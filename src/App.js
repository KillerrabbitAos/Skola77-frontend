import React, { useState, useEffect } from "react";
import "./App.css";
import Grid from "./Grid";
import Cookies from "js-cookie";
import ExcelToTextConverter from "./ExcelToTextConverter";
import generateCombinedList from "./CombinedListGenerator";
import NameList from "./Namn";
import LZString from "lz-string";
import { useCookies } from "react-cookie";
import { papperskorg } from "./papperskorg";
import doneImg from "./done.svg";
import backImg from "./back.png";
import schackBräde from "./schackVärden.js";
import { isTablet } from "react-device-detect";
import { RiDeleteBin6Line } from "react-icons/ri";

function compressData(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

function orm() {
  //bästa funktionen 2024
  alert(orm);
}

// Function to decompress data retrieved from cookies
function decompressData(compressedData) {
  return JSON.parse(LZString.decompressFromEncodedURIComponent(compressedData));
}

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

const App = () => {
  const [groupName, setGroupName] = useState("ny...");
  const [keyChange, setKeyChange] = useState("tom");
  const [rows, setRows] = useState(7);
  const [columns, setColumns] = useState(9);
  const [boxes, setBoxes] = useState([]);
  const [names, setNames] = useState([""]);
  const [boxNames, setBoxNames] = useState("tom");
  const [filledBoxes, setFilledBoxes] = useState([]);
  const [cellSize, setCellSize] = useState(isTablet ? 85 : 70);
  const [fixaCounter, setFixaCounter] = useState(0);
  const [baklänges, setBaklänges] = useState(false);
  const defaultGroup = "ny...";
  const [rowsInput, setRowsInput] = useState("7");
  const [columnsInput, setColumnsInput] = useState("7");
  const [nere, setNere] = useState("Bak");
  const [uppe, setUppe] = useState("Tavla");
  const [clicked, setClicked] = useState(false);
  const [dummyState, setDummyState] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [bytaPlatser, setBytaPlatser] = useState(false);
  const [showBorders, setShowBorders] = useState(true);
  const [editingMode, setEditingMode] = useState(true);
  const [knappStatus, setKnappStatus] = useState(true);
  const [låstaNamn, setLåstaNamn] = useState([]);
  const [updateFixa, setUpdateFixa] = useState(false);
  const [namnRader, setNamnRader] = useState(
    (window.screen.width / 260).toFixed(0)
  );
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [runFixa, setRunFixa] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [nameGroupName, setNameGroupName] = useState(defaultGroup);

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };
  useEffect(() => {
    fixa();
  }, [cellSize]);

  const handleRowsInputChange = (e) => {
    const value = e.target.value;
    setRowsInput(value);
    setRows(isNaN(value) || value === "" ? 0 : parseInt(value, 10));
    fixa();
  };

  const handleColumnsInputChange = (e) => {
    const value = e.target.value;
    setColumnsInput(value);
    setColumns(isNaN(value) || value === "" ? 0 : parseInt(value, 10));
    fixa();
  };

  const ändraPerspektiv = () => {
    setBaklänges(!baklänges);
    if (!baklänges) {
      setNere("Tavla");
      setUppe("Bak");
    } else {
      setNere("Bak");
      setUppe("Tavla");
    }
  };
  const handleSaveNames = async () => {
    if (groupName !== defaultGroup) {
      const compressedData = compressData({
        names,
      });

      Cookies.set(`${groupName}_nameValues`, compressedData, { expires: 365 });

      setShowSavedMessage(true);
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 2000);
    } else {
      const name = prompt("Döp din klass: ");
      if (name) {
        setNameGroupName(name);

        const compressedData = compressData({
          names,
        });

        Cookies.set(`${name}_nameValues`, compressedData, { expires: 365 });
        await new Promise((resolve) => setTimeout(resolve, 100));

        document.getElementById(`${name}_nameValues`).selected = true;
      }
    }
  };

  const handleSaveButtonClick = async () => {
    if (groupName !== defaultGroup) {
      const compressedData = compressData({
        rows,
        columns,
        boxes,
        names,
        boxNames,
        filledBoxes,
        cellSize,
        fixaCounter,
        keyChange,
        låstaNamn,
      });

      Cookies.set(`${groupName}_values`, compressedData, { expires: 365 });

      setShowSavedMessage(true);
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 2000);
    } else {
      const name = prompt("Döp din placering: ");
      if (name) {
        setGroupName(name);

        const compressedData = compressData({
          rows,
          columns,
          boxes,
          names,
          boxNames,
          filledBoxes,
          cellSize,
          fixaCounter,
          keyChange,
          låstaNamn,
        });

        Cookies.set(`${name}_values`, compressedData, { expires: 365 });
        await new Promise((resolve) => setTimeout(resolve, 100));

        document.getElementById(`${name}_values`).selected = true;
      }
    }
  };

  const sparaSomNy = async () => {
    const name = prompt("Döp din placering: ");
    if (name) {
      setGroupName(name);

      const compressedData = compressData({
        rows: rows,
        columns: columns,
        boxes: boxes,
        names: names,
        boxNames: boxNames,
        filledBoxes: filledBoxes,
        cellSize: cellSize,
        fixaCounter: fixaCounter,
        keyChange: keyChange,
        låstaNamn: låstaNamn,
      });

      Cookies.set(`${name}_values`, compressedData, { expires: 365 });
      await new Promise((resolve) => setTimeout(resolve, 10));

      document.getElementById(`${name}_values`).selected = true;
    }
  };
  const sparaNamnSomNy = async () => {
    const name = prompt("Döp din klass: ");
    if (name) {
      setGroupName(name);

      const compressedData = compressData({
        names,
      });

      Cookies.set(`${name}_nameValues`, compressedData, { expires: 365 });
      await new Promise((resolve) => setTimeout(resolve, 10));

      document.getElementById(`${name}_nameValues`).selected = true;
    }
  };

  const raderaKlass = () => {
    setGroupName(defaultGroup);
    document.getElementById("nyKlass").selected = true;
    const klassAttRadera = `${encodeURI(groupName)}_values`;
    removeCookie(klassAttRadera);
  };

  const raderaNamnKlass = () => {
    setNameGroupName(defaultGroup);
    document.getElementById("nyKlassNamn").selected = true;
    const klassAttRadera = `${encodeURI(nameGroupName)}`;
    removeCookie(klassAttRadera);
    setNames([""]);
  };

  function applyFontSizesToClass(className) {
    const elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const container = element.parentElement;

      fitTextToContainer(container, element, 25);
    }
  }

  const readCookieValues = (group) => {
    // Läser värden från cookie
    const cookieName = `${group}`;
    console.log("Attempting to get cookie:", cookieName);

    if (!Cookies.get(cookieName)) {
      console.log(`${cookieName} cookie does not exist.`);
      return {};
    }

    const compressedData = Cookies.get(cookieName);
    console.log("Cookie values string:", compressedData);

    try {
      const values = decompressData(compressedData);
      fixa();
      return values || {};
    } catch (error) {
      console.error("Error parsing cookie values:", error);
      return {};
    }
  };

  const handleRemoveName = (index) => {
    console.log(index);
    const updatedNames = [...names];
    updatedNames[index] = "";

    setNames(updatedNames);

    // Update the 'boxNames' array with the 'value' property replaced with 0 for matching items
    if (boxNames !== "tom") {
      const removedName = index;
      const newArray = boxNames.map((item) => {
        if (item.value === removedName) {
          return { ...item, value: 0 };
        } else {
          return item;
        }
      });

      setBoxNames(newArray);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMassImportNames = () => {
    const textarea = document.getElementById("namesInput");
    const textareaContent = textarea.value
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    setNames((prevNames) => [...prevNames, ...textareaContent]);
    textarea.value = "";
  };

  const handleRedigeringKlick = () => {
    setBytaPlatser(bytaPlatser != true);
    setKnappStatus(!knappStatus);
  };

  const toggleBorders = () => {
    setShowBorders(!showBorders);
    setEditingMode(!editingMode);
  };

  const ökaStorlek = () => {
    if (cellSize >= 150) {
      console.log("för stor:" + cellSize);

      return;
    }

    setCellSize(cellSize + 10);
    console.log(cellSize);
  };

  const minskaStorlek = () => {
    if (cellSize <= 60) {
      console.log("för liten:" + cellSize);
      return;
    }

    setCellSize(cellSize - 10);
    console.log(cellSize);
  };

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
  const firstConstantFunction = async () => {
    const namesList = names;
    setBoxNames(
      generateCombinedList(
        filledBoxes,
        names,
        0,
        namesList,
        låstaNamn,
        boxNames
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
  };

  const handleMixNames = async () => {
    // Call the first constant function and wait for it to complete
    await firstConstantFunction();

    // Once the first function completes, call the second one
    fixa();
  };
  const handleGroupChange = async (event) => {
    const selectedGroup = event.target.value;
    setGroupName(selectedGroup);
    // Om den valda gruppen är standardgruppen, sätt standardvärden
    if (selectedGroup === defaultGroup) {
      setRows(7);
      setColumns(7);
      setBoxNames("tom");
      setBoxes([]);
      setNames([""]);
      setFilledBoxes([]);
      setCellSize(70);
      setFixaCounter(0);
      setLåstaNamn([]);
    } else {
      var values = schackBräde;
      nere = "Svart";
      uppe = "Vit";

      console.log(schackBräde);
      if (selectedGroup !== "schack") {
        var uppe = "Tavla";
        var nere = "Bak";
        values = readCookieValues(selectedGroup);
      }
      console.log(values);
      if (values) {
        setRows(values.rows || 0);
        setColumns(values.columns || 0);
        setBoxNames(values.boxNames || []);
        setBoxes(values.boxes || []);
        setNames(values.names || []);
        setFilledBoxes(values.filledBoxes || []);
        setCellSize(values.cellSize || 0);
        setFixaCounter(values.fixaCounter || 0);
        setKeyChange(values.keyChange);
        // Uppdatera groupName när en grupp väljs
        setGroupName(selectedGroup.replace("_values", ""));
        setUppe(uppe);
        setNere(nere);
        setLåstaNamn(values.låstaNamn || []);
      } else {
        // Handle the case when values are not available
        console.error(`No values found for group: ${selectedGroup}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
      fixa();
    }
  };

  const handleNameGroupChange = (event) => {
    const selectedNameGroup = event.target.value;
    setNameGroupName(selectedNameGroup);
    if (selectedNameGroup === defaultGroup) {
      setNames([""]);
    } else {
      const values = readCookieValues(selectedNameGroup);
      if (values) {
        setNames(values.names);
      }
    }
  };

  const gridConf = (
    <div className="gridInstallning" id="kebaben">
      <p>Namnimport</p>
      <textarea
        id="namesInput"
        rows="10"
        cols="30"
        placeholder="Ett namn per rad"
      ></textarea>
      <button onClick={handleMassImportNames}>Spara namn</button>
      <ExcelToTextConverter setNames={setNames} names={names} />
    </div>
  );
  const grid = (
    <Grid
      rows={rows}
      columns={columns}
      boxes={boxes}
      setBoxes={setBoxes}
      names={names}
      boxNames={boxNames}
      setBoxNames={setBoxNames}
      filledBoxes={filledBoxes}
      setFilledBoxes={setFilledBoxes}
      cellSize={cellSize}
      setCellSize={setCellSize}
      baklänges={baklänges}
      uppe={uppe}
      nere={nere}
      keyChange={keyChange}
      setKeyChange={setKeyChange}
      bytaPlatser={bytaPlatser}
      setBytaPlatser={setBytaPlatser}
      setKnappStatus={setKnappStatus}
      knappStatus={knappStatus}
      setEditingMode={setEditingMode}
      editingMode={editingMode}
      setShowBorders={setShowBorders}
      showBorders={showBorders}
      fixa={fixa}
      groupName={groupName}
      låstaNamn={låstaNamn}
      setLåstaNamn={setLåstaNamn}
      updateFixa={updateFixa}
      setUpdateFixa={setUpdateFixa}
    />
  );
  const sparningsLösning = (
    <div id="sparaSettings">
      {showSavedMessage && (
        <div>
          <b>Sparat!</b>
        </div>
      )}

      <button
        onClick={handleSaveButtonClick}
        className="spara"
        id="sparaKnapp"
      ></button>
      <label htmlFor="sparaKnapp">Spara!</label>

      <label>Sparade klasser:</label>
      <select
        id="sparadeKlasser"
        defaultValue={groupName}
        onChange={handleGroupChange}
      >
        <option id="nyKlass" key="ny..." value={defaultGroup}>
          {defaultGroup}
        </option>
        {names.includes("schack") && (
          <option id="schack" key="schack" value={"schack"}>
            schack
          </option>
        )}
        {/* Lista alla grupper som finns sparade i cookies */}

        {Object.keys(Cookies.get()).length > 0 &&
          Object.keys(Cookies.get()).map(
            (cookieName) =>
              cookieName.endsWith("_values") && (
                <option id={cookieName} key={cookieName} value={cookieName}>
                  {cookieName.replace("_values", "")}
                </option>
              )
          )}
      </select>

      <div className="sparaKnappar">
        {groupName === defaultGroup ? (
          ""
        ) : (
          <div className="raderaKlassDiv">
            <button onMouseDown={raderaKlass} id="raderaKlass"></button>
            <label htmlFor="raderaKlass">Radera Klass</label>
          </div>
        )}

        {groupName === defaultGroup ? (
          ""
        ) : (
          <div className="sparaSomNyDiv">
            <button onMouseDown={sparaSomNy} id="sparaSomNy"></button>
            <label htmlFor="sparaSomNy">Spara som ny</label>
          </div>
        )}
      </div>
    </div>
  );
  const NamnSparningsLösning = (
    <div id="sparaNamnSettings">
      <div style={{ display: "block", width: "100%", height: "35px" }}>
        <div id="yberKebab">
          {showSavedMessage && (
            <div>
              <b>Sparat!</b>
            </div>
          )}
          <div id="kebabWrap">
            <div style={{ display: "block" }}>
              <select
                id="sparadeNamnKlasser"
                defaultValue={groupName}
                onChange={handleNameGroupChange}
              >
                <option id="nyKlassNamn" key="ny..." value={defaultGroup}>
                  {defaultGroup}
                </option>
                {/* Lista alla grupper som finns sparade i cookies */}

                {Object.keys(Cookies.get()).length > 0 &&
                  Object.keys(Cookies.get()).map(
                    (cookieName) =>
                      cookieName.endsWith("nameValues") && (
                        <option
                          id={cookieName}
                          key={cookieName}
                          value={cookieName}
                        >
                          {cookieName.replace("_nameValues", "")}
                        </option>
                      )
                  )}
              </select>
            </div>
            <div style={{ display: "flex" }}>
              <button
                onClick={handleSaveNames}
                className="sparaNamnKnapp"
                id="sparaNamnKnapp"
              >
                spara
              </button>
              {nameGroupName === defaultGroup ? (
                ""
              ) : (
                <div className="raderaNamnKlassDiv">
                  <button onMouseDown={raderaNamnKlass} id="raderaNamnKlass">
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

          <div className="sparaKnappar"></div>
        </div>
      </div>
    </div>
  );
  useEffect(() => {
    fixa();
    setTimeout(() => {
      console.log("fixade igen");
      fixa();
    }, 10);
    console.log("fixade");
  }, [updateFixa, cellSize]);
  useEffect(() => {
    fixa();
  });

  useEffect(() => {
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);
  useEffect(() => {
    setNamnRader(
      (
        document.getElementById("bräddMått").getBoundingClientRect().width / 260
      ).toFixed(0)
    );
    while (
      !document.getElementById("bräddMått").getBoundingClientRect().width
    ) {
      setNamnRader(
        document.getElementById("bräddMått").getBoundingClientRect().width / 260
      ).toFixed(0);
    }
  }, [windowWidth]);

  return (
    <div className="App">
      <div id="bräddMått"></div>
      <div className="gridInstallning">
        <label>Rader:</label>
        <input
          type="number"
          max="50"
          value={rowsInput}
          onChange={handleRowsInputChange}
        />
        <label>Kolumner:</label>
        <input
          type="number"
          max="50"
          value={columnsInput}
          onChange={handleColumnsInputChange}
        />

        <div className="storkleksÄndring">
          <div className="ökaStorlekDiv">
            <button
              onClick={ökaStorlek}
              id="ökaStorlek"
              className="grönaKnappar"
            ></button>
            <label htmlFor="ökaStorlek">Öka Storlek</label>
          </div>

          <div className="minskaStorlekDiv">
            <button onClick={minskaStorlek} id="minskaStorlek"></button>
            <label htmlFor="minskaStorlek">Minska storlek</label>
          </div>
        </div>
      </div>

      {sparningsLösning}

      <div id="gridMedAnnat">
        <div id="pdfDiv">
          <button id="pdfKnapp" onClick={handlePrint}></button>
          <label id="pdfLabel" htmlFor="pdfKnapp">
            Skriv ut
          </label>
        </div>

        {grid}
        <div id="meny">
          <div id="redigeringsDiv" className="menySaker"></div>
          <div id="klarDiv" className="menySaker">
            <button
              id="klar"
              onClick={toggleBorders}
              style={{
                backgroundImage: editingMode
                  ? `url(${doneImg})`
                  : `url(${backImg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: "50px",
                border: "none",
                cursor: "pointer",
              }}
            ></button>
            <label id="klarLabel" htmlFor="klar">
              {editingMode ? "Klar" : "Fortsätt redigera"}
            </label>
          </div>

          <div id="perspektivDiv" className="menySaker">
            <button id="perspektiv" onClick={ändraPerspektiv}></button>
            <label id="perspektivLabel" htmlFor="perspektiv">
              Byt perspektiv
            </label>
          </div>

          <div className="menySaker" id="slumpaDiv">
            <button onClick={handleMixNames} id="slumpaKnappen"></button>
            <label id="slumpaLabel" htmlFor="slumpaKnappen">
              Slumpa
            </label>
          </div>
        </div>
      </div>
      {gridConf}
      <div>
        <p id="nameHeader">Namn:</p>
        {NamnSparningsLösning}
        <div id="namn">
          <NameList
            names={names}
            handleRemoveName={handleRemoveName}
            setBoxNames={setBoxNames}
            låstaNamn={låstaNamn}
            setLåstaNamn={setLåstaNamn}
            namnRader={namnRader}
          ></NameList>
        </div>
      </div>
      <p>
        <a id="mailTag" href="https://skola77.com">
          Startsida
        </a>
      </p>
    </div>
  );
};

export default App;
