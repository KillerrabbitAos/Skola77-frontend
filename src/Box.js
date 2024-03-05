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


const Box = ({ position, groupName, setLåstaNamn, contextMenu, setContextMenu, showContextMenu, låstaNamn, boxes, showBorders, setBoxes, fixa, names, bytaPlatser, id, originalid, keyChange, boxNames, setBoxNames, filledBoxes, setFilledBoxes }) => {
  const [isFilled, setIsFilled] = useState(false);
  const [nameValue, setNameValue] = useState('tom');
  const [färg, setFärg] = useState(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
const setShowContextMenu = (bool) => {
    const newContextMenu = []
  if (bool){
      newContextMenu.push(id)
      setContextMenu(newContextMenu)
    }
    else{
      const newContextMenu = []
      for (let i = 0; i < contextMenu.length; i++){
        if (contextMenu[i] !== id){
            newContextMenu.push(låstaNamn[i])
        }
        setLåstaNamn(newContextMenu); 
    }

  }
}

  const handleLåsaNamn = () => {
    if (!låstaNamn.includes(id)){
    setLåstaNamn((prevLåstaNamn) => [...prevLåstaNamn, id])
  }
  else{
    const newLåstaNamn = [] 
    for (let i = 0; i < låstaNamn.length; i++){
        if (låstaNamn[i] !== id){
            newLåstaNamn.push(låstaNamn[i])
        }
        setLåstaNamn(newLåstaNamn);
    }
  }
}



// Existing useEffect and handlers

// Context menu handlers
const handleContextMenu = (e) => {
  e.preventDefault(); // Prevent default right-click menu
  setShowContextMenu(true); // Show custom context menu
  // Set position for the context menu
  setContextMenuPosition({
    x: e.clientX,
    y: e.clientY
  });
};

const handleClick = (e) => {
  // Hide context menu when clicking anywhere else
  if (showContextMenu) {
    setShowContextMenu(false);
  }
};



  const handleBoxClick = (e) => {
    if (e.button === 0 && !isFilled) {
      const newName = 'tom';
      console.log(boxNames[id]);
      if (newName) {
        setIsFilled(true);
        setFilledBoxes([...filledBoxes, id]);
      }
    }
  }
  const handleRemoveBox = () =>{
      setIsFilled(false);
      setFilledBoxes((prevFilledBoxes) => prevFilledBoxes.filter((boxId) => boxId !== id));
      const newBoxNames = []
      for (let i = 0; i < boxNames.length; i++) {
        if (JSON.parse(JSON.stringify(boxNames[i].key)) !== (JSON.parse(JSON.stringify(id)))){
          newBoxNames.push(boxNames[i])
        }
        else{
          console.log(JSON.parse(JSON.stringify(boxNames[i].key)) + ' är inte lika med ' + (JSON.parse(JSON.stringify(i))))
        }
      }
      setBoxNames(newBoxNames)
      if (newBoxNames == []){
        console.log("rem")
        setBoxNames('tom')
      }
  }
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

useEffect(() => {
  // Listen for clicks to handle hiding the context menu
  document.addEventListener('click', handleClick);
  return () => {
    document.removeEventListener('click', handleClick);
  };
}, [showContextMenu]);
return (
  <div
    className={`box ${färg ? färg : ''}`}
    onMouseUp={handleBoxClick}
    onDragStart={handleDragStart}
    draggable={isFilled ? true : false}
    id={id}
    data-originalid={originalid}
    style={{ gridArea: position }}
    onContextMenu={handleContextMenu}
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
        {showContextMenu && (
        <ul className="custom-context-menu" style={{ position: 'fixed', // Use 'fixed' for positioning based on viewport
        top: contextMenuPosition.y,
        left: contextMenuPosition.x,
        listStyle: 'none',
        padding: '10px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
          {names.map((name) => (
            <li key={name} onClick={() => {/* Implement your logic for when a name is clicked, possibly using a function that handles this logic and passes the name or other data as argument */}}>
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
};

export default Box;