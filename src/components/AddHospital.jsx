import React, { useState } from 'react'
import './AddHospital.css'
import { registerHospital } from '../firebase/services';
import Swal from 'sweetalert2';

const AddHospital = ({user,triggerRefresh,setTriggerRefresh, setRegisterHospital}) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        hospitalName: "",
        place: "",
        VRDeviceCount: 1,
        deviceIds: [""],
        isSubscriptionActive: false,
      });
    
      const handleChange = (e, index = null) => {
        const { name, value, type, checked } = e.target;
        if (name === "deviceIds") {
          const updatedDevices = [...formData.deviceIds];
          updatedDevices[index] = value;
          setFormData({ ...formData, deviceIds: updatedDevices });
        } else {
          setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
          });
        }
      };
    
      const handleDeviceCountChange = (e) => {
        const count = parseInt(e.target.value);
        setFormData({
          ...formData,
          VRDeviceCount: count,
          deviceIds: Array(count).fill(""),
        });
      };
      const addHospital=async(user, formData)=>{
        await registerHospital(user,formData)
        setTriggerRefresh(!triggerRefresh)
        setFormData({email: "",
            password: "",
            hospitalName: "",
            place: "",
            VRDeviceCount: 1,
            deviceIds: [""],
            isSubscriptionActive: false})
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await addHospital(user, formData);
            Swal.fire({
                title: 'Success!',
                text: 'Hospital details added successfully.',
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
        } catch (error) {
            console.error("Error adding hospital:", error);
            Swal.fire({
                title: 'Error!',
                text: 'There was an issue adding the hospital.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        }
    };
    
  return (
    <>
    <div className="form-container">
      <h2 style={{margin:'1%',fontWeight:'200'}}>Register New Hospital</h2>
      <form>
        <div className='form-addHospital'>
            <label>Email
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </label>
    
            <label>Password
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </label>
        
            <label>Hospital Name
              <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} required />
            </label>
    
            <label>Place:
              <input type="text" name="place" value={formData.place} onChange={handleChange} required />
            </label>
            <label>VR Device Count
              <input type="number" name="VRDeviceCount" min="0" value={formData.VRDeviceCount} onChange={handleDeviceCountChange} required />
            </label>
    
            {formData.deviceIds.map((_, idx) => (
              <div style={{display:'flex',flexDirection:'column'}}>
                  <label key={idx}>
                    Device {idx + 1} id
                    <input
                      type="text"
                      name="deviceIds"
                      value={formData.deviceIds[idx]}
                      onChange={(e) => handleChange(e, idx)}
                      required
                    />
                  </label>
              </div>
            ))}
    </div>
            <div style={{display:'flex'}}>
                <label className="checkbox-label">
                Subscription Active? <input
                    type="checkbox"
                    name="isSubscriptionActive"
                    checked={formData.isSubscriptionActive}
                    onChange={handleChange}
                  />
                </label>
            
            <button style={{marginLeft:'20px'}} onClick={()=>setRegisterHospital(false)} className='addhospt-btn'>Cancel</button>
            <button style={{marginLeft:'10px'}} onClick={handleSubmit} className='sec-btn addhospt-btn'>Register Hospital</button>
            </div>
      </form>
    </div>
    <hr style={{marginTop:'20px'}} />
    </>
  )
}

export default AddHospital