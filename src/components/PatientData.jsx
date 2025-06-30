import React, { useEffect, useState } from 'react';
import './PatientData.css';
import { fetchSessionHistoryOfPatient, getSelectedPatientData } from '../firebase/services';
import Loader from '../helperComponents/Loader';
import PatientInsight from './PatientInsight';
import { Card, CardContent, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import SessionInsight from './SessionInsight';

const PatientData = ({ user, clickedPatientID, setPatientDataPage, setInsightPage }) => {
  const [patientDetails, setPatientDetails] = useState(null);
  const [sessionRawData, setSessionRawData] = useState([]);           // 🔴 Raw data
  const [displaySessionData, setDisplaySessionData] = useState([]);   // 🟢 Processed data


  const showInsights = () => {
    setPatientDataPage(false);
    setInsightPage(true);
  };

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

  return (
    
    <>
    {showSessionInsight?<>
    <SessionInsight sessionRawData={sessionRawData}
    displaySessionData={displaySessionData} patientDetails={patientDetails}
    session={selectedSession}
    setShowSessionInsight={setShowSessionInsight}
  /></>:
      <div className="container">
        <button className="sec-btn app-btn action-btn" onClick={() => setPatientDataPage(false)}>
          <i className="fa-solid fa-arrow-left"></i> Back to all patients
        </button>
  
        {patientDetails ? (
          <>
            <Card elevation={2} sx={{ margin: '1rem 0', backgroundColor: 'none' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
            Patient Information
          </Typography>
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
              <PatientInsight sessionData={sessionRawData} displaySessionData={displaySessionData}/>
  
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
