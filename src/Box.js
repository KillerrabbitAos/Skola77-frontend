import React, { useEffect, useState } from 'react';

function findValueByKey(list, key) {
  if (list === 'tom') {
    return 0;
  } else {
    const foundItem = list.find(item => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}


const Box = ({ position, boxes, setBoxes, names, id, boxNames, setBoxNames, filledBoxes, setFilledBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [nameValue, setNameValue] = useState('tom');
  const [hookCounter, setHookCounter] = useState(false)
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
  
  useEffect(() => {
    setNameValue(findValueByKey(boxNames, id));
    if (filledBoxes.includes(id)){
      setIsFilled(true)
    }
    else{
      setIsFilled(false)
    }
  }, [boxNames, setNameValue, id]);
  useEffect(() => {
    let isMounted = true;
  
    if (isMounted) {
      setNameValue(names[(findValueByKey(boxNames, id))]);
    }
  
    return () => {
      isMounted = false;
    };
  }, [boxNames, setNameValue, id, filledBoxes, isFilled, names]);  
  return (
    <div
      className={`box ${(filledBoxes.includes(id)) ? 'filled' : ''}`}
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