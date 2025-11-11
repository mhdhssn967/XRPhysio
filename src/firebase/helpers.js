import { getFirestore, doc, getDoc, getDocs, setDoc, serverTimestamp, where, query, deleteDoc, updateDoc, orderBy } from 'firebase/firestore';
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
      SceneName: "ActivitySelection",
      gameName: "Home Screen",
      language:'english',
      changeScene:false,
      startedAt: serverTimestamp(),
      serverIP
    };

    await setDoc(doc(db,'hospitalData',hospitalId, "activeDeviceSessions", deviceId), sessionData);
    console.log("Session started successfully!");
  } catch (error) {
    console.error("Error starting session:", error.message);
  }
};

// fetching Active Device Sessions


export const fetchActiveSessions = async (hospitalId) => {
    try {
        const sessionsRef = collection(db,'hospitalData',hospitalId, "activeDeviceSessions");
        
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

// update game

export const updateSessionGameInfo = async (hospitalId, deviceId, gameName, sceneName, gameSetName) => {
  try {
    if (!hospitalId || !deviceId || !gameName || !sceneName) {
      throw new Error("Missing required parameters to update session.");
    }

    const sessionRef = doc(db, 'hospitalData', hospitalId, 'activeDeviceSessions', deviceId);

    await updateDoc(sessionRef, {
      gameName: gameName,
      SceneName: sceneName,
      changeScene:true,
      gameSetName:gameSetName,
      startedAt: serverTimestamp(),
    });

    console.log(`Session updated with game "${gameName}" and scene "${sceneName}".`);
  } catch (error) {
    console.error("Error updating session game info:", error.message);
  }
};



// update gameplay status
export const updateGameStatus = async (hospitalId,deviceId, newStatus) => {
    try {
      if (!deviceId || !newStatus) {
        throw new Error("Device ID and new status are required.");
      }
  
      const sessionRef = doc(db,'hospitalData',hospitalId, "activeDeviceSessions",deviceId);
      await updateDoc(sessionRef, {
        gameStatus: newStatus,
      });
  
      console.log(`Game status updated to "${newStatus}" for device ${deviceId}`);
    } catch (error) {
      console.error("Error updating game status:", error.message);
    }
  };

  // go to homescreen
export const setSceneToActivitySelection = async (hospitalId, deviceId) => {
  try {
    if (!hospitalId || !deviceId) {
      throw new Error("Hospital ID and Device ID are required.");
    }

    const sessionRef = doc(db, 'hospitalData', hospitalId, 'activeDeviceSessions', deviceId);

    await updateDoc(sessionRef, {
      SceneName: "ActivitySelection",
      gameName: "Home Screen",
      gameStatus:"idle",
      changeScene:true
    });

    console.log(`SceneName set to "ActivitySelection" and gameName to "Home Screen" for device ${deviceId}`);
  } catch (error) {
    console.error("Error updating scene and game name:", error.message);
  }
};

// uploadGameDetails.js

//________________________________Game details_______________________________________________
/**
 * Uploads the list of game details to Firestore (one-time use).
 * @param {import('firebase/app').FirebaseApp} firebaseApp - Initialized Firebase app
 */
// export const uploadGameDetails = async (firebaseApp) => {
//   const db = getFirestore(firebaseApp);
//   const gameCollectionRef = collection(db, "gameDetails");

//   const games = [
//     { gameName: "ActivitySelection", gameDisplayName: "Activity Selection", focus: "General" },
//     { gameName: "MosqKillHandGross", gameDisplayName: "Mosquito Kill", focus: "Hand Gross" },
//     { gameName: "FruitCutHandGross", gameDisplayName: "Fruit Cut", focus: "Hand Gross" },
//     { gameName: "BaloonCutHandGross", gameDisplayName: "Balloon Cut", focus: "Hand Gross" },
//     { gameName: "BlossomHandGross", gameDisplayName: "Blossom", focus: "Hand Gross" },
//     { gameName: "ButterflyHandGross", gameDisplayName: "Butterfly Catch", focus: "Hand Gross" },
//     { gameName: "BaloonpopHandgross", gameDisplayName: "Balloon Pop", focus: "Hand Gross" },
//     { gameName: "BaloonpopHandFine", gameDisplayName: "Balloon Pop", focus: "Hand Fine" },
//     { gameName: "LightHandFine", gameDisplayName: "Light Tap", focus: "Hand Fine" },
//     { gameName: "NeckHorizontal", gameDisplayName: "Neck Horizontal Movement", focus: "Neck" },
//     { gameName: "NeckVertical", gameDisplayName: "Neck Vertical Movement", focus: "Neck" },
//     { gameName: "TrunkRotation", gameDisplayName: "Trunk Rotation", focus: "Trunk" },
//     { gameName: "TrunkSideCrunches", gameDisplayName: "Trunk Side Crunches", focus: "Trunk" },
//     { gameName: "LegStaticBalancing", gameDisplayName: "Leg Static Balancing", focus: "Leg Balance" },
//     { gameName: "LegDynamicBalancing", gameDisplayName: "Leg Dynamic Balancing", focus: "Leg Balance" },
//     { gameName: "ColorPen", gameDisplayName: "Color Pen", focus: "Concentration" },
//     { gameName: "Concentration", gameDisplayName: "Concentration Task", focus: "Concentration" },
//     { gameName: "LegSideMarches", gameDisplayName: "Leg Side Marches", focus: "Leg Movement" },
//     { gameName: "LegFrontMarches", gameDisplayName: "Leg Front Marches", focus: "Leg Movement" },
//     { gameName: "LegKicks", gameDisplayName: "Leg Kicks", focus: "Leg Movement" },
//     { gameName: "ShoulderMaxHeight", gameDisplayName: "Shoulder Max Height", focus: "Shoulder Movement" }
//   ];

//   try {
//     for (const game of games) {
//       await addDoc(gameCollectionRef, game);
//       console.log(`✅ Added: ${game.gameDisplayName}`);
//     }
//     console.log("🎉 All games uploaded successfully.");
//   } catch (error) {
//     console.error("❌ Error uploading games:", error);
//   }
// };
// __________________________________________________________________________________________________________________ 


// Fetch game name and details
/**
 * Fetches all game details from the "gameDetails" collection in Firestore.
 * @param {import('firebase/app').FirebaseApp} firebaseApp - Initialized Firebase app
 * @returns {Promise<Array>} Array of game objects with gameName, gameDisplayName, focus, etc.
 */
export const fetchGameDetails = async (firebaseApp) => {
  const db = getFirestore(firebaseApp);
  const gameCollectionRef = collection(db, "gameDetails");

  try {
    const snapshot = await getDocs(gameCollectionRef);
    const games = snapshot.docs.map(doc => ({
      id: doc.id, // Firestore document ID
      ...doc.data()
    }));

    console.log("✅ Fetched games:", games);
    return games;
  } catch (error) {
    console.error("❌ Error fetching game details:", error);
    return [];
  }
};

/**
 * Updates the specified activeDeviceSession document by merging new data
 * @param {string} hospitalId - Hospital document ID
 * @param {string} sessionId - Active device session document ID
 * @param {Object} newData - New fields to add/update in the document
 */
export const updateGameSettings = async (hospitalId, deviceId, newData) => {
  try {
    const sessionDocRef = doc(
      db,
      "hospitalData",
      hospitalId,
      "activeDeviceSessions",
      deviceId
    );
    await updateDoc(sessionDocRef, newData); // Merges fields by default

    console.log("✅ Document updated successfully!");
  } catch (error) {
    console.error("❌ Error updating document:", error);
  }
};


export const setApplyPositionsTrue = async (hospitalId, deviceId) => {
  try {
    const sessionDocRef = doc(
      db,
      "hospitalData",
      hospitalId,
      "activeDeviceSessions",
      deviceId
    );

    await updateDoc(sessionDocRef, {
      applyPositions: true,
    });

    console.log("✅ 'applyPositions' updated to true successfully!");
  } catch (error) {
    console.error("❌ Error updating 'applyPositions':", error);
  }
};

// Set language

export const updateLanguage = async (hospitalId, deviceId, language) => {
  try {
    const sessionDocRef = doc(
      db,
      "hospitalData",
      hospitalId,
      "activeDeviceSessions",
      deviceId
    );
    await updateDoc(sessionDocRef, { language });
    console.log("✅ Language updated successfully!");
  } catch (error) {
    console.error("❌ Error updating language:", error);
  }
};



/**
 * Fetch patientId from Firestore
 * @param {string} userId - The hospital/user ID (first ID in the path)
 * @param {string} deviceId - The active device session ID (second ID in the path)
 * @returns {Promise<string|null>} - Returns patientId or null if not found
 */
export const fetchPatientId = async (userId, deviceId) => {
  try {
    // Reference to the document
    const docRef = doc(db, "hospitalData", userId, "activeDeviceSessions", deviceId);

    // Get snapshot
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      return {patientId:data.patientId,gameSetName:data.gameSetName} || null;
    } else {
      console.warn("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching patientId:", error);
    throw error;
  }
};


/**
 * Fetch spawnPointList for a given patient and gameDisplayName.
 * Looks up focus in gameDetails, then finds matching gameName in patient gameDatas.
 *
 * @param {string} userId - hospital/user ID
 * @param {string} patientId - patient ID
 * @param {string} gameDisplayName - the display name of the game
 * @returns {Promise<Array|null>} spawnPointList or null if not found
 */
export const fetchSpawnPointList = async (userId, patientId, gameDisplayName) => {
  try {
    // Step 1: Find gameDetails entry for this displayName
    const gameDetailsRef = collection(db, "gameDetails");
    const gameDetailsSnap = await getDocs(query(gameDetailsRef, where("gameSetName", "==", gameDisplayName)));

    if (gameDetailsSnap.empty) {
      console.warn("No gameDetails found for:", gameDisplayName);
      return null;
    }

    // There should be only one, but take the first
    const gameDetailsData = gameDetailsSnap.docs[0].data();
    const focusName = gameDetailsData.gameSetName;


    // Step 2: Now check patient gameDatas, sorted latest → oldest
    const gameDatasRef = collection(db, "hospitalData", userId, "patients", patientId, "gameDatas");
    const q = query(gameDatasRef, orderBy("timestamp", "desc"));
    const querySnap = await getDocs(q);

    for (const docSnap of querySnap.docs) {
      const data = docSnap.data();
      
      if (data.gameName === focusName) {
        return data.spawnPointsList || [];
      }
    }

    // If not found
    console.warn("No matching gameDatas found for:", focusName);
    return null;
  } catch (error) {
    console.error("Error fetching spawnPointList:", error);
    throw error;
  }
};


export const fetchGameName = async (userId, deviceId) => {
  try {
    // Reference to the document
    const docRef = doc(db, "hospitalData", userId, "activeDeviceSessions", deviceId);

    // Get snapshot
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.gameName || null;
    } else {
      console.warn("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching gameName:", error);
    throw error;
  }
};

