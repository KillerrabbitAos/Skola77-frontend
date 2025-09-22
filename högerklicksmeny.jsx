import React, { useState, useEffect } from "react";

const MousePositionDiv = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
      <div
        style={{
          position: "absolute",
          left: mousePosition.x + "px",
          top: mousePosition.y + "px",
          width: "20px",
          height: "20px",
          backgroundColor: "red",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      ></div>
  );
};

export default MousePositionDiv;
