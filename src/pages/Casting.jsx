import React, { useEffect } from 'react'
import UnityCastPlayer from '../components/casting/UnityCastPlayer';

const Casting = () => {
    useEffect(()=>{
console.log("casting loaded");

    },[])
  return (
    <div>
        <UnityCastPlayer />
    </div>
  )
}

export default Casting