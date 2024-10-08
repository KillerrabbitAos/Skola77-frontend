import React, { useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Grid.css"; // Import the CSS file

// Function to create an initial grid with empty cells
const data = JSON.parse(
  '{"grid":[[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395558391","person":1},{"id":"item-1728395558639","person":1}],[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395560144","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395557488","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":"item-1728395563304","person":1},{"id":"item-1728395562912","person":1},{"id":"item-1728395557831","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395562504","person":1},{"id":"item-1728395559832","person":1}],[{"id":null,"person":0},{"id":"item-1728395561288","person":1},{"id":"item-1728395560888","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}]],"cols":7,"rows":6,"names":["","Ben","kol"]}'
);
const initialGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ id: null, person: 0 }))
  );
};

// Main Grid Component
const Grid3 = () => {
  const [names, setNames] = useState(data.names);
  const [rows, setRows] = useState(data.rows);
  const [cols, setCols] = useState(data.cols);
  const [grid, setGrid] = useState(data.grid);
  const [deletedItems, setDeletedItems] = useState([]);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  
  const ändraRader = (e) => {
    const newRows = parseInt(e.target.value);
  
    // Store removed items from the previous grid
    const removedItems = [];
    const newGrid = [];
  
    // Create new grid based on the new number of rows
    for (let rowIndex = 0; rowIndex < newRows; rowIndex++) {
      if (rowIndex < rows) {
        // Copy existing rows
        newGrid.push(grid[rowIndex]);
      } else {
        // Initialize new rows with empty cells
        newGrid.push(Array.from({ length: cols }, () => ({ id: null, person: 0 })));
      }
    }
  
    // If reducing the number of rows, collect removed rows
    if (newRows < rows) {
      for (let rowIndex = newRows; rowIndex < rows; rowIndex++) {
        // Store the entire row with its original index
        const removedRow = { index: rowIndex, data: grid[rowIndex] };
        removedItems.push(removedRow);
      }
      // Update deleted items with whole rows
      setDeletedItems((prev) => [...prev, ...removedItems]);
    }
  
    // If increasing the number of rows, restore deleted rows if the index matches
    if (newRows > rows) {
      // Restore entire deleted rows into the new empty rows if available
      for (let rowIndex = rows; rowIndex < newRows; rowIndex++) {
        // Find a deleted row that matches the current row index
        const matchingDeletedRow = deletedItems.find(item => item.index === rowIndex);
  
        // If a matching deleted row exists, restore it
        if (matchingDeletedRow) {
          newGrid[rowIndex] = [...matchingDeletedRow.data]; // Create a copy to prevent reference issues
        }
      }
    }
  
    // Update grid and row count
    setGrid(newGrid);
    setRows(newRows);
  };
  
  

  // Increase the number of columns in the grid
  const ändraKolumner = (e) => {
    const newCols = parseInt(e.target.value);
    const newGrid = grid.map((row, rowIndex) => {
      if (newCols > cols) {
        for (let colIndex = cols; colIndex < newCols; colIndex++) {
          const restoredItem = deletedItems.find(
            (item) => item.rowIndex === rowIndex && item.colIndex === colIndex
          );
          if (restoredItem) {
            row.push({ id: restoredItem.id, person: restoredItem.person });
          } else {
            row.push({ id: null, person: 0 });
          }
        }
      } else {
        // Remove excess columns and store them in deletedItems
        const removedItems = row.slice(newCols).map((cell, colIndex) => ({
          ...cell,
          rowIndex,
          colIndex: colIndex + newCols,
        }));
        setDeletedItems((prev) => [...prev, ...removedItems]);
        row = row.slice(0, newCols);
      }
      return row;
    });

    setGrid(newGrid);
    setCols(newCols);
  };

  // Handle drag-and-drop event
  const handleDrop = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return; // Return if no valid drop

    const [activeRow, activeCol] = active.id.split("-").map(Number);
    const [overRow, overCol] = over.id.split("-").map(Number);

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell }))); // Deep copy

    // Swap active and over items in the grid
    [newGrid[activeRow][activeCol], newGrid[overRow][overCol]] = [
      newGrid[overRow][overCol],
      newGrid[activeRow][activeCol],
    ];

    setGrid(newGrid); // Update grid with swapped cells
  };
  const spara = () => {
    console.log(
      JSON.stringify({ grid: grid, cols: cols, rows: rows, names: names })
    );
  };
  return (
    <div>
      <input type="text" value={rows} onChange={ändraRader} />
      <input type="text" value={cols} onChange={ändraKolumner} />
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
                names={names}
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
const GridCell = ({ rowIndex, colIndex, cell, grid, setGrid, names }) => {
  const { setNodeRef } = useDroppable({
    id: `${rowIndex}-${colIndex}`, // Unique ID for each cell
  });

  // Handle clicking on an empty cell to add a draggable item
  const handleCellClick = () => {
    if (!cell.id) {
      const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
      newGrid[rowIndex][colIndex] = { id: `item-${Date.now()}`, person: 0 }; 
      setGrid(newGrid);
    }
  };

  // Function to remove an item
  const removeItem = () => {
    const newGrid = grid.map((row) => row.map((c) => ({ ...c }))); 
    newGrid[rowIndex][colIndex] = { id: null, person: 0 }; 
    setGrid(newGrid);
  };

  return (
    <div
      ref={setNodeRef}
      id={`${rowIndex}-${colIndex}`}
      onClick={handleCellClick}
      className={`grid-cell ${cell.id ? "active" : ""}`} // Use CSS classes
    >
      {cell.id ? (
        <DraggableItem
          names={names}
          id={`${rowIndex}-${colIndex}`}
          person={cell.person}
          removeItem={removeItem}
        />
      ) : null}{" "}
      {/* Show person value */}
    </div>
  );
};

// DraggableItem component represents the item that can be dragged around
const DraggableItem = ({ id, person, removeItem, names }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id, // The unique id for the draggable item
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
      className="draggable-item"
      style={{
        ...style,
      }}
    >
      <div className="buttons">
        <button
          className="removeButton"
          onMouseDown={(e) => {
            e.stopPropagation();
            removeItem();
          }}
        >
          <RiDeleteBin6Line />
        </button>
      </div>
      <h2>{names[person]}</h2>
    </div>
  );
};

export default Grid3;
