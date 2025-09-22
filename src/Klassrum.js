// Klassrum.js
import React, { useState, useRef, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import "./Grid.css";
import { isTablet, isMobile } from "react-device-detect";
import "./Klassrum.css";
import GridCell from "./GridCell";
import { data } from "./data.js";

const engelska = false;

const Klassrum = ({
  rows = 5,
  columns = 5,
  grid,
  setGrid,
  names = [""],
  låstaBänkar,
  klar,
  setLåstaBänkar,
  updateSize,
  edit = true,
  reverse,
  setReverse,
  engelska,
  extra,
  skrivUt = false,
}) => {
  const [activePerson, setActivePerson] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [overId, setOverId] = useState(null);
  const [overPerson, setOverPerson] = useState(null);
  const [size, setSize] = useState(null);
  const [fontSize, setFontSize] = useState([{ id: "0-0", size: 100 }]);
  const [högerklicksmeny, setHögerklicksmeny] = useState(false);

  const gridRef = useRef(null);
  const updateGridColumns = () => {
    setSize(
      `repeat(${columns}, ${
        skrivUt || klar
          ? Math.min(window.outerWidth / columns, window.outerHeight / rows)
          : window.outerWidth / (columns > 14 ? columns : 14)
      }px)`
    );
  };
  const rum = (grid ? grid : data.klassrum[0].grid)
    .slice(0, rows)
    .map((row, rowIndex) =>
      row.slice(0, columns).map((cell, colIndex) => (
        <GridCell
          key={`${rowIndex}-${colIndex}`}
          cords={`${rowIndex}-${colIndex}`}
          rowIndex={rowIndex}
          rows={rows}
          colIndex={colIndex}
          overId={overId}
          updateSize={updateSize}
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
          fontSize={fontSize}
          setFontSize={setFontSize}
          högerklicksmeny={högerklicksmeny}
          setHögerklicksmeny={setHögerklicksmeny}
          grid={grid}
          names={names}
          omvänd={reverse}
          låstaBänkar={låstaBänkar}
          setLåstaBänkar={setLåstaBänkar}
          setGrid={setGrid}
          overBool={
            (grid ? grid : data.klassrum[0].grid)
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
              )
              .some((row) => row.includes(null)) &&
            overId &&
            dragging &&
            overId !== `${rowIndex}-${colIndex}`
          }
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
    updateGridColumns();
    window.addEventListener("resize", updateGridColumns);
    return () => {
      window.removeEventListener("resize", updateGridColumns);
    };
  }, []);
  return (
    <>
      {!klar ? (
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
          <div className="print grid grid-cols-3">
            <div></div>
            <p className="place-self-center" id="uppe">
              {reverse
                ? engelska
                  ? "back"
                  : "bak"
                : engelska
                ? "board"
                : "tavla"}
            </p>
            <div className="place-self-center text-xl flex justify-center items-center">
              {extra}
            </div>
          </div>

          <div
            className="w-fit print m-auto"
            ref={gridRef}
            style={{
              display: "grid",
              overflow: "hidden",
              zIndex: "115",
              gridTemplateColumns: `repeat(${columns}, ${
                skrivUt || klar
                  ? Math.min(
                      window.outerWidth / 1.1 / columns,
                      window.outerHeight / 1.1 / rows
                    )
                  : rows / columns > 1.1
                  ? Math.min(
                      window.outerWidth / 1.1 / columns,
                      window.outerHeight / 1.1 / rows
                    )
                  : window.outerWidth /
                    (isTablet || window.outerWidth < window.outerHeight
                      ? isMobile && !isTablet
                        ? 1
                        : 1.2
                      : 1.4) /
                    (columns > 14 || (isMobile && !isTablet) ? columns : 14)
              }px)`,
              gridTemplateRows: `repeat(${rows}, ${
                skrivUt || klar
                  ? Math.min(
                      window.outerWidth / 1.1 / columns,
                      window.outerHeight / 1.1 / rows
                    )
                  : rows / columns > 1.1
                  ? Math.min(
                      window.outerWidth / 1.1 / columns,
                      window.outerHeight / 1.1 / rows
                    )
                  : window.outerWidth /
                    (isTablet || window.outerWidth < window.outerHeight
                      ? isMobile && !isTablet
                        ? 1
                        : 1.2
                      : 1.4) /
                    (columns > 14 || (isMobile && !isTablet) ? columns : 14)
              }px )`,
              justifyItems: "center",
            }}
          >
            {reverse ? rum.reverse().map((row) => row.reverse()) : rum}
          </div>
        </DndContext>
      ) : (
        <div
          className="w-fit print m-auto"
          ref={gridRef}
          style={{
            display: "grid",
            overflow: "hidden",
            zIndex: "115",
            gridTemplateColumns: `repeat(${columns}, ${
              skrivUt || klar
                ? Math.min(
                    window.outerWidth / 1.1 / columns,
                    window.outerHeight / 1.1 / rows
                  )
                : rows / columns > 1.1
                ? Math.min(
                    window.outerWidth / 1.1 / columns,
                    window.outerHeight / 1.1 / rows
                  )
                : window.outerWidth /
                  (isTablet || window.outerWidth < window.outerHeight
                    ? isMobile && !isTablet
                      ? 1
                      : 1.2
                    : 1.4) /
                  (columns > 14 || (isMobile && !isTablet) ? columns : 14)
            }px)`,
            gridTemplateRows: `repeat(${rows}, ${
              skrivUt || klar
                ? Math.min(
                    window.outerWidth / 1.1 / columns,
                    window.outerHeight / 1.1 / rows
                  )
                : rows / columns > 1.1
                ? Math.min(
                    window.outerWidth / 1.1 / columns,
                    window.outerHeight / 1.1 / rows
                  )
                : window.outerWidth /
                  (isTablet || window.outerWidth < window.outerHeight
                    ? isMobile && !isTablet
                      ? 1
                      : 1.2
                    : 1.4) /
                  (columns > 14 || (isMobile && !isTablet) ? columns : 14)
            }px )`,
            justifyItems: "center",
          }}
        >
          {reverse ? rum.reverse().map((row) => row.reverse()) : rum}
        </div>
      )}

      <div>
        <p id="nere">
          {reverse ? (engelska ? "board" : "tavla") : engelska ? "back" : "bak"}
        </p>
      </div>
    </>
  );
};

export default Klassrum;
