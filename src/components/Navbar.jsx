import React from 'react'
import logo from '../assets/OQ.png'
import './Navbar.css'
import examination from '../assets/examination.png'
import medicalteam from '../assets/medical-team.png'
import vr from '../assets/vr-glasses.png'
import vr2 from '../assets/vr-glasses (1).png'
import settings from '../assets/settings.png'
import adminImg from '../assets/administrator-developer-icon.png'
import home from '../assets/home.png'

const Navbar = ({user, adminId, setPage, page}) => {

  return (
    <>
    <div className='nav-container'>
        
        <div className='menu-div'>
               <button title='home' onClick={()=>setPage(0)} ><img src={home} alt="" style={page==0?{backgroundColor:'white',filter:'invert(0)'}:{}} /></button>
               <button title='Manage Patients' onClick={()=>setPage(1)} ><img src={examination} alt="" style={page==1?{backgroundColor:'white',filter:'invert(0)'}:{}} /></button>
               <button title='Manage Therapists' onClick={()=>setPage(2)} ><img src={medicalteam} alt="" /></button>
               <button title='Manage Devices' onClick={()=>setPage(3)}><img src={vr2} alt="" /></button>
               <button title='Game sessions' onClick={()=>setPage(4)}><img src={vr} alt="" style={page==4?{backgroundColor:'white',filter:'invert(0)'}:{}} /></button>
               <button title='Settings' onClick={()=>setPage(5)}><img src={settings} alt="" /></button>

               {user==adminId&&
                <button title='Admin Settings'onClick={()=>setPage(6)} ><img style={page==6?{backgroundColor:'white',filter:'invert(0)'}:{}} src={adminImg} alt="" /></button>
                }


            
        </div>
        
    </div>
    </>
  )
}

export default Navbar