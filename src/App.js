import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Grid from './Grid';
import html2pdf from 'html2pdf.js';
import Cookies from 'js-cookie';
import ExcelToTextConverter from './ExcelToTextConverter';

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
function findValueByKey(list, key) {
  if (list === 'tom') {
    return "tom";
  } else {
    const foundItem = list.find(item => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}

const App = () => {
  const [componentLoaded, setComponentLoaded] = useState(false);
  const [groupName, setGroupName] = useState('ny...');
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [boxes, setBoxes] = useState([]);
  const [names, setNames] = useState([]);
  const [boxNames, setBoxNames] = useState('tom');
  const [filledBoxes, setFilledBoxes] = useState([]);
  const [cellSize, setCellSize] = useState(70);
  const [fixaCounter, setFixaCounter] = useState(0);

  const defaultGroup = 'default';

  const handleSaveButtonClick = () => {
    const name = prompt('Döp din klass: ');
    if (name) {
      setGroupName(name);

      // Sparar värden i cookie
      Cookies.set(`${name}_values`, JSON.stringify({
        rows: rows,
        columns: columns,
        boxes: boxes,
        names: names,
        boxNames: boxNames,
        filledBoxes: filledBoxes,
        cellSize: cellSize,
        fixaCounter: fixaCounter,
      }));
    }
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
  
    const valuesString = Cookies.get(cookieName);
    console.log('Cookie values string:', valuesString);
  
    try {
      const values = JSON.parse(valuesString);
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
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
  };

  const handleMassImportNames = () => {
    const textarea = document.getElementById('namesInput');
    const textareaContent = textarea.value.split('\n').map((name) => name.trim()).filter(Boolean);

    setNames((prevNames) => [...prevNames, ...textareaContent]);
    textarea.value = '';
  };

 // const fixa = useCallback(() => {
   // setNamesFromBoxNames();
    //console.log("kebab")
    //setFixaCounter((prevCounter) => prevCounter + 1);
  //}, []);
  const fixa = () => {
  applyFontSizesToClass('name');
  }
  const handleMixNames = () => {
    const mixedList = [...names].sort(() => Math.random() - 0.5);
    setFilledBoxes([...filledBoxes].sort(() => Math.random() - 0.5));
    const newBoxNames = filledBoxes.map((item, index) => ({
      key: item,
      value: mixedList[index],
    }));

    setBoxNames(newBoxNames);
  };

  const handleGroupChange = (event) => {
    const selectedGroup = event.target.value;
    setGroupName(selectedGroup)
    // Om den valda gruppen är standardgruppen, sätt standardvärden
    if (selectedGroup === defaultGroup) {
      setRows(3);
      setColumns(3);
      setBoxNames('tom');
      setBoxes([]);
      setNames([]);
      setFilledBoxes([]);
      setCellSize(70);
      setFixaCounter(0);
    } else {
    const values = readCookieValues(selectedGroup);
    if (values) {
      setRows(values.rows || 0);
      setColumns(values.columns || 0);
      setBoxNames(values.boxNames || []);
      setBoxes(values.boxes || []);
      setNames(values.names || []);
      setFilledBoxes(values.filledBoxes || []);
      setCellSize(values.cellSize || 0);
      setFixaCounter(values.fixaCounter || 0);
      // Uppdatera groupName när en grupp väljs
      setGroupName(selectedGroup.replace('_values', ''));
    } else {
      // Handle the case when values are not available
      console.error(`No values found for group: ${selectedGroup}`);
    }
  };
}


 // useEffect(() => {
   // if (fixaCounter > 0) {
      //setFixaCounter(0);
   // } else {
      //fixa();
   // }
  //}, [rows, columns, boxes, names, boxNames, filledBoxes, cellSize, fixa, fixaCounter]);
  useEffect(() => {
    if (fixaCounter > 100){
      setFixaCounter(0)
      return;
      }
    else{
      fixa();
    }
    }, [filledBoxes, boxNames, rows, columns, cellSize, fixa]);
 
  return (
    <div className="App">
      <div className='gridInstallning'>
        
        <label>Rader:</label>
        <input type="number" max="50" value={rows} onChange={(e) => setRows(Math.max(0, Math.min(e.target.value, 50)))} />
        <label>Kolumner:</label>
        <input type="number" max="50" value={columns} onChange={(e) => setColumns(Math.max(0, Math.min(e.target.value, 50)))} />
        <label>Storlek:</label>
        <input type="number" label="Rutstorlek: " value={cellSize} max="300" onChange={(e) => setCellSize(Math.max(0, Math.min(e.target.value, 300)))} />
      </div>

      <div id='sparaSettings'>
      <button onClick={handleSaveButtonClick} className='spara' id='sparaKnapp'></button>
      <label for="sparaKnapp">Spara!</label>
       
        <label>Sparade klasser:</label>
  <select defaultValue={groupName} onChange={handleGroupChange}>
  <option key={defaultGroup} value={defaultGroup}>ny...</option>
  {/* Lista alla grupper som finns sparade i cookies */}
      
  {Object.keys(Cookies.get()).length > 0 &&
              Object.keys(Cookies.get()).map((cookieName) => (
                <option key={cookieName} value={cookieName}>
                  {cookieName.replace('_values', '')}
                </option>
              ))}
      </select>
      </div>


      <button label="fixa 2.0" onClick={fixa}>Fixa!</button>
      <button onClick={handleExportToPDF}>Exportera till PDF</button>
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
      />
      <button onClick={handleMixNames}>Slumpa</button>
      <div className='gridInstallning' id='kebaben'>
        <p>Namnimport</p>
        <textarea id="namesInput" rows="10" cols="30" placeholder="Ett namn per rad"></textarea>
        <button onClick={handleMassImportNames}>Spara namn</button>
        <ExcelToTextConverter
        setNames={setNames}
        />
      </div>
      <div>
        <p id='nameHeader'>Namn:</p>
        <ul>
          {names.map((name, index) => (
            <li key={index} className="namelist">
              {name}
              <button onClick={() => handleRemoveName(index)}>Ta bort</button>
            </li>
          ))}
        </ul>
      </div>
      <p><a id="mailTag" href="mailto:feedback@skola77.com">Feedback</a></p>
    </div>
  );
          };

export default App;
