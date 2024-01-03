import React, { useState } from 'react';

const Box = ({ position, boxes, setBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [assignedName, setAssignedName] = useState('');

  const handleBoxClick = () => {
  if (!isFilled) {
    const newName = prompt('Enter a name:');
    if (newName) {
      setIsFilled(true);
      setAssignedName(newName);
    }
  } else {
    setIsFilled(false);
    setAssignedName('');
  }
};


  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsFilled(false);
    setAssignedName('');
  };

  return (
    <div
      className={`box ${isFilled ? 'filled' : ''}`}
      onMouseDown={handleBoxClick}
      onContextMenu={handleContextMenu}
      style={{ gridArea: position }}
    >
      {isFilled && (
        <span className="name">
        </span>
      )}
      <span className="name">
          {assignedName}
        </span>
    </div>
  );
};

export default Box;
