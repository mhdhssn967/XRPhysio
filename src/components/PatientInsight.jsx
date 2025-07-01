import React, { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  Legend,
} from "recharts";
import './PatientInsight.css';
const PatientInsight = ({ displaySessionData = [] }) => {
  const sortedSessions = useMemo(() => {
    return [...displaySessionData]
      .map((s) => ({
        ...s,
        dateStr: s.date || 'N/A',
        efficiency: parseFloat(s.avgEfficiency) || 0,
        reaction: parseFloat(s.avgReaction) || 0,
      }))
      .sort((a, b) => a.dateStr.localeCompare(b.dateStr));
  }, [displaySessionData]);

  const minDate = sortedSessions[0]?.dateStr || '';
  const maxDate = sortedSessions[sortedSessions.length - 1]?.dateStr || '';

  const [fromDate, setFromDate] = useState(minDate);
  const [toDate, setToDate] = useState(maxDate);

  const filteredData = useMemo(() => {
    return sortedSessions.filter((s) => {
      return s.dateStr >= fromDate && s.dateStr <= toDate;
    });
  }, [sortedSessions, fromDate, toDate]);

  const totalSessions = filteredData.length;
  const averageEfficiency = totalSessions
    ? (filteredData.reduce((sum, s) => sum + s.efficiency, 0) / totalSessions).toFixed(1)
    : 0;

  return (
    <div className="insight-container">
      {/* Filters */}
      <div className="filters">
        <div>
          <label>From Date: </label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div>
          <label>To Date: </label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="overview">
        <div className="card">
          <h4>Total Sessions:</h4>
          <p>{totalSessions}</p>
        </div>
        <div className="card">
          <h4>Average Efficiency:</h4>
          <p>{averageEfficiency}%</p>
        </div>
      </div>

      {/* Combined Line Chart */}
      <h3 style={{ margin: '2%', textAlign: 'center' }}>Session Progress</h3>
      <ResponsiveContainer width="100%" height={300}>
  <LineChart data={filteredData}>
    <XAxis dataKey="dateStr" />
    <YAxis yAxisId="left" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
    <YAxis yAxisId="right" orientation="right" />
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
      dot={{ r: 5 }}
      name="Efficiency"
    />
    <Line
      yAxisId="right"
      type="monotone"
      dataKey="reaction"
      stroke="green"
      strokeWidth={2}
      dot={{ r: 5 }}
      name="Reaction Time"
    />
  </LineChart>
</ResponsiveContainer>

    </div>
  );
};

export default PatientInsight;
