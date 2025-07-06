import React, { useEffect, useState } from 'react';
import './Homepage.css';
import Navbar from '../components/Navbar';
import { getUserId } from '../firebase/getUserID';
import { fetchHospitalData, fetchHospitalDataForAll, fetchHospitalName } from '../firebase/services';
import Patients from './Patients';
import Landing from './Landing';
import AdminPage from './AdminPage';
import GameSessions from './GameSessions';
import MockVRData from '../components/MockVRData';
const adminId = import.meta.env.VITE_ADMIN_ID


const Homepage = () => {

  const [user, setUser]=useState(null) 

   
  const [hospName, setHospName]=useState(null)
  const [fetchedHospitalData,setFetchedHospitalData]=useState({})
  // const [page, setPage]=useState(0)
  const [triggerRefresh, setTriggerRefresh]=useState(false) 

  const [page, setPage] = useState(() => {
  const savedPage = localStorage.getItem("currentPage");
  return savedPage !== null ? parseInt(savedPage) : 0;
});
  
useEffect(() => {
  localStorage.setItem("currentPage", page);
}, [page]);
  
  useEffect(() => {
    const fetchUserID = async() => {
      try {
        const currentUser =  await getUserId();        
        setUser(currentUser); // Set the user ID in the state
        const name = await fetchHospitalName(currentUser);  
        const detailsRef=await fetchHospitalDataForAll(currentUser)
        setFetchedHospitalData(detailsRef)     
        setHospName(name)
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUser(null); // Optionally set user to null if no user is found
      }
    };

    fetchUserID(); // Call the function inside useEffect

  }, [page]); 

  // const [theme, setTheme] = useState('light');

  // On initial load, set the saved theme
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme') || 'light';
  //   document.documentElement.setAttribute('data-theme', savedTheme);
  //   setTheme(savedTheme);
  // }, []);

  // const toggleTheme = () => {
  //   const newTheme = theme === 'dark' ? 'light' : 'dark';
  //   document.documentElement.setAttribute('data-theme', newTheme);
  //   localStorage.setItem('theme', newTheme);
  //   setTheme(newTheme);
  // };


  const renderPage = () => {
    switch (page) {
      case 0:
        return <Landing hospName={hospName} triggerRefresh={triggerRefresh} fetchedHospitalData={fetchedHospitalData} user={user}/>
      case 1:
        return <Patients user={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh}/>
      case 2:
        return <ManageTherapists />
      case 3:
        return <MockVRData />
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
    <div className='body-section'>
      <div className='nav-section'><Navbar user={user} adminId={adminId} setPage={setPage} page={page}/></div>  
          <div className="content">
          {renderPage()}
        </div>
    </div>
    {/* <button onClick={toggleTheme}>
      Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button> */}
    </>
  );
};

export default Homepage;
// ThemeToggle.jsx

