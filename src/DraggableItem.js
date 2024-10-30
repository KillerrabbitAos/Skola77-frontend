// DraggableItem.js
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Grid.css"; // Make sure to include your styles

export const DraggableItem = ({ id, person, removeItem, names }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id, // The unique id for the draggable item
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
	  zIndex: "99";
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="draggable-item"
      style={style}
    >
      <div className="buttons">
        <button
          className="removeButton"
          onMouseUp={(e) => {
            e.stopPropagation();
            removeItem();
          }}
        >
          <RiDeleteBin6Line />
        </button>
      </div>
      <h2>{names[person]}</h2>
    </div>
  );
};
