import React, { useState, useEffect } from "react";
import Namn from "./ettNamn";
import ExcelToTextConverter from "./ExcelToTextConverter";
import "./styles.css";

const data = JSON.parse(
  '{"grid":[[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395558391","person":1},{"id":"item-1728395558639","person":1}],[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395560144","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395557488","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}],[{"id":"item-1728395563304","person":1},{"id":"item-1728395562912","person":1},{"id":"item-1728395557831","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":"item-1728395562504","person":1},{"id":"item-1728395559832","person":1}],[{"id":null,"person":0},{"id":"item-1728395561288","person":1},{"id":"item-1728395560888","person":1},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0},{"id":null,"person":0}]],"cols":7,"rows":6,"names":["","Ben","kol"]}'
);
function fitTextToContainer(container, element, maxFontSizePx) {
  for (let i = 0; i < 20; i++) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const widthScale = containerWidth / elementWidth;
    const heightScale = containerHeight / elementHeight;

    const minScale = Math.min(widthScale, heightScale);

    const currentFontSize = window.getComputedStyle(element).fontSize;
    let newFontSize = parseFloat(currentFontSize) * minScale;

    newFontSize = Math.min(newFontSize, maxFontSizePx);

    element.style.fontSize = newFontSize + "px";

    const scaledElementWidth = element.offsetWidth * minScale;
    const scaledElementHeight = element.offsetHeight * minScale;

    const offsetX = (containerWidth - scaledElementWidth) / 2;
    const offsetY = (containerHeight - scaledElementHeight) / 2;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
}
const NameList = () => {
  const [låstaNamn, setLåstaNamn] = useState([]);
  const [names, setNames] = useState([""]);
  const [columns, setColumns] = useState(3);
  const [efternamnStarForst, setEfternamnStarForst] = useState(true);

  const handleRemoveName = (index) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
  };
  function applyFontSizesToClass(className) {
    const elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const container = element.parentElement;

      fitTextToContainer(container, element, 25);
    }
  }
  const fixa = () => {
    applyFontSizesToClass("name");
    //const elements = document.getElementsByClassName('namnTxt')
    //for (let i = 0; i < elements.length; i++) {
    //const element = elements[i];
    // console.log(element)
    // const container = element.parentElement;
    // const containerWidth = container.clientWidth;
    //const elementWidth = element.offsetWidth;
    // console.log(elementWidth)
    // console.log(containerWidth)
    // if (elementWidth > containerWidth){
    //// fitTextToContainer(container, element);
    // }
    // }
  };
  const läggTillNamn = () => {
    const textarea = document.getElementById("namesInput");
    const textareaContent = textarea.value
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    setNames((prevNames) => [...prevNames, ...textareaContent]);
    textarea.value = "";
  };
  const taBortEfternamn = () => {
    if (efternamnStarForst) {
      setNames((förraNamn) =>
        förraNamn.map((namn) => namn.split(" ").slice(-1)[0])
      );
    } else {
      setNames((förraNamn) => förraNamn.map((namn) => namn.split(" ")[0]));
    }
    console.log("keb");
    fixa();
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newColumns = Math.floor(width / 260);
      setColumns(Math.max(newColumns, 1));
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedNamesWithIndex = names
    .map((name, index) => ({ name, originalIndex: index }))
    .filter(({ name }) => name !== "")
    .sort((a, b) => a.name.localeCompare(b.name));

  const columnSize = Math.ceil(sortedNamesWithIndex.length / columns);

  const columnsArray = Array.from({ length: columns }, (_, columnIndex) =>
    sortedNamesWithIndex.slice(
      columnIndex * columnSize,
      (columnIndex + 1) * columnSize
    )
  );
  const andraCheckboxvarde = (e) => setEfternamnStarForst(e.target.checked);
  return (
    <div className="container">
      <div className="inputSection">
        <textarea
          id="namesInput"
          rows="10"
          cols="30"
          placeholder="Ett namn per rad"
        ></textarea>

        <div className="addButtonSection">
          <button className="addButton" onClick={läggTillNamn}>
            Lägg till...
          </button>
        </div>
        
        <div>
          <button
            onClick={taBortEfternamn}
            className="sparaNamnKnapp2"
            id="sparaNamnKnapp2"
          >
            Ta bort efternamn
          </button>
          
          <label>
            <input
                id="efternamnStarForst"
                type="checkbox"
                defaultChecked={true}
                onChange={andraCheckboxvarde}
                style={{ display: 'none' }} // Hide the default checkbox
            />
            <span className="custom-checkbox"></span>
        </label>
        </div>

        <div className="excelSection">
          <ExcelToTextConverter setNames={setNames} names={names} />
        </div>
      </div>

      <div className="nameList">
        {columnsArray.map((column, columnIndex) => (
          <div key={columnIndex} className="column">
            <ul style={{ listStyleType: "none" }}>
              {column.map(({ name, originalIndex }) => (
                <Namn
                  key={originalIndex}
                  name={name}
                  originalIndex={originalIndex}
                  handleRemoveName={handleRemoveName}
                  låstaNamn={låstaNamn}
                  setLåstaNamn={setLåstaNamn}
                  names={names}
                  setNames={setNames}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NameList;
