import React, { useEffect, useState } from 'react'
import './HospList.css'
import { fetchAllHospitals, fetchDeviceIds, fetchHospitalData } from '../firebase/services'
import HospitalModal from './HospitalModal'

const HospList = ({triggerRefresh, user}) => {
    
    const [hospitals,setHospitals]=useState([])
    const [modalData,setModalData]=useState([])
    const [dataModal, setDataModal]=useState(false)
    const [deviceIds,setDeviceIds]=useState([])

        
       useEffect(() => {
           const fetchHosps = async () => {
               try {
                   const data = await fetchAllHospitals(user); 
                   setHospitals(data) // You can set this data to state if needed
               } catch (error) {
                   console.error("Error while fetching hospitals:", error);
               }
           };
           fetchHosps();
       }, [triggerRefresh]);

       const handleOpenModal=async(id)=>{
        setDataModal(true)

            const hospitalInfo=await fetchHospitalData(user,id)
            setModalData(hospitalInfo)
            const deviceData=await fetchDeviceIds(user, id)                        
            setDeviceIds(deviceData)
            
       }

  return (
    <>
    {dataModal&&<HospitalModal setDataModal={setDataModal} modalData={modalData} deviceIds={deviceIds}/>}
    <div className='hospital-cards' >
        {
        hospitals.map((data)=>
            <div className='hospital-card' key={data.id} onClick={()=>handleOpenModal(data.id)}>
            <p>{data.name}</p> 
            <p>Devices {data.deviceIds.length}</p>
        </div>)}
    </div>
    </>
  )
}

export default HospList