import React from 'react';
import frontView from '../assets/1.png';
import topView from '../assets/2.png';
import sideView from '../assets/3.png';


const SIZE = 300;
const SCALE = 100; // 1 meter = 100px

const ProjectionView = ({  title,
  plane,
  points = [],
  hoveredIndex,
  setHoveredIndex,
  setTooltip }) => {
  const getCoordinates = (point) => {
    const [xVal, yVal, zVal] = point.position || [0, 0, 0];
    let x = 0, y = 0;

    if (plane === 'top') {
      x = xVal;
      y = zVal;
    } else if (plane === 'front') {
      x = xVal;
      y = yVal;
    } else if (plane === 'side') {
      x = zVal;
      y = yVal;
    }

    return {
  x:
    plane === 'side'
      ? SIZE * 0.75 + x * SCALE
      : SIZE / 2 + x * SCALE,
  y:
    plane === 'top'
      ? SIZE * 0.90 - y * SCALE
      : plane === 'side'
      ? SIZE - y*1.75 * SCALE
      : SIZE - y*1.75 * SCALE,
  efficiency: parseFloat(point.efficiency || '0').toFixed(1),
};

  };

  const getBackgroundImage = () => {
  if (plane === 'front') return `url(${frontView})`;
  if (plane === 'top') return `url(${topView})`;
  if (plane === 'side') return `url(${sideView})`;
  return 'none';
};


  return (
    
    <div
      style={{
        margin: '10px',
        flex: '1 1 320px',
        maxWidth: '400px',
      }}
    >
      <h4 style={{ textAlign: 'center', marginBottom: '8px' }}>{title}</h4>
      <svg
  width="100%"
  height={SIZE}
  viewBox={`0 0 ${SIZE} ${SIZE}`}
  style={{
    border: '1px solid #ccc',
    backgroundImage: getBackgroundImage(),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  }}
>
        {/* Axes */}
        <line
          x1={0}
          y1={plane === 'top' ? SIZE / 2 : SIZE}
          x2={SIZE}
          y2={plane === 'top' ? SIZE / 2 : SIZE}
          stroke="#aaa"
          strokeDasharray="4"
        />
        <line
          x1={SIZE / 2}
          y1={0}
          x2={SIZE / 2}
          y2={SIZE}
          stroke="#aaa"
          strokeDasharray="4"
        />

        {/* Axis scale markers */}
        {[...Array(6)].map((_, i) => {
          const offset = (i - 3) * SCALE;
          return (
            <g key={i}>
              {/* X-axis scale */}
              <line
                x1={SIZE / 2 + offset}
                y1={SIZE - 5}
                x2={SIZE / 2 + offset}
                y2={SIZE}
                stroke="#999"
              />
              <text
                x={SIZE / 2 + offset}
                y={SIZE - 10}
                fontSize="10"
                textAnchor="middle"
                fill="#666"
              >
                {i - 3}m
              </text>

              {/* Y-axis scale */}
              <line
                x1={5}
                y1={SIZE / 2 - offset}
                x2={0}
                y2={SIZE / 2 - offset}
                stroke="#999"
              />
              <text
                x={10}
                y={SIZE / 2 - offset + 3}
                fontSize="10"
                textAnchor="start"
                fill="#666"
              >
                {i - 3}m
              </text>
            </g>
          );
        })}

        {/* Points */}
        {points.map((point, idx) => {
  const { x, y, efficiency } = getCoordinates(point);
  const isHovered = hoveredIndex === idx;

  return (
    <g
  key={idx}
  onMouseEnter={(e) => {
    setHoveredIndex(idx);
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      data: {
        efficiency: point.efficiency,
        x: point.position?.[0]?.toFixed(2),
        y: point.position?.[1]?.toFixed(2),
        z: point.position?.[2]?.toFixed(2),
      },
    });
  }}
  onMouseMove={(e) => {
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX,
      y: e.clientY,
    }));
  }}
  onMouseLeave={() => {
    setHoveredIndex(null);
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  }}
>
      {/* Projection lines */}
      <line x1={x} y1={plane === 'top' ? SIZE / 2 : SIZE} x2={x} y2={y} stroke="rgb(224, 89, 27)" />
      <line x1={SIZE / 2} y1={y} x2={x} y2={y} stroke="rgb(224, 89, 27)" />

      {/* Dot */}
      <circle
        cx={x}
        cy={y}
        r={isHovered ? 8 : 4} // 👈 Bigger when hovered
        fill={getEfficiencyColor(efficiency)}
        stroke={isHovered ? '#000' : 'none'}
        strokeWidth="1"
        style={{ transition: 'r 0.2s ease-in-out, stroke 0.2s ease-in-out' ,cursor:'pointer'}}
      />

      {/* Label */}
      <text
        x={x}
        y={y - 8}
        fontSize="11"
        textAnchor="middle"
        fontWeight="bold"
        fill="#333"
        cursor="pointer"
      >
        {efficiency}%
      </text>
    </g>
  );
})}


        {/* Scale bar */}
        <line
          x1={SIZE - 110}
          y1={SIZE - 10}
          x2={SIZE - 10}
          y2={SIZE - 10}
          stroke="#333"
          strokeWidth={2}
        />
        <text
          x={SIZE - 60}
          y={SIZE - 15}
          textAnchor="middle"
          fontSize="10"
          fill="#333"
        >
          1 meter
        </text>
      </svg>
    </div>
  );
};

const getEfficiencyColor = (effStr) => {
  const eff = parseFloat(effStr);

  // Clamp between 0 and 100
  const clampedEff = Math.max(0, Math.min(eff, 100));

  // Map efficiency (0–100) to hue (0–120), where:
  // 0 = red, 60 = yellow, 120 = green
  const hue = (clampedEff / 100) * 120;

  // Return as HSL string for smooth gradient transition
  return `hsl(${hue}, 85%, 45%)`;
};


export default ProjectionView;
