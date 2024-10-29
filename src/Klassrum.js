// Klassrum.js
import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import "./Grid.css";
import "./Klassrum.css";
import GridCell from "./GridCell"; 
import { data } from "./data.js";
const Klassrum = ({
  rows=5,
  columns=5,
  grid,
  setGrid,
  names=[""],
edit=true
}) => {
  
  const handleDrop = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const [activeRow, activeCol] = active.id.split("-").map(Number);
    const [overRow, overCol] = over.id.split("-").map(Number);

    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell }))); 

    [newGrid[activeRow][activeCol], newGrid[overRow][overCol]] = [
      newGrid[overRow][overCol],
      newGrid[activeRow][activeCol],
    ];

    setGrid(newGrid);
  };
  
	return (
    <DndContext onDragEnd={handleDrop}>
      <div
        className="grid"
        style={{
          display: "grid",
	overflow:"hidden",
        
	zIndex: "0",
          gridTemplateColumns: `repeat(${columns}, 100px)`,
          gridTemplateRows: `repeat(${rows}, 100px)`,
        }}
      >
	  {( grid ? grid : data.klassrum[0].grid).slice(0, rows).map((row, rowIndex) =>
          row
            .slice(0, columns)
            .map((cell, colIndex) => (
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                cell={cell}
                grid={grid}
                names={names}
                setGrid={setGrid}
		edit={edit}
              />
            ))
        )}
      </div>
    </DndContext>
  );
};

export default Klassrum;
