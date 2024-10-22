// Klassrum.js
import React from "react";
import { DndContext } from "@dnd-kit/core";
import "./Grid.css"; // Import the CSS file
import GridCell from "./GridCell"; // Ensure this path is correct

const Klassrum = ({ rows, columns, grid, setGrid, names }) => {
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

  return (
    <DndContext onDragEnd={handleDrop}>
      <div
        className="grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 100px)`,
          gridTemplateRows: `repeat(${rows}, 100px)`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.slice(0, columns).map((cell, colIndex) => (
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
  );
};

export default Klassrum;
