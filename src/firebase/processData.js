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




export function analyzeGameData(sessions) {
  const result = {};

  const reactionList = sessions.map(s => s.reaction);
  const efficiencyList = sessions.map(s => s.efficiency);

  // 1. Average Reaction Time
  const avgReaction = reactionList.reduce((a, b) => a + b, 0) / reactionList.length;
  result.averageReactionTime = parseFloat(avgReaction.toFixed(3));

  // 2. Reaction Time Consistency
  const reactMean = avgReaction;
  const reactVariance = reactionList.reduce((sum, val) => sum + Math.pow(val - reactMean, 2), 0) / reactionList.length;
  result.reactionConsistency = parseFloat(Math.sqrt(reactVariance).toFixed(3));

  // 3. Average Efficiency
  const avgEfficiency = efficiencyList.reduce((a, b) => a + b, 0) / efficiencyList.length;
  result.averageEfficiency = parseFloat(avgEfficiency.toFixed(3));

  // 4. Efficiency Consistency
  const effMean = avgEfficiency;
  const effVariance = efficiencyList.reduce((sum, val) => sum + Math.pow(val - effMean, 2), 0) / efficiencyList.length;
  result.efficiencyConsistency = parseFloat(Math.sqrt(effVariance).toFixed(3));

  // 5. Total Target Accuracy
  let totalHits = 0;
  let totalTargets = 0;
  for (const s of sessions) {
    const hits = s.targetHitCount?.reduce((a, b) => a + b, 0) || 0;
    const targets = s.targetTotalCount?.reduce((a, b) => a + b, 0) || 0;
    totalHits += hits;
    totalTargets += targets;
  }
  result.totalTargetAccuracy = totalTargets ? parseFloat((totalHits / totalTargets).toFixed(3)) : 0;

  // 6. Total Miss Count
  result.totalMissCount = totalTargets - totalHits;

  // 7. Average Reach Range
  function distance3D(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
  }

  let totalReach = 0;
  let sessionCount = 0;

  for (const s of sessions) {
    const points = s.spawnPointsList || [];
    let maxDist = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const d = distance3D(points[i], points[j]);
        if (d > maxDist) maxDist = d;
      }
    }
    if (points.length >= 2) {
      totalReach += maxDist;
      sessionCount++;
    }
  }

  result.averageReachRange = sessionCount ? parseFloat((totalReach / sessionCount).toFixed(3)) : 0;

  // 8. Total Reach Area Coverage
  const quadrantSet = new Set();
  for (const s of sessions) {
    for (const p of s.spawnPointsList || []) {
      const qx = p.x < 0 ? "Left" : p.x > 0 ? "Right" : "CenterX";
      const qy = p.y > 1 ? "High" : "Low";
      const qz = p.z < 5 ? "Near" : "Far";
      quadrantSet.add(`${qx}-${qy}-${qz}`);
    }
  }
  result.totalReachAreaCoverage = quadrantSet.size;

  // 9. Fatigue Trend (across sessions)
  if (reactionList.length >= 2) {
    result.fatigueTrend = {
      reactionDrop: parseFloat((reactionList[reactionList.length - 1] - reactionList[0]).toFixed(3)),
      efficiencyDrop: parseFloat((efficiencyList[0] - efficiencyList[efficiencyList.length - 1]).toFixed(3))
    };
  } else {
    result.fatigueTrend = {
      reactionDrop: null,
      efficiencyDrop: null
    };
  }

  return result;
}

