import { getFirestore, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
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
export const addPatientToHospital = async (hospitalId, patientData) => {
  try {
    const patientsCollectionRef = collection(
      db,
      'hospitalData',
      hospitalId,
      'patients'
    );

    await addDoc(patientsCollectionRef, {
      ...patientData,
      createdAt: new Date()
    });

    console.log('✅ Patient added successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error adding patient:', error);
    return { success: false, error };
  }
};


// Fetch patient data

export const getPatientData = async (hospitalId) => {
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
         startingStage: "Beginner",
         therapist: "System",
         isGuest: true
       };
 
       const patientResult = await addPatientToHospital(uid, guestPatient);
 
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