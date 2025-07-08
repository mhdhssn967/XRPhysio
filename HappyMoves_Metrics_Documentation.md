
# Happy Moves: Physiotherapy Metrics Documentation

This document describes how to extract clinically useful physiotherapy metrics from the raw game data collected during sessions in the **Happy Moves** platform.

---

## 🎯 Metrics & Calculations

### 1. Average Reaction Time
**Description:** Mean time (in seconds) the user takes to respond to each target.

**Calculation:**
```js
avgReactionTime = sum(reactionTime[]) / reactionTime.length
```

---

### 2. Reaction Time Consistency
**Description:** Standard deviation of reaction times. High variability may indicate inconsistency in motor response.

**Calculation (Pseudocode):**
```js
mean = avgReactionTime
variance = sum((t - mean)^2 for t in reactionTime[]) / reactionTime.length
stdDeviation = sqrt(variance)
```

---

### 3. Overall Efficiency
**Description:** Overall percentage efficiency across all targets.

**Calculation:**
```js
overallEfficiency = efficiency // Directly from JSON
```

---

### 4. Target Accuracy
**Description:** Percentage of targets successfully hit.

**Calculation:**
```js
totalHits = sum(targetHitCount[])
totalTargets = sum(targetTotalCount[])
accuracy = (totalHits / totalTargets) * 100
```

---

### 5. Miss Count
**Description:** Total number of targets missed by the user.

**Calculation:**
```js
missCount = totalTargets - totalHits
```

---

### 6. Reach Range
**Description:** Maximum 3D distance between any two spawn points. Indicates spatial capability or range of motion.

**Calculation (Pseudocode):**
```js
For each pair of spawnPoints A and B:
  dist = sqrt((Ax - Bx)^2 + (Ay - By)^2 + (Az - Bz)^2)
reachRange = max(distances)
```

---

### 7. Reach Area Coverage
**Description:** Number of spatial zones covered. Can be approximated by dividing space into quadrants (e.g., left/right, near/far, high/low).

**Calculation (Conceptual):**
```js
Define spatial quadrants or grid
For each spawnPoint:
  classify into quadrant
reachCoverage = count(unique quadrants covered)
```

---

### 8. Fatigue Indicator
**Description:** Measures performance drop-off across repetitions due to fatigue.

**Calculation (Conceptual):**
```js
Compare first rep vs last rep:
  reactionFatigue = lastReactionTime - firstReactionTime
  efficiencyDrop = firstEfficiency - lastEfficiency
fatigueIndicator = weighted combination of both
```

---

## 📄 Mock Game Session JSON

```json
{
  "gameName": "Hand Gross Motor",
  "timestamp": {
    "seconds": 1751180379,
    "nanoseconds": 979367000
  },
  "totalRepCount": 2,
  "targetTotalCount": [2, 2, 2, 2],
  "targetHitCount": [2, 1, 2, 1],
  "targetEfficiency": [100, 50, 100, 50],
  "reactionTime": [2.5, 1.88, 1.75, 2.0],
  "efficiency": 75,
  "handSelected": "Right",
  "spawnPointsList": [
    { "x": -0.6, "y": 1.4, "z": 0.34 },
    { "x": -0.3, "y": 1.4, "z": 0.34 },
    { "x": -0.02, "y": 1.4, "z": 0.34 },
    { "x": 0.25, "y": 1.4, "z": 0.34 }
  ],
  "date": "2025-06-29"
}
```

---

## ✅ Notes

- `reactionTime` and `targetEfficiency` arrays must match the number of target points.
- For `Reach Area Coverage`, zones can be dynamically defined based on therapist configuration or space layout.

---

Created for **Oqulix – Happy Moves**, 2025.
