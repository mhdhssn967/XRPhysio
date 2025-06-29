import React from 'react'
import man from '../assets/man.png';
import './Landing.css'



const Landing = ({hospName}) => {
  return (
    <div>
          <div className="homepage-wrapper">
            <div className="dashboard-home">
              <div className="dashboard-info">
                <h2>Welcome, <br /> <span className="highlight"><strong>{hospName}</strong></span></h2>
                <p className="tagline">Monitoring VR Therapy Sessions with <strong>Happy Moves</strong></p>
                <div className="stats-grid">
                  <div className="stat-card">👥 Total Patients: <strong>128</strong></div>
                  <div className="stat-card">🎮 Sessions Played: <strong>452</strong></div>
                  <div className="stat-card">🧠 Active Today: <strong>15</strong></div>
                  <div className="stat-card">📦 Devices Connected: <strong>6</strong></div>
                  <div className="stat-card">⚠️ Alerts: <strong>1 Subscription Ending</strong></div>
                  <div className="stat-card">📅 Registered Since: <strong>12/01/2024</strong></div>
                </div>  
              </div>
            </div>
              
          </div>
        </div>
  )
}

export default Landing