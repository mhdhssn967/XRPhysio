import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";

const firestore = getFirestore();

export const useAccessRequestStatus = () => {
  const [isRequestActive, setIsRequestActive] = useState(false);

  useEffect(() => {
    const accessRequestRef = collection(firestore, "access_request");
    const q = query(accessRequestRef, where("request_status", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIsRequestActive(true);
      } else {
        setIsRequestActive(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return isRequestActive;
};



export const fetchDeviceId = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "device_request"));
    
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data(); // assuming only one document
      const deviceId = docData.deviceId; // or 'deviceid' if that's the exact field name

      console.log("Fetched Device ID:", deviceId);
      return deviceId;
    } else {
      console.warn("No documents found in 'device_request'");
      return null;
    }
  } catch (error) {
    console.error("Error fetching device ID:", error);
    return null;
  }
};



export const registerDevice = async (deviceId, reqEmail, reqPassword) => {
  try {
    // Step 1: Register the device

    // Step 2: Fetch the only document from 'access_request'
    const querySnapshot = await getDocs(collection(firestore, "device_request"));

    if (!querySnapshot.empty) {
      const firstDoc = querySnapshot.docs[0];
      const docRef = doc(firestore, "device_request", firstDoc.id);

      // Step 3: Update the document with email and password
      await updateDoc(docRef, {
        deviceId:deviceId,
        email: reqEmail,
        password: reqPassword
      });
      // Set credentials true
    const querySnapshotCredentials = await getDocs(collection(firestore, "access_request"));

    if (!querySnapshotCredentials.empty) {
      const firstDoc = querySnapshotCredentials.docs[0];
      const docRef = doc(firestore, "access_request", firstDoc.id);

      // Step 3: Update the document with email and password
      await updateDoc(docRef, {
        credentials_exist:true
      });

      console.log("Email and password stored successfully.");
    } else {
      console.warn("No documents found in 'device_request'");
    }
  }
  } catch (error) {
    console.error("Error in device registration and credential storage:", error);
  }
};



export const registerDeviceFalse = async (deviceId, bool) => {
  try {


    // Step 1: Get the only document in 'access_request'
    const querySnapshot = await getDocs(collection(firestore, "access_request"));

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;

      // Step 2: Update that document's request_status and timestamp
      await updateDoc(docRef, {
        request_status: bool,
        timestamp: serverTimestamp()
      });
    } else {
      console.warn("No document found in 'access_request'.");
    }

    const deviceDocRef = doc(firestore, "device_request", deviceId);

    // Step 3: If bool is true, create/update the device_request doc
    if (bool) {
      await setDoc(deviceDocRef, {
        status: "active",
        timestamp: serverTimestamp(),
        deviceId: deviceId
      });
    } else {
      // Step 4: If bool is false, delete the device_request doc
      await deleteDoc(deviceDocRef);
    }

    console.log("Device registration process completed.");
  } catch (error) {
    console.error("Error registering device: ", error);
  }
};

export const setCredentialsFalse=async()=>{
  const querySnapshotCredentials = await getDocs(collection(firestore, "access_request"));

    if (!querySnapshotCredentials.empty) {
      const firstDoc = querySnapshotCredentials.docs[0];
      const docRef = doc(firestore, "access_request", firstDoc.id);

      // set credentials exist false
      await updateDoc(docRef, {
        credentials_exist:false
      });
    }   
}