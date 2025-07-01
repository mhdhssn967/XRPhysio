import React, { useEffect, useState } from 'react';
import './SessionInsight.css';
import PatientEfficiencyVisualizer from './PatientEfficiencyVisualizer';
import VisualChart from './VisualChart';
import ProjectionViews from './ProjectionViews';

const SessionInsight = ({ selectedSession, sessionRawData, patientDetails, setShowSessionInsight }) => {
  const [enhancedPoints, setEnhancedPoints] = useState([]);
  const [session, setSession] = useState(null);
  const [realSpawnPoints,setRealSpawnPoints]=useState([])  

  useEffect(() => {
    window.scrollTo(0, 0);

    const latest = selectedSession;
    setSession(latest);

    // Prepare points
    const spawnPoints = selectedSession.spawnPointsList || [];
    setRealSpawnPoints(spawnPoints)
    const hitCounts = selectedSession.targetHitCount || [];
    const totalCounts = selectedSession.targetTotalCount || [];

    const computedPoints = spawnPoints.map((point, index) => {
      const touchCount = hitCounts[index] || 0;
      const totalSpawns = totalCounts[index] || 0;
      const efficiency = totalSpawns > 0 ? ((touchCount / totalSpawns) * 100).toFixed(1) : 0;
      return {
        name: `Point ${index + 1}`,
        position: [point.x, point.y, point.z],
        touchCount,
        totalSpawns,
        efficiency,
      };
    });

    setEnhancedPoints(computedPoints);
  }, [selectedSession]);

  if (!session) return <p>Loading session details...</p>;

  const formattedDate = new Date(selectedSession.timestamp.seconds * 1000).toLocaleDateString();

  const totalPoints = enhancedPoints.length;
  const touchedPoints = enhancedPoints.filter((pt) => pt.touchCount > 0).length;
  const missedPoints = totalPoints - touchedPoints;

  const efficiencies = enhancedPoints.map((pt) => parseFloat(pt.efficiency));
  const avgEfficiency = efficiencies.length ? (efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length).toFixed(1) : 'N/A';

  const highest = enhancedPoints.reduce((max, pt) => (parseFloat(pt.efficiency) > parseFloat(max.efficiency) ? pt : max), enhancedPoints[0]);
  const lowest = enhancedPoints.reduce((min, pt) => (parseFloat(pt.efficiency) < parseFloat(min.efficiency) ? pt : min), enhancedPoints[0]);

  const feedback = avgEfficiency >= 90
  ? 'Outstanding performance. Excellent spatial accuracy and response control.'
  : avgEfficiency >= 80
    ? 'Excellent spatial awareness and motor response.'
    : avgEfficiency >= 70
      ? 'Very good effort. Patient shows strong coordination with room for refinement.'
      : avgEfficiency >= 60
        ? 'Good performance, continue training for consistency.'
        : avgEfficiency >= 50
          ? 'Moderate control observed. Focused sessions may help stabilize performance.'
          : avgEfficiency >= 40
            ? 'Below average response. Recommend targeted motor skill drills.'
            : avgEfficiency >= 30
              ? 'Low efficiency. Consider adjusting game parameters and supervised therapy.'
              : 'Severely low performance. Immediate guided physiotherapy intervention advised.';



const spawnPoints = realSpawnPoints;

  return (
    <div className='container'>
      <button className='sec-btn app-btn action-btn back-button' onClick={()=>setShowSessionInsight(false)}>
        <i className='fa-solid fa-arrow-left'></i> Back to patient details
      </button>
      <div className='visualizer-heading'>
        <h2><span>Patient Name:</span> {patientDetails.name || 'Patient Name'}</h2>
        <h2><span>Condition</span>: {patientDetails.condition || 'Condition'}</h2>
        <h2><span>Game:</span> {selectedSession.gameName}</h2>
      </div>

      

      <div className='visualizer'>
        <PatientEfficiencyVisualizer sessionRawData={sessionRawData} selectedSession={selectedSession}/>

        <div className='visual-data-div'>
          <h2 className='main-heading'>Game Session Summary</h2>
          <hr style={{ marginBottom: '6%' }} />

          <p><strong>Game Name:</strong> {selectedSession.gameName}</p>
          <p><strong>Played On:</strong> {formattedDate}</p>
          <p><strong>Hand Selected:</strong> {selectedSession.handSelected}</p>
          <p><strong>Play Duration:</strong> Approx. {selectedSession.reactionTime?.length * 3 || 'N/A'} seconds</p>

          <hr />

          <p><strong>Total Stimuli Points:</strong> {totalPoints}</p>
          <p><strong>Engaged Points:</strong> {touchedPoints}</p>
          <p><strong>Missed Points:</strong> {missedPoints}</p>

          <hr />

          <p><strong>Highest Efficiency:</strong> {highest.name} ({highest.efficiency}%)</p>
          <p><strong>Lowest Efficiency:</strong> {lowest.name} ({lowest.efficiency}%)</p>

          <hr />

          <p><strong>Average Motor Efficiency:</strong> {avgEfficiency}%</p>
          <p><strong>Target Response:</strong> {selectedSession.reactionTime?.length || 0} targets</p>
          <p style={{textWrap:'wrap'}}><strong>Feedback:</strong> {feedback}</p>
        </div>
      </div>

      <div className='physio-data-div'>
        <h3 style={{ marginBottom: '10px', color: '#444' }}>Performance Metrics</h3>
        <hr /> 
        <ProjectionViews enhancedPoints={enhancedPoints} spawnPoints={spawnPoints}/>
        <div>
          <VisualChart enhancedPoints={enhancedPoints}/>
        </div>
      </div>
    </div>
  );
};

export default SessionInsight;
