import React, { useEffect, useState } from "react";
import {fetchActiveSessions,
  setSceneToActivitySelection,
  updateGameStatus,
  updateLanguage,
} from "../firebase/helpers"; // adjust path if needed
import "./ActiveSessions.css";
import LoaderSmall from "../helperComponents/LoaderSmall";
import GameModal from "./GameModal";
import GameSetting from "./GameSetting";


const ActiveSessions = ({ user, triggerRefresh, setTriggerRefresh }) => {
  const [sessions, setSessions] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedDeviceId,setSelectedDeviceId]=useState(null)
  const [openSettings,setOpenSettings]=useState(false)
  const [selectedGame,setSelectedgame]=useState({})
  const handleOpen = (deviceId) => {
    setOpen(true)
    setSelectedDeviceId(deviceId)
  }
  const handleClose = () => setOpen(false);

  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    const getSessions = async () => {
      const activeSessions = await fetchActiveSessions(user);
      console.log(activeSessions)
      setSessions(activeSessions);
    };

    getSessions();
  }, [user, triggerRefresh]);

  const settingsOpen=(deviceId)=>{
    setSelectedDeviceId(deviceId)
    setOpenSettings(true)
  }


  const handleEditStatus = async (hospitalId, deviceId, status) => {
    setLoadingStatus(true);
    await updateGameStatus(hospitalId, deviceId, status);
    setTriggerRefresh(!triggerRefresh);
    setLoadingStatus(false);
  };

  const goToHomeScreen=async(hospitalId,deviceId)=>{
    await setSceneToActivitySelection(hospitalId,deviceId)
    setTriggerRefresh(!triggerRefresh)
  }

const handleLanguageChange = async (e, hospitalId, deviceId) => {
  const language = e.target.value;

  try {
    await updateLanguage(hospitalId, deviceId, language);
    console.log("✅ Language updated to", language);
  } catch (error) {
    console.error("❌ Failed to update language:", error);
  }
};


  return (
    <div >
      {openSettings&&<div className="settings-modal">
        <GameSetting user={user} selectedDeviceId={selectedDeviceId} setOpenSettings={setOpenSettings}/>
      </div>}
      <GameModal selectedDeviceId={selectedDeviceId} setSelectedgame={setSelectedgame} open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} user={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh}/> 
      <div className="active-session">
        <p style={{fontWeight:'800', fontSize:'20px',marginTop:'30px'}}>Game sessions</p>
  {sessions && sessions.length > 0 ? (
    sessions.map((session) => (
      <div key={session.id} className="session-row">
        <div className="session-info">
          <p> {session.deviceName || session.deviceId}</p>
          <p> {session.patientName}</p>
        </div>

        <div className="session-controls">
          {/* <p className="controls-heading" style={{fontWeight:'800'}}>Controls</p> */}
          <div className="controls">
            <button style={{textWrap:'nowrap',fontWeight:'800'}} className="game-name-btn" onClick={()=>handleOpen(session.deviceId)}>
              {session.gameName || 'No game selected'}
            </button>
  
            {!loadingStatus ? (
              <>
                {session.gameStatus === "idle" ? (
                  <i
                    role="button"
                    title="Play"
                    className="ri-play-circle-fill game-btn play-btn"
                    onClick={() =>
                      handleEditStatus(
                        session.hospitalId,
                        session.deviceId,
                        "playing"
                      )
                    }
                  />
                ) : (
                  <i
                    role="button"
                    title="Stop"
                    className="ri-stop-circle-fill game-btn stop-btn"
                    onClick={() =>
                      handleEditStatus(
                        session.hospitalId,
                        session.deviceId,
                        "idle"
                      )
                    }
                  />
                )}
              </>
            ) : (
              <LoaderSmall />
            )}
             <select
  className="lang"
  onChange={(e) => handleLanguageChange(e, session.hospitalId, session.deviceId)}
>
  <option value="" disabled>
    Select Language
  </option>
  <option value="english">English</option>
  <option value="hindi">Hindi</option>
  <option value="malayalam">Malayalam</option>
  <option value="arabic">Arabic</option>
  <option value="telugu">Telugu</option>
</select>

<p>{session.serverIP}</p>

  {session.SceneName!='ActivitySelection'&&<button onClick={()=>settingsOpen(session.deviceId)} className="game-setting-btn game-btn">
              <i class="ri-settings-4-fill"></i>
            </button>}
            <i
              role="button"
              onClick={() =>
                goToHomeScreen(session.hospitalId, session.deviceId)
              }
              title="Go to homepage"
              style={{ color: "brown", cursor: "pointer" }}
              className="ri-home-4-fill game-btn"
            ></i>
            
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="no-sessions">No Active Sessions!!!</p>
  )}
</div>

    </div>
  );
};

export default ActiveSessions;
