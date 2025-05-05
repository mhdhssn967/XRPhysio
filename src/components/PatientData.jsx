import React, { useEffect, useState } from 'react'
import './PatientData.css'
import { getSelectedPatientData } from '../firebase/services'
import Loader from '../helperComponents/Loader'
import PatientInsight from './PatientInsight'


const PatientData = ({ user, clickedPatientID, setPatientDataPage, setInsightPage }) => {

    const [patientDetails, setPatientDetails] = useState(null)
    const [showAll, setShowAll] = useState(false);


    // Mock data
    const sessionData = [
        { date: '2024-06-10', duration: '25 mins', game: 'Balloon Pop', status: 'Completed', notes: 'Good concentration today' },
        { date: '2024-06-09', duration: '10 mins', game: 'Memory Match', status: 'Abandoned', notes: 'Patient got tired quickly' },
        { date: '2024-06-08', duration: '20 mins', game: 'Shape Sorter', status: 'Completed', notes: 'Improved motor control' },
        { date: '2024-06-07', duration: '18 mins', game: 'Maze Runner', status: 'Completed', notes: 'Quick reflexes observed' },
        { date: '2024-06-06', duration: '5 mins', game: 'Color Match', status: 'Abandoned', notes: 'Network error' },
        { date: '2024-06-05', duration: '30 mins', game: 'Shape Sorter', status: 'Completed', notes: 'Great focus' },
        { date: '2024-06-04', duration: '15 mins', game: 'Memory Match', status: 'Completed', notes: 'Memory improved slightly' },
        { date: '2024-06-03', duration: '22 mins', game: 'Balloon Pop', status: 'Completed', notes: '-' },
        { date: '2024-06-02', duration: '12 mins', game: 'Maze Runner', status: 'Abandoned', notes: 'Device crashed' },
        { date: '2024-06-01', duration: '28 mins', game: 'Color Match', status: 'Completed', notes: 'Very responsive today' },
        { date: '2024-06-10', duration: '25 mins', game: 'Balloon Pop', status: 'Completed', notes: 'Good concentration today' },
        { date: '2024-06-09', duration: '10 mins', game: 'Memory Match', status: 'Abandoned', notes: 'Patient got tired quickly' },
        { date: '2024-06-08', duration: '20 mins', game: 'Shape Sorter', status: 'Completed', notes: 'Improved motor control' },
        { date: '2024-06-07', duration: '18 mins', game: 'Maze Runner', status: 'Completed', notes: 'Quick reflexes observed' },
        { date: '2024-06-06', duration: '5 mins', game: 'Color Match', status: 'Abandoned', notes: 'Network error' },
        { date: '2024-06-05', duration: '30 mins', game: 'Shape Sorter', status: 'Completed', notes: 'Great focus' },
        { date: '2024-06-04', duration: '15 mins', game: 'Memory Match', status: 'Completed', notes: 'Memory improved slightly' },
        { date: '2024-06-03', duration: '22 mins', game: 'Balloon Pop', status: 'Completed', notes: '-' },
        { date: '2024-06-02', duration: '12 mins', game: 'Maze Runner', status: 'Abandoned', notes: 'Device crashed' },
        { date: '2024-06-01', duration: '28 mins', game: 'Color Match', status: 'Completed', notes: 'Very responsive today' }
      ];

    const showInsights=()=>{
      setPatientDataPage(false)
      setInsightPage(true)
     
    }
    

    useEffect(() => {
        const fetchPatientDetails = async () => {
            const dataRef = await getSelectedPatientData(user, clickedPatientID)
            setPatientDetails(dataRef)
        };fetchPatientDetails();
    }, [])

    return (
        <>
        <div className='container'>
          <button className='sec-btn app-btn action-btn' onClick={() => setPatientDataPage(false)}> <i className='fa-solid fa-arrow-left'></i> Back to all patients</button>
                  {patientDetails?
                      <>
                          <div className='patient-detail-head'>
                              <p>Name : <strong>{patientDetails.name}</strong> </p>
                              <p>Age : <strong>{patientDetails.age}</strong> </p>
                              <p>Condition : <strong>{patientDetails.condition}</strong> </p>
                              <p>Starting Stage : <strong>{patientDetails.startingStage}</strong> </p>
                              <p>Therapist : <strong>{patientDetails.therapist}</strong> </p>
                          </div>
                          <div className="session-table-container">
                            <PatientInsight/>
        <h2>Session History</h2>
        <table className="session-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Duration</th>
              <th>Game</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {sessionData.map((session, index) => (
              <tr key={index} onClick={()=>showInsights()}>
                <td>{index + 1}</td>
                <td>{session.date}</td>
                <td>{session.duration}</td>
                <td>{session.game}</td>
                <td className={session.status === 'Completed' ? 'status-completed' : 'status-abandoned'}>
                  {session.status}
                </td>
                <td>{session.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
                      </>
          :
              <Loader/>
              }
        </div>
        </>
    )
}

export default PatientData