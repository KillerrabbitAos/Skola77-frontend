import React, { useEffect, useState } from 'react';

function findValueByKey(list, key) {
  if (list === 'tom') {
    return 0;
  } else {
    const foundItem = list.find(item => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}


const Box = ({ position, groupName, boxes, setBoxes, fixa, names, bytaPlatser, id, originalid, keyChange, boxNames, setBoxNames, filledBoxes, setFilledBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [nameValue, setNameValue] = useState('tom');
  const [färg, setFärg] = useState(null)

  const handleBoxClick = () => {
    if (bytaPlatser) {

    }
    else if (!isFilled) {
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
    const idInfo = { ny: id, original: originalid };
    e.dataTransfer.setData('boxId', 'ny: ' + id + 'original: ' + originalid);
  };

  useEffect(() => {
    if ((document.getElementById(id).getElementsByClassName("name"))[0]) {
      if ((document.getElementById(id).getElementsByClassName("name"))[0].style.fontSize.startsWith("0.")) {
        ((document.getElementById(id).getElementsByClassName("name"))[0]).style.fontSize = "20px"
        fixa();
    }
  }
  setNameValue(findValueByKey(boxNames, id));
  if (filledBoxes.includes(id)) {
    setIsFilled(true)
  }
  else {
    setIsFilled(false)
  }
}, [boxNames, setNameValue, id, filledBoxes]);
useEffect(() => {
  let isMounted = true;

  if (isMounted) {
    setNameValue(names[(findValueByKey(boxNames, id))]);
  }
  if (groupName == "schack"){
    setFärg(nameValue.split(";")[0])
  }
  return () => {
    isMounted = false;
  };
}, [boxNames, setNameValue, id, filledBoxes, isFilled, names]);
return (
  <div
    className={`box ${färg ? färg : ''}`}
    onMouseDown={handleBoxClick}
    onDragStart={handleDragStart}
    draggable={bytaPlatser ? true : false}
    id={id}
    data-originalid={originalid}
    style={{ gridArea: position }}
  >
    <div className={`box ${(filledBoxes.includes(id)) ? 'filled' : ''} ${färg ? färg : ''}`}>
      {isFilled && (
        <span id={id} className={'name'} data-originalid={originalid}>
          {groupName === 'schack' ? nameValue.split(";")[1] : nameValue}
        </span>
      )}
    </div>
  </div>
);
};

export default Box;