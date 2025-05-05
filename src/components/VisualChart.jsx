import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const touchData = [
    { name: "Point 1", touchCount: 3 },
    { name: "Point 2", touchCount: 1 },
    { name: "Point 3", touchCount: 4 },
    { name: "Point 4", touchCount: 2 },
    { name: "Point 5", touchCount: 5 },
    { name: "Point 6", touchCount: 0 },
    { name: "Point 7", touchCount: 2 },
    { name: "Point 8", touchCount: 1 },
    { name: "Point 9", touchCount: 3 },
    { name: "Point 10", touchCount: 4 },
];
const points = [
    { name: "Point 1", position: [2, 0, 2] },
    { name: "Point 2", position: [-2, 0, 2] },
    { name: "Point 3", position: [2, 0, -2] },
    { name: "Point 4", position: [-2, 0, -2] },
    { name: "Point 5", position: [0, 0, 3] },
    { name: "Point 6", position: [0, 0, -3] },
    { name: "Point 7", position: [3, 0, 0] },
    { name: "Point 8", position: [-3, 0, 0] },
    { name: "Point 9", position: [0, 3, 2] },
    { name: "Point 10", position: [0, 2, 0] },
  ];

  const xyPoints = points.map(p => ({ x: p.position[0], y: p.position[1] }));
  const xzPoints = points.map(p => ({ x: p.position[0], z: p.position[1] }));
  const yzPoints = points.map(p => ({ y: p.position[0], z: p.position[1] }));




const VisualChart = () => {
    return (
        <div style={{ width: '100%', marginTop: '3%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={touchData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Touches', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Bar dataKey="touchCount" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
            <div className='performance-matrix'>
        <p><strong>Motor Efficiency:</strong> 70%</p>
        <p><strong>Session Completion:</strong> 100%</p>
        <p><strong>Symmetry Index:</strong> 85%</p>
        <p><strong>Upper Body Reach:</strong> 60%</p>
        <p><strong>Lower Body Reach:</strong> 80%</p>
        <p><strong>Left/Right Balance:</strong> 90%</p>
     </div>
        </div>
    )
}

export default VisualChart
