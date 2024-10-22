import React from "react";
import { DndContext } from "@dnd-kit/core";
import GridCell from "./GridCell"; // Import the individual grid cell component

const Klassrum = ({ rows, cols, grid, setGrid, sensors, names }) => {
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
              names={names}
            />
          ))
        )}
      </div>
    </DndContext>
  );
};

export default Klassrum;
