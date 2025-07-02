import React, { useEffect, useState } from "react";
import {
  endActiveSession,
  fetchActiveSessions,
  updateGameStatus,
} from "../firebase/helpers"; // adjust path if needed
import "./ActiveSessions.css";
import Swal from "sweetalert2";
import LoaderSmall from "../helperComponents/LoaderSmall";

const ActiveSessions = ({ user, triggerRefresh, setTriggerRefresh }) => {
  const [sessions, setSessions] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const getSessions = async () => {
      const activeSessions = await fetchActiveSessions(user);
      setSessions(activeSessions);
    };

    getSessions();
  }, [user, triggerRefresh]);

  const handleEditStatus = async (hospitalId, deviceId, status) => {
    setLoadingStatus(true);
    await updateGameStatus(hospitalId, deviceId, status);
    setTriggerRefresh(!triggerRefresh);
    setLoadingStatus(false);
  };

  return (
    <div >
      <div className="active-session">
        <table>
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Patient Name</th>
              <th>Game Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessions && sessions.length > 0 ? (
              sessions.map((session, index) => (
                <tr key={session.id}>
                  <td>{session.deviceName || session.deviceId}</td>
                  <td>{session.patientName}</td>
                  <td>{session.gameName}</td>

                  {
                    <td>
                      {!loadingStatus ? (
                        <>
                          {session.gameStatus == "idle" ? (
                            <i
                              class="ri-play-circle-fill game-btn play-btn"
                              onClick={() =>
                                handleEditStatus(
                                  session.hospitalId,
                                  session.deviceId,
                                  "playing"
                                )
                              }
                            ></i>
                          ) : (
                            <i
                              className="ri-stop-circle-fill game-btn stop-btn"
                              onClick={() =>
                                handleEditStatus(
                                  session.hospitalId,
                                  session.deviceId,
                                  "idle"
                                )
                              }
                            ></i>
                          )}
                        </>
                      ) : (
                        <LoaderSmall />
                      )}
                    </td>
                  }
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Active Sessions!!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveSessions;

