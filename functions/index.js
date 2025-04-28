/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.deleteUserAndData = functions.https.onCall(async (data, context) => {
  // 1. Optional: Verify admin privileges (you can check email, UID, custom claims, etc.)
  const requestingUser = context.auth;
  if (!requestingUser) {
    throw new functions.https.HttpsError('unauthenticated', 'Only authenticated users can call this function.');
  }

  const uidToDelete = data.uid;

  try {
    // 2. Delete user from Firebase Auth
    await admin.auth().deleteUser(uidToDelete);

    const db = admin.firestore();

    // 3. Delete documents from hospitals and hospitalData collections
    await db.collection("hospitals").doc(uidToDelete).delete();
    await db.collection("hospitalData").doc(uidToDelete).delete();

    return { success: true, message: `User ${uidToDelete} and data deleted.` };
  } catch (error) {
    console.error("Error deleting user and data:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
