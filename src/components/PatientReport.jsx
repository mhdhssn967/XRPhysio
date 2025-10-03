import React, { useEffect, useRef, useState } from 'react';
import './PatientReport.css';
import oq from '../assets/OQ.png'
import { getUserId } from '../firebase/getUserID';
import { fetchHospitalName } from '../firebase/services';
import PrepareReport from './PrepareReport';
import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';


const PatientReport = ({processedPhysioData, sessionRawData,patient,session,projectionImage,chartImage,statsImage, setDownloadReport}) => {
  
const [hospName,setHospName]=useState('Rehab Institute')
const [loading,setLoading]=useState(true)



useEffect(()=>{
  const getHospName=async()=>{
    const userRef=await getUserId()
    
  const hospNameRef=await fetchHospitalName(userRef)
  setHospName(hospNameRef)
  
  };getHospName()
},[])
useEffect(()=>{
  if(hospName!='Rehab Institute' && patient && session && projectionImage && chartImage && statsImage){
    setLoading(false)
  }
},[hospName , patient , session , projectionImage , chartImage , statsImage])


  
const page1Ref = useRef();
  const page2Ref = useRef();

  const handleDownload = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const capturePage = async (ref, addPage = false) => {
      const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (addPage) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    };

    await capturePage(page1Ref); // First page
    await capturePage(page2Ref, true); // Second page

    pdf.save(`${patient.name}-VR_Rehab-report.pdf`);
  };
  return (
    <> 
    
    {!loading?<div className='report-btns'>
          <button className='download-report-btn'onClick={handleDownload}>Download</button>
          <button onClick={()=>setDownloadReport(false)}>Close</button>
        </div>:<></>}
      {!loading?
      <div className='report-viewport'>
        <div className="report-container" id="reportContent">
         
          <div className='report-main' ref={page1Ref}>
              {/* <header className="report-header">
                <img style={{filter:'invert(1)'}} width={'30px'} src={oq} alt="" />
                <p>Happy Moves</p>
              </header> */}
              <header className='header2'>
                <h1>{hospName}</h1>
    <p>
      Generated on {new Date().toLocaleDateString('en-GB')}
    </p>
              </header>
              
        
              <div className='all-info'>
                  <section className="section patient-info">
                    <div className='sec-det'>
                        <h3>Patient Details</h3>
                       <div className='details-pad'>
                            <p><strong>Name:</strong> {patient.name}</p>
                            <p><strong>Age:</strong> {patient.age}</p>
                          <p><strong>Patient ID:</strong> {patient.id}</p>
                       </div>
                    </div>
                  </section>
        
                  <section className="section patient-info">
                    <div className='sec-det'>
                        <h3>Session Information</h3>
                       <div className='details-pad'>
                            <p><strong>Date:</strong> {session.date}</p>
                            {session.therapist&&<p><strong>Therapist:</strong> {session.therapist}</p>}
                            <p><strong>Diagnosis:</strong> {patient.condition}</p>
                             <p><strong>session duration:</strong> Aprox {session.duration}</p>
                       </div>
                       <p style={{margin:'20px 0px'}}><strong>Average motor efficiency recorded: </strong>{session.avgEfficiency}</p>
                    </div>
                  </section>
    
                  <section className='section stats-image'>
                    <img src={statsImage} alt="" />
                  </section>
        
                  <section className="section patient-info">
                    <div className='sec-det'>
                        {/* <h3>Session Notes</h3> */}
                       <div className='details-pad'>
                            {/* <p style={{textWrap:'wrap'}}>Patient exhibited improved external shoulder rotation. Pain level decreased compared to last session. Advised to continue mobility routines. Observed minor discomfort during resistance movement. */}
        {/* </p> */}
                       </div>
                    </div>
                  </section>
    
                  <section className="section visual-chart">
        <div className='sec-det'>
            <h3>Motor Efficiency Chart</h3>
            <img src={chartImage} alt="Efficiency Chart" className="report-chart-image" />
        </div>
      </section>
            
        
       
            
        
              </div>
        
              
          </div>
          <div className='report-main' ref={page2Ref}>
            <section className="section chart">
        <div className='sec-det'>
            <h3>Projections</h3>
            <img src={projectionImage} alt="Projection View" className="report-chart-image" />
        </div>
      </section>
    <div style={{ marginTop: '20px', fontSize: '14px' }}>
          <p><strong></strong> 1 unit = 1 meter (approx. as per VR spatial data)</p>
    
          <div style={{ marginTop: '10px', }}>
            <p><strong>Efficiency Scale:</strong></p>
            <div style={{ display: 'flex',flexDirection:'column', alignItems: 'start', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#e74c3c'
                }} />
                <span style={{ fontSize: '12px' }}>Low</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#f1c40f'
                }} />
                <span style={{ fontSize: '12px' }}>Moderate</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#2ecc71'
                }} />
                <span style={{ fontSize: '12px' }}>High</span>
              </div>
            </div>
          </div>
        </div>
    
    
      <footer className="report-footer">
                <p><strong>Disclaimer:</strong> This VR rehabilitation report is based on spatial data captured through virtual reality mapping. All values and measurements are approximate and may not reflect precise physical dimensions.</p>
              </footer>
          </div>
    
          
        </div>
      </div>:
      <div className='loadScreen' >
        <PrepareReport/>
      </div>}
    </>
  );
};

export default PatientReport;
