import React, { useEffect, useState } from 'react'
import './AdminPage.css'
import HospList from '../components/HospList'
import { fetchAllHospitals } from '../firebase/services'
import AddHospital from '../components/AddHospital'


const AdminPage = ({user,triggerRefresh,setTriggerRefresh}) => {
    // const [hospitals,setHospitals]=useState([])
    const [registerHospital, setRegisterHospital]=useState(false)
    console.log(triggerRefresh);
    
    // useEffect(() => {
    //     const fetchHosps = async () => {
    //         try {
    //             const data = await fetchAllHospitals(user); 
    //             setHospitals(data) // You can set this data to state if needed
    //         } catch (error) {
    //             console.error("Error while fetching hospitals:", error);
    //         }
    //     };
    //     fetchHosps();
    // }, [triggerRefresh]);

  return (
    <div className='admin-page'>
        <div className='container-head'>
            <h1 className='main-heading'>Admin Panel</h1>
        </div>    <h1 className='sub-heading'>Hospital List <i className="fa-solid fa-square-plus" title='Add new hospital' onClick={()=>setRegisterHospital(!registerHospital)}></i></h1>

        {registerHospital&&<AddHospital user={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh} setRegisterHospital={setRegisterHospital}/>}
        <HospList user={user} triggerRefresh={triggerRefresh}/>
    </div>
  )
}

export default AdminPage