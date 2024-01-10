import React, { useState } from 'react';
function findValueByKey(list, key) {
  list = list.sort(() => Math.random() - 0.5);
  if (list == 'tom'){
    return("tom")
  }
  else{
  const foundItem = list.find(item => item.key === key);
  return foundItem ? foundItem.value : null;
}
}
const Box = ({ position, boxes, setBoxes, names, id, boxNames, setBoxNames, filledBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);

  const handleBoxClick = () => {
  if (!isFilled) {
    const newName = 'tom';
    console.log(boxNames[id])
    if (newName) {
      setIsFilled(true);
      filledBoxes.push(id)
    }
  } else {
    setIsFilled(false);
  }
};


  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsFilled(false);
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
          {findValueByKey(boxNames, id)}
        </span>
      )}
    </div>
  );
};

export default Box;
