import React from 'react'
import './SessionInsight.css'
import PatientEfficiencyVisualizer from './PatientEfficiencyVisualizer'
import VisualChart from './VisualChart'

const SessionInsight = ({ setInsightPage, setPatientDataPage }) => {
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
    <div>
      <VisualChart/>
    </div>
    
    </div>
      </div>
  )
}

export default SessionInsight