import React from 'react'
import man from '../assets/man.png';
import './Landing.css'



const Landing = ({hospName}) => {
  return (
    <div className='landing-main'>
      <p>V 1.3</p>
          <div className="homepage-wrapper">
            <div className="dashboard-home">
              <div className="dashboard-info">
                <h2> <br /> <span className="highlight"><strong>{hospName}</strong></span></h2>
                <p className="tagline">Monitoring VR Therapy Sessions with <strong>Happy Moves</strong></p>
                <div className="stats-grid">
                  <div className="stat-card"><i class="fa-solid fa-bed-pulse"></i> <h4>Total Patients: <strong>128</strong></h4></div>
                  <div className="stat-card"><i class="fa-solid fa-gamepad"></i> <h4>Sessions Played: <strong>452</strong></h4></div>
                  <div className="stat-card"><i class="fa-solid fa-vr-cardboard"></i><h4> Devices Connected: <strong>6</strong></h4></div>
                </div>  
              </div>
            </div>  
          </div>
          <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn quick"><i class="fa-solid fa-user-plus"></i> Add New Patient</button>
          <button className="action-btn quick"><i class="fa-solid fa-chart-simple"></i> View Reports</button>
          <button className="action-btn quick"><i class="fa-solid fa-gear"></i>  Device Settings</button>
          <button className='action-btn quick'><i class="fa-solid fa-headset"></i> Contact Support</button>
        </div>
      </section>
        </div>
  )
}

export default Landing