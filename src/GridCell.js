// GridCell.js
import React from "react";
import "./Grid.css"; // Import the CSS file
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { RiDeleteBin6Line } from "react-icons/ri";

const GridCell = ({ rowIndex, colIndex, cell, names, setGrid, grid }) => {
  const { setNodeRef } = useDroppable({
    id: `${rowIndex}-${colIndex}`, // Unique ID for each droppable cell
  });

  // Handle clicking on an empty cell to add a draggable item
  const handleCellClick = () => {
    if (!cell.id) {
      const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
      newGrid[rowIndex][colIndex] = { id: `item-${Date.now()}`, person: 0 }; // Default person index to 0
      setGrid(newGrid);
    }
  };

  // Function to remove an item
  const removeItem = () => {
    const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
    newGrid[rowIndex][colIndex] = { id: null, person: 0 }; // Reset cell to empty
    setGrid(newGrid);
  };

  const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({
    id: `${rowIndex}-${colIndex}`, // Unique ID for the draggable item
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCellClick}
      className={`grid-cell ${cell.id ? "active" : ""}`}
      style={{
        border: "1px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cell.id ? "lightblue" : "white",
      }}
    >
      {cell.id ? (
        <div ref={draggableRef} {...listeners} {...attributes} style={style}>
          <div className="buttons">
            <button
              className="removeButton"
              onMouseUp={(e) => {
                e.stopPropagation();
                removeItem();
              }}
            >
              <RiDeleteBin6Line />
            </button>
          </div>
          <h2>{names[cell.person]}</h2> {/* Display person name from names array */}
        </div>
      ) : (
        <span>Empty</span> // Indicate empty cell
      )}
    </div>
  );
};

export default GridCell;
