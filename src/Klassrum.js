// Klassrum.js
import React, { useState, useRef, useEffect } from "react";
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
  skrivUt = false,
}) => {
  const [activePerson, setActivePerson] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [overId, setOverId] = useState(null);
  const [overPerson, setOverPerson] = useState(null);
  const [reverse, setReverse] = useState(omvänd);
  const gridRef = useRef(null);
  const updateGridColumns = () => {
    const columnWidth = skrivUt
      ? Math.min(window.outerWidth / columns, window.outerHeight / rows)
      : window.outerWidth / (columns > 14 ? columns : 14);

    gridRef.current.style.gridTemplateColumns = `repeat(${columns}, ${columnWidth}px)`;
    gridRef.current.style.gridTemplateRows = `repeat(${rows}, ${columnWidth}px)`;
  };
  const rum = (grid ? grid : data.klassrum[0].grid)
    .slice(0, rows)
    .map((row, rowIndex) =>
      row
        .slice(0, columns)
        .map((cell, colIndex) => (
          <GridCell
            key={`${rowIndex}-${colIndex}`}
            cords={`${rowIndex}-${colIndex}`}
            rowIndex={rowIndex}
            rows={rows}
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
    );
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

  useEffect(() => {
    window.addEventListener("resize", updateGridColumns);
    return () => window.removeEventListener("resize", updateGridColumns);
  }, []);
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
          ref={gridRef}
          style={{
            display: "grid",
            overflow: "hidden",
            zIndex: "115",
            gridTemplateColumns: `repeat(${columns}, ${
              skrivUt
                ? Math.min(
                    window.outerWidth / columns,
                    window.outerHeight / rows
                  )
                : window.outerWidth / (columns > 14 ? columns : 14)
            }px)`,
            gridTemplateRows: `repeat(${rows}, ${
              skrivUt
                ? Math.min(
                    window.outerWidth / columns,
                    window.outerHeight / rows
                  )
                : window.outerWidth / (columns > 14 ? columns : 14)
            }px )`,
          }}
        >
          {reverse ? rum.reverse().map((row) => row.reverse()) : rum}
        </div>
      </DndContext>

      <div>
        <p id="nere">{reverse ? "tavla" : "bak"}</p>
        <button
          onClick={() => {
            setReverse(reverse ? false : true);
          }}
        >
          spegelvänd
        </button>
      </div>
    </>
  );
};

export default Klassrum;
