import { getAuth } from "firebase/auth";

// Function to get the current user's ID
export const getUserId = async() => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return user.uid; // Return the user's UID if authenticated
  } else {
    throw new Error("No user is currently signed in");
  }
};
