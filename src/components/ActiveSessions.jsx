import React, { useEffect, useState } from 'react';
import { endActiveSession, fetchActiveSessions, updateGameStatus } from '../firebase/helpers'; // adjust path if needed
import './ActiveSessions.css'
import Swal from 'sweetalert2';

const ActiveSessions = ({ user,triggerRefresh, setTriggerRefresh }) => {

  const [sessions, setSessions] = useState([]);
  

  useEffect(() => {
    const getSessions = async () => {        
        const activeSessions = await fetchActiveSessions(user);   
        setSessions(activeSessions);
    };

    getSessions();
  }, [user,triggerRefresh]);

 const handleEditStatus=async(deviceId, status)=>{
    await updateGameStatus(deviceId, status)
    setTriggerRefresh(!triggerRefresh)
 }


  return (
    <div style={{padding:'2rem'}}>
      <div className='active-session'>
        <table>
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Patient Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessions && sessions.length > 0 ? (
              sessions.map((session, index) => (
                <tr key={session.id}>
                  <td>{session.deviceName || session.deviceId}</td>
                  <td>{session.patientName}</td>
                  {<td>{session.gameStatus=='idle'?<i class="fa-solid fa-circle-play game-btn" onClick={()=>handleEditStatus(session.deviceId,'playing')}></i>:<i className="fa-solid fa-circle-stop game-btn" onClick={()=>handleEditStatus(session.deviceId,'idle')}></i>}
                 </td>}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No Active Sessions!!!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
  

export default ActiveSessions;
