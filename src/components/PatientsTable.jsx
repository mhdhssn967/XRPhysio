import React, { useEffect, useState } from 'react'
import './PatientsTable.css'
import Loader from '../helperComponents/Loader'

const PatientsTable = ({patientData, patients,setPatientDataPage, setClickedPatientID}) => {


  const handlePatientRowClicked=(id)=>{
    setClickedPatientID(id)
    setPatientDataPage(true)
  }
    
  return (
    <>
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

    
    </>
  )
}

export default PatientsTable