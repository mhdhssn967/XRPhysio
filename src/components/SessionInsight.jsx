import React, { useEffect, useState } from 'react';
import './SessionInsight.css';
import PatientEfficiencyVisualizer from './PatientEfficiencyVisualizer';
import VisualChart from './VisualChart';
import ProjectionViews from './ProjectionViews';
import PatientReport from './PatientReport';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import Swal from "sweetalert2";
import { deletePatientHistory } from '../firebase/services';

const SessionInsight = ({user, focus, selectedSession, sessionRawData, patientDetails, setShowSessionInsight, processedPhysioData,setProcessedPhysioData,statsImage }) => {
  const [enhancedPoints, setEnhancedPoints] = useState([]);
  const [session, setSession] = useState(null);
  const [realSpawnPoints,setRealSpawnPoints]=useState([])  
  const [modelPosition,setModelPosition]=useState(true)
  const [downloadReport,setDownloadReport]=useState(false)



const visualChartRef = useRef();
const [chartImage, setChartImage] = useState(null);

  const projectionRef = useRef();
const [projectionImage, setProjectionImage] = useState(null);

useEffect(() => {
  setTimeout(() => {
    const target = projectionRef.current;
    if (target) {
      html2canvas(target).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        setProjectionImage(imgData);
      });
    }
  }, 2000); // Wait for projection render

  setTimeout(() => {
  if (visualChartRef.current) {
    html2canvas(visualChartRef.current, { useCORS: true, scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      setChartImage(imgData);
    });
  }
}, 2500);
}, []);

  
  useEffect(() => {
    window.scrollTo(0, 0);

    const latest = selectedSession;
    setSession(latest);

    // Prepare points
    const spawnPoints = selectedSession.spawnPointsList || [];
    setRealSpawnPoints(spawnPoints)
    const hitCounts = selectedSession.targetHitCount || [];
    const totalCounts = selectedSession.targetTotalCount || [];

    const computedPoints = spawnPoints.map((point, index) => {
      const touchCount = hitCounts[index] || 0;
      const totalSpawns = totalCounts[index] || 0;
      const efficiency = totalSpawns > 0 ? ((touchCount / totalSpawns) * 100).toFixed(1) : 0;
      return {
        name: `Point ${index + 1}`,
        position: [point.x, point.y, point.z],
        touchCount,
        totalSpawns,
        efficiency,
      };
    });

    setEnhancedPoints(computedPoints);
  }, [selectedSession]);

  if (!session) return <p>Loading session details...</p>;

  const formattedDate = new Date(selectedSession.timestamp.seconds * 1000).toLocaleDateString();

  const totalPoints = enhancedPoints.length;
  const touchedPoints = enhancedPoints.filter((pt) => pt.touchCount > 0).length;
  const missedPoints = totalPoints - touchedPoints;

  const efficiencies = enhancedPoints.map((pt) => parseFloat(pt.efficiency));
  const avgEfficiency = efficiencies.length ? (efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length).toFixed(1) : 'N/A';

  const highest = enhancedPoints.reduce((max, pt) => (parseFloat(pt.efficiency) > parseFloat(max.efficiency) ? pt : max), enhancedPoints[0]);
  const lowest = enhancedPoints.reduce((min, pt) => (parseFloat(pt.efficiency) < parseFloat(min.efficiency) ? pt : min), enhancedPoints[0]);

  const feedback = avgEfficiency >= 90
  ? 'Outstanding performance. Excellent spatial accuracy and response control.'
  : avgEfficiency >= 80
    ? 'Excellent spatial awareness and motor response.'
    : avgEfficiency >= 70
      ? 'Very good effort. Patient shows strong coordination with room for refinement.'
      : avgEfficiency >= 60
        ? 'Good performance, continue training for consistency.'
        : avgEfficiency >= 50
          ? 'Moderate control observed. Focused sessions may help stabilize performance.'
          : avgEfficiency >= 40
            ? 'Below average response. Recommend targeted motor skill drills.'
            : avgEfficiency >= 30
              ? 'Low efficiency. Consider adjusting game parameters and supervised therapy.'
              : 'Severely low performance. Immediate guided physiotherapy intervention advised.';



const spawnPoints = realSpawnPoints;

const handleDelete = async () => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This will permanantly delete the session data.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await deletePatientHistory(user, patientDetails.id, selectedSession.id);

      Swal.fire({
        title: "Deleted!",
        text: "The patient history has been removed.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      setShowSessionInsight(false)

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting the history.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
      console.error("Error deleting patient history:", error);
    }
  }
};

  return (
    <div className='container'>
      {downloadReport&&<div className='report-overlay'><PatientReport setDownloadReport={setDownloadReport} statsImage={statsImage} processedPhysioData={processedPhysioData} setProcessedPhysioData={setProcessedPhysioData} focus={focus} sessionRawData={sessionRawData} chartImage={chartImage} projectionImage={projectionImage}
  patient={{
    name: patientDetails.name,
    condition: patientDetails.condition,
    id: patientDetails.id || 'HMXXXX',
    age: patientDetails.age || 'N/A',
  }}
  session={{
    date: new Date(selectedSession.timestamp.seconds * 1000).toLocaleDateString(),
    gameName: selectedSession.gameName,
    hand: selectedSession.handSelected,
    targetCount: selectedSession.reactionTime?.length || 0,
    duration: `${(selectedSession.reactionTime?.length || 0) * 3} seconds`,
    highest: `${highest.name} (${highest.efficiency}%)`,
    lowest: `${lowest.name} (${lowest.efficiency}%)`,
    totalPoints,
    touchedPoints,
    missedPoints,
    avgEfficiency: `${avgEfficiency}%`,
    feedback,
  }}
/></div>}
      <button title='Download Report' className='rpt-main-btn' onClick={()=>setDownloadReport(!downloadReport)}> <img className='rpt-btn' src='/rpt.png' alt="" /> </button>
      <div className='top-btn'>
        <button className='sec-btn app-btn action-btn back-button' onClick={()=>setShowSessionInsight(false)}>
          <i class="ri-arrow-left-circle-fill" style={{fontSize:'25px',color:'black',fontWeight:'100'}}></i> Back to patient details
        </button>
                <button onClick={handleDelete} className='delete-patient-btn'><i style={{color:'white',fontWeight:'200'}} className="ri-file-reduce-line"></i> Remove session data</button>
  
      </div>

      <div className='visualizer-heading'>
        <h2><span>Patient Name:</span> {patientDetails.name || 'Patient Name'}</h2>
        <h2><span>Condition</span>: {patientDetails.condition || 'Condition'}</h2>
        <h2><span>Game:</span> {selectedSession.gameName}</h2>
      </div>

      

      <div className='visualizer'>
        <PatientEfficiencyVisualizer setModelPosition={setModelPosition} modelPosition={modelPosition} sessionRawData={sessionRawData} selectedSession={selectedSession}/>

        <div className='visual-data-div'>
          <h2 className='main-heading'>Game Session Summary</h2>
          <hr style={{ marginBottom: '6%' }} />

          <p><strong>Game Name:</strong> {selectedSession.gameName}</p>
          <p><strong>Played On:</strong> {formattedDate}</p>
          <p><strong>Hand Selected:</strong> {selectedSession.handSelected}</p>
          <p><strong>Play Duration:</strong> Approx. {selectedSession.reactionTime?.length * 3 || 'N/A'} seconds</p>

          <hr />

          <p><strong>Total Stimuli Points:</strong> {totalPoints}</p>
          <p><strong>Engaged Points:</strong> {touchedPoints}</p>
          <p><strong>Missed Points:</strong> {missedPoints}</p>

          <hr />

          <p><strong>Highest Efficiency:</strong> {highest?.name} ({highest?.efficiency}%)</p>
          <p><strong>Lowest Efficiency:</strong> {lowest?.name} ({lowest?.efficiency}%)</p>

          <hr />

          <p><strong>Average Motor Efficiency:</strong> {avgEfficiency}%</p>
          <p><strong>Target Response:</strong> {selectedSession.reactionTime?.length || 0} targets</p>
          <p style={{textWrap:'wrap'}}><strong>Feedback:</strong> {feedback}</p>
        </div>
      </div>

      <div className='physio-data-div'>
        <h3 style={{ marginBottom: '10px', color: '#444' }}>Performance Metrics</h3>
        <hr /> 
        <ProjectionViews setModelPosition={setModelPosition} modelPosition={modelPosition} enhancedPoints={enhancedPoints} spawnPoints={spawnPoints} projectionRef={projectionRef}/>
        <div>
          <div ref={visualChartRef}><VisualChart enhancedPoints={enhancedPoints}/></div>
          

        </div>
      </div>
    </div>
  );
};

export default SessionInsight;
