import React from 'react';
import frontView from '../assets/1.png';
import topView from '../assets/2.png';
import sideView from '../assets/3.png';

const SIZE = 300;
const SCALE = 100; // 1 meter = 100px

const ProjectionView = ({
  title,
  plane,
  points = [],
  hoveredIndex,
  setHoveredIndex,
  setTooltip,
}) => {
  const getCoordinates = (point) => {
    const [xVal, yVal, zVal] = point.position || [0, 0, 0];
    let x = 0,
      y = 0;

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
          ? SIZE * 0.6 + x * SCALE
          : SIZE / 2 + x * SCALE,
      y:
        plane === 'top'
          ? SIZE * 1 - y * SCALE
          : plane === 'side'
          ? SIZE - y * 1.75 * SCALE+100
          : SIZE - y * 1.75 * SCALE+100,
      efficiency: parseFloat(point.efficiency || '0').toFixed(1),
    };
  };

  const getBackgroundImage = () => {
    if (plane === 'front') return frontView;
    if (plane === 'top') return topView;
    if (plane === 'side') return sideView;
    return null;
  };

  return (
    <div
      style={{
        margin: '10px 60px',
        flex: '1 1 320px',
        maxWidth: '500px',
        position: 'relative',
        height: '700px', // Adjust height as needed
        border:'solid 1px gray'
      }}
    >
      <h4 style={{ textAlign: 'center', marginBottom: '8px' }}>{title}</h4>

      {/* Background image as a separate element */}
      <img
        src={getBackgroundImage()}
        
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '50%',
          width: '100%',
          objectFit: 'contain',
          zIndex: 0,
          opacity: 0.3,
          filter:'invert(1)',
          marginTop:'280px',
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <line
          x1={0}
          y1={plane === 'top' ? SIZE / 2 : SIZE+50}
          x2={SIZE}
          y2={plane === 'top' ? SIZE / 2 : SIZE+50}
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

        {[...Array(6)].map((_, i) => {
          const offset = (i - 4) * SCALE;
          return (
            <g key={i}>
              <line
                x1={SIZE / 2 + offset}
                y1={SIZE + 5}
                x2={SIZE / 2 + offset}
                y2={SIZE +5}
                stroke="#999"
              />
              <text
                x={SIZE / 2 + offset}
                y={SIZE +65}
                fontSize="10"
                textAnchor="middle"
                fill="#666"
              >
                {i -3}
              </text>

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
                {i -2}
              </text>
            </g>
          );
        })}

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
              <line x1={x} y1={plane === 'top' ? SIZE / 2 : SIZE} x2={x} y2={y} stroke="rgb(224, 89, 27)" />
              <line x1={SIZE / 2} y1={y} x2={x} y2={y} stroke="rgb(224, 89, 27)" />
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 8 : 4}
                fill={getEfficiencyColor(efficiency)}
                stroke={isHovered ? '#000' : 'none'}
                strokeWidth="1"
                style={{ transition: 'r 0.2s ease-in-out, stroke 0.2s ease-in-out', cursor: 'pointer' }}
              />
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
  const clampedEff = Math.max(0, Math.min(eff, 100));
  const hue = (clampedEff / 100) * 120;
  return `hsl(${hue}, 85%, 45%)`;
};

export default ProjectionView;
