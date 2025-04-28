import React, { useEffect, useState } from 'react'
import './GameSessions.css'
import meta from '../assets/meta.png'
import { fetchDeviceIdsForHospitals, getPatientDataforHospitals, initiateSession } from '../firebase/helpers'
import ActiveSessions from '../components/ActiveSessions'
import Swal from 'sweetalert2';



const GameSessions = ({ user, triggerRefresh, setTriggerRefresh }) => {
    const [deviceIds, setDeviceIds] = useState([])
    const [allPatients, setAllPatients] = useState([])
    const [selected, setSelected] = useState({ activeDevice: '', activePatient: '', activeDeviceName: '', activePatientName: '' })



    useEffect(() => {
        const getDeviceIds = async (user) => {
            const deviceIdsRef = await fetchDeviceIdsForHospitals(user)
            setDeviceIds(deviceIdsRef)
            const patientsRef = await getPatientDataforHospitals(user)
            setAllPatients(patientsRef)
        }; getDeviceIds(user);
    }, [user])

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
            <div className='game-sessions-page'>
                <div className='container-head'>
                    <h1 className='main-heading'>Game Sessions</h1>
                </div>
                <div  className='sessions-container'>
                <img src={meta} alt="" />
                    <div className='sessions-body'>
                        <h2 style={{ fontWeight: '400' }}>Assign Device to patient</h2>
                        <div style={{ display: 'flex' }}>
                            <div style={{ display: 'flex' }}>
                                {/* <img src={meta} alt="" /> */}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column',alignItems:'center' }}>
    
                                <div className='input-sessions'>
                                    <p>Select Device</p>
                                    <select name="" id="" onChange={(e) => {
                                        const selectedIndex = e.target.selectedIndex - 1; 
                                        setSelected({
                                            ...selected,
                                            activeDevice: e.target.value,
                                            activeDeviceName: `Device ${selectedIndex + 1}`,
                                        });
                                    }}>
                                        <option selected disabled>Select Device</option>
                                        {deviceIds &&
                                            deviceIds.map((id, index) => (
                                                <option key={index} value={id}>Device {index + 1}</option>
                                            ))
    
                                        }
                                    </select>
                                </div >
                                <div className='input-sessions'>
                                    <p>Select Patient</p>
                                    <select name="" id="" onChange={(e) => {
                                        const selectedPatient = allPatients.find(p => p.id === e.target.value);
                                        setSelected({
                                            ...selected,
                                            activePatient: selectedPatient.id,
                                            activePatientName: selectedPatient.name,
                                        });
                                    }}>
                                        <option selected disabled>Select Pateint</option>
                                        {
                                            allPatients &&
                                            allPatients.map((patient) => (
                                                <option value={patient.id}>{patient.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <button className='main-btn app-btn' onClick={handleStartSession}>Edit</button>
                            </div>
                        </div>
                        <ActiveSessions triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh} user={user}/>

                    </div>
                
                {/* <ActiveSessions triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh} user={user}/> */}
                </div>
                </div>
        </>
    )
}

export default GameSessions