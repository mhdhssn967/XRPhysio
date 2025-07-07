import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import './PatientInsight.css';


const PatientInsight = ({sessionRawData,sessionData }) => {
  console.log(sessionRawData);
  
  // Sort input
  const sorted = [...sessionRawData].sort((a, b) => a.timestamp.seconds - b.timestamp.seconds);
const minTimestamp = Math.min(...sessionRawData.map(item => item.timestamp.seconds));
const minDate = new Date(minTimestamp * 1000).toISOString().split('T')[0];
const today = new Date();
const maxDate = today.toISOString().split('T')[0];


  const [fromDate, setFromDate] = useState(minDate);
  const [toDate, setToDate] = useState(maxDate);
console.log(fromDate,toDate);

  

const average = (arr) =>
  Array.isArray(arr) && arr.length
    ? arr.reduce((a, b) => a + b, 0) / arr.length
    : 0;


 const parsedData = sorted.map((item) => {
  const timestampDate = new Date(item.timestamp.seconds * 1000); // convert to JS Date
  const dateStr = timestampDate.toISOString().split('T')[0];     // get YYYY-MM-DD
  

  return {
    ...item,
    date: dateStr,
    efficiency: average(item.targetEfficiency),
    reaction: average(item.reactionTime),
  };
});
console.log(parsedData);


const filteredData = useMemo(() => {
  return parsedData.filter((session) => {
    return session.date >= fromDate && session.date <= toDate;
  });
}, [parsedData, fromDate, toDate]);
console.log(filteredData);


  return (
    <div className="patient-insight-container">
      <h2 style={{ textAlign: 'center' }}>Patient Insight</h2>

      {/* ✅ Date Filters */}
      <div className="date-filters">
        <div className="date-field">
          <label htmlFor="from-date">From:</label>
          <input
            id="from-date"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="date-field">
          <label htmlFor="to-date">To:</label>
          <input
            id="to-date"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <button onClick={()=>{setFromDate(minDate); setToDate(maxDate)}}>Reset</button>
      </div>

      {/* ✅ Line Chart */}
      <h3 style={{ textAlign: 'center' }}>Session Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(v) => `${v}s`}
          />
          <Tooltip
            formatter={(value, name) =>
              name === 'Efficiency'
                ? [`${value.toFixed(1)}%`, 'Efficiency']
                : [`${value.toFixed(2)} s`, 'Reaction Time']
            }
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="efficiency"
            stroke="#527faf"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Efficiency"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="reaction"
            stroke="#39ce90"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Reaction Time"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatientInsight;
