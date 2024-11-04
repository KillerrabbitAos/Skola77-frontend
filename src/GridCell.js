import React, { useEffect, useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Grid.css"; // Import the CSS file

const GridCell = ({
  dragging,
  edit,
  rowIndex,
  over,
  overId,
  overPerson,
  activePerson,
  activeId,
  overNamn,
  colIndex,
  cell,
  names,
  setGrid,
  grid,
  klar,
  cords,
  columns,
  låstaBänkar,
  overbench,
  setLåstaBänkar,
}) => {
  const { setNodeRef } = useDroppable({
    id: `${rowIndex}-${colIndex}`, // Unique ID for each droppable cell
  });
  const [fontSize, setFontSize] = useState("1rem");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleResize = () => {
      const cell = document.getElementById(cords);
      if (cell) {
        const cellWidth = cell.offsetWidth;
        setFontSize(`${cellWidth * 0.3}px`);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [columns]);
  useEffect(() => {
    // Only update position if `over` is true and `overId` is not equal to `activeId`
    if (over && overId !== activeId && activePerson) {
      const targetElement = document.getElementById(activePerson);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        });
      }
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, [over, overId, activeId, activePerson]);

  const handleCellClick = () => {
    if (!cell.id) {
      const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
      newGrid[rowIndex][colIndex] = {
        id: `item-${Date.now()}`,
        person: 0,
      };
      setGrid(newGrid);
    }
  };
  const lås = () => {
    !låstaBänkar.includes(cell.id)
      ? setLåstaBänkar(
          cell.person
            ? [...låstaBänkar, cell.id, cell.person]
            : [...låstaBänkar, cell.id]
        )
      : setLåstaBänkar(
          låstaBänkar.filter((sak) => sak !== cell.id && sak !== cell.person)
        );
  };
  const removeItem = () => {
    const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
    newGrid[rowIndex][colIndex] = { id: null, person: 0 }; // Reset cell to empty
    setGrid(newGrid);
  };

  const {
    attributes,
    listeners,
    setNodeRef: draggableRef,
    transform,
  } = useDraggable({
    id: `${rowIndex}-${colIndex}`,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `translate3d(${position.x}px, ${position.y}px, 0)`,
    width: "100%",
    height: "100%",
    background: "black",
    background:
      låstaBänkar.includes(cell.id) && cell.person === 0
        ? "repeating-linear-gradient(45deg, #b3b3b34d, #0003 10px, #0000004d 0, #0000004d 20px)"
        : "white",
    border: dragging ? "1px solid black" : "none",
    touchAction: "none",
    zIndex: dragging ? "99" : "1",
    position: over ? "absolute" : "relative",
    textAllign: "center",
    margin: "auto",
  };
  const style2 = {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    border: "none",
    touchAction: "none",
    zIndex: dragging ? "99" : "1",
    position: "absolute",
    borderRadius: "10px",
    textAllign: "center",
    margin: "auto",
  };

  return (
    <div
      id={cords}
      ref={setNodeRef}
      onClick={handleCellClick}
      className={`grid-cell ${cell.id ? "active" : ""} rounded-xl`}
      style={{
        border: over ? "2px solid gray" : "2px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
        width: "90%",
        height: "90%",
        zIndex: dragging ? "99" : "1",
      }}
    >
      {!overNamn.some((row) => row.includes(null)) &&
        overId &&
        dragging &&
        overId !== cords && (
          <div style={style2}>
            <div className="buttons">
              <button
                className="removeButton rounded-tl-xl rounded-tr-none rounded-br-none rounded-bl-none"
                onMouseUp={(e) => {
                  e.stopPropagation();
                  removeItem();
                }}
              >
                <RiDeleteBin6Line
                  style={{
                    height: "75%",
                    width: "75%",
                    color: "white",
                    margin: "auto",
                  }}
                />
              </button>
              <button
                className="removeButton rounded-tl-none rounded-tr-xl rounded-bl-none !rounded-br-none !bg-gray-400"
                onMouseUp={(e) => {
                  e.stopPropagation();
                  lås();
                }}
              >
                {!låstaBänkar.includes(dragging) ? (
                  <svg
                    style={{ height: "80%", marginLeft: "5%", margin: "auto" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48-16 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-240 0 0-48z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    style={{ height: "80%", marginLeft: "5%", margin: "auto" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
                      fill="white"
                    />
                  </svg>
                )}
              </button>
            </div>
            <h2
              style={{
                fontSize,
              }}
            >
              {overNamn}
            </h2>
          </div>
        )}

      {cell.id ? (
        <div
          ref={draggableRef}
          {...listeners}
          {...attributes}
          style={style}
          className="rounded-xl"
        >
          {!klar && (
            <div className="buttons">
              <button
                className="removeButton rounded-tl-xl rounded-tr-none rounded-br-none rounded-bl-none"
                onMouseUp={(e) => {
                  e.stopPropagation();
                  removeItem();
                }}
              >
                <RiDeleteBin6Line
                  style={{
                    height: "75%",
                    width: "75%",
                    color: "white",
                    margin: "auto",
                  }}
                />
              </button>
              <button
                className="removeButton rounded-tl-none rounded-tr-xl rounded-bl-none !rounded-br-none !bg-gray-400"
                onMouseUp={(e) => {
                  e.stopPropagation();
                  lås();
                }}
              >
                {!låstaBänkar.includes(cell.id) ? (
                  <svg
                    style={{ height: "80%", marginLeft: "5%", margin: "auto" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48-16 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-240 0 0-48z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    style={{ height: "80%", marginLeft: "5%", margin: "auto" }}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
                      fill="white"
                    />
                  </svg>
                )}
              </button>
            </div>
          )}
          <h2
            style={{
              fontSize,
            }}
          >
            {names[cell.person]}
          </h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default GridCell;
