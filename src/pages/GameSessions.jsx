import React, { useEffect, useState } from 'react'
import './GameSessions.css'
import { fetchDeviceIdsForHospitals, fetchGameDetails, getPatientDataforHospitals, initiateSession } from '../firebase/helpers'
import ActiveSessions from '../components/ActiveSessions'
import Swal from 'sweetalert2';
import Typography from '@mui/material/Typography';
import LoaderComponent from './LoaderComponent'
import {FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { div, log } from 'three/tsl'




const GameSessions = ({ user, triggerRefresh, setTriggerRefresh }) => {
    const [deviceIds, setDeviceIds] = useState([])
    const [allPatients, setAllPatients] = useState([])
    const [loading,setLoading]=useState(true)    
    const [selected, setSelected] = useState({ activeDevice: '', activePatient: '', activeDeviceName: '', activePatientName: ''})
    const [allGames,setAllGames]=useState([])

    

    useEffect(() => {
        const getDeviceIds = async (user) => {
            const deviceIdsRef = await fetchDeviceIdsForHospitals(user)
            setDeviceIds(deviceIdsRef)
            const patientsRef = await getPatientDataforHospitals(user)
            setAllPatients(patientsRef)
            setLoading(false)
        }; getDeviceIds(user);
    }, [user])

    useEffect(() => {
        const getGamesDetails = async () => {
            const gamesRef=await fetchGameDetails()
            setAllGames(gamesRef)
        }; getGamesDetails(user);
    }, [])

    const handleStartSession = async () => {
        const { activeDevice, activePatient, activeDeviceName, activePatientName } = selected;
        if (!activeDevice || !activePatient || !user) {
            console.error("Missing info to start session");
            return;
        }
    
        const result = await Swal.fire({
            title: 'Change?',
            html: `Change <strong>${activePatientName}</strong> to using <strong>${activeDeviceName}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        });
    
        if (result.isConfirmed) {
            await initiateSession(activeDevice, activePatient, activeDeviceName, activePatientName, user);
            setTriggerRefresh(!triggerRefresh);
            Swal.fire('Edited!', 'Patient and device is edited.', 'success');
        }
    };

    return (
        <>
  {!loading ? (
    <div>
        <div>
          <div className='container-head'>
            <Typography
              component="h1"
              sx={{
                fontSize: {
                  xs: '1.5rem',
                  sm: '2rem',
                  md: '2.5rem',
                },
                fontWeight: 600,
                color: '#505050',
                mt: 2,
                mb: 2,
              }}
            >
              Game Sessions
            </Typography>
          </div>
          <div className='game-sessions-page'>
              <div className='sessions-container'>
                <img src='/images/meta2.png' alt="" />
                <div className='sessions-body'>
                  <h2 style={{ fontWeight: '400' }}>Assign Device to patient</h2>
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex' }}>{/* Placeholder */}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                      <div className='input-sessions'>
                        <p style={{textWrap:'nowrap',marginRight:'10px'}}>Select Device</p>
                        <FormControl fullWidth variant="outlined" size="small" >
          <InputLabel >Device</InputLabel>
          <Select sx={{ width: '300px' }}
            label="Select Device"
            onChange={(e) => {
              const selectedValue = e.target.value;
              const selectedIndex = deviceIds.indexOf(selectedValue)+1;
              
              setSelected({
                ...selected,
                activeDevice: selectedValue,
                activeDeviceName: `Device ${selectedIndex}`,
              });
            }}
            defaultValue=""
          >
            <MenuItem value="" disabled>
              Select Device
            </MenuItem>
            {deviceIds &&
              deviceIds.map((id, index) => (
                <MenuItem key={index} value={id}>
                  Device {index + 1}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        
                      </div>
                      <div className='input-sessions'>
                        <p style={{textWrap:'nowrap',marginRight:'10px'}}>Select Patient </p>
                        <FormControl fullWidth variant="outlined" size="small">
                          <InputLabel>Patient</InputLabel>
                          <Select sx={{ width: '300px' }}
                            label="Select Patient"
                            onChange={(e) => {
                              const selectedPatient = allPatients.find(p => p.id === e.target.value);
                              setSelected({
                                ...selected,
                                activePatient: selectedPatient.id,
                                activePatientName: selectedPatient.name,
                              });
                            }}
                            defaultValue=""
                          >
                            <MenuItem value="" disabled>
                              Select Patient
                            </MenuItem>
                            {allPatients &&
                              allPatients.map((patient) => (
                                <MenuItem key={patient.id} value={patient.id}>
                                  <p className="drop-down-patient-id">{patient.id}</p>{patient.name} 
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className='input-sessions'>
                      

                      </div>
        <button className='main-btn app-btn' onClick={handleStartSession}>Edit</button>             
                    </div>
                  </div>
                </div>
              </div>
                                <ActiveSessions triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh} user={user} />

    
    
              {/* game details */}
              
      {/* <div className="game-details-page">   
                <h1 style={{fontWeight:'900',marginBottom:'20px'}}>Therapy Games by Focus Area</h1>

      <div className='game-dets-grid'>
          {Object.entries(
            allGames
              ?.filter(game => game.gameName !== "ActivitySelection")
              ?.reduce((groups, game) => {
                const key = game.focus || "Other";
                if (!groups[key]) groups[key] = [];
                groups[key].push(game);
                return groups;
              }, {})
          ).map(([focus, games]) => (
            <div key={focus} className="focus-group">
              <h2>{focus}</h2>
              <div className='game-item-div'>
                  {games.map((game, index) => (
                    <div key={game.gameName || index} className="game-item">
                      <p>{game.gameDisplayName}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
   


    </div> */}
          </div>
        </div>
    
        

    </div>
  ) : (
    <div className='loadScreen'>
      <LoaderComponent />
    </div>
  )}
</>
    )
}

export default GameSessions

