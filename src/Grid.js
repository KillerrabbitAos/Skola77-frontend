import React from 'react';
import Box from './Box';

const Grid = ({ rows, columns, boxes, setBoxes, names, boxNames, setBoxNames, filledBoxes, setFilledBoxes, cellSize, setCellSize }) => {
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
            outline: '1px solid black',
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
    <div className="grid-outer-container" id='gridPdfSak' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "50px"}}>
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '10px', width: `${columns * cellSize + (columns - 1) * 10}px`, }}>
        {generateGrid()}
        {generateBoxes()}
      </div>
    </div>
  );
};

export default Grid;