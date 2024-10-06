import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { RiDeleteBin6Line } from "react-icons/ri";
import './Grid.css'; // Import the CSS file
const names = ["", "bing", "hej", "kebab", "hoho"];
// Function to create an initial grid with empty cells
const initialGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ id: null, person: 0 }))
  );
};

// Main Grid Component
const Grid3 = () => {
    console.log("Grid3 component rendered"); // Add this line
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [grid, setGrid] = useState(initialGrid(3, 3));
  

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

  return (
    <div>
      <button onClick={increaseRows}>Increase Rows</button>
      <button onClick={increaseCols}>Increase Columns</button>

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
            onClick={(e) => { 
              console.log("Button clicked"); // This should log when the button is clicked
              e.stopPropagation(); // Prevent event from bubbling up
              removeItem(); // Call removeItem to remove the item
              console.log("beng"); // Log to check if function is called
            }}
          >
            <RiDeleteBin6Line />
          </button>
          <button onClick={() => console.log("Test Button Clicked")}>
  Test Button
</button>
        </div>
        <div className='nameTag'><h2>{names[person]}</h2></div>
      </div>
    );
  };
  

export default Grid3;
