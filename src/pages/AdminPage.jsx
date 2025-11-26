import React, { useEffect, useState } from 'react'
import './AdminPage.css'
import HospList from '../components/HospList'
import { fetchAllHospitals } from '../firebase/services'
import AddHospital from '../components/AddHospital'
import { useAccessRequestStatus } from '../firebase/authRequest'
import RegisterDevice from '../components/RegisterDevice'



const AdminPage = ({user,triggerRefresh,setTriggerRefresh}) => {
    // const [hospitals,setHospitals]=useState([])
  const [registerHospital, setRegisterHospital] = useState(false);
  const authRequest = useAccessRequestStatus(); // 👈 Real-time state


  return (
    <div className='admin-page'>
        <div className='container-head'>
            <h1 className='main-heading'>Admin Panel</h1>
        </div>    <h1 className='sub-heading'>Hospital List <i className="fa-solid fa-square-plus" title='Add new hospital' onClick={()=>setRegisterHospital(!registerHospital)}></i></h1>

        {registerHospital&&<AddHospital user={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh} setRegisterHospital={setRegisterHospital}/>}
        <HospList user={user} triggerRefresh={triggerRefresh}/>
        {authRequest&&<div className='reg-device'><RegisterDevice/></div>}
    </div>
  )
}

export default AdminPage