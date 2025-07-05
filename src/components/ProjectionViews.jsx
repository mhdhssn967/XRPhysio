import React, { useState } from 'react';
import ProjectionView from './ProjectionView';

const AllProjections = ({ enhancedPoints }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, data: null });


  return (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
    <ProjectionView
      title="Top View"
      plane="top"
      points={enhancedPoints}
      hoveredIndex={hoveredIndex}
      setHoveredIndex={setHoveredIndex}
      setTooltip={setTooltip}
    />
    <ProjectionView
      title="Front View"
      plane="front"
      points={enhancedPoints}
      hoveredIndex={hoveredIndex}
      setHoveredIndex={setHoveredIndex}
      setTooltip={setTooltip}
    />
    <ProjectionView
      title="Side View"
      plane="side"
      points={enhancedPoints}
      hoveredIndex={hoveredIndex}
      setHoveredIndex={setHoveredIndex}
      setTooltip={setTooltip}
    />

    {/* 👇 Tooltip Component Goes Here */}
    {tooltip.visible && tooltip.data && (
      <div
        style={{
          position: 'fixed',
          top: tooltip.y + 10,
          left: tooltip.x + 10,
          background: 'rgba(255, 255, 255, 0.8)',
          color: '#fff',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '12px',
          pointerEvents: 'none',
          zIndex: 1000,
          boxShadow:'0px 0px 8px rgba(0,0,0,0.5)',transform:'scale(1.2)'
        }}
      >
        <div>Efficiency:<strong>{tooltip.data.efficiency}%</strong></div>
        <div>X: {tooltip.data.x} m</div>
        <div>Y: {tooltip.data.y} m</div>
        <div>Z: {tooltip.data.z} m</div>
      </div>
    )}
  </div>
);

};

export default AllProjections;