import React, { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, ResponsiveContainer, CartesianGrid,
} from "recharts";
import './PatientInsight.css';

const mockSessions = [
    { sessionId: "s001", date: "2024-06-01", gameType: "Gross Motor", gameName: "Mosquito Swat VR", score: 2, maxScore: 100 },
    { sessionId: "s002", date: "2024-06-03", gameType: "Fine Motor", gameName: "Precision Pick", score: 5, maxScore: 60 },
    { sessionId: "s003", date: "2024-06-04", gameType: "Neck", gameName: "Target Gaze", score: 15, maxScore: 50 },
    { sessionId: "s004", date: "2024-06-06", gameType: "Gross Motor", gameName: "Ball Smash", score: 55, maxScore: 100 },
    { sessionId: "s005", date: "2024-06-07", gameType: "Fine Motor", gameName: "Thread the Beads", score: 40, maxScore: 50 },
    { sessionId: "s006", date: "2024-06-08", gameType: "Neck", gameName: "Follow the Dot", score: 25, maxScore: 40 },
    { sessionId: "s007", date: "2024-06-09", gameType: "Gross Motor", gameName: "Wall Punch", score: 60, maxScore: 80 },
    { sessionId: "s008", date: "2024-06-10", gameType: "Fine Motor", gameName: "Tiny Button Tap", score: 68, maxScore: 60 },
    { sessionId: "s009", date: "2024-06-11", gameType: "Neck", gameName: "Balance and Look", score: 68, maxScore: 45 },
    { sessionId: "s010", date: "2024-06-13", gameType: "Gross Motor", gameName: "Jump Squat VR", score: 68, maxScore: 100 },
    { sessionId: "s011", date: "2024-06-14", gameType: "Fine Motor", gameName: "Pinch and Place", score: 75, maxScore: 50 },
    { sessionId: "s012", date: "2024-06-15", gameType: "Neck", gameName: "Head Tilt Puzzle", score: 88, maxScore: 50 },
    { sessionId: "s013", date: "2024-06-16", gameType: "Gross Motor", gameName: "Reach and Touch", score: 100, maxScore: 90 },
    { sessionId: "s014", date: "2024-06-17", gameType: "Fine Motor", gameName: "Nimble Fingers", score: 52, maxScore: 60 },
    { sessionId: "s015", date: "2024-06-18", gameType: "Neck", gameName: "Neck Twist Challenge", score: 40, maxScore: 50 },
];

const enrichSessions = (sessions) =>
    sessions.map((s) => ({
        ...s,
        efficiency: (s.score / s.maxScore) * 100,
    }));

const PatientInsight = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedGameType, setSelectedGameType] = useState("All");

    const sessionEfficiency = enrichSessions(mockSessions);

    const filteredData = sessionEfficiency.filter((s) => {
        const sessionDate = new Date(s.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        const matchDate =
            (!from || sessionDate >= from) && (!to || sessionDate <= to);

        const matchType =
            selectedGameType === "All" || s.gameType === selectedGameType;

        return matchDate && matchType;
    });

    const totalSessions = filteredData.length;

    const averageEfficiency = totalSessions
        ? (filteredData.reduce((sum, s) => sum + s.efficiency, 0) / totalSessions).toFixed(1)
        : 0;

    const gameTypes = Array.from(new Set(mockSessions.map((s) => s.gameType)));

    const avgEfficiencyByType = {};
    filteredData.forEach((s) => {
        if (!avgEfficiencyByType[s.gameType]) {
            avgEfficiencyByType[s.gameType] = { total: 0, count: 0 };
        }
        avgEfficiencyByType[s.gameType].total += s.efficiency;
        avgEfficiencyByType[s.gameType].count += 1;
    });

    const efficiencyBarData = Object.keys(avgEfficiencyByType).map((type) => ({
        gameType: type,
        averageEfficiency: (
            avgEfficiencyByType[type].total / avgEfficiencyByType[type].count
        ).toFixed(1),
    }));

    return (
        <div className="insight-container">
            <h2>Patient Insights</h2>

            <div className="filters">
                <div>
                    <label>From Date: </label>
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div>
                    <label>To Date: </label>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <div>
                    <label>Game Type: </label>
                    <select value={selectedGameType} onChange={(e) => setSelectedGameType(e.target.value)}>
                        <option value="All">All</option>
                        {gameTypes.map((type, i) => (
                            <option key={i} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overview">
                <div className="card">
                    <h4>Total Sessions</h4>
                    <p>{totalSessions}</p>
                </div>
                <div className="card">
                    <h4>Average Efficiency</h4>
                    <p>{averageEfficiency}%</p>
                </div>
            </div>

            <h3>Efficiency Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line
                        type="step"
                        dataKey="efficiency"
                        stroke="#ff0055"
                        strokeWidth={2}
                        dot={{ r: 2 }}
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>

            <h3>Average Efficiency by Game Type</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={efficiencyBarData}>
                    <XAxis dataKey="gameType" />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Legend />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Bar dataKey="averageEfficiency" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PatientInsight;
