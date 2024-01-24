import React, { useState } from 'react';
import Box from './Box';

const Grid = ({ rows, columns, boxes, setBoxes, names, boxNames, setBoxNames, filledBoxes, setFilledBoxes, cellSize, setCellSize }) => {
  const [showBorders, setShowBorders] = useState(true);
  const [editingMode, setEditingMode] = useState(true);

  const toggleBorders = () => {
    setShowBorders(!showBorders);
    setEditingMode(!editingMode);

  };


  const generateGrid = () => {
    const gridItems = [];

    for (let i = 0; i < rows * columns; i++) {
      const box = boxes[i] || { position: `${i + 1}`, name: '' };
      gridItems.push(
        <div
          key={`grid-item-${i}`}
          className="grid-item"
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            outline: showBorders ? '1px solid black' : 'none',
            boxSizing: 'border-box',
          }}
        >
          <Box
            key={`box-${i}`}
            id={`box-${i}`}
            position={box.position}
            boxes={boxes}
            setBoxes={setBoxes}
            name={box.name}
            boxNames={boxNames}
            filledBoxes={filledBoxes}
            setFilledBoxes={setFilledBoxes}
          />
        </div>
      );
    }

    return gridItems;
  };

  return (
    <div className="grid-outer-container" id='gridPdfSak' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "50px"}}>
      <p id='perspektiv'>Tavla</p>
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '10px', width: `${columns * cellSize + (columns - 1) * 10}px`, }}>
        {generateGrid()}
      </div>

      <p id='perspektiv2'>Bak</p>

      
      <button id="klar" onClick={toggleBorders} style={{ marginTop: '10px' }}>{editingMode ? 'Klar' : 'Fortsätt redigera'}</button>
    </div>
  );
};

export default Grid;
