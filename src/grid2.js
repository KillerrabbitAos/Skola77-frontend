import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './Grid.css';

// Simulating persistent storage with a constant variable
let saved = null;

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Sortable Item Component
const SortableItem = ({ item, names, isPlaceholder, activePerson, items, isActive, overId }) => {
  const { id } = item; 
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    
  const style = {

  };

  return (
    <div 
      id={id}
      ref={setNodeRef}
      className={`grid-item ${isPlaceholder ? 'placeholder' : isActive ? 'dragging' : ''}`}
      style={style}
      {...attributes}
      {...listeners}
    >
      {!isPlaceholder ? (
        <>
          <h2>{names[item.person]}</h2>
        </>
      ) : isActive ? (
        <div className="placeholder-content">
        <h2>{names[overId]}</h2>
        </div>
      ) : (
        <div className="placeholder-content">
        <h2>{names[item.person]}</h2>
        </div>
      )}
    </div>
  );
};

const Grid2 = () => {
  const rader = 9;
  const kolumner = 7;
  const names = ["", "bing", "hej", "kebab", "hoho"];

 
  // Load saved order from the 'saved' constant or default to sequential order
  const loadInitialItems = () => {
    if (saved) {
      return saved;
    }
    return Array.from({ length: rader * kolumner }, (_, index) => ({
      id: index + 1,
      person: 0,
    }));
  };

  const [items, setItems] = useState(loadInitialItems);
  const [activePerson, setActivePerson] = useState(null); // Track the active item
  const [overId, setOverId] = useState(null); // Track the ID of the item being hovered over

  // Update the 'saved' constant whenever the grid items are updated
  useEffect(() => {
    saved = items;
  }, [items]);

  const shuffle = () => {
    const newItems = [];
    items.forEach((item) => {
      let newPerson = 0;
      if (item.id < (names.length + 1)) {
        newPerson = item.id;
      }
      newItems.push({ id: item.id, person: newPerson });
    });
    shuffleArray(newItems);
    setItems(newItems);
  };

  const handleDragStart = (event) => {
    setActivePerson(event.active.id); // Set the active item ID
    document.body.style.overflow = 'hidden';

  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Create a new array where only the two items being swapped are changed
        const updatedItems = [...items];

        // Swap the two items in the updatedItems array
        [updatedItems[oldIndex], updatedItems[newIndex]] = [updatedItems[newIndex], updatedItems[oldIndex]];

        return updatedItems;
      });
    }

    // Clear the active item and hovered item
    setActivePerson("");
    setOverId("");
  };

  const handleDragOver = (event) => {
    const { over } = event;
    if (over) {
      setOverId(over.id); // Update the hovered item ID
    }
  };
  
  return (
    <>
      <button onClick={shuffle}>Shuffle Person Values</button>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <SortableContext items={items.map((item) => item.id)}>
          <div
            className="grid-container"
            style={{
              display: 'grid',
              width: '200px',
              gap: '10px',
              margin: 'auto',
              display: "grid",
            margin: "20px",
             width: "400px",
            height: "400px",
            gridTemplateColumns: `repeat(${kolumner}, 1fr)`,
            gridTemplateRows: `repeat(${rader}, 1fr)`
            }}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                items={items}
                activePerson={names[activePerson]}
                names={names}
                isPlaceholder={overId === item.id || activePerson === item.id}
                overId={overId}
                isActive={item.id === activePerson}
              />
            ))}
          </div>
          
        </SortableContext>
      </DndContext>
    </>
  );
};

export default Grid2;
