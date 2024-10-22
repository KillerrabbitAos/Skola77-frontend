// GridCell.js
import React from "react";
import { useDraggable } from "@dnd-kit/core";

const GridCell = ({ rowIndex, colIndex, cell }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${rowIndex}-${colIndex}`,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        width: "100px",
        height: "100px",
        border: "1px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDragging ? "lightgreen" : "white",
      }}
    >
      {cell.id ? cell.id : "Empty"}
    </div>
  );
};

export default GridCell;
