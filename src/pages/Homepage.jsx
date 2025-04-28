import React, { useEffect, useState } from 'react';
import './Homepage.css';
import Navbar from '../components/Navbar';
import { getUserId } from '../firebase/getUserID';
import { fetchHospitalName } from '../firebase/services';
import Patients from './Patients';
import Landing from './Landing';
import AdminPage from './AdminPage';
import GameSessions from './GameSessions';
const adminId = import.meta.env.VITE_ADMIN_ID


const Homepage = () => {

  const [user, setUser]=useState(null)  
  const [hospName, setHospName]=useState(null)
  const [page, setPage]=useState(0)
  const [triggerRefresh, setTriggerRefresh]=useState(false) 
  
  
  useEffect(() => {
    const fetchUserID = async() => {
      try {
        const currentUser =  await getUserId();        
        setUser(currentUser); // Set the user ID in the state
        const name = await fetchHospitalName(currentUser);       
        setHospName(name)
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUser(null); // Optionally set user to null if no user is found
      }
    };

    fetchUserID(); // Call the function inside useEffect

  }, [page]); 

  const renderPage = () => {
    switch (page) {
      case 0:
        return <Landing hospName={hospName}/>
      case 1:
        return <Patients user={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh}/>
      case 2:
        return <ManageTherapists />
      case 3:
        return <ManageDevices />
      case 4:
        return <GameSessions triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh} user={user} />
      case 5:
        return <Settings />
      case 6:
        return <AdminPage user={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh}/>
      default:
        return <Landing hospName={hospName}/>
    }
  }
  return (
    <>
    <Navbar user={user} adminId={adminId} setPage={setPage} page={page}/>  
        <div className="content">
        {renderPage()}
      </div>
    </>
  );
};

export default Homepage;
