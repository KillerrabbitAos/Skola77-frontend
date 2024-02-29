import React, { useState, useEffect } from 'react';
import './App.css';
import Grid from './Grid';
import html2pdf from 'html2pdf.js';
import Cookies from 'js-cookie';
import ExcelToTextConverter from './ExcelToTextConverter';
import generateCombinedList from './CombinedListGenerator';
import NameList from './Namn';
import LZString from 'lz-string';
import { useCookies } from 'react-cookie';
import { papperskorg } from './papperskorg';
import doneImg from './done.svg';
import backImg from './back.png';
import schackBräde from './schackVärden.js'

function compressData(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

function orm() {
  alert(orm);
}
// Function to decompress data retrieved from cookies
function decompressData(compressedData) {
  return JSON.parse(LZString.decompressFromEncodedURIComponent(compressedData));
}

function fitTextToContainer(container, element) {
  for (let i = 0; i < 20; i++) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const widthScale = containerWidth / elementWidth;
    const heightScale = containerHeight / elementHeight;

    const minScale = Math.min(widthScale, heightScale);

    const currentFontSize = window.getComputedStyle(element).fontSize;
    const newFontSize = parseFloat(currentFontSize) * minScale;

    element.style.fontSize = newFontSize + 'px';

    const offsetX = (containerWidth - elementWidth * minScale) / 2;
    const offsetY = (containerHeight - elementHeight * minScale) / 2;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
}


const App = () => {
  const [groupName, setGroupName] = useState('ny...');
  const [keyChange, setKeyChange] = useState('tom')
  const [rows, setRows] = useState(7);
  const [columns, setColumns] = useState(7);
  const [boxes, setBoxes] = useState([]);
  const [names, setNames] = useState([""]);
  const [boxNames, setBoxNames] = useState('tom');
  const [filledBoxes, setFilledBoxes] = useState([]);
  const [cellSize, setCellSize] = useState(70);
  const [fixaCounter, setFixaCounter] = useState(0);
  const [baklänges, setBaklänges] = useState(false)
  const defaultGroup = 'ny...';
  const [rowsInput, setRowsInput] = useState('7');
  const [columnsInput, setColumnsInput] = useState('7');
  const [nere, setNere] = useState("Bak")
  const [uppe, setUppe] = useState("Tavla")
  const [clicked, setClicked] = useState(false)
  const [dummyState, setDummyState] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['name']);
  const [bytaPlatser, setBytaPlatser] = useState(false)
  const [showBorders, setShowBorders] = useState(true);
  const [editingMode, setEditingMode] = useState(true);
  const [knappStatus, setKnappStatus] = useState(true);

  const handleRowsInputChange = (e) => {
    const value = e.target.value;
    setRowsInput(value);
    setRows(isNaN(value) || value === '' ? 0 : parseInt(value, 10));
  };

  const handleColumnsInputChange = (e) => {
    const value = e.target.value;
    setColumnsInput(value);
    setColumns(isNaN(value) || value === '' ? 0 : parseInt(value, 10));
  };

  const ändraPerspektiv = () => {
    setBaklänges(!baklänges)
    if (baklänges) {
      setNere("Tavla")
      setUppe("Bak")
    }
    else {
      setNere("Bak")
      setUppe("Tavla")
    }
  }

  const handleSaveButtonClick = async () => {
    const name = prompt('Döp din klass: ');
    if (name) {
      setGroupName(name);

      // Sparar värden i cookie
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
      });

      Cookies.set(`${name}_values`, compressedData, { expires: 365 });
      await new Promise(resolve => setTimeout(resolve, 10));

      document.getElementById(`${name}_values`).selected = true
    }

  }


  const raderaKlass = () => {
    setGroupName(defaultGroup);
    document.getElementById("nyKlass").selected = true
    const klassAttRadera = `${encodeURI(groupName)}_values`
    removeCookie(klassAttRadera)
    setRows(7);
      setColumns(7);
      setBoxNames('tom');
      setBoxes([]);
      setNames([""]);
      setFilledBoxes([]);
      setCellSize(70);
      setFixaCounter(0);
  }

  function applyFontSizesToClass(className) {
    const elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const container = element.parentElement;

      fitTextToContainer(container, element);
    }
  }

  const readCookieValues = (group) => {
    // Läser värden från cookie
    const cookieName = `${group}`;
    console.log('Attempting to get cookie:', cookieName);

    if (!Cookies.get(cookieName)) {
      console.log(`${cookieName} cookie does not exist.`);
      return {};
    }

    const compressedData = Cookies.get(cookieName);
    console.log('Cookie values string:', compressedData);

    try {
      const values = decompressData(compressedData);
      fixa()
      return values || {};
    } catch (error) {
      console.error('Error parsing cookie values:', error);
      return {};
    }

  };




  const handleExportToPDF = () => {
    document.getElementById("klar").style.visibility = "hidden";
    const gridContainer = document.getElementById('gridPdfSak');

    if (gridContainer) {
      const pdfConfig = {
        filename: 'skola77-placering.pdf',
        jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' }
      };

      html2pdf(gridContainer, pdfConfig);
    }
  };
  const handleRemoveName = (index) => {

    console.log(index)
    const updatedNames = [...names];
    updatedNames[index] = ""

    setNames(updatedNames);

    // Update the 'boxNames' array with the 'value' property replaced with 0 for matching items
    if (boxNames !== "tom") {
      const removedName = index;
      const newArray = boxNames.map(item => {
        if (item.value === removedName) {
          return { ...item, value: 0 };
        } else {
          return item;
        }
      });

      setBoxNames(newArray);
    };
  };








  const handleMassImportNames = () => {
    const textarea = document.getElementById('namesInput');
    const textareaContent = textarea.value.split('\n').map((name) => name.trim()).filter(Boolean);

    setNames((prevNames) => [...prevNames, ...textareaContent]);
    textarea.value = '';
  };
  const handleRedigeringKlick = () => {
    setBytaPlatser(bytaPlatser != true);
    setKnappStatus(!knappStatus);
  }

  const toggleBorders = () => {
    setShowBorders(!showBorders);
    setEditingMode(!editingMode);

  };
  const fixa = () => {
    applyFontSizesToClass('name');
  }
  const firstConstantFunction = async () => {
    const namesList = names
    setBoxNames(generateCombinedList(filledBoxes, names, 0, namesList));
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  const handleMixNames = async () => {
    // Call the first constant function and wait for it to complete
    await firstConstantFunction();

    // Once the first function completes, call the second one
    fixa();
  };
  const handleGroupChange = async (event) => {
    const selectedGroup = event.target.value;
    setGroupName(selectedGroup)
    // Om den valda gruppen är standardgruppen, sätt standardvärden
    if (selectedGroup === defaultGroup) {
      setRows(7);
      setColumns(7);
      setBoxNames('tom');
      setBoxes([]);
      setNames([""]);
      setFilledBoxes([]);
      setCellSize(70);
      setFixaCounter(0);
    } else {
      var values = schackBräde
      console.log(schackBräde)
      if (selectedGroup !== 'schack'){
        values = readCookieValues(selectedGroup); 
      }
      console.log(values)
      if (values) {
        setRows(values.rows || 0);
        setColumns(values.columns || 0);
        setBoxNames(values.boxNames || []);
        setBoxes(values.boxes || []);
        setNames(values.names || []);
        setFilledBoxes(values.filledBoxes || []);
        setCellSize(values.cellSize || 0);
        setFixaCounter(values.fixaCounter || 0);
        setKeyChange(values.keyChange)
        // Uppdatera groupName när en grupp väljs
        setGroupName(selectedGroup.replace('_values', ''));
      } else {
        // Handle the case when values are not available
        console.error(`No values found for group: ${selectedGroup}`);
      }
      await new Promise(resolve => setTimeout(resolve, 10));
      fixa();
    };
  }



  const gridConf = <div className='gridInstallning' id='kebaben'>
    <p>Namnimport</p>
    <textarea id="namesInput" rows="10" cols="30" placeholder="Ett namn per rad"></textarea>
    <button onClick={handleMassImportNames}>Spara namn</button>
    <ExcelToTextConverter
      setNames={setNames}
      names={names}
    />
  </div>;
  const grid = <Grid
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

  />;
  const sparningsLösning = <div id='sparaSettings'>
    <button onClick={handleSaveButtonClick} className='spara' id='sparaKnapp'></button>
    <label htmlFor="sparaKnapp">Spara!</label>

    <label>Sparade klasser:</label>
    <select id="sparadeKlasser" defaultValue={groupName} onChange={handleGroupChange}>
      <option id="nyKlass" key="ny..." value={defaultGroup}>{defaultGroup}</option>
      {names.includes("schack") && <option id="schack" key="schack" value={"schack"}>schack</option>}
      {/* Lista alla grupper som finns sparade i cookies */}

      {Object.keys(Cookies.get()).length > 0 &&
        Object.keys(Cookies.get()).map((cookieName) => (
          <option id={cookieName} key={cookieName} value={cookieName}>
            {cookieName.replace('_values', '')}
          </option>
        ))}

    </select>
    {(groupName === defaultGroup)
      ? ''
      : <button key="raderaKlass" onMouseDown={raderaKlass}>radera klass</button>}
  </div>;

  return (
    <div className="App">
      <div className='gridInstallning'>
        <label>Rader:</label>
        <input type="number" max="50" value={rowsInput} onChange={handleRowsInputChange} />
        <label>Kolumner:</label>
        <input type="number" max="50" value={columnsInput} onChange={handleColumnsInputChange} />
        <label>Storlek:</label>
        <input type="number" label="Rutstorlek: " value={cellSize} max="300" onChange={(e) => setCellSize(Math.max(0, Math.min(e.target.value, 300)))} />
      </div>

      {sparningsLösning}

      <div id='gridMedAnnat'>
        <div id='pdfDiv'>

          <button id='pdfKnapp' onClick={handleExportToPDF}></button>
          <label id='pdfLabel' htmlFor="pdfKnapp">Exportera till PDF</label>


        </div>

        {grid}
        <div id='meny'>
      <div id='redigeringsDiv' className='menySaker'>
      <button id="redigeringsKnapp" onClick={handleRedigeringKlick}></button>
      <label id='redigeringsLabel' htmlFor='redigeringsKnapp'>{knappStatus ? 'Ändra placering' : 'Tillbaka till platsutplacering'}</label>
      </div>
      <div id="klarDiv" className='menySaker'>
      <button
        id="klar"
        onClick={toggleBorders}
        style={{ 
          backgroundImage: editingMode ? `url(${doneImg})` : `url(${backImg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          height: '50px',
          border: 'none',
          cursor: 'pointer'
        }}
>
</button>
      <label id='klarLabel' htmlFor="klar">{editingMode ? 'Klar' : 'Fortsätt redigera'}</label>
      </div>  
        
          <div id="perspektivDiv" className='menySaker'>
          <button id='perspektiv' onClick={ändraPerspektiv}></button>
          <label id='perspektivLabel' htmlFor="perspektiv">Byt perspektiv</label>
          </div>

          <div className="menySaker" id='slumpaDiv'>
          <button onClick={handleMixNames} id='slumpaKnappen'></button>
          <label id='slumpaLabel' htmlFor="slumpaKnappen">Slumpa</label>
          </div>
      </div>
      </div>
      {gridConf}
      <div>
        <p id='nameHeader'>Namn:</p>
        <div id="namn">
          <NameList
            names={names}
            handleRemoveName={handleRemoveName}
            setBoxNames={setBoxNames}
          ></NameList>
        </div>
      </div>
      <p><a id="mailTag" href="https://skola77.com">Startsida</a></p>
    </div>
  );
};

export default App;
