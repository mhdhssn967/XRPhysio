// firebaseFunctions.js
import {db } from '../../firebaseConfig'; // adjust path as needed

import { collection, addDoc, getDocs, deleteDoc, doc, Timestamp } from "firebase/firestore";
/**
 * Add a new therapy schedule for a specific user
 * @param {string} userId - The physiotherapist / user ID
 * @param {object} scheduleData - Schedule details
 */
export const addTherapySchedule = async (userId, scheduleData) => {
  try {
    const docRef = await addDoc(
      collection(db, "hospitalData", userId, "therapySchedules"),
      {
        ...scheduleData,
        createdAt: Timestamp.now(),
      }
    );
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding schedule:", error);
    return { success: false, error };
  }
};



// Get schedules
export const getTherapySchedules = async (userId) => {
  try {
    const schedulesRef = collection(db, "hospitalData", userId, "therapySchedules");
    const snapshot = await getDocs(schedulesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }
};

// Delete schedule
export const deleteTherapySchedule = async (userId, scheduleId) => {
  try {
    const scheduleRef = doc(db, "hospitalData", userId, "therapySchedules", scheduleId);
    await deleteDoc(scheduleRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return { success: false, error };
  }
};