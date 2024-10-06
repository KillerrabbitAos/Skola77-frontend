import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';

const initialGrid = (rows, cols) =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ id: null, person: 0 })));

const Grid = () => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [grid, setGrid] = useState(initialGrid(3, 3));

  // Use both Mouse and Touch sensors for desktop and touch device compatibility
  const sensors = useSensors(
    useSensor(MouseSensor), // Mouse sensor for desktops
    useSensor(TouchSensor)  // Touch sensor for touch-enabled devices like iPads
  );

  const increaseRows = () => {
    setGrid([...grid, Array(cols).fill({ id: null, person: 0 })]);
    setRows(rows + 1);
  };

  const increaseCols = () => {
    setGrid(grid.map(row => [...row, { id: null, person: 0 }]));
    setCols(cols + 1);
  };

  const saveToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(grid));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "grid-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const loadFromJson = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const loadedGrid = JSON.parse(e.target.result);
      setGrid(loadedGrid);
    };
    reader.readAsText(file);
  };

  // Define handleDrop function to manage the swapping of items between cells
  const handleDrop = (event) => {
    const { active, over } = event;
    if (!over) return; // If not dropped over a valid area, exit early

    // Ensure active.id and over.id are both strings (e.g., "cell-1-2")
    const activeId = String(active.id); // Force it to string if needed
    const overId = String(over.id);     // Force it to string if needed

    const [activeRow, activeCol] = activeId.split('-').slice(1).map(Number);
    const [overRow, overCol] = overId.split('-').slice(1).map(Number);

    if (activeId !== overId) {
      const newGrid = [...grid];
      // Swap the items in both cells
      [newGrid[activeRow][activeCol], newGrid[overRow][overCol]] = [newGrid[overRow][overCol], newGrid[activeRow][activeCol]];
      setGrid(newGrid);
    }
  };

  return (
    <div>
      <button onClick={increaseRows}>Increase Rows</button>
      <button onClick={increaseCols}>Increase Columns</button>
      <button onClick={saveToJson}>Save Grid to JSON</button>
      <input type="file" onChange={loadFromJson} accept="application/json" />
      
      <DndContext sensors={sensors} onDragEnd={handleDrop}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 100px)`,
            gridTemplateRows: `repeat(${rows}, 100px)`,
            gap: '10px',
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
              />
            ))
          )}
        </div>
      </DndContext>
    </div>
  );
};

const GridCell = ({ rowIndex, colIndex, cell, grid, setGrid }) => {
  const { setNodeRef } = useDroppable({
    id: `cell-${rowIndex}-${colIndex}`,  // Use string IDs like "cell-1-2"
  });

  const handleCellClick = () => {
    if (!cell.id) {
      const newGrid = [...grid];
      newGrid[rowIndex][colIndex] = { id: `cell-${rowIndex}-${colIndex}`, person: 0 };  // Ensure id is a string
      setGrid(newGrid);
    }
  };

  return (
    <div
      ref={setNodeRef}
      id={`cell-${rowIndex}-${colIndex}`}
      onClick={handleCellClick}
      style={{
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: cell.id ? 'lightblue' : 'white',
      }}
    >
      {cell.id ? <DraggableItem id={cell.id} /> : null}
    </div>
  );
};

const DraggableItem = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        ...style,
        width: '50px',
        height: '50px',
        backgroundColor: 'orange',
        textAlign: 'center',
        lineHeight: '50px',
      }}
    >
      {id}
    </div>
  );
};

export default Grid;
