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

import backImg from "./imgs/back.png";
import doneImg from "./imgs/done.svg";
import schackBräde from "./schackVärden.js";
import { set } from "react-ga";
import { IoIosArrowRoundDown, IoIosArrowRoundForward } from "react-icons/io";
import { IoIosArrowDropright, IoIosArrowDropdownCircle } from "react-icons/io";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import DownloadJSON from "./laddaNed.js";
import Namn from "./ettNamn.js";
import { write } from "xlsx";

function compressData(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

function orm() {
  //bästa funktionen 2024
  alert("orm");
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
  const [loading, setLoading] = useState(true);
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
  const [data, setData] = useState(null);
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
  const [efternamnStarForst, setEfternamnStarForst] = useState(true)
  const [userData, setUserData] = useState()
  const [backup1, setBackup1] = useState();
  const [error, setError] = useState(null);
  async function checkLoginStatus() {
    const response = await fetch('https://192.168.50.10:3005/home', {
      credentials: 'include'
    });

    const result = await response.json();

    if (result.loggedin) {
      const userDataString = result.data;
      setData(userDataString);
      return userDataString;
    }
    return null;
  }
  const waitForValidData = async (maxRetries = 2) => {
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < maxRetries) {
      attempts++;
      try {
        // Start loading
        setLoading(true);

        const data = await checkLoginStatus(); // Await the result of checkLoginStatus
        console.log("Fetched data:", data); // Log fetched data

        // Check if data can be split correctly
        const splitData = data.split(":");
        if (splitData) { // Ensure it splits into two parts
          console.log("Data is valid:", splitData);
          isValid = true; // Set flag to true if data is valid
        } else {
          console.log("Data is invalid, retrying...");
        }
      } catch (error) {
        console.log("Error fetching data:", error);
        setError(error); // Set error if it occurs
      } finally {
        // End loading

      }

      // Wait before the next attempt if not valid yet
      if (!isValid) {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Delay of 1 second
      }
      else {
        setLoading(false);
      }
    }

    if (!isValid) {
      console.log("Max retries reached. Exiting.");
      setError("Max retries reached. Unable to fetch valid data.");
      window.location.href = "http://localhost:3000/login.html"
    }
  };

  useEffect(() => {
    waitForValidData(); // Call the function when the component mounts
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }
  let baconBurger = false;
  let cheeseBurger = false;




  const ändraPerspektiv = () => {
    setBaklänges(!baklänges);
    if (!baklänges) {
      setNere("Tavla");
      setUppe("Bak");
    } else {
      setNere("Bak");
      setUppe("Tavla");
    }
    if ((groupName == "schack")) {
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
      let klassAttRadera = `${name}_nameValues`
      let loggedInData = JSON.parse(data)
      loggedInData = loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':'))
      loggedInData.push(`${name}_nameValues` + ":" + compressedData)
      const newData = JSON.stringify(loggedInData)
      const response = await fetch('https://192.168.50.10:3005/updateData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData }),
        credentials: 'include'
      });
      setData(newData)
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

      let klassAttRadera = `${finalGroupName}_values`
      let loggedInData = JSON.parse(data)
      loggedInData = loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':'))
      loggedInData.push(`${finalGroupName}_values` + ":" + compressedData)
      const newData = JSON.stringify(loggedInData)

      const response = await fetch('https://192.168.50.10:3005/updateData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData }),
        credentials: 'include'
      });
      setData(newData)

      setShowSavedMessage(true);
      setTimeout(() => {
        setShowSavedMessage(false);
      }, 2000);
      await new Promise((resolve) => setTimeout(resolve, 100));
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
      let klassAttRadera = `${groupName}_values`
      let loggedInData = JSON.parse(data)
      loggedInData = loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':'))
      loggedInData.push(`${groupName}_values` + ":" + compressedData)
      const newData = JSON.stringify(loggedInData)

      const response = await fetch('https://192.168.50.10:3005/updateData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData }),
        credentials: 'include'
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
      setData(newData)

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

          let klassAttRadera = `${name}_values`
          let loggedInData = JSON.parse(data)
          loggedInData = loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':'))
          loggedInData.push(`${name}_values` + ":" + compressedData)
          const newData = JSON.stringify(loggedInData)
          const response = await fetch('https://192.168.50.10:3005/updateData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newData }),
            credentials: 'include'
          });
          setData(newData)
          await new Promise((resolve) => setTimeout(resolve, 100));

          document.getElementById(`${name}_values`).selected = true;
        }
      }
    }
  };








  async function readCookieValues(dataTitle) {
    const loggedInData = await checkLoginStatus();
    let match = null
    console.log(loggedInData)
    JSON.parse(loggedInData).map((item) => {
      console.log(item);
      if (item) {
        console.log("hej");
        if (item.split(":")[0] === dataTitle) {
          console.log("då");
          console.log(item);
          match = item.split(":")[1];
          console.log(match);
          match = decompressData(match);
          console.log(match);
        }
      }
    });
    console.log(match)


    return match;
  }


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
      const loggedInData = JSON.parse(data)
      loggedInData.push(`${name}_values` + ":" + compressedData)
      const newData = JSON.stringify(loggedInData)

      const response = await fetch('https://192.168.50.10:3005/updateData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newData }),
        credentials: 'include'
      });
      setData(newData)
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

  const raderaKlass = async () => {
    setGroupName(defaultGroup);
    document.getElementById("nyKlass").selected = true;
    const klassAttRadera = `${groupName}_values`;
    const loggedInData = JSON.parse(data)
    const newData = JSON.stringify(loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':')))


    const response = await fetch('https://192.168.50.10:3005/updateData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newData }),
      credentials: 'include'
    });
    setData(newData)

  };

  const raderaNamnKlass = async () => {
    setNameGroupName(defaultGroup);
    document.getElementById("nyKlassNamn").selected = true;
    const klassAttRadera = `${encodeURI(nameGroupName)}`;
    const loggedInData = JSON.parse(data)

    const newData = JSON.stringify(loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':')))
    const response = await fetch('https://192.168.50.10:3005/updateData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newData }),
      credentials: 'include'
    });
    setData(newData)
    setNames([""]);
  };
  const raderaGrid = async () => {
    setGridGroupName(defaultGroup);
    document.getElementById("nyGridNamn").selected = true;
    const klassAttRadera = `${gridGroupName}`;
    const loggedInData = JSON.parse(data)

    const newData = JSON.stringify(loggedInData.filter(item => item !== null && !item.startsWith(klassAttRadera + ':')))

    const response = await fetch('https://192.168.50.10:3005/updateData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newData }),
      credentials: 'include'
    });
    setData(newData)
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

  const adadsads = (group) => {
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
    setShowBorders(false);

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        setShowBorders(true);
      }, 100);
    }, 0);
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
        values = await readCookieValues(selectedGroup);
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
        setGroupName(selectedGroup.replace("_values", ""));
        setUppe(uppe);
        setNere(nere);
        setLåstaNamn(values.låstaNamn || []);
      } else {
        console.error(`No values found for group: ${selectedGroup}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
      fixa();

      var selectElement = document.getElementById("sparadeNamnKlasser");
      selectElement.selectedIndex = 0;
    }
  };


  const handleNameGroupChange = async (event) => {
    const selectedNameGroup = event.target.value;
    setNameGroupName(selectedNameGroup);
    if (selectedNameGroup === defaultGroup) {
      setNames([""]);
    } else {
      const values = await readCookieValues(selectedNameGroup);
      console.log(values)
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
      data={data}
      setData={setData}
    />
  );
  const taBortEfternamn = () => {

    if (efternamnStarForst) {
      setNames(förraNamn => förraNamn.map((namn) => namn.split(" ").slice(-1)[0]))
    } else {
      setNames(förraNamn => förraNamn.map((namn) => namn.split(" ")[0]))
    }
    console.log("keb")
    fixa();
  };
  const andraCheckboxvarde = (e) => setEfternamnStarForst(e.target.checked);
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

        {JSON.parse(data).length > 0 &&
          JSON.parse(data).map(
            (item) => item &&

              item.split(":")[0].endsWith("_values") && (
                <option id={item.split(":")[0]} key={item.split(":")[0]} value={item.split(":")[0]}>
                  {item.split(":")[0].replace("_values", "")}
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



  return (
    <div className="App prevent-select">
      <div id="bräddMått"></div>

      <div className="gridInstallning">
        {Cookies.get && (
          <DownloadJSON
            data={data} // Sätt data till användardatan
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

                {JSON.parse(data).length > 0 &&
                  JSON.parse(data).map(
                    (item) => item &&
                      item.split(":")[0].endsWith("nameValues") && (
                        <option
                          id={item.split(":")[0]}
                          key={item.split(":")[0]}
                          value={item.split(":")[0]}
                        >
                          {item.split(":")[0].replace("_nameValues", "")}
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
              <div>
                <a>Efternamn står först?</a>
                <input type="checkbox" defaultChecked="true" onChange={andraCheckboxvarde} />

              </div>
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
        <a id="mailTag">
          Skola77: Version 24.9
        </a>
      </p>
    </div>
  );
};

export default Editor;





