import React, { useEffect, useState } from 'react'
import './SessionInsight.css'
import PatientEfficiencyVisualizer from './PatientEfficiencyVisualizer'
import VisualChart from './VisualChart'
import ProjectionViews from './ProjectionViews'

const SessionInsight = ({ setInsightPage, setPatientDataPage }) => {

  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });

  const points = [
    { name: "Point 1", position: [2, 0, 2] },
    { name: "Point 2", position: [-2, 0, 2] },
    { name: "Point 3", position: [2, 0, -2] },
    { name: "Point 4", position: [-2, 0, -2] },
    { name: "Point 5", position: [0, 0, 3] },
    { name: "Point 6", position: [0, 0, -3] },
    { name: "Point 7", position: [3, 0, 0] },
    { name: "Point 8", position: [-3, 0, 0] },
    { name: "Point 9", position: [0, 3, 2] },
    { name: "Point 10", position: [0, 2, 0] },
  ];
  
  const enhancedPoints = points.map((point) => {
    const touchCount = Math.floor(Math.random() * 6);
    const totalSpawns = 5 + Math.floor(Math.random() * 2);
    const efficiency = (touchCount / totalSpawns) * 100;
    return {
      ...point,
      touchCount,
      totalSpawns,
      efficiency,
    };
  });

  return (
    <div>
      <div className='visualizer-heading'>
        <h2>Shamsad P</h2>
        <h2>Stroke</h2>
        <h2>Precision Shooter</h2>
      </div>
      <button className='sec-btn app-btn action-btn' onClick={() => {setInsightPage(false); setPatientDataPage(true)}}> <i className='fa-solid fa-arrow-left'></i> Back to patient details</button>
      <div className='visualizer'> <PatientEfficiencyVisualizer />
      
        <div className='visual-data-div'>
          <h2 className='main-heading'>Game Session Summary</h2>
          <hr style={{ marginBottom: '6%' }} />
          <p><strong>Game Name:</strong> Precision Shooter</p>
          <p><strong>Played On:</strong> July 3, 2025</p>
          <p><strong>Play Duration:</strong> 3 minutes 45 seconds</p>

          <hr />

          <p><strong>Total Points:</strong> 10</p>
          <p><strong>Touched Points:</strong> 6</p>
          <p><strong>Missed Points:</strong> 4</p>

          <hr />

          <p><strong>Highest Efficiency:</strong> Point 5 (92%)</p>
          <p><strong>Lowest Efficiency:</strong> Point 8 (12%)</p>

          <hr />

          <p><strong>Average Efficiency:</strong> 65.4%</p>
          <p><strong>Score:</strong> 785</p>
          <p><strong>Feedback:</strong> Good precision, consider working on consistency.</p>
        </div>
        </div>
        <div className='physio-data-div'>
      <h3 style={{ marginBottom: '10px', color: '#444' }}>Performance Metrics</h3>
      <hr />
      <ProjectionViews enhancedPoints={enhancedPoints} />
    <div>
      <VisualChart/>
    </div>

    </div>
      </div>
  )
}

export default SessionInsight