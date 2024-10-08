import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { RiDeleteBin6Line } from "react-icons/ri";
import './Grid.css'; // Import the CSS file
const names = ["", "bing", "hej", "kebab", "hoho"];
// Function to create an initial grid with empty cells
const värden = JSON.parse('{"grid":[[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395558391","person":1},{"id":"item-1728395558639","person":1}],[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395560144","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395557488","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":"item-1728395563304","person":1},{"id":"item-1728395562912","person":1},{"id":"item-1728395557831","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395562504","person":1},{"id":"item-1728395559832","person":1}],[{"id":null,"person":0},{"id":"item-1728395561288","person":1},{"id":"item-1728395560888","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}]],"cols":7,"rows":6}')
const initialGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ id: null, person: 0 }))
  );
};

// Main Grid Component
const Grid3 = () => {
    console.log("Grid3 component rendered"); // Add this line
  const [rows, setRows] = useState(värden.rows);
  const [cols, setCols] = useState(värden.cols);
  const [grid, setGrid] = useState(värden.grid);
  

  const sensors = useSensors(
    useSensor(MouseSensor), // Mouse for desktop
    useSensor(TouchSensor)  // Touch for mobile/tablet
  );

  // Increase the number of rows in the grid
  const increaseRows = () => {
    setGrid([...grid, Array(cols).fill({ id: null, person: 0 })]);
    setRows(rows + 1);
  };

  // Increase the number of columns in the grid
  const increaseCols = () => {
    setGrid(grid.map(row => [...row, { id: null, person: 0 }]));
    setCols(cols + 1);
  };

  // Handle drag-and-drop event
  const handleDrop = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return; // Return if no valid drop

    const [activeRow, activeCol] = active.id.split('-').map(Number);
    const [overRow, overCol] = over.id.split('-').map(Number);

    const newGrid = grid.map(row => row.map(cell => ({ ...cell }))); // Deep copy

    // Swap active and over items in the grid
    [newGrid[activeRow][activeCol], newGrid[overRow][overCol]] = [
      newGrid[overRow][overCol],
      newGrid[activeRow][activeCol]
    ];

    setGrid(newGrid); // Update grid with swapped cells
  };
  const spara = () => {
    console.log(JSON.stringify({grid: grid, cols: cols, rows: rows}))
  }
  return (
    <div>
      <button onClick={increaseRows}>Increase Rows</button>
      <button onClick={increaseCols}>Increase Columns</button>
      <button onClick={spara}>spara</button>
      <DndContext sensors={sensors} onDragEnd={handleDrop}>
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 100px)`,
            gridTemplateRows: `repeat(${rows}, 100px)`,
          }}
        >
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                cell={cell}
                grid={grid}
                setGrid={setGrid}
              />
            ))
          )}
        </div>
      </DndContext>
    </div>
  );
};

// GridCell component represents each cell in the grid
const GridCell = ({ rowIndex, colIndex, cell, grid, setGrid }) => {
  const { setNodeRef } = useDroppable({
    id: `${rowIndex}-${colIndex}`,  // Unique ID for each cell
  });

  // Handle clicking on an empty cell to add a draggable item
  const handleCellClick = () => {
    if (!cell.id) {
      const newGrid = grid.map(row => row.map(c => ({ ...c })));
      // Set a default person value (e.g., 1) for the new item
      newGrid[rowIndex][colIndex] = { id: `item-${Date.now()}`, person: 1 }; // Default person value set to 1
      setGrid(newGrid);
    }
  };

  // Function to remove an item
  const removeItem = () => {
    console.log('Remove Item called'); // Log to check if function is called
    const newGrid = grid.map(row => row.map(c => ({ ...c }))); // Deep copy
    newGrid[rowIndex][colIndex] = { id: null, person: 0 }; // Reset cell to empty state
    setGrid(newGrid); // Update grid
  };

  return (
    <div
      ref={setNodeRef}
      id={`${rowIndex}-${colIndex}`}
      onClick={handleCellClick}
      className={`grid-cell ${cell.id ? 'active' : ''}`} // Use CSS classes
    >
      {cell.id ? <DraggableItem id={`${rowIndex}-${colIndex}`} person={cell.person} removeItem={removeItem} /> : null} {/* Show person value */}
    </div>
  );
};

// DraggableItem component represents the item that can be dragged around
const DraggableItem = ({ id, person, removeItem }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id,  // The unique id for the draggable item
    });
  
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    };
  
    return (
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="draggable-item" // Use CSS class
        style={{
          ...style,
        }}
      >
        <div className='buttons'>
          <button 
            className="removeButton" 
            onMouseDown={(e) => { 
              e.stopPropagation(); 
              removeItem()
            }}
          >
            <RiDeleteBin6Line />
          </button>
          
        </div>
        <div className='nameTag'><h2>{names[person]}</h2></div>
      </div>
    );
  };
  

export default Grid3;
