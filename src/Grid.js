import React, { useState } from 'react';
import Box from './Box';

const Grid = ({ rows, columns, boxes, setBoxes, keyChange, setKeyChange, names, boxNames, setBoxNames, filledBoxes, setFilledBoxes, cellSize, setCellSize, baklänges, nere, uppe }) => {
  const [showBorders, setShowBorders] = useState(true);
  const [editingMode, setEditingMode] = useState(true);

  const toggleBorders = () => {
    setShowBorders(!showBorders);
    setEditingMode(!editingMode);

  };
  const handleDrop = (e) => {
    e.preventDefault();
  
    let target = e.target;
    // Traverse up to find an element with an ID that matches your expected pattern
    while (target && !target.id.startsWith('box-') && target !== e.currentTarget) {
      target = target.parentNode;
    }
  
    if (!target || target === e.currentTarget) {
      console.log('Dropped on an invalid target');
      return; // Early return if we don't find a valid target
    }
  
    const draggedBoxId = e.dataTransfer.getData('boxId'); // Get the dragged box id
    const targetId = target.id; // Now we're sure this is the correct target ID
  
    console.log(`Box ${draggedBoxId} dropped on ${targetId}`);
    setKeyChange(
      {
        "key": draggedBoxId,
        "value": targetId
      }
    )
    // Update state based on the drop, similar to the previous explanation
  };
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };
  const generateGrid = () => {
    const gridItems = [];
    var x = baklänges;
    const startIndex = x ? (rows * columns) - 1 : 0;
  const endIndex = x ? -1 : rows * columns;
  const step = x ? -1 : 1;

  for (let i = startIndex; i !== endIndex; i += step) {
    const box = boxes[i] || { position: `${i + 1}`, name: '' };
    var toBeKey = "kebab"
    if (("box-" + i) != 'box-0'){
      toBeKey = (`box-${i}`);
    }
      gridItems.push(
        //if (findValueByKey(keyChange, id)){
          //var orm = findValueByKey(keyChange, id)
        //}
        
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
            key={toBeKey}
            id={toBeKey}
            position={box.position}
            boxes={boxes}
            setBoxes={setBoxes}
            name={box.name}
            boxNames={boxNames}
            filledBoxes={filledBoxes}
            setFilledBoxes={setFilledBoxes}
            names={names}
            keyChange={keyChange}
          />
        </div>
      );
    }

    return gridItems;
  };

  return (
    <div className="grid-outer-container" onDragOver={handleDragOver} onDrop={handleDrop} id='gridPdfSak' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "0px"}}>
      <p id='uppe'>{uppe}</p>
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '10px', width: `${columns * cellSize + (columns - 1) * 10}px`, }}>
        {generateGrid()}
      </div>

      <p id='nere'>{nere}</p>

      
      <button id="klar" onClick={toggleBorders} style={{ marginTop: '10px' }}>{editingMode ? 'Klar' : 'Fortsätt redigera'}</button>
    </div>
  );
};

export default Grid;
