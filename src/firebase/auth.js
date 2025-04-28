// src/firebase/auth.js
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

/**
 * Logs in a user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} - User credentials or error
 */
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login failed:", error.code, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Logs out the currently authenticated user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout failed:", error.message);
    return { success: false, error: error.message };
  }
};
