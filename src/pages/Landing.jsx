import React, { useEffect, useState } from 'react'
import man from '../assets/man.png';
import './Landing.css'
import gamepad from '../assets/gamepad.png'
import examination from '../assets/examination.png'
import vrglass from '../assets/virtual-reality-glasses.png'
import vrr from '../assets/vrr.png'
import { fetchActiveSessions, getPatientDataforHospitals } from '../firebase/helpers';
import { fetchLatestGameSessions } from '../firebase/processData';
import LoaderComponent from './LoaderComponent';

const Landing = ({hospName, fetchedHospitalData, user, triggerRefresh}) => {
  const subscribedSince = fetchedHospitalData?.createdAt?.toDate().toLocaleDateString();

  console.log(fetchedHospitalData);
  
  const [sessions, setSessions] = useState([]);
  const [latestSessions,setLatestSessions]=useState([])
  const [loading,setLoading]=useState(true)
  const [patients,setPatients]=useState([])
  console.log(patients);
  
  console.log(latestSessions);
  


    
  
    useEffect(() => {
      const getSessions = async () => {        
          const activeSessions = await fetchActiveSessions(user);   
          setSessions(activeSessions);
          const recentDataRef=await fetchLatestGameSessions(user)
          setLatestSessions(recentDataRef)
          const patientsRef=await getPatientDataforHospitals(user)
          setPatients(patientsRef)
          if(fetchedHospitalData && sessions && patients){
          setLoading(false)
          }
      };
  
      getSessions();
    }, [user,triggerRefresh]);

  const version =3.1



  return (
    <>{!loading?
      <div className="container">
        
        <div className='dash-head'>
          <div>
            <p>Happy Moves v{version} </p>
            <h3>{hospName}</h3>
          </div>
          <p><strong>Subscribed since :</strong> {subscribedSince}</p>
          
           </div>
           <div className='main-cards'>
            <div className='main-card'>
              <img src={vrglass} alt="" />
                <h2><strong>VR Devices :</strong> {fetchedHospitalData?.VRDeviceCount}</h2>
            </div>
            <div className='main-card'>
              <img src={examination} alt="" />
                <h2><strong>Patients :</strong> {fetchedHospitalData?.patientCount}</h2>
            </div>
            <div className='main-card'>
              <img src={gamepad} alt="" />
                <h2><strong>Total Games Played :</strong> {fetchedHospitalData?.totalGamePlayCount}</h2>
            </div>
            <div className='recent-data'>
              <h2 className='dash-headings'>Recent Game data</h2>
    <table>
      <thead>
        <tr>
          <th>Patient Name</th>
          <th>Game Name</th>
          <th>Hand</th>
          <th>Average Reaction Time (s)</th>
          <th>Efficiency (%)</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {latestSessions.length>0?
        latestSessions.map((session, index) => (
          <tr key={index}>
            <td>{session.patientName}</td>
            <td>{session.gameName}</td>
            <td>{session.hand}</td>
            <td>{session.avgReaction}</td>
            <td>{session.efficiency}</td>
            <td>{session.date}</td>
          </tr>
        )):
        <td colSpan={'5'}>No recent activity</td>
        }
      </tbody>
    </table>
  </div>
  
           </div>
  
           <div className='session-card'>
            <h2 className='dash-headings'>Game session</h2>
            <div className='session-card-content'><img width={'550px'} src={vrr} alt="" />
              
               <div className='card-dets'>
                  {sessions && sessions.length>0?
                  sessions.map((session,index)=>(
                  <div className='card-ss' key={session.id}>
                   <div style={{display:'flex',alignItems:'center'}}>
                      <h2 style={{fontWeight:'900',color:'var(--secondary-color)'}}>{session.deviceName}</h2>
                      <div className='device-info'><p>View Device id</p><p className='session-device-id'><strong>Device id : </strong>{session.deviceId}</p></div>
                   </div>
                    <h3><strong>Patient Name :</strong> {session.patientName}</h3>
                    <h3><strong>Game Status :</strong>{session.gameStatus}</h3>
                    <h3><strong>Started at :</strong>{session.startedAt.toDate().toLocaleString()}</h3>
                    </div>)):
                    <p>No devices yet</p>
                    }
               </div>
              </div>
           </div>
  
           <div className='patients-table-div'>
            <h2 className='dash-headings'>Patients</h2>
            <div><table className="patients-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Age</th>
            <th>Condition</th>
            <th>Starting Stage</th>
            <th>Therapist</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient, index) => (
            <tr key={patient.id} onClick={()=>handlePatientRowClicked(patient.id)}>
              <td>{index+1}</td>
              <td>{patient.name}</td>
              <td>{patient.age}</td>
              <td>{patient.condition}</td>
              <td>{patient.startingStage}</td>
              <td>{patient.therapist}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
           </div>
      </div>:
      <div className='loadScreen'><LoaderComponent/></div>
      }
    </>
  )
}

export default Landing