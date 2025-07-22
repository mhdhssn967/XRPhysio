import React, { useState, useMemo, useEffect, useRef } from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,Bar
} from 'recharts';

import './PatientInsight.css';
import { Button, Stack } from '@mui/material';
import { analyzeGameData } from '../firebase/processData';
import SessionStats from './SessionStats';

const PatientInsight = ({focus,sessionRawData,onStatsImageReady }) => {

  const statsRef = useRef(null);

  useEffect(() => {
    if (statsRef.current) {
      import('html2canvas').then(({ default: html2canvas }) => {
        html2canvas(statsRef.current).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          if (onStatsImageReady) onStatsImageReady(imgData); // 👈 send to parent
        });
      });
    }
  }, [sessionRawData]);

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
const [processedPhysioData,setProcessedPhysioData]=useState({})


  

const average = (arr) =>
  Array.isArray(arr) && arr.length
    ? arr.reduce((a, b) => a + b, 0) / arr.length
    : 0;


const parsedData = useMemo(() => {
  return sorted.map((item) => {
    const timestampDate = new Date(item.timestamp.seconds * 1000);
    const dateStr = timestampDate.toISOString().split('T')[0];
    return {
      ...item,
      date: dateStr,
      gameName: item.gameName,
      efficiency: average(item.targetEfficiency),
      reaction: average(item.reactionTime),
    };
  });
}, []);





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

useEffect(() => {
  if (uniqueFocuses.length && !activeFocus) {
    setActiveFocus(uniqueFocuses[0]);
  }
}, [uniqueFocuses]);



  const handleClick = (focus) => {
    if (focus !== activeFocus) {
  setActiveFocus(focus);
  // onFilter(focus);
}
  };

  useEffect(()=>{
      const processedPhysioDataRef=analyzeGameData(filteredData)
      setProcessedPhysioData(processedPhysioDataRef)
    },[filteredData])


  return (
    <div className="patient-insight-container">
      <div ref={statsRef}><SessionStats processedPhysioData={processedPhysioData} /></div>

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
      <div className='focus-points'>
        <Stack direction="row" flexWrap="nowrap" spacing={1}>
        {uniqueFocuses.map((focus, index) => (
          <Button
  key={index}
  variant={activeFocus === focus ? "contained" : "outlined"}
  size="small"
  onClick={() => handleClick(focus)}
  sx={{fontSize:'10px',
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

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={parsedData}
    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
    barGap={8}
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
        name === "Efficiency"
          ? [`${value.toFixed(1)}%`, "Efficiency"]
          : [`${value.toFixed(2)} s`, "Reaction Time"]
      }
    />
    <Legend verticalAlign="top" height={36} />
    <Bar
      yAxisId="left"
      dataKey="efficiency"
      fill="#527faf"
      name="Efficiency"
      barSize={16}
    />
    <Bar
      yAxisId="right"
      dataKey="reaction"
      fill="#39ce90"
      name="Reaction Time"
      barSize={16}
    />
  </BarChart>
</ResponsiveContainer>

    </div>
  );
};

export default PatientInsight;
