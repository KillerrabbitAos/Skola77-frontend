// Grid.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { initialGridData } from './data'; // Import your initial data
import GridCell from './GridCell'; // Import GridCell for rendering

const Grid3 = () => {
  const [gridData, setGridData] = useState(initialGridData);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedGrid = Array.from(gridData);
    const [movedItem] = updatedGrid.splice(result.source.index, 1);
    const targetItem = updatedGrid[result.destination.index];

    // Swap names and klassrum
    if (targetItem) {
      const tempName = movedItem.name;
      const tempKlassrum = movedItem.klassrum;

      movedItem.name = targetItem.name;
      targetItem.name = tempName;

      movedItem.klassrum = targetItem.klassrum;
      targetItem.klassrum = tempKlassrum;
    }

    updatedGrid.splice(result.destination.index, 0, movedItem);
    setGridData(updatedGrid);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            className="grid"
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', // Adjust number of columns
              gap: '10px',
            }}
          >
            {gridData.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <GridCell
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    item={item}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Grid3;
