import React, { useEffect, useState } from 'react';
import Box from './Box';
import schackBräde from './schackVärden';
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function findValueByKey(list, key) {
  if (list == 'tom') {
    return null;
  } else {
    const foundItem = list.find(item => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}
function findKeyByValue(list, value) {
  if (list == 'tom') {
    return null;
  } else {
    const foundItem = list.find(item => item.value === value);
    return foundItem ? foundItem.key : null;
  }
}

const Grid = ({ rows, fixa, columns, knappStatus, setKnappStatus, setLåstaNamn, låstaNamn, groupName, setShowBorders, setEditingMode, showBorders, editingMode, boxes, setBoxes, setBytaPlatser, bytaPlatser, keyChange, setKeyChange, names, boxNames, setBoxNames, filledBoxes, setFilledBoxes, cellSize, setCellSize, baklänges, nere, uppe }) => {


  const handleDrop = async (e) => {
    e.preventDefault();

    let target = e.target;
    while (target && !target.id.startsWith('box-') && target !== e.currentTarget) {
      target = target.parentNode;
    }

    if (!target || target === e.currentTarget) {
      console.log('Dropped on an invalid target');

      return;
    }
    if (e.dataTransfer.getData('namn')) {
      console.log(target.id)
      const newBoxNames = []
      for (let i = 0; i < boxNames.length; i++) {
        if (boxNames[i].key != target.id) {
          newBoxNames.push(boxNames[i])
        }
      }
      const key = target.id
      const value = e.dataTransfer.getData('namn')
      newBoxNames.push({ key, value })
      if (!filledBoxes.includes(target.id)) {
        setFilledBoxes([...filledBoxes, target.id]);
      }
      setBoxNames(newBoxNames)
      return;
    }
    

    const draggedBoxId = JSON.parse(JSON.stringify(e.dataTransfer.getData('boxId').split("ny: ")[1].split("original")[0]));
    const draggedBoxOriginalId = JSON.parse(JSON.stringify(e.dataTransfer.getData('boxId').split("original: ")[1])); // Get the dragged box id
    const targetId = JSON.parse(JSON.stringify(target.id)); // Now we're sure this is the correct target ID
    const targetOriginalId = JSON.parse(JSON.stringify(target.getAttribute("data-originalid")))
    console.log(`Box ${draggedBoxId} dropped on ${targetId}`);
    
    if (keyChange != 'tom') {
      console.log("a")
      const keyChangeDeepCopy = JSON.parse(JSON.stringify(keyChange));
      const newKeyChange = [];
      for (let i = 0; i < keyChange.length; i++) {
        console.log(keyChange[i].key)
        if (keyChange[i].key != draggedBoxOriginalId && keyChange[i].key != targetOriginalId) {
          console.log(keyChange[i].key + "!=" + draggedBoxOriginalId + "&&" + keyChange[i].key + "!=" + targetOriginalId)
          newKeyChange.push(keyChange[i])
          console.log(target)
        }
        else {
          console.log('togbort: ' + keyChange[i].key)
        }
      }
      newKeyChange.push({
        "key": draggedBoxOriginalId,
        "value": (groupName === "schack") ? 'box-T' : targetId
      },
        {
          "key": targetOriginalId,
          "value": draggedBoxId
        })
      setKeyChange(newKeyChange)
    }
    else {
      console.log("första")
      setKeyChange([{
        "key": draggedBoxOriginalId,
        "value": targetId
      },
      {
        "key": targetOriginalId,
        "value": draggedBoxId
      }
      ])
    }
  
    return;
    

  };
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };
  const generateGrid = () => {
    const gridItems = [];
    var x = baklänges;
    const startIndex = x ? (rows * columns) - 1 : 0;
    const endIndex = x ? -1 : rows * columns;
    const step = x ? -1 : 1;

    for (let i = startIndex; i !== endIndex; i += step) {
      const box = boxes[i] || { position: `${i + 1}`, name: '' };
      var toBeKey = (`box-${i}`);
      if ((findValueByKey(keyChange, (`box-${i}`)))) {
        toBeKey = ((findValueByKey(keyChange, (`box-${i}`))));
      }
      gridItems.push(

        <div
          key={`grid-item-${i}`}
          className="grid-item"
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            outline: showBorders ? '1px solid black' : 'none',
            boxSizing: 'border-box',
          }}
        >
          <Box
            key={toBeKey}
            originalid={`box-${i}`}
            id={toBeKey}
            position={box.position}
            boxes={boxes}
            setBoxes={setBoxes}
            name={box.name}
            boxNames={boxNames}
            filledBoxes={filledBoxes}
            setFilledBoxes={setFilledBoxes}
            names={names}
            keyChange={keyChange}
            bytaPlatser={bytaPlatser}
            fixa={fixa}
            groupName={groupName}
            låstaNamn={låstaNamn}
            setLåstaNamn={setLåstaNamn}
            showBorders={showBorders}
          />
        </div>
      );
    }

    return gridItems;
  };

  return (
    <div className="grid-outer-container" onDragOver={handleDragOver} onDrop={handleDrop} id='gridPdfSak' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: "0px" }}>
      
      <h1 id='placeringsTitel'>{groupName}</h1>

      
      <p id='uppe'>{uppe}</p>


      <div id='grid' className={`grid-container ${groupName === 'schack' ? 'schackBräde' : ''}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '10px', width: `${columns * cellSize + (columns - 1) * 10}px`, }}>
        {generateGrid()}
      </div>


      <p id='nere'>{nere}</p>


    </div>
  );
};

export default Grid;
