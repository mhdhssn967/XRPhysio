
# Session Metrics Calculation Guide

This document outlines how the metrics such as **efficiency**, **average efficiency**, and **reaction time** are calculated and used in the Happy Moves app.

## 1. Efficiency (Per Session)
Efficiency is a percentage value indicating how accurately the patient hit the targets in a game.

### Formula:
```
efficiency = (score / maxScore) * 100
```
Where:
- `score` = Number of targets successfully hit or achieved
- `maxScore` = Total possible score in the game session

If `score` or `maxScore` is missing or 0, efficiency defaults to `0%`.

---

## 2. Average Efficiency (All Sessions)
Average efficiency is the mean value of all session efficiency percentages in a filtered time range.

### Formula:
```
averageEfficiency = (sum of all efficiencies) / (total number of sessions)
```
The result is rounded to one decimal place.

---

## 3. Reaction Time (Per Session)
This indicates the average time taken by the patient to react in a session.

### Formula:
```
avgReaction = sum of reactionTime array / number of reactionTime entries
```

If the reactionTime array is empty, the value is displayed as `"N/A"`.

---

## 4. Date Formatting
All timestamps from Firestore are converted to ISO format:

### Conversion:
```javascript
new Date(session.timestamp.seconds * 1000).toISOString().split('T')[0]
```

This produces a string like `YYYY-MM-DD` for easier filtering and charting.

---

## 5. Charts
- **Efficiency Line** (Red): Displays session-wise efficiency over time.
- **Reaction Time Line** (Green): Shows corresponding reaction times over the same timeline.
- **Dual Y-Axis**: Efficiency uses a 0–100% scale, while reaction time uses a seconds scale.

---

## Notes:
- All calculations are preprocessed before rendering charts.
- `displaySessionData` contains these precomputed values to optimize rendering and decouple logic from UI.
