import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';

const Bänk = ({ item, names, isPlaceholder, activePerson, items, isActive, overId }) => {
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
export default Bänk;