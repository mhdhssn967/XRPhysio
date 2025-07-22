import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis
} from 'recharts';
import './VisualChart.css'

const SCALE = 100; // 1 meter = 100px

const VisualChart = ({ enhancedPoints = [] }) => {
  // Prepare data
  const barData = enhancedPoints.map((point, idx) => ({
    name: `P${idx + 1}`,
    touchCount: point.touchCount,
  }));

  const scatterDataXY = enhancedPoints.map(p => ({
    x: p.position[0],
    y: p.position[1],
    efficiency: parseFloat(p.efficiency),
  }));

  const scatterDataXZ = enhancedPoints.map(p => ({
    x: p.position[0],
    y: p.position[2],
    efficiency: parseFloat(p.efficiency),
  }));

  const scatterDataYZ = enhancedPoints.map(p => ({
    x: p.position[1],
    y: p.position[2],
    efficiency: parseFloat(p.efficiency),
  }));

  // Physiotherapy-relevant Metrics
  const metrics = useMemo(() => {
    const totalTouch = enhancedPoints.reduce((sum, p) => sum + p.touchCount, 0);
    const totalSpawn = enhancedPoints.reduce((sum, p) => sum + p.totalSpawns, 0);
    const avgEff = totalSpawn > 0 ? (totalTouch / totalSpawn) * 100 : 0;

    const symmetryScore = (() => {
      const left = enhancedPoints.filter(p => p.position[0] < 0).reduce((sum, p) => sum + p.touchCount, 0);
      const right = enhancedPoints.filter(p => p.position[0] >= 0).reduce((sum, p) => sum + p.touchCount, 0);
      return (Math.min(left, right) / Math.max(left, right)) * 100 || 0;
    })();

    const reachVariance = (() => {
      const origin = [0, 0, 0];
      const distances = enhancedPoints.map(p => {
        const [x, y, z] = p.position;
        return Math.sqrt((x ** 2 + y ** 2 + z ** 2));
      });
      const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
      const variance = distances.reduce((sum, d) => sum + (d - avg) ** 2, 0) / distances.length;
      return variance.toFixed(2);
    })();

    return {
      avgEff: avgEff.toFixed(1),
      totalTouch,
      totalSpawn,
      symmetryScore: symmetryScore.toFixed(1),
      reachVariance,
    };
  }, [enhancedPoints]);

  return (
    <div style={{ width: '100%', marginTop: '2%' }}>
      <h3>Touch Count Per Point</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Touches', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="touchCount" fill="#00bcd4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '30px', gap: '30px' }}>
        <Projection title="XY Plane" data={scatterDataXY} />
        <Projection title="XZ Plane" data={scatterDataXZ} />
        <Projection title="YZ Plane" data={scatterDataYZ} />
      </div>
<h3 style={{margin:'30px 10px 5px'}}>Physiotherapy Session Summary</h3>
      <div className='visual-summary'>
        
        <p><strong>Average Efficiency:</strong> {metrics.avgEff}%</p>
        <p><strong>Total Touches:</strong> {metrics.totalTouch}</p>
        <p><strong>Total Targets Spawned:</strong> {metrics.totalSpawn}</p>
        {/* <p><strong>Symmetry Score (Left vs Right):</strong> {metrics.symmetryScore}%</p> */}
        <p><strong>Reach Variance:</strong> {metrics.reachVariance}</p>
      </div>
    </div>
  );
};

// Simple scatter projection for 2D plane
const Projection = ({ title, data }) => {
  return (
    <div style={{ flex: '1 1 300px', minWidth: '300px', height: 300 }}>
      <h4 style={{ textAlign: 'center' }}>{title}</h4>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, bottom: 10 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <ZAxis type="number" dataKey="efficiency" range={[100, 300]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Points" data={data} fill="#1976d2" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VisualChart;
