// Klassrum.js
import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";
import "./Grid.css";
import "./Klassrum.css";
import GridCell from "./GridCell";
import { data } from "./data.js";
const Klassrum = ({
  rows = 5,
  columns = 5,
  grid,
  setGrid,
  names = [""],
  edit = true
}) => {
  const [activePerson, setActivePerson] = useState(null)
  const [dragging, setDragging] = useState("y-x")
  const [overId, setOverId] = useState(null)
  const [overPerson, setOverPerson] = useState(null)

  
  const handleDrop = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDragging(null);
    setActivePerson(over.person);
  
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
    <DndContext 
  onDragEnd={handleDrop} 
  onDragStart={(e) => { const { active } = e; setDragging(active.id); }} 
  onDragOver={(e) => { 
    const { over } = e; 
    if (over) { 
      setOverId(over.id); 
      setOverPerson(over.Person); 
    } else { 
      setOverId(null); 
      setOverPerson(null); 
    } 
  }}
>
      <div
        className="grid"
        style={{
          display: "grid",
          overflow: "hidden",

          zIndex: "100",
          gridTemplateColumns: `repeat(${columns}, 100px)`,
          gridTemplateRows: `repeat(${rows}, 100px)`,
        }}
      >
        {(grid ? grid : data.klassrum[0].grid).slice(0, rows).map((row, rowIndex) =>
          row
            .slice(0, columns)
            .map((cell, colIndex) => (<>
              <GridCell
                key={`${rowIndex}-${colIndex}`}
                rowIndex={rowIndex}
                colIndex={colIndex}
                overId={overId}
                over={overId == `${rowIndex}-${colIndex}` ? true : false}
                activePerson={activePerson}
                cell={cell}
                grid={grid}
                names={names}
                setGrid={setGrid}
                edit={edit}
                overPerson={overPerson}
                dragging={dragging == `${rowIndex}-${colIndex}` ? true : false}
              />


            </>))
        )}
      </div>

    </DndContext>
  );
};

export default Klassrum;
