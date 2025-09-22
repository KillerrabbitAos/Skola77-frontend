import React from "react";

const Overlay = ({ children, style }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 500,
        ...style, 
      }}
    >
      {children}
    </div>
  );
};

export default Overlay;
