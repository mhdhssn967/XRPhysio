import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot, getDocs, updateDoc, doc } from "firebase/firestore";

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
