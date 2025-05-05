import React from "react";
import "./ProjectionViews.css";

// You can replace these URLs with your actual image paths.
const planeBackgrounds = {
  XY: "images/xy.png",
  YZ: "images/yz.png",
  XZ: "images/xz.png",
};

  
  const ProjectionViews = ({ enhancedPoints }) => {
    const scale = 30; // 30px per meter
    const center = 200; // Centering the grid on the screen
  
    // Function to get 2D coordinates based on the plane (XY, YZ, or XZ)
    const get2DCoords = (plane, position) => {
      const [x, y, z] = position;
      switch (plane) {
        case "XY":
          return { x: x * scale + center, y: -y * scale + center };
        case "YZ":
          return { x: y * scale + center, y: -z * scale + center };
        case "XZ":
          return { x: x * scale + center, y: -z * scale + center };
        default:
          return { x: center, y: center };
      }
    };
  
    // Function to generate grid lines
    const renderGridLines = () => {
      const gridLines = [];
      const numLines = 20; // Adjust the number of grid lines
      const gridSize = 300; // The size of the grid in pixels
  
      for (let i = 0; i <= numLines; i++) {
        const linePosition = (i * gridSize) / numLines;
  
        // Vertical lines (in X direction)
        gridLines.push(
          <div
            key={`v-${i}`}
            className="grid-line vertical"
            style={{ left: `${linePosition}px` }}
          />
        );
        // Horizontal lines (in Y direction)
        gridLines.push(
          <div
            key={`h-${i}`}
            className="grid-line horizontal"
            style={{ top: `${linePosition}px` }}
          />
        );
      }
      return gridLines;
    };
  
    const projections = ["XY", "YZ", "XZ"];
  
    return (
      <div className="projections-wrapper">
        {projections.map((plane) => (
          <div className="projection" key={plane}>
            <h4>{plane} View</h4>
            <div
              className="view-box"
              style={{
                backgroundImage: `url(${planeBackgrounds[plane]})`,
                backgroundSize: "cover", // Optional: Adjust image size if necessary
                backgroundPosition: "center",
              }}
            >
              {/* Grid lines */}
              {renderGridLines()}
  
              {/* Loop over enhanced points */}
              {enhancedPoints.map((point, index) => {
                const coords = get2DCoords(plane, point.position);
                return (
                  <div
                    key={index}
                    className="dot"
                    style={{
                      left: `${coords.x}px`,
                      top: `${coords.y}px`,
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor:
                        point.efficiency >= 80
                          ? "green"
                          : point.efficiency >= 50
                          ? "orange"
                          : "red",
                      position: "absolute", // Important for correct placement
                      zIndex: 2, // To ensure dots are on top of the background
                    }}
                    title={`${point.name} - Efficiency: ${point.efficiency.toFixed(1)}%`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ProjectionViews;