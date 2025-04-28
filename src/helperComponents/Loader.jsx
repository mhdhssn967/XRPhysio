import React from 'react'
import loader from '../assets/loadcustom2.png'

const Loader = () => {
  return (
    <div style={{width:'80vw',height:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <img className='custom-loader' width={'100px'} src={loader} alt="" />
    </div>

    
  )
}

export default Loader