import React from 'react';
import Box from './Box';

const Grid = ({ rows, columns, boxes, setBoxes, names }) => {
  const generateGrid = () => {
    const gridItems = [];
    const cellSize = 50; // Ange önskad storlek för varje ruta

    for (let i = 0; i < rows * columns; i++) {
      gridItems.push(
        <div
          key={`grid-item-${i}`}
          className="grid-item"
          style={{
            width: `${cellSize}px`, // Bredden för varje ruta
            height: `${cellSize}px`, // Höjden för varje ruta (samma som bredden för att göra dem kvadrater)
            outline: '1px solid black', // Outline runt varje ruta
            boxSizing: 'border-box', // Så att outline inkluderas i cellens storlek
          }}
        />
      );
    }

    return gridItems;
  };

  const generateBoxes = () => {
    return boxes.map((box, index) => (
      <Box
        key={`box-${index}`}
        id={`box-${index}`}
        position={box.position}
        boxes={boxes}
        setBoxes={setBoxes}
        name={box.name}
      />
    ));
  };

  return (
    <div className="grid-outer-container" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '5px', width: `${columns * 50 + (columns - 1) * 5}px`, }}>
        {generateGrid()}
        {generateBoxes()}
      </div>
    </div>
  );
};

export default Grid;
