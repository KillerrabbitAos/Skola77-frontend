import React from 'react';

const Box = ({ id, position, boxes, setBoxes, name }) => {
  const handleDragStart = (e) => {
    // Implementera hanteringen för dragstart-händelsen för att flytta lådor
  };

  const handleDragOver = (e) => {
    // Implementera hanteringen för dragover-händelsen för att tillåta släpp på lådor
  };

  const handleDrop = (e) => {
    // Implementera hanteringen för drop-händelsen för att placera lådor på nya positioner
  };

  return (
    <div
      className="box"
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ gridArea: position }}
    >
      {name}
    </div>
  );
};

export default Box;
