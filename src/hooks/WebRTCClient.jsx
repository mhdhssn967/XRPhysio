import { useEffect, useRef, useState } from "react";

// ⭐ Material UI
import {
    Card, CardContent, TextField, Button, Typography
} from "@mui/material";

// ⭐ SweetAlert2
import Swal from "sweetalert2";

// ⭐ External CSS
import "./webrtc.css";

export default function WebRTCClient() {
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const peerRef = useRef(null);

    const [signalingStatus, setSignalingStatus] = useState("Disconnected");
    const [webrtcStatus, setWebrtcStatus] = useState("Not connected");

    const [ip, setIp] = useState("");
    const [castStarted, setCastStarted] = useState(false);

    // -------------------------------- INIT --------------------------------
    useEffect(() => {
        if (castStarted) connectToSignaling();
        return () => disconnect();
    }, [castStarted]);

    useEffect(() => {
        const unlock = () => {
            videoRef.current?.play().catch(() => {});
        };
        document.addEventListener("click", unlock, { once: true });
        return () => document.removeEventListener("click", unlock);
    }, []);

    // -------------------------------- CONNECT TO SIGNALING --------------------------------
    function connectToSignaling() {
        if (!ip || !ip.trim()) {
            Swal.fire("Invalid IP", "Please enter a valid IP address.", "error");
            return;
        }

        setSignalingStatus("Connecting...");
        console.log("Connecting to WebSocket bridge...");

        try {
            socketRef.current = new WebSocket(`ws://localhost:8080`);
        } catch (err) {
            Swal.fire("Connection Failed", "Could not connect to this IP.", "error");
            return;
        }

        socketRef.current.onopen = () => {
            setSignalingStatus("Connected");
            console.log("Connected to websocket");

            // ⭐ ADDED → Send Unity IP + port to server
            socketRef.current.send(
                JSON.stringify({
                    type: "config",
                    unityHost: ip,
                    unityPort: 8888, // You can make this user-input later
                })
            );

            initWebRTC();
        };

        socketRef.current.onerror = () => {
            Swal.fire("Error", "Failed to connect to the signaling server.", "error");
        };

        socketRef.current.onclose = () => {
            setSignalingStatus("Disconnected");
        };

        socketRef.current.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                processSignalingMessage(msg);
            } catch (e) {
                console.error("Failed to parse message");
            }
        };
    }

    // --------------------- (Your SAME WebRTC functions — UNCHANGED) ---------------------

    function processSignalingMessage(message) {
        switch (message.type) {
            case "offer":
                handleOffer(message.sdp);
                break;
            case "answer":
                handleAnswer(message.sdp);
                break;
            case "ice-candidate":
                handleIce(message);
                break;
        }
    }

    function initWebRTC() {
        peerRef.current = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        peerRef.current.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current.send(
                    JSON.stringify({
                        type: "ice-candidate",
                        candidate: event.candidate.candidate,
                        sdpMid: event.candidate.sdpMid,
                        sdpMLineIndex: event.candidate.sdpMLineIndex
                    })
                );
            }
        };

        peerRef.current.oniceconnectionstatechange = () => {
            setWebrtcStatus(peerRef.current.iceConnectionState);
        };

        peerRef.current.ontrack = (event) => {
            const stream = new MediaStream([event.track]);
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
        };
    }

    async function handleOffer(sdp) {
        const cleanedSdp = sdp
            .replace(/a=rtpmap:\d+ rtx\/\d+\r?\n/g, "")
            .replace(/a=fmtp:\d+ apt=\d+\r?\n/g, "");

        await peerRef.current.setRemoteDescription({ type: "offer", sdp: cleanedSdp });
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);

        socketRef.current.send(JSON.stringify({ type: "answer", sdp: answer.sdp }));
    }

    async function handleAnswer(sdp) {
        await peerRef.current.setRemoteDescription({ type: "answer", sdp });
    }

    async function handleIce(msg) {
        await peerRef.current.addIceCandidate(
            new RTCIceCandidate({
                candidate: msg.candidate,
                sdpMid: msg.sdpMid,
                sdpMLineIndex: msg.sdpMLineIndex
            })
        );
    }

    function disconnect() {
        socketRef.current?.close();
        peerRef.current?.close();
    }

    // ------------------------------ UI SECTION ------------------------------

    return (
        <div className="container">
            <Card className="card">
                <CardContent>
                    {/* <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                        WebRTC Client
                    </Typography> */}

                    <TextField
                        label="Enter IP Address"
                        variant="outlined"
                        fullWidth
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        disabled={!ip.trim()}
                        onClick={() => setCastStarted(true)}
                    >
                        CAST
                    </Button>

                    <Typography sx={{ mt: 2 }}>
                        <b>Signaling:</b> {signalingStatus}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                        <b>WebRTC:</b> {webrtcStatus}
                    </Typography>

                    <div className="video-container">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            id="remoteVideo"
                            className="video-box"
                        ></video>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
