import React, { useEffect, useState } from 'react';
import './PatientData.css';
import { deletePatient, fetchSessionHistoryOfPatient, getSelectedPatientData, getUniqueGameNames } from '../firebase/services';
import Loader from '../helperComponents/Loader';
import PatientInsight from './PatientInsight';
import { Card, CardContent, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SessionInsight from './SessionInsight';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Swal from 'sweetalert2';

dayjs.extend(customParseFormat);

const PatientData = ({ user, clickedPatientID, setPatientDataPage, setInsightPage }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [sessionRawData, setSessionRawData] = useState([]);           // 🔴 Raw data
  const [displaySessionData, setDisplaySessionData] = useState([]);   // 🟢 Processed data
  const [sessionData,setSessionData]=useState([])
  const [focus,setFocus]=useState([])

  const [sessionStatsImage, setSessionStatsImage] = useState(null);

  const showInsights = () => {
    setPatientDataPage(false);
    setInsightPage(true);
  };

  useEffect(() => {
  const result = displaySessionData.map(item => {
  const [month, day, year] = item.date.split('/');
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  return {
    date: formattedDate,
    efficiency: parseFloat(item.avgEfficiency),
    reaction: parseFloat(item.avgReaction)
  };
});

  setSessionData(result);
}, [patientDetails, displaySessionData]);
  
  

  useEffect(() => {
    const getSessionHistory = async () => {
      const rawData = await fetchSessionHistoryOfPatient(clickedPatientID, user);
      setSessionRawData(rawData);

      // Process & store derived values
      const transformedData = rawData.map((session) => {
        const avgReaction =
          session.reactionTime?.length > 0
            ? (session.reactionTime.reduce((a, b) => a + b, 0) / session.reactionTime.length).toFixed(2)
            : 'N/A';

        const avgEfficiency =
          session.targetEfficiency?.length > 0
            ? (session.targetEfficiency.reduce((a, b) => a + b, 0) / session.targetEfficiency.length).toFixed(1)
            : 'N/A';

        const dateStr = session.timestamp?.seconds
          ? new Date(session.timestamp.seconds * 1000).toLocaleDateString()
          : 'N/A';

        return {
          id: session.id,
          date: dateStr,
          gameName: session.gameName || 'N/A',
          hand: session.handSelected || 'N/A',
          totalReps: session.totalRepCount || 'N/A',
          avgReaction,
          avgEfficiency,
        };
      });

      setDisplaySessionData(transformedData);
    };

    getSessionHistory();
  }, [user, clickedPatientID]);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      const dataRef = await getSelectedPatientData(user, clickedPatientID);
      setPatientDetails(dataRef);
    };

    fetchPatientDetails();
  }, []);

const [showSessionInsight, setShowSessionInsight] = useState(false);
const [selectedSession, setSelectedSession] = useState(null);


   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

 useEffect(()=>{
  const getFocusPoints=async()=>{
    const focusRef=await getUniqueGameNames(user,clickedPatientID)
    setFocus(focusRef)
    
  };getFocusPoints();
 },[])

 const handleDeletePatient = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanently delete the patient and all their data.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete!"
  });

  if (result.isConfirmed) {
    try {
      await deletePatient(user, patientDetails.id); // user = hospitalId
      Swal.fire({
        title: "Deleted!",
        text: "The patient and their data have been removed.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      setPatientDataPage(false)
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting the patient.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  }
};

  return (
    
    <>
    {showSessionInsight?<>
    <SessionInsight user={user} sessionRawData={sessionRawData}
    displaySessionData={displaySessionData} patientDetails={patientDetails}
    session={selectedSession}
    setShowSessionInsight={setShowSessionInsight}
    selectedSession={selectedSession}
      statsImage={sessionStatsImage}
  /></>:
      <div className="container">
       <div className='top-btn'>
          <button className="sec-btn app-btn action-btn back-button" onClick={() => setPatientDataPage(false)}>
            <i class="ri-arrow-left-circle-fill" style={{fontSize:'25px',color:'black',fontWeight:'100'}}></i> Back to all patients
          </button>
  
          <button onClick={handleDeletePatient} className='delete-patient-btn'><i style={{color:'white',fontWeight:'200'}} className="ri-delete-bin-2-line"></i> Delete Patient</button>
       </div>
  
        {patientDetails ? (
          <>
            <Card elevation={2} sx={{ margin: '1rem 0', background: 'none',boxShadow:'none' }}>
        <CardContent>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Name:</strong> {patientDetails.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Age:</strong> {patientDetails.age}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Condition:</strong> {patientDetails.condition}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Starting Stage:</strong> {patientDetails.startingStage}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body1"><strong>Therapist:</strong> {patientDetails.therapist}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
  
            <div className="session-table-container">
              <PatientInsight onStatsImageReady={setSessionStatsImage} focus={focus} sessionRawData={sessionRawData} />
  
              <h2 style={{ margin: '2%' }}>Session History</h2>
              <table className="session-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Game</th>
                    <th>Hand</th>
                    <th>Total Reps</th>
                    <th>Avg Reaction Time (s)</th>
                    <th>Target Hit Efficiency (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySessionData.length > 0 ? (
                    displaySessionData.map((session, index) => (
                      <tr key={session.id} onClick={() => {
    setSelectedSession(sessionRawData.find(s => s.id === session.id));
    setShowSessionInsight(true)}}>
                        <td>{index + 1}</td>
                        <td>{session.date}</td>
                        <td>{session.gameName}</td>
                        <td>{session.hand}</td>
                        <td>{session.totalReps}</td>
                        <td>{session.avgReaction}</td>
                        <td>{session.avgEfficiency}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center' }}>
                        No history present
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
}
    </>
  );
};

export default PatientData;
