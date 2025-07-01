import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../../firebaseConfig'; // adjust path as needed

export const fetchLatestGameSessions = async (hospitalId) => {
  try {
    const patientsRef = collection(db, 'hospitalData', hospitalId, 'patients');
    const patientSnapshot = await getDocs(patientsRef);

    let allGameData = [];

    for (const patientDoc of patientSnapshot.docs) {
      const patientId = patientDoc.id;
      const patientData = patientDoc.data();
      const gameDataRef = collection(
        db,
        'hospitalData',
        hospitalId,
        'patients',
        patientId,
        'gameDatas'
      );

      const gameSnapshot = await getDocs(gameDataRef);
      gameSnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        allGameData.push({
          patientName: patientData.name || 'Unknown',
          gameName: data.gameName || 'N/A',
          hand: data.handSelected || 'N/A',
          avgReaction: Array.isArray(data.reactionTime)
            ? (data.reactionTime.reduce((a, b) => a + b, 0) / data.reactionTime.length).toFixed(2)
            : 'N/A',
          efficiency: Array.isArray(data.targetEfficiency)
            ? (
                data.targetEfficiency.reduce((a, b) => a + b, 0) /
                data.targetEfficiency.length
              ).toFixed(1)
            : 'N/A',
          date: data.timestamp?.toDate().toLocaleDateString() || 'N/A',
          timestamp: data.timestamp?.toMillis() || 0,
        });
      });
    }

    // Sort and return top 5 recent gameplays
    const latestFive = allGameData
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
      .map(({ timestamp, ...rest }) => rest); // remove raw timestamp before return

    return latestFive;
  } catch (error) {
    console.error('❌ Error fetching latest game sessions:', error);
    return [];
  }
};
