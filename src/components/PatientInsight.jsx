import React, { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import './PatientInsight.css'


const PatientInsight = ({ displaySessionData }) => {
  const parsedData = useMemo(() => {
    return (displaySessionData || []).map((session) => {
      const [month, day, year] = (session.date || '').split('/');

      let fullYear = year;
      if (year && year.length === 2) {
        fullYear = parseInt(year, 10) < 50 ? '20' + year : '19' + year;
      }

      const dateStr =
        fullYear && month && day
          ? `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
          : 'N/A';

      return {
        ...session,
        dateStr,
        efficiency: parseFloat(session.avgEfficiency) || 0,
        reaction: parseFloat(session.avgReaction) || 0,
      };
    });
  }, [displaySessionData]);

  // 🟡 Get min and max dates
  const sorted = [...parsedData].sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr));
  const minDate = sorted[0]?.dateStr || '';
  const maxDate = sorted[sorted.length - 1]?.dateStr || '';

  // 🟡 State for filters
  const [fromDate, setFromDate] = useState(minDate);
  const [toDate, setToDate] = useState(maxDate);

  // 🟡 Filter data
const filteredData = useMemo(() => {
  return parsedData
    .filter((session) => session.dateStr >= fromDate && session.dateStr <= toDate)
    .sort((a, b) => new Date(a.dateStr) - new Date(b.dateStr)); // 👈 sort ascending
}, [parsedData, fromDate, toDate]);


  console.log("Filtered Data:", filteredData);

  return (
    <>
      {/* Date Filter UI */}
      <div className="date-filters">
  <div>
    <label>From:</label>
    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
  </div>
  <div>
    <label>To:</label>
    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
  </div>
</div>


      {/*Chart */}
      <h3 style={{ textAlign: 'center' }}>Session Progress</h3>
<ResponsiveContainer width="100%" height={300}>
  <LineChart
    data={filteredData}
    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
  >
    <XAxis
      dataKey="dateStr"
      angle={-45}
      textAnchor="end"
      
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
    <CartesianGrid strokeDasharray="3 3" />
    <Legend verticalAlign="top" height={36} />
    <Line
      yAxisId="left"
      type="monotone"
      dataKey="efficiency"
      stroke="red"
      strokeWidth={2}
      dot={{ r: 4 }}
      name="Efficiency"
    />
    <Line
      yAxisId="right"
      type="monotone"
      dataKey="reaction"
      stroke="green"
      strokeWidth={2}
      dot={{ r: 4 }}
      name="Reaction Time"
    />
  </LineChart>
</ResponsiveContainer>

    </>
  );
};

export default PatientInsight;
