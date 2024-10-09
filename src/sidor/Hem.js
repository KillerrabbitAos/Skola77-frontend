//test
import React, { useEffect } from "react";
import { isMobile, isTablet } from "react-device-detect";

const Hem = () => {
  useEffect(() => {
    if (isMobile && !isTablet) {
      alert(
        "Du besöker just nu Skola77 från en mobiltelefon. Observera att sidan inte alls är utformad för den typen av användande. Vi rekommenderar starkt att du testar sidan på dator för en bättre användarupplevelse."
      );
    }
  }, []);

  return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        userSelect: 'none'  // Prevent text selection
    }}>
        <h1>Skola77 2 alfa</h1>
    </div>
    
  );
};

export default Hem;
