import React, { useEffect, useState } from 'react';
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImUnlocked } from "react-icons/im";
import { ImLock } from "react-icons/im";

function findValueByKey(list, key) {
  if (list === 'tom') {
    return 0;
  } else {
    const foundItem = list.find(item => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}


const Box = ({ position, groupName, setLåstaNamn, låstaNamn, boxes, showBorders, setBoxes, fixa, names, bytaPlatser, id, originalid, keyChange, boxNames, setBoxNames, filledBoxes, setFilledBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [nameValue, setNameValue] = useState('tom');
  const [färg, setFärg] = useState(null)

  const handleLåsaNamn = () => {
    const isCurrentlyLocked = låstaNamn.includes(id);
    const updatedLåstaNamn = isCurrentlyLocked
      ? låstaNamn.filter((lockedId) => lockedId !== id)
      : [...låstaNamn, id];
  
    setLåstaNamn(updatedLåstaNamn);
}


  const handleBoxClick = () => {
    if (!isFilled) {
      const newName = 'tom';
      console.log(boxNames[id]);
      if (newName) {
        setIsFilled(true);
        setFilledBoxes([...filledBoxes, id]);
      }
    }
  }
  const handleRemoveBox = () => {
    setIsFilled(false);
    setFilledBoxes((prevFilledBoxes) => prevFilledBoxes.filter((boxId) => boxId !== id));
  
    if (låstaNamn.includes(id)) {
      setLåstaNamn((prevLåstaNamn) => prevLåstaNamn.filter((lockedId) => lockedId !== id));
    }
  
    const newBoxNames = boxNames.filter((box) => box.key !== id);
    setBoxNames(newBoxNames.length ? newBoxNames : 'tom');
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
  fixa();
  return () => {
    isMounted = false;
  };
}, [boxNames, setNameValue, id, filledBoxes, isFilled, names]);
return (
  <div
    className={`box ${färg ? färg : ''}`}
    onMouseUp={handleBoxClick}
    onDragStart={handleDragStart}
    draggable={isFilled ? true : false}
    id={id}
    data-originalid={originalid}
    style={{ gridArea: position }}
  >
    <div className={`box ${(filledBoxes.includes(id)) ? 'filled' : ''} ${färg ? färg : ''}  ${låstaNamn.includes(id) && showBorders ? 'låst' : ''}`}>
      {isFilled && (
          <button className="låsKnappBox" style={{visibility: showBorders ? 'visible' : 'hidden'}}  onClick={handleRemoveBox}><RiDeleteBin6Line /></button>
        )}
        {isFilled && (
          <button className='låsKnappBox' style={{ visibility: showBorders ? 'visible' : 'hidden' }} onClick={handleLåsaNamn}>{låstaNamn.includes(id) ? <ImLock /> : <ImUnlocked />}</button>
        )}
        
      </div>
      <div className={`boxNamn ${låstaNamn.includes(id) ? 'låstBoxNamn' : ''} ${nameValue ? '' : 'tom'}`}>
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