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
  låstaBänkar,
  klar,
  setLåstaBänkar,
  edit = true,
  omvänd = false,
}) => {
  const [activePerson, setActivePerson] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [overId, setOverId] = useState(null);
  const [overPerson, setOverPerson] = useState(null);
  const [reverse, setReverse] = useState(omvänd)  
const rum = ((grid ? grid : data.klassrum[0].grid).slice(0, rows)
.map((row, rowIndex) =>
  (
    row.slice(0, columns)
  ).map((cell, colIndex) => (
    <GridCell
      key={`${rowIndex}-${colIndex}`}
      cords={`${rowIndex}-${colIndex}`}
      rowIndex={rowIndex}
      colIndex={colIndex}
      overId={overId}
      over={overId === `${rowIndex}-${colIndex}`}
      overNamn={(grid ? grid : data.klassrum[0].grid)
        .slice(0, rows)
        .map((row, rowIndex) =>
          row
            .slice(0, columns)
            .map(
              (cell, colIndex) =>
                `${rowIndex}-${colIndex}` === overId &&
                cell.id &&
                names[cell.person]
            )
        )}
      activeId={dragging}
      activePerson={dragging}
      cell={cell}
      grid={grid}
      names={names}
      låstaBänkar={låstaBänkar}
      setLåstaBänkar={setLåstaBänkar}
      setGrid={setGrid}
      edit={edit}
      columns={columns}
      klar={klar}
      overPerson={overPerson}
      dragging={dragging === `${rowIndex}-${colIndex}`}
    />
  ))
))
  const handleDrop = (event) => {
    setDragging(null);
    setOverId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDragging(null);
    setActivePerson(active.id);

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
    <>
      <DndContext
        onDragEnd={handleDrop}
        onDragStart={(e) => {
          const { active } = e;
          setDragging(active.id);
        }}
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
        <div>
          <p id="uppe">{reverse ? "bak" : "tavla"}</p>
        </div>

        <div
          className="grid"
          style={{
            display: "grid",
            overflow: "hidden",
            zIndex: "115",
            gridTemplateColumns: `repeat(${columns}, ${
              window.innerWidth / (columns > 14 ? columns : 14)
            }px)`,
            gridTemplateRows: `repeat(${rows}, ${
              window.innerWidth / (columns > 14 ? columns : 14)
            }px )`,
          }}
        >
          {reverse ? rum.reverse().map(row => row.reverse()) : rum}
        </div>
      </DndContext>

      <div>
        <p id="nere">{reverse ? "tavla" : "bak"}</p>
        <button onClick={() => {setReverse(reverse ? false : true)}}>spegelvänd</button>
      </div>
    </>
  );
};

export default Klassrum;
