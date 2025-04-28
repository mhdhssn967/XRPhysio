import React, { useEffect, useState } from 'react';
import './Patients.css';
import Navbar from '../components/Navbar';
import PatientsTable from '../components/PatientsTable';
import Addpatient from '../components/Addpatient';
import { getUserId } from '../firebase/getUserID';
import { fetchHospitalName, getPatientData } from '../firebase/services';
import PatientData from '../components/PatientData';
import Loader from '../helperComponents/Loader';
import SessionInsight from '../components/SessionInsight';



const Patients = ({ user, triggerRefresh, setTriggerRefresh }) => {

  const [addPatients, setAddPatients] = useState(false)
  const [patients, setPatients] = useState([])
  const [patientDataPage, setPatientDataPage] = useState(false)
  const [clickedPatientId,setClickedPatientID]=useState(null)
  const [inisghtPage, setInsightPage]=useState(false)
  

  const handleAddPatients = () => {
    setAddPatients(!addPatients)
  }

  useEffect(() => {
    const fetchPatientData = async () => {
      try {

        const data = await getPatientData(user);
        setPatients(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPatients(null);
      }
    };

    fetchPatientData(); // Call the function inside useEffect

  }, [triggerRefresh]);



  return (

    <>
      {/* Patient Table */}
      {(!patientDataPage && !inisghtPage) &&
      <div className="patients-container">
        <div className='container-head'><h2 className='main-heading'>Patients </h2><i title='Add a new patient' className="fa-solid fa-user-plus" onClick={handleAddPatients}></i>
        </div>
        {addPatients ?
          <Addpatient setAddPatients={setAddPatients} addPatients={addPatients} user={user} setTriggerRefresh={setTriggerRefresh} triggerRefresh={triggerRefresh} />
          : <div className='no-add-patients'>
          </div>
        }
        {patients.length>0?
          <PatientsTable patients={patients} setTriggerRefresh={setTriggerRefresh} triggerRefresh={triggerRefresh} setPatientDataPage={setPatientDataPage} setClickedPatientID={setClickedPatientID}/>
        :<Loader/>
        }
      </div>
}
      {/* Patient Details page */}
      {patientDataPage &&  
      <div className='patient-details'>
        <div className='container-head'><h2 className='main-heading'>Patient Details </h2>
        </div>
        <PatientData setInsightPage={setInsightPage} setPatientDataPage={setPatientDataPage} clickedPatientID={clickedPatientId} user={user}/>
      </div>}
      {setInsightPage &&
        <SessionInsight/>
      }
    </>
  );
};

export default Patients;
