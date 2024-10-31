import React, { useEffect, useState } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { RiDeleteBin6Line } from "react-icons/ri";

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
  cords,
}) => {
  const { setNodeRef } = useDroppable({
    id: `${rowIndex}-${colIndex}`, // Unique ID for each droppable cell
  });

  const [position, setPosition] = useState({ x: 0, y: 0 });

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
      }; // Default person index to 0
      setGrid(newGrid);
    }
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
    id: `${rowIndex}-${colIndex}`, // Unique ID for the draggable item
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `translate3d(${position.x}px, ${position.y}px, 0)`,
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    border: "1px solid black",
    touchAction: "none",
    zIndex: dragging ? "99" : "1",
    position: over ? "absolute" : "relative",
  };
  const style2 = {
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    border: "1px solid black",
    touchAction: "none",
    zIndex: dragging ? "99" : "1",
    position: over ? "absolute" : "relative",
  };

  return (
    <div
      id={cords}
      ref={setNodeRef}
      onClick={handleCellClick}
      className={`grid-cell ${cell.id ? "active" : ""}`}
      style={{
        border: "0.5px solid gray",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
        width: "100%",
        zIndex: dragging ? "99" : "1",
      }}
    >
      {overNamn && overId && dragging && overId !== cords && (
        <div style={style2}>
          <div className="buttons">
            <button
              className="removeButton"
              onMouseUp={(e) => {
                e.stopPropagation();
                removeItem();
              }}
            >
              <RiDeleteBin6Line style={{ color: "white" }} />
            </button>
          </div>
          <h2>{overNamn}</h2>
        </div>
      )}
    
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
              <RiDeleteBin6Line style={{ color: "white" }} />
            </button>
          </div>
          <h2>{names[cell.person]}</h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default GridCell;
