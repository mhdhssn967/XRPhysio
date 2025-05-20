import React, { useEffect, useState } from 'react'
import './RegisterDevice.css'
import { fetchDeviceId, registerDevice } from '../firebase/authRequest'
import { div } from 'three/tsl'
import meta2 from '../assets/meta2.png'

const RegisterDevice = () => {
  const [deviceId, setDeviceId] = useState(null)
  const [reqCredentials, setReqCredentials] = useState({ reqEmail: '', reqPassword: '' })
  const [registered,setRegistered]=useState(false)
  


  useEffect(() => {
    const getDeviceId = async () => {
      const deviceIdRef = await fetchDeviceId()
      setDeviceId(deviceIdRef)
    }; getDeviceId()
  }, [])

  const handleRegisterDevice=async()=>{
        await registerDevice(deviceId,reqCredentials.reqEmail,reqCredentials.reqPassword)
        setRegistered(true)
    }
  

  return (
    <div className='register-device'>
      <div>
        <h1>A device is requesting for registeration</h1>
        <h2>Device id <span>{deviceId}</span></h2>
        <img src={meta2} style={{margin:'20px'}} width={'250px'} alt="" />
      </div>
      {!registered?<div className='input-register'>
        <label htmlFor="hospEmail">Enter hospital email</label>
        <input id='hospEmail' type="text" onChange={(e)=>setReqCredentials({...reqCredentials,reqEmail:e.target.value})} />
        <label htmlFor="pass">Enter hospital password</label>
        <input id='pass' type="password" onChange={(e)=>setReqCredentials({...reqCredentials,reqPassword:e.target.value})}/>
        <button className='reg-btn' onClick={handleRegisterDevice}>Register device with hospital</button>
      </div>:
      <div style={{margin:'50px'}}>
        <h2 style={{color:'rgb(4, 173, 4)'}}><i style={{color:'rgb(4, 173, 4)'}} className="fa-solid fa-circle-check"></i> Device is succesfully registered</h2>
        <h3>Login on the VR device to continue</h3>
      </div>

      }
    </div>
  )
}

export default RegisterDevice