
import React, { useEffect, useState } from 'react';

const calculateFontSize = (containerId, textId, baseFontSize = 16) => {
  const containerWidth = document.getElementById(containerId).offsetWidth;
  const elementWidth = document.getElementById(textId).offsetWidth;
  const ratio = containerWidth / elementWidth;
  return baseFontSize * ratio;
};

// Example usage
const newFontSize = calculateFontSize('container', 'text');

// Now `newFontSize` contains the calculated font size.

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
        filledBoxes.push(id);
      }
    } else {
      //setIsFilled(false);
      //var elements = [filledBoxes];
      //for(var i = elements.length - 1; i >= 0; i--){
          //if(elements[i] == id){
          //    elements.splice(i, 1);
        //  }
      //    setFilledBoxes(elements)
      
      }
    }

  const nameValue = findValueByKey(boxNames, id);
  const isNameTooLong = nameValue && nameValue.length > 7;
  

  return (
    <div
      className={`box ${isFilled ? 'filled' : ''}`}
      onMouseDown={handleBoxClick}
      style={{ gridArea: position }}
    >
      {isFilled && (
        <span className={`name`}>
          {nameValue}
        </span>

      )}
    </div>
  );
};

export default Box;
