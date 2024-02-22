import React, { useEffect, useState } from 'react';

function findValueByKey(list, key) {
  if (list === 'tom') {
    return 0;
  } else {
    const foundItem = list.find(item => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}


const Box = ({ position, boxes, setBoxes, names, id, setId, boxNames, setBoxNames, filledBoxes, setFilledBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [nameValue, setNameValue] = useState('tom');

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
  const handleDragStart = (e) => {
    e.dataTransfer.setData('boxId', id); // Set the id of the dragged box
  };
  useEffect(() => {
    setNameValue(findValueByKey(boxNames, id));
    if (filledBoxes.includes(id)){
      setIsFilled(true)
    }
    else{
      setIsFilled(false)
    }
  }, [boxNames, setNameValue, id, filledBoxes]);
  useEffect(() => {
    let isMounted = true;
  
    if (isMounted) {
      setNameValue(names[(findValueByKey(boxNames, id))]);
      
      if (findValueByKey(keyChange, id)){
        id = findValueByKey(keyChange, id)
      }
    }
  
    return () => {
      isMounted = false;
    };
  }, [boxNames, setNameValue, id, filledBoxes, isFilled, names]);  
  return (
    <div
      className={`box ${(filledBoxes.includes(id)) ? 'filled' : ''}`}
      onMouseDown={handleBoxClick}
      onDragStart={handleDragStart}
      draggable={true}
      id={id}
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