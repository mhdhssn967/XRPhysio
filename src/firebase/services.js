import { getFirestore, doc, getDoc, getDocs, setDoc, orderBy, query, increment, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../../firebaseConfig'; // adjust path as needed
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { initiateSession } from './helpers';
const adminId = import.meta.env.VITE_ADMIN_ID

// Function to fetch the hospital name using the userID
export const fetchHospitalName = async (userID) => {
  const db = getFirestore(); // Get Firestore database instance
  const docRef = doc(db, 'hospitals', userID);
   // Reference the document using the userID
  try {
    const docSnap = await getDoc(docRef); // Get the document snapshot
 

    if (docSnap.exists()) {
      // If the document exists, retrieve the hospName
      const hospName = docSnap.data().name;
      
      return hospName; // Return the hospital name
    } else {
      throw new Error('No such document found');
    }
  } catch (error) {
    console.error('Error fetching hospital name:', error);
    throw error; // You can choose to return null or throw an error based on your needs
  }
};



// To add patient details to database
export const generatePatientId = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Random two-letter prefix
  const letterPart =
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)];

  // Last 4 digits of timestamp (changes every millisecond)
  const timestampSuffix = String(Date.now()).slice(-4);

  return `${letterPart}-${timestampSuffix}`;
};

export const addPatientToHospital = async (hospitalId, patientData) => {
  try {
    const patientsCollectionRef = collection(
      db,
      'hospitalData',
      hospitalId,
      'patients'
    );

    const customId = generatePatientId(); // Short ID
    const newPatientDocRef = doc(patientsCollectionRef, customId); // Create doc ref with custom ID

    await setDoc(newPatientDocRef, {
      ...patientData,
      createdAt: new Date(),
    }); // ✅ Use setDoc, not addDoc

    await updateDoc(doc(db, 'hospitalData', hospitalId), {
      patientCount: increment(1),
    });

    console.log('✅ Patient added with ID:', customId);
    return { success: true, id: customId };
  } catch (error) {
    console.error('❌ Error adding patient:', error);
    return { success: false, error };
  }
};

// Fetch patient data

export const getPatientData = async (hospitalId) => {
  try {
    const patientsRef = collection(db, 'hospitalData', hospitalId, 'patients');

    // 🔽 Order by 'name' in ascending (alphabetical) order
    const q = query(patientsRef, orderBy('name'));

    const snapshot = await getDocs(q);

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


// Get hosp details for admin

export const fetchAllHospitals = async (user) => {

  if (user === adminId) {
    const db = getFirestore();
    const hospitalsRef = collection(db, 'hospitals');

    try {
      const snapshot = await getDocs(hospitalsRef);
      const hospitals = snapshot.docs
        .filter(doc => doc.id != adminId) // Exclude admin document
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

      return hospitals;
    } catch (error) {
      console.error('Error fetching hospital data:', error);
      throw error;
    }
  } else {
    console.log("Not Admin. Access Denied");
    return []; // Or throw an error if preferred
  }
};

// Register New hospital


/**
 * Registers a new hospital by creating a user and saving hospital data.
 * @param {Object} hospitalData - The data of the hospital.
 * @param {string} hospitalData.email - Email for login.
 * @param {string} hospitalData.password - Password for login.
 * @param {string} hospitalData.hospitalName - Name of the hospital.
 * @param {string} hospitalData.place - Location.
 * @param {number} hospitalData.VRDeviceCount - Number of VR devices.
 * @param {Array<string>} hospitalData.deviceIds - Array of device IDs.
 * @param {boolean} hospitalData.isSubscriptionActive - Subscription status.
 * @returns {Promise<string>} - Returns the UID of the created user on success.
 */

// Create a secondary app instance
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
const secondaryAuth = getAuth(secondaryApp);
 // Import the function if in separate file



 
 export const registerHospital = async (user, hospitalData) => {
   if (user === adminId) {
     try {
       const {
         email,
         password,
         hospitalName,
         place,
         VRDeviceCount,
         deviceIds,
         isSubscriptionActive,
       } = hospitalData;
 
       // Create hospital user using secondary auth
       const userCred = await createUserWithEmailAndPassword(
         secondaryAuth,
         email,
         password
       );
       const uid = userCred.user.uid;
 
       // Store hospital info
       await setDoc(doc(db, "hospitals", uid), {
         name: hospitalName,
         deviceIds: deviceIds,
       });
 
       await setDoc(doc(db, "hospitalData", uid), {
         name: hospitalName,
         place: place,
         isSubscriptionActive: isSubscriptionActive,
         VRDeviceCount: VRDeviceCount,
         patientCount: 0,
         totalGamePlayCount: 0,
         createdAt: new Date(),
       });
 
       // ✅ Add guest patient
       const guestPatient = {
         name: "Guest",
         age: "N/A",
         condition: "Test Mode",
         startingStage: "N/A",
         therapist: "System",
         isGuest: true
       };
 
       await setDoc(
  doc(db, "hospitalData", uid, "patients", "GUEST001"),
  {
    ...guestPatient,
    createdAt: new Date(),
  }
);
 
       // Get the guest patient ID (if needed)
       const patientsRef = collection(db, "hospitalData", uid, "patients");
       const guestSnapshot = await getDocs(patientsRef);
       let guestDoc = null;
       guestSnapshot.forEach((doc) => {
         if (doc.data().isGuest) {
           guestDoc = { id: doc.id, ...doc.data() };
         }
       });
 
       if (guestDoc) {
         // ✅ For each device, initiate a session with the guest patient
         for (const deviceId of deviceIds) {
           await initiateSession(
             deviceId,
             guestDoc.id,
             `Device ${deviceIds.indexOf(deviceId) + 1}`,
             guestDoc.name,
             uid
           );
         }
       }
 
       await secondaryAuth.signOut();
       return uid;
     } catch (error) {
       console.error("Error in registerHospital:", error.message);
       throw error;
     }
   } else {
     console.log("No permission to add data");
   }
 };
 


// Fetch Hospital data
export const fetchHospitalData = async (user, hospitalID) => {
  if (user === adminId) {
    const db = getFirestore();
    const hospitalDocRef = doc(db, 'hospitalData', hospitalID); // direct reference to the doc

    try {
      const docSnap = await getDoc(hospitalDocRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        console.log("No such hospital data document!");
        return null;
      }

    } catch (error) {
      console.error('Error fetching hospital data:', error);
      throw error;
    }
  } else {
    console.log("Not Admin. Access Denied");
    return null;
  }
};

export const fetchHospitalDataForAll = async (user) => {
  
    const db = getFirestore();
    const hospitalDocRef = doc(db, 'hospitalData', user); // direct reference to the doc
  
    try {
      const docSnap = await getDoc(hospitalDocRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      } else {
        console.log("No such hospital data document!");
        return null;
      }

    } catch (error) {
      console.error('Error fetching hospital data:', error);
      throw error;
    }
  } 


// to fetch deviceIds
export const fetchDeviceIds = async (user, hospitalId) => {
  if (user === adminId) {
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
  } else {
    console.log("Not Admin. Access Denied");
    return [];
  }
};

// Delete userId
// Delete user from database not possible without a paid plan

// Fetch one patient data
export const getSelectedPatientData = async (hospitalId, patientId) => {
  try {
    const patientRef = doc(db, 'hospitalData', hospitalId, 'patients', patientId);
    const patientSnap = await getDoc(patientRef);

    if (patientSnap.exists()) {
      return {
        id: patientSnap.id,
        ...patientSnap.data(),
      };
    } else {
      console.warn('Patient not found!');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching single patient:', error);
    return null;
  }
};


/**
 * Fetches game session history of a patient from Firestore.
 * 
 * @param {string} patientId - Firestore patient document ID.
 * @param {string} hospitalId - Firestore hospital (user/admin) ID.
 * @returns {Promise<Array>} - Array of session data objects.
 */

export async function fetchSessionHistoryOfPatient(patientId, hospitalId) {
  try {
    const sessionsRef = collection(
      db,
      'hospitalData',
      hospitalId,
      'patients',
      patientId,
      'gameDatas'
    );

    const q = query(sessionsRef, orderBy('timestamp', 'desc')); // or 'asc' for oldest first

    const snapshot = await getDocs(q);

    const sessionHistory = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return sessionHistory;
  } catch (error) {
    console.error('Error fetching session history:', error);
    return [];
  }
}


// utils/getUniqueGameNames.js


/**
 * Fetch unique game names from a specific patient's gameDatas collection
 * @param {string} hospitalId - ID of the hospital
 * @param {string} patientId - ID of the patient
 * @returns {Promise<string[]>} - Array of unique game names
 */

export const getUniqueGameNames = async (hospitalId, patientId) => {
  const gameDatasRef = collection(
    db,
    `hospitalData/${hospitalId}/patients/${patientId}/gameDatas`
  );

  try {
    const snapshot = await getDocs(gameDatasRef);
    const gameNamesSet = new Set();

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.gameName) {
        gameNamesSet.add(data.gameName);
      }
    });

    // Convert Set to array of objects with gameName and focus
    const gameNamesArray = Array.from(gameNamesSet).map((name) => {
      const focus = name.includes(" - ") ? name.split(" - ")[0].trim() : name;
      return { gameName: name, focus };
    });

    return gameNamesArray;
  } catch (error) {
    console.error("Error fetching game names:", error);
    return [];
  }
};


// Delete patient history

/**
 * Deletes a specific patient history (game session) from Firestore.
 *
 * @param {string} userId - The logged-in user's ID
 * @param {string} patientId - The patient's document ID
 * @param {string} sessionId - The game session document ID
 * @returns {Promise<void>}
 */
export async function deletePatientHistory(userId, patientId, sessionId) {
  try {
    // Reference to the document
    const docRef = doc(db, "hospitalData", userId, "patients", patientId, "gameDatas", sessionId);
    
    // Delete document
    await deleteDoc(docRef);
    console.log(`Deleted history for patient ${patientId}, session ${sessionId}`);
  } catch (error) {
    console.error("Error deleting patient history:", error);
  }
}

//Delete pateint
/**
 * Deletes a patient document along with all its subcollections,
 * and decrements the patient count in the hospital document.
 *
 * @param {string} hospitalId - The hospital document ID (usually the logged-in user ID)
 * @param {string} patientId - The patient document ID
 */
export async function deletePatient(hospitalId, patientId) {
  try {
    const patientRef = doc(db, "hospitalData", hospitalId, "patients", patientId);

    // 1. Delete all gameDatas docs for the patient
    const gameDatasRef = collection(db, "hospitalData", hospitalId, "patients", patientId, "gameDatas");
    const gameDatasSnap = await getDocs(gameDatasRef);
    const deletePromises = gameDatasSnap.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    // 2. Delete patient document
    await deleteDoc(patientRef);

    // 3. Decrement patientCount by 1
    const hospitalRef = doc(db, "hospitalData", hospitalId);
    await updateDoc(hospitalRef, {
      patientCount: increment(-1)
    });

    console.log(`Patient ${patientId} and all related data deleted successfully.`);
  } catch (error) {
    console.error("Error deleting patient:", error);
    throw error;
  }
}