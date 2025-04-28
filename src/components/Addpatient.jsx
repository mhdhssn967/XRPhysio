import React, { useState } from 'react';
import './Addpatient.css'
import { addPatientToHospital } from '../firebase/services';
import Swal from 'sweetalert2';

const Addpatient = ({addPatients, setAddPatients, user, triggerRefresh, setTriggerRefresh}) => {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    condition: '',
    startingStage: '',
    therapist: ''
  });
  console.log(patient);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await addPatientToHospital(user, patient);

        setPatient({
            name: '',
            age: '',
            condition: '',
            startingStage: '',
            therapist: ''
        });

        setTriggerRefresh(!triggerRefresh);

        // 🎉 Show success alert
        Swal.fire({
            icon: 'success',
            title: 'Patient Added',
            text: `${patient.name} has been successfully added!`,
            confirmButtonColor: '#3085d6'
        });
    } catch (error) {
        // ❌ Show error alert
        Swal.fire({
            icon: 'error',
            title: 'Failed to Add Patient',
            text: error.message || 'Something went wrong. Please try again.',
            confirmButtonColor: '#d33'
        });
    }
};

  return (
    <div className='add-patients'>
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit} className='add-patient-form'>
        <div className='form-div'>
            <div className='inputs'>
                <label>Name</label>
                <input
                  type='text'
                  name='name'
                  value={patient.name}
                  onChange={handleChange}
                  required
                  placeholder='Add Patient Name'
                />
        
                <label>Age</label>
                <input
                  type='number'
                  name='age'
                  value={patient.age}
                  onChange={handleChange}
                  required
                  placeholder='Add patient age'
                />
        
                <label>Condition</label>
                <input
                  type='text'
                  name='condition'
                  value={patient.condition}
                  onChange={handleChange}
                  required
                  placeholder='Add Patient Condition'
                />
        
                <label>Starting Stage</label>
                <input
                  type='text'
                  name='startingStage'
                  value={patient.startingStage}
                  onChange={handleChange}
                  required
                  placeholder='Add Starting stage of patient'
                />
        
                <label>Therapist</label>
                <input
                  type='text'
                  name='therapist'
                  value={patient.therapist}
                  onChange={handleChange}
                  required
                  placeholder='Add therapist of patient'
                />
            </div>
            <div className='form-btns'>
                <button className='form-btn' onClick={()=>setAddPatients(!addPatients)}>Close</button>
                <button type='submit' className='sec-btn form-btn'>Add Patient</button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default Addpatient;
