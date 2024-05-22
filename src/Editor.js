import Cookies from "js-cookie";
import LZString from "lz-string";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { isTablet } from "react-device-detect";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./App.css";

import generateCombinedList from "./CombinedListGenerator.js";
import ExcelToTextConverter from "./ExcelToTextConverter.js";
import Grid from "./Grid.js";
import NameList from "./Namn.js";

import backImg from "./back.png";
import doneImg from "./done.svg";
import schackBräde from "./schackVärden.js";
import { set } from "react-ga";
import { IoIosArrowRoundDown, IoIosArrowRoundForward } from "react-icons/io";
import { IoIosArrowDropright, IoIosArrowDropdownCircle } from "react-icons/io";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import DownloadJSON from "./laddaNed.js";
import Namn from "./ettNamn.js";

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

const Editor = () => {
  const [groupName, setGroupName] = useState("ny...");
  const [keyChange, setKeyChange] = useState("tom");
  const [rows, setRows] = useState(8);
  const [columns, setColumns] = useState(9);
  const [boxes, setBoxes] = useState([]);
  const [names, setNames] = useState([""]);
  const [boxNames, setBoxNames] = useState("tom");
  const [filledBoxes, setFilledBoxes] = useState([]);
  const [cellSize, setCellSize] = useState(isTablet ? 70 : 70);
  const [fixaCounter, setFixaCounter] = useState(0);
  const [baklänges, setBaklänges] = useState(false);
  const defaultGroup = "ny...";
  const [rowsInput, setRowsInput] = useState("8");
  const [columnsInput, setColumnsInput] = useState("9");
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
  const [gridGroupName, setGridGroupName] = useState(defaultGroup);
  const [visaNamn, setVisaNamn] = useState(true);
  const [oldFilledBoxes, setOldBoxes] = useState("");

  const [backup1, setBackup1] = useState();

  let baconBurger = false;
  let cheeseBurger = false;

  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  };
  useEffect(() => {
    fixa();
  }, [cellSize]);

  const ändraPerspektiv = () => {
    setBaklänges(!baklänges);
    if (!baklänges) {
      setNere("Tavla");
      setUppe("Bak");
    } else {
      setNere("Bak");
      setUppe("Tavla");
    }
    if ((groupName = "schack")) {
      if (!baklänges) {
        setNere("Vit");
        setUppe("Svart");
      } else {
        setNere("Svart");
        setUppe("Vit");
      }
    }
  };
  const handleSaveNames = async () => {
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
  };

  const handleSaveButtonClick = async () => {
    let finalGroupName = groupName;

    if (
      groupName == defaultGroup &&
      gridGroupName !== defaultGroup &&
      nameGroupName !== defaultGroup
    ) {
      baconBurger = true;

      const finNameGroupName = nameGroupName.replace("_nameValues", "");
      const finGridGroupName = gridGroupName.replace("_gridValues", "");

      finalGroupName = finNameGroupName + " i " + finGridGroupName;
      setGroupName(finalGroupName);
      cheeseBurger = true;
    }

    if (cheeseBurger == true) {
      cheeseBurger = false;

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

      Cookies.set(`${finalGroupName}_values`, compressedData, { expires: 365 });

      setShowSavedMessage(true);
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 2000);

      document.getElementById(`${finalGroupName}_values`).selected = true;
    }

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
      if (baconBurger == true) {
        baconBurger = false;
        return;
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
    }
  };

  function useBeforeUnload(message) {
    useEffect(() => {
      const handler = (event) => {
        event.preventDefault();
        event.returnValue = message;
        return message;
      };
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }, [message]);
  }

  useBeforeUnload(
    "Är du säker på att du vill lämna sidan? Eventuella osparade ändringar kan gå förlorade."
  );

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
  const raderaGrid = () => {
    setGridGroupName(defaultGroup);
    document.getElementById("nyGridNamn").selected = true;
    const klassAttRadera = `${encodeURI(gridGroupName)}`;
    removeCookie(klassAttRadera);
    setColumns(9);
    setRows(9);
    setCellSize(70);
    setBoxNames("tom");
    setBoxes([]);
    setFilledBoxes([]);
    setCellSize(70);
    setFixaCounter(0);
    setLåstaNamn([]);
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
    updatedNames.splice(index, 1);
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
    let antalRiktigaNamn = names.length - 1;
    let realLåstaNamn = låstaNamn.filter((item) => !isNaN(item));
    let låstaBoxar = låstaNamn.filter(
      (item) => typeof item === "string" && item.startsWith("box")
    );

    let antalFåBänkar =
      antalRiktigaNamn -
      realLåstaNamn.length -
      (filledBoxes.length - låstaBoxar.length);

    if (filledBoxes.length == 0) {
      alert("Klicka på en ruta för att placera ut en bänk!");
    } else if (
      antalRiktigaNamn - realLåstaNamn >
      filledBoxes.length - låstaBoxar.length
    ) {
      if (oldFilledBoxes == filledBoxes) {
      } else {
        const confirmResult = window.confirm(
          "Du har för få bänkar utsatta för att få plats med alla namn. Du har " +
            antalFåBänkar +
            " bänk/bänkar för lite. Vill du fortsätta utan att placera alla namn?"
        );
        if (confirmResult) {
          setOldBoxes(filledBoxes);
        } else {
          return;
        }
      }
    }

    await firstConstantFunction();
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
      var selectElement = document.getElementById("sparadeNamnKlasser");
      selectElement.selectedIndex = 0;
      var selectElement = document.getElementById("sparadeGridKlasser");
      selectElement.selectedIndex = 0;

      setNameGroupName(defaultGroup);
      setGridGroupName(defaultGroup);
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

      var selectElement = document.getElementById("sparadeNamnKlasser");
      selectElement.selectedIndex = 0;
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
    <div className="namnFält" id="kebaben">
      <p>Namnimport</p>
      <textarea
        id="namesInput"
        rows="10"
        cols="30"
        placeholder="Ett namn per rad"
      ></textarea>
      <button
        style={{ fontWeight: "bolder", fontSize: "20px" }}
        onClick={handleMassImportNames}
      >
        Lägg till...
      </button>
      <ExcelToTextConverter setNames={setNames} names={names} />
    </div>
  );
  const GridSparningsLösning = (
    <div id="sparaNamnSettings">
      <div style={{ display: "block", width: "100%", height: "35px" }}>
        <div id="yberKebabGrid">
          <div className="sparaKnappar"></div>
        </div>
      </div>
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
      GridSparningsLösning={GridSparningsLösning}
      setRowsInput={setRowsInput}
      rowsInput={rowsInput}
      setColumnsInput={setColumnsInput}
      columnsInput={columnsInput}
      setRows={setRows}
      setColumns={setColumns}
      setGridGroupName={setGridGroupName}
      gridGroupName={gridGroupName}
      readCookieValues={readCookieValues}
      setFixaCounter={setFixaCounter}
      defaultGroup={defaultGroup}
      raderaGrid={raderaGrid}
    />
  );
  const taBortEfternamn = () => {
    const efternamnStårFörst = false
    if (efternamnStårFörst){
     setNames(förraNamn => förraNamn.map((namn) => namn = namn.split(" ")[1]))
    }else{
      setNames(förraNamn => förraNamn.map((namn) => namn = namn.split(" ")[0]))
    }
    console.log("keb")
    fixa();
  };
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

      <label>Sparade bordsplaceringar:</label>
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

  const handleToggleNamn = () => {
    setVisaNamn(!visaNamn);
  };
  const NamnSparningsLösning = (
    <div id="sparaNamnSettings">
      <div style={{ display: "block", width: "100%", height: "35px" }}></div>
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
    <div className="App prevent-select">
      <div id="bräddMått"></div>

      <div className="gridInstallning">
        {Cookies.get && (
          <DownloadJSON
            data={JSON.stringify(
              Object.keys(Cookies.get()).map((cookieName) => {
                if (
                  cookieName.endsWith("_values") ||
                  cookieName.endsWith("_gridValues") ||
                  cookieName.endsWith("_nameValues")
                ) {
                  return `${cookieName}:${Cookies.get(cookieName)}`;
                }
              })
            )}
            fileName={`backup skola77`}
          />
        )}
        {sparningsLösning}
      </div>

      <div id="gridMedAnnat">
        <div id="pdfDiv">
          <button id="pdfKnapp" onClick={handlePrint}></button>
          <label id="pdfLabel" htmlFor="pdfKnapp">
            Skriv ut
          </label>

          <p id="pdfInfo"></p>
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
            <GiPerspectiveDiceSixFacesRandom
              style={{ height: "80px", width: "auto" }}
              onClick={handleMixNames}
              id="slumpaKnappen"
            />
            <label
              className="prevent-select"
              id="slumpaLabel"
              htmlFor="slumpaKnappen"
            >
              Slumpa
            </label>
          </div>
        </div>
      </div>

      {gridConf}
      <div>
        <p id="nameHeader" className="prevent-select">
          {nameGroupName.split("_nameValues")[0]}
          {visaNamn ? (
            <IoIosArrowDropdownCircle
              className="pil"
              onClick={handleToggleNamn}
            />
          ) : (
            <IoIosArrowDropright className="pil" onClick={handleToggleNamn} />
          )}
        </p>

        <div id="yberKebab">
          
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
                className="sparaNamnKnapp2"
                id="sparaNamnKnapp2"
              >
                spara klass
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
              <button onClick={taBortEfternamn} className="sparaNamnKnapp2" id="sparaNamnKnapp2">Ta bort efternamn</button>
            </div>
          </div>

          <div className="sparaKnappar"></div>
        </div>

        {NamnSparningsLösning}
        <div id="namn">
          <NameList
            visaNamn={visaNamn}
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

export default Editor;
