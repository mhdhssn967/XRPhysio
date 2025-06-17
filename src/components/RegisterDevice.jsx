import React, { useEffect, useState } from 'react'
import './RegisterDevice.css'
import { fetchDeviceId, registerDevice, registerDeviceFalse, setCredentialsFalse } from '../firebase/authRequest'
import meta2 from '../assets/meta2.png'

const RegisterDevice = () => {
  const [deviceId, setDeviceId] = useState(null)
  const [reqCredentials, setReqCredentials] = useState({ reqEmail: '', reqPassword: '' })
  const [registered, setRegistered] = useState(false)



  useEffect(() => {
    const getDeviceId = async () => {
      const deviceIdRef = await fetchDeviceId()
      setDeviceId(deviceIdRef)
    }; getDeviceId()
  }, [])

  const handleRegisterDevice = async () => {
    await registerDevice(deviceId, reqCredentials.reqEmail, reqCredentials.reqPassword)
    setRegistered(true)
  }
  const handleRejectRegisteration=async()=>{
    await registerDeviceFalse(deviceId, false)
    await setCredentialsFalse()
  }


  return (
    <div className='register-device'>
      <div>
        <h1>A device is requesting for registeration</h1>
        <h2>Device id <span>{deviceId}</span></h2>
        <img src={meta2} style={{ margin: '20px' }} width={'250px'} alt="" />
      </div>
      {!registered ? <div className='input-register'>
        <label htmlFor="hospEmail">Enter hospital email</label>
        <input id='hospEmail' type="text" onChange={(e) => setReqCredentials({ ...reqCredentials, reqEmail: e.target.value })} />
        <label htmlFor="pass">Enter hospital password</label>
        <input id='pass' type="password" onChange={(e) => setReqCredentials({ ...reqCredentials, reqPassword: e.target.value })} />
        <div className='reg-btn-div'>
          <button className='reg-btn reg-accept' onClick={handleRegisterDevice}>Accept</button>
          <button className='reg-btn reg-reject' onClick={handleRejectRegisteration}>Reject</button>
        </div>

      </div> :
        <div style={{ margin: '50px' }} className='success-reg'>
          <h2 style={{ color: 'rgb(4, 173, 4)' }}><i style={{ color: 'rgb(4, 173, 4)' }} className="fa-solid fa-circle-check"></i> Device registered</h2>
          <h3>Try log-in on the VR device to continue</h3>
        </div>

      }
    </div>
  )
}

export default RegisterDevice