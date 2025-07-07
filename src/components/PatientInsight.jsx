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
import { Button, Stack } from '@mui/material';

const PatientInsight = ({focus,sessionRawData }) => {

  const [activeFocus, setActiveFocus] = useState("");
const sorted = [...(sessionRawData || [])].sort(
  (a, b) => a.timestamp?.seconds - b.timestamp?.seconds
);

// 🛡️ Check if data exists before calculating minDate
const minTimestamp = sessionRawData?.length
  ? Math.min(...sessionRawData.map(item => item.timestamp?.seconds || Infinity))
  : null;

const minDate = minTimestamp && isFinite(minTimestamp)
  ? new Date(minTimestamp * 1000).toISOString().split('T')[0]
  : ""; // fallback empty or some default like "2023-01-01"

const today = new Date();
const maxDate = today.toISOString().split('T')[0];

// 🛡️ Use sensible default/fallback
const [fromDate, setFromDate] = useState(minDate || maxDate);
const [toDate, setToDate] = useState(maxDate);



  

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
    gameName:item.gameName,
    efficiency: average(item.targetEfficiency),
    reaction: average(item.reactionTime),
  };
});



const filteredData = useMemo(() => {
  return parsedData.filter((session) => {
    const isWithinDateRange =
      session.date >= fromDate && session.date <= toDate;

    const matchesFocus = activeFocus
      ? session.gameName.startsWith(activeFocus)
      : true;

    return isWithinDateRange && matchesFocus;
  });
}, [parsedData, fromDate, toDate, activeFocus]);



  const uniqueFocuses = Array.from(new Set(focus.map((g) => g.focus)));

  const handleClick = (focus) => {
    const newValue = focus === activeFocus ? "" : focus;
    setActiveFocus(newValue);
    onFilter(newValue); // return the selected focus value
  };


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
        <button onClick={()=>{setFromDate(minDate); setToDate(maxDate); setActiveFocus("")}}>Reset</button>
      </div>
      <div className='focus-points'>
        <Stack direction="row" flexWrap="wrap" spacing={1}>
        {uniqueFocuses.map((focus, index) => (
          <Button
  key={index}
  variant={activeFocus === focus ? "contained" : "outlined"}
  size="small"
  onClick={() => handleClick(focus)}
  sx={{
    bgcolor: activeFocus === focus ? "var(--primary-color)" : "var(--background-color)",
    color: activeFocus === focus ? "#fff" : "var(--primary-color)",
    border: "1px solid var(--primary-color)",
    "&:hover": {
      bgcolor: activeFocus === focus ? "var(--primary-color)" : "#f0f0f0",
    },
  }}
>
  {focus}
</Button>

        ))}
      </Stack>
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
