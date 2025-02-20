import React, { useState, useEffect, useRef } from "react";

const Footer = ({ isFixed = false }) => {
  const [showFlamingo, setShowFlamingo] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const flamingoRef = useRef(null);
  const animationFrameRef = useRef(null);

  const updateMousePosition = (e) => {
    setMousePosition({
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = requestAnimationFrame(() => updateMousePosition(e));
    };

    if (showFlamingo) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [showFlamingo]);

  const handleFlamingoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 10) {
      setShowFlamingo(true);
    } else {
      setShowFlamingo(false);
    }
  };

  return (
    <>
      <footer
        className={`w-full bg-gray-200 text-gray-600 text-center py-1 mt-10 shadow-inner ${
          isFixed ? "fixed bottom-0 left-0" : ""
        }`}
        style={isFixed ? { zIndex: 10 } : {}}
      >
        <p>
          <b>Skola77 2</b>{" "}
          <u
            className="no-underline"
            onClick={handleFlamingoClick}
          >
            Flamingo
          </u>

        </p>
      </footer>

      {showFlamingo && (
        <img
          ref={flamingoRef}
          src="https://helenelund.org/eggus.jpeg"
          alt="Flamingo"
          style={{
            position: "absolute",
            top: mousePosition.y - 50,
            left: mousePosition.x - 50,
            width: "100px",
            height: "100px",
            pointerEvents: "none",
            zIndex: 1000,
            transition: "top 0.1s, left 0.1s",
          }}
        />
      )}
    </>
  );
};

export default Footer;
