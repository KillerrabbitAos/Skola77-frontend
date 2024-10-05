import React, { useEffect, useState } from "react";
import Box from "./Box";
import SchackBox from "./schackBox";
import Cookies from "js-cookie";
import schackBräde from "./schackVärden";
import LZString from "lz-string";
import { RiDeleteBin6Line } from "react-icons/ri";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function findValueByKey(list, key) {
  if (list == "tom") {
    return null;
  } else {
    const foundItem = list.find((item) => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}
function findKeyByValue(list, value) {
  if (list == "tom") {
    return null;
  } else {
    const foundItem = list.find((item) => item.value === value);
    return foundItem ? foundItem.key : null;
  }
}
function compressData(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}
const Grid = ({
  rows,
  fixa,
  columns,
  updateFixa,
  setUpdateFixa,
  knappStatus,
  setKnappStatus,
  setLåstaNamn,
  låstaNamn,
  groupName,
  setShowBorders,
  setEditingMode,
  showBorders,
  editingMode,
  boxes,
  setBoxes,
  setBytaPlatser,
  bytaPlatser,
  keyChange,
  setKeyChange,
  names,
  boxNames,
  setBoxNames,
  filledBoxes,
  setFilledBoxes,
  cellSize,
  setCellSize,
  baklänges,
  nere,
  uppe,
  GridSparningsLösning,
  columnsInput,
  setColumnsInput,
  setRowsInput,
  rowsInput,
  setRows,
  setColumns,
  raderaGrid,
  gridGroupName,
  defaultGroup,
  setGridGroupName,
  setFixaCounter,
  readCookieValues,
  data,
  setData
  
}) => {
  const [contextMenu, setContextMenu] = useState(["tom"]);


 
  const ökaStorlek = () => {
    if (cellSize >= 150) {
      console.log("för stor:" + cellSize);

      return;
    }

    setCellSize(cellSize + 10);
    console.log(cellSize);
  };

  const minskaStorlek = () => {
    if (cellSize <= 40) {
      console.log("för liten:" + cellSize);
      return;
    }

    setCellSize(cellSize - 10);
    console.log(cellSize);
  };
  const handleSaveGrid = async () => {
    const name = prompt("Döp det här klassrummet: ");
    if (name) {
      setGridGroupName(name);

      const compressedData = compressData({
        rows,
        columns,
        cellSize,
        filledBoxes,
        keyChange,
        låstaNamn,
      });

      let klassAttRadera = `${name}_gridValues`
      let loggedInData = JSON.parse(data)
      loggedInData = loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':'))
      loggedInData.push(`${name}_gridValues` + ":" + compressedData)
      const newData = JSON.stringify(loggedInData)
      const response = await fetch('https://account.skola77.com:3005/updateData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData }),
        credentials: 'include'
    });
    setData(newData)
      
      await new Promise((resolve) => setTimeout(resolve, 100));

      document.getElementById(`${name}_gridValues`).selected = true;
    }
  };
  const handleGridGroupChange = async (event) => {
    const selectedGridGroup = event.target.value;
    setGridGroupName(selectedGridGroup);
    setLåstaNamn([]);

    if (selectedGridGroup === defaultGroup) {
      setRows(7);
      setColumns(7);
      setBoxNames("tom");
      setBoxes([]);
      setFilledBoxes([]);
      setCellSize(70);
      setFixaCounter(0);


      
    } else {
      const values = await readCookieValues(selectedGridGroup);
      if (values) {
        setColumns(values.columns);
        setRows(values.rows);
        setCellSize(values.cellSize);
        setFilledBoxes(values.filledBoxes);
        setKeyChange(values.keyChange);
        setLåstaNamn(values.låstaNamn || []);
      }

      var selectElement = document.getElementById("sparadeKlasser");
      selectElement.selectedIndex = 0;

    }
  };


  

  const handleRowsInputChange = (e) => {



    const value = e.target.value;
    console.log(value);

    if (value > 30) {

      setRowsInput(30);
      setRows(isNaN(30) || value === "" ? 0 : parseInt(30, 10));
      fixa();

    }

    else  {

    setRowsInput(value);
    setRows(isNaN(value) || value === "" ? 0 : parseInt(value, 10));
    fixa();
    }




  };

  const handleColumnsInputChange = (e) => {
    const value = e.target.value;

    if (value > 30)  {
      setColumnsInput(30);
      setColumns(isNaN(30) || value === "" ? 0 : parseInt(30, 10));
      fixa();
    }

    else{

      setColumnsInput(value);
      setColumns(isNaN(value) || value === "" ? 0 : parseInt(value, 10));
      fixa();

    }
    

  };
  const handleDrop = async (e) => {
    
    e.preventDefault();
    e.target.classList.remove("dragging");;
    let target = e.target;
    while (
      target &&
      !target.id.startsWith("box-") &&
      target !== e.currentTarget
    ) {
      target = target.parentNode;
    }

    if (!target || target === e.currentTarget) {
      console.log("Dropped on an invalid target");

      return;
    }
    if (e.dataTransfer.getData("namn")) {
      console.log(target.id);
      const newBoxNames = [];
      for (let i = 0; i < boxNames.length; i++) {
        if (boxNames[i].key != target.id) {
          newBoxNames.push(boxNames[i]);
        }
      }
      const key = target.id;
      const value = e.dataTransfer.getData("namn");
      newBoxNames.push({ key, value });
      if (!filledBoxes.includes(target.id)) {
        setFilledBoxes([...filledBoxes, target.id]);
      }
      setBoxNames(newBoxNames);
      setUpdateFixa(!updateFixa);
      return;
    }

    const draggedBoxId = JSON.parse(
      JSON.stringify(
        e.dataTransfer.getData("boxId").split("ny: ")[1].split("original")[0]
      )
    );
    const draggedBoxOriginalId = JSON.parse(
      JSON.stringify(e.dataTransfer.getData("boxId").split("original: ")[1])
    );
    const targetId = JSON.parse(JSON.stringify(target.id));
    const targetOriginalId = JSON.parse(
      JSON.stringify(target.getAttribute("data-originalid"))
    );
    console.log(`Box ${draggedBoxId} dropped on ${targetId}`);

    if (keyChange != "tom") {
      console.log("a");
      const keyChangeDeepCopy = JSON.parse(JSON.stringify(keyChange));
      const newKeyChange = [];
      for (let i = 0; i < keyChange.length; i++) {
        console.log(keyChange[i].key);
        if (
          keyChange[i].key != draggedBoxOriginalId &&
          keyChange[i].key != targetOriginalId
        ) {
          console.log(
            keyChange[i].key +
              "!=" +
              draggedBoxOriginalId +
              "&&" +
              keyChange[i].key +
              "!=" +
              targetOriginalId
          );
          newKeyChange.push(keyChange[i]);
          console.log(target);
        } else {
          console.log("togbort: " + keyChange[i].key);
        }
      }
      newKeyChange.push(
        {
          key: draggedBoxOriginalId,
          value: groupName === "schack" ? "box-T" : targetId,
        },
        {
          key: targetOriginalId,
          value: draggedBoxId,
        }
      );
      setKeyChange(newKeyChange);
    } else {
      console.log("första");
      setKeyChange([
        {
          key: draggedBoxOriginalId,
          value: targetId,
        },
        {
          key: targetOriginalId,
          value: draggedBoxId,
        },
      ]);
    }
    setUpdateFixa(!updateFixa);
    return;
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.preventDefault();
  };

  const generateGrid = () => {
    const gridItems = [];
    var x = baklänges;
    const startIndex = x ? rows * columns - 1 : 0;
    const endIndex = x ? -1 : rows * columns;
    const step = x ? -1 : 1;

    for (let i = startIndex; i !== endIndex; i += step) {
      const box = boxes[i] || { position: `${i + 1}`, name: "" };
      var toBeKey = `box-${i}`;
      if (findValueByKey(keyChange, `box-${i}`)) {
        toBeKey = findValueByKey(keyChange, `box-${i}`);
      }
      gridItems.push(
        <div
          key={`grid-item-${i}`}
          className="grid-item prevent-select"
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            outline:
              showBorders && groupName !== "schack"
                ? "1px solid black"
                : "none",
            outline:
              showBorders && groupName !== "schack"
                ? "1px solid black"
                : "none",
            boxSizing: "border-box",
          }}
        >
          {groupName === "schack" ? (
            <SchackBox
              key={toBeKey}
              originalid={`box-${i}`}
              id={toBeKey}
              position={box.position}
              boxes={boxes}
              setBoxes={setBoxes}
              name={box.name}
              boxNames={boxNames}
              updateFixa={updateFixa}
              setUpdateFixa={setUpdateFixa}
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
              setBoxNames={setBoxNames}
              showContextMenu={contextMenu.includes(`box-${i}`)}
              setContextMenu={setContextMenu}
              contextMenu={contextMenu}
              i={i}
            />
          ) : (
            <Box
              key={toBeKey}
              originalid={`box-${i}`}
              id={toBeKey}
              position={box.position}
              boxes={boxes}
              setBoxes={setBoxes}
              name={box.name}
              boxNames={boxNames}
              updateFixa={updateFixa}
              setUpdateFixa={setUpdateFixa}
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
              setBoxNames={setBoxNames}
              showContextMenu={contextMenu.includes(`box-${i}`)}
              setContextMenu={setContextMenu}
              contextMenu={contextMenu}
              editingMode={editingMode}
            />
          )}
        </div>
      );
    }

    return gridItems;
  };

  return (
    <div
      className="grid-outer-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      id="gridPdfSak"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0px",
      }}
    >
      
      <div
        style={{ display: "inline-block", width: "100%" }}
        className="helaGriden"
      >
        <div id="sparaGridContainer">{GridSparningsLösning}</div>
      <h1 id="placeringsTitel">{groupName}</h1>

        <div
          className="gridSize"
          style={{
            position: "relative",
            width: "710px",
            margin: "auto"
          }}
        >
          <div id="höjaDiv" className="storlekDiv">
            <button
              onClick={ökaStorlek}
              id="ökaStorlek"
              className="storlek"
            ></button>
            <label htmlFor="ökaStorlek">Öka storlek</label>
          </div>

          <label>Rader:</label>
          <input
            type="number"
            max="50"
            value={rowsInput}
            onChange={handleRowsInputChange}
            id="rader"
          />
          <label>Kolumner:</label>
          <input
            type="number"
            max="50"
            value={columnsInput}
            onChange={handleColumnsInputChange}
            id="kolumner"
          />
          <div id="minskaDiv" className="storlekDiv">
            <button
              className="storlek"
              onClick={minskaStorlek}
              id="minskaStorlek"
            ></button>
            <label htmlFor="minskaStorlek">Minska storlek</label>
          </div>
        </div>
      </div>

      <div className="infoDiven">
        {!filledBoxes[0] ? <h2 style={{ display: 'block' }}>Klicka på en ruta för att placera ut en bänk!</h2> : null}
      </div>
      <div id="ovanförGrid">
      
      <div id="kebabWrap" style={{left:"68%", marginBottom: "5px"}}>
            <div style={{ display: "block" }}>
              <select
                id="sparadeGridKlasser"
                defaultValue={groupName}
                onChange={handleGridGroupChange}
              >
                <option id="nyGridNamn" key="ny..." value={defaultGroup}>
                  {defaultGroup}
                </option>

                {JSON.parse(data).length > 0 &&
                  JSON.parse(data).map(
                    (item) => item &&
                      item.split(":")[0].endsWith("gridValues") && (
                        <option
                          id={item.split(":")[0]}
                          key={item.split(":")[0]}
                          value={item.split(":")[0]}
                        >
                          {item.split(":")[0].replace("_gridValues", "")}
                        </option>
                      )
                  )}
              </select>
              
            </div>
            
            

            <div style={{ display: "flex" }}>
              <button
                onClick={handleSaveGrid}
                className="sparaNamnKnapp"
                id="sparaNamnKnapp"
              >
                Spara klassrum
              </button>
              {gridGroupName !== defaultGroup && (
              <div className="raderaNamnKlassDiv">
              <button onMouseDown={raderaGrid} id="raderaNamnKlass">
              <RiDeleteBin6Line />
              </button>
              </div>
              )}
              
              {
                //{
                //(nameGroupName === defaultGroup)
                //? ''
                //: (
                //<div className='sparaNamnSomNyDiv'>
                //<button onMouseDown={sparaNamnSomNy} id='sparaNamnSomNy'>Spara som ny</button>
                // </div>
                //)
                //}
              }
            </div>
          </div>
          </div>
          
          <span id="uppe">{uppe}</span>

      <div
        id="grid"
        className={`grid-container ${
          groupName === "schack" ? "schackBräde" : ""
        }`}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: groupName === "schack" ? "0px" : "10px",
          width: `${
            groupName === "schack"
              ? columns * cellSize
              : columns * cellSize + (columns - 1) * 10
          }px`,
          width: `${
            groupName === "schack"
              ? columns * cellSize
              : columns * cellSize + (columns - 1) * 10
          }px`,
        }}
      >
        {generateGrid()}
      </div>

      <p id="nere">{nere}</p>
    </div>
  );
};

export default Grid;
