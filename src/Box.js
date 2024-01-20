import React, { useState } from 'react';

function findValueByKey(list, key) {
  if (list === 'tom') {
    return "tom";
  } else {
    const foundItem = list.find(item => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}

const Box = ({ position, boxes, setBoxes, names, id, boxNames, setBoxNames, filledBoxes, setFilledBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);

  const handleBoxClick = () => {
    if (!isFilled) {
      const newName = 'tom';
      console.log(boxNames[id]);
      if (newName) {
        setIsFilled(true);
        setFilledBoxes([...filledBoxes, id]);
      }
    } else {
      setIsFilled(false);
      setFilledBoxes((prevFilledBoxes) => prevFilledBoxes.filter((boxId) => boxId !== id));
    }
  };

  const nameValue = findValueByKey(boxNames, id);
  const isNameTooLong = nameValue && nameValue.length > 7;

  return (
    <div
      className={`box ${isFilled ? 'filled' : ''}`}
      onMouseDown={handleBoxClick}
      style={{ gridArea: position }}
    >
      {isFilled && (
        <span id={id} className={'name'}>
          {nameValue}
        </span>
      )}
    </div>
  );
};

export default Box;
