import React, { useState } from 'react'
import './HospitalModal.css'

const HospitalModal = ({ setDataModal, modalData, deviceIds }) => {


    return (
        <>
            <div className='modal-overlay'>
                <div className='custom-modal'>
                    <div className='modal-head'>
                        <h1 className='main-heading'>Hospital Details</h1>
                        <i className='fa-solid fa-close' onClick={() => setDataModal(false)}></i>
                    </div>
                    <hr />
                    <div className='modal-body'>
                        <div>
                            <h2><i className="fa-solid fa-house-medical"></i> Hospital Name :<span>{modalData ? modalData.name : 'Loading...'}</span> </h2>
                            <h2><i className="fa-solid fa-box-open"></i> Subscription :<span>{modalData ? modalData.isSubscriptionActive ? 'Active' : 'Inactive' : 'Loading...'}</span> </h2>
                            <h2><i className="fa-solid fa-bed"></i> Total Patients :<span> {modalData ? modalData.patientCount : 'Loading...'}</span> </h2>
                        </div>
                        <div>
                            <h2><i className="fa-solid fa-location-dot"></i> Place :<span> {modalData ? modalData.place : 'Loading...'}</span> </h2>
                            <h2><i className="fa-solid fa-calendar"></i> Activated on :<span>
                                {modalData && modalData.createdAt
                                    ? new Date(modalData.createdAt.seconds * 1000).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })
                                    : 'Loading...'}
                            </span> </h2>
                            <h2><i className="fa-solid fa-gamepad"></i> Total Games Played : <span>{modalData ? modalData.totalGamePlayCount : 'Loading...'}</span> </h2>
                        </div>
                    </div>
                    <h2><i className="fa-solid fa-vr-cardboard"></i> Total Devices : <span style={{ fontWeight: '500' }}> {modalData ? modalData.VRDeviceCount : 'Loading...'}</span> </h2>
                    <div className='device-details'>
                        {deviceIds && deviceIds.length > 0 ? (
                            deviceIds.map((id, index) => (
                                <h2 key={index}>
                                    Device {index + 1} : <span style={{fontWeight:'500'}}>{id}</span>
                                </h2>
                            ))
                        ) : (
                            <h2>No devices found.</h2>
                        )}

                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'15px'}}>
                        <button className='app-btn deactivate-hosp'>Deactivate subscription</button>
                        <button className='app-btn delete-hosp'>Delete Hospital</button>
                    </div>


                </div>
            </div>
        </>
    )
}

export default HospitalModal