import { getFirestore, doc, getDoc, getDocs, setDoc, serverTimestamp, where, query, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../../firebaseConfig'; // adjust path as needed
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";


export const fetchDeviceIdsForHospitals = async (hospitalId) => {
 
    const db = getFirestore();
    const hospitalRef = doc(db, 'hospitals', hospitalId);
    try {
      const docSnap = await getDoc(hospitalRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return data.deviceIds || []; // Return deviceIds if exists
      } else {
        console.warn("No such hospital document exists.");
        return [];
      }
    } catch (error) {
      console.error('Error fetching device IDs:', error);
      throw error;
    }
}

export const getPatientDataforHospitals = async (hospitalId) => {
    try {
    const patientsRef = collection(db, 'hospitalData', hospitalId, 'patients');
    const snapshot = await getDocs(patientsRef);

    const patients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return patients;
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    return [];
  }
};

// To initiate a session
export const initiateSession = async (deviceId,patientId,deviceName,patientName,hospitalId ) => {
    
  try {
    if (!deviceId || !patientId || !hospitalId) {
      throw new Error("Missing parameters to start session.");
    }

    const sessionData = {
      deviceId,
      patientId,
      hospitalId,
      deviceName,
      patientName,
      gameStatus:'idle',
      startedAt: serverTimestamp()
    };

    await setDoc(doc(db, "activeDeviceSessions", deviceId), sessionData);
    console.log("Session started successfully!");
  } catch (error) {
    console.error("Error starting session:", error.message);
  }
};

// fetching Active Device Sessions


export const fetchActiveSessions = async (hospitalId) => {
    try {
        const sessionsRef = collection(db, "activeDeviceSessions");
        
        const q = query(sessionsRef, where("hospitalId", "==", hospitalId));
        
        const snapshot = await getDocs(q);
        const sessions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return sessions;
    } catch (error) {
        console.error("Error fetching active sessions:", error);
        return [];
    }
};


// deactivate a session

/**
 * Ends an active session by deleting it from Firestore
 * @param {string} sessionId - The ID of the session document
 */
export const endActiveSession = async (sessionId) => {
  try {
    const sessionRef = doc(db, 'activeDeviceSessions', sessionId);
    await deleteDoc(sessionRef);
    console.log('Session ended successfully.');
  } catch (error) {
    console.error('Error ending session:', error);
  }
};


// update gameplay status
export const updateGameStatus = async (deviceId, newStatus) => {
    try {
      if (!deviceId || !newStatus) {
        throw new Error("Device ID and new status are required.");
      }
  
      const sessionRef = doc(db, "activeDeviceSessions", deviceId);
      await updateDoc(sessionRef, {
        gameStatus: newStatus,
      });
  
      console.log(`Game status updated to "${newStatus}" for device ${deviceId}`);
    } catch (error) {
      console.error("Error updating game status:", error.message);
    }
  };