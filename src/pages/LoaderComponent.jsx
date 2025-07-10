import React from 'react'
import './LoaderComponent.css'
import oquload from '../assets/oqu-load.gif'

const LoaderComponent = () => {
  return (
    <div className='loader-bg'>
        {/* <div className="loader-bg">
          <div className="loader-bar"></div>
        </div> */}
        <img width={'100px'} src={oquload} alt="" />
    </div>
  )
}

export default LoaderComponent