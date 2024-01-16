import React, { useState, useEffect } from 'react';
import './App.css';
import Grid from './Grid';
import Box from './Box';
import html2pdf from 'html2pdf.js';


function fitTextToContainer(container, element) {
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
}

const App = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [boxes, setBoxes] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [names, setNames] = useState([]);
  const [boxNames, setBoxNames] = useState('tom');
  const [filledBoxes, setFilledBoxes] = useState([]);
  const [cellSize, setCellSize] = useState(70);
  const [fixaCounter, setFixaCounter] = useState(0);

  useEffect(() => {
    if (fixaCounter > 0) {
      // The change was caused by fixa, reset the counter
      setFixaCounter(0);
    } else {
      // The change was not caused by fixa, run fixa
      fixa();
    }
  }, [rows, columns, boxes, names, boxNames, filledBoxes, cellSize, fixaCounter]);

  function applyFontSizesToClass(className) {
    const elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const container = element.parentElement;

      fitTextToContainer(container, element);
    }
  }

  const handleExportToPDF = () => {
    const gridContainer = document.getElementById('gridPdfSak');
  
    if (gridContainer) {
      const pdfConfig = {
        filename: 'skola77-placering.pdf',
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
    const newNames = [];
    const textarea = document.getElementById('namesInput');
    const textareaContent = textarea.value.split('\n');

    for (const name of textareaContent) {
      if (name.trim() !== '') {
        newNames.push(name);
      }
    }

    setNames([...names, ...newNames]);
    textarea.value = '';
  };

  const fixa = () => {
    applyFontSizesToClass('name');
    setFixaCounter((prevCounter) => prevCounter + 1);
  };

  const handleMixNames = () => {
    const mixedList = names.sort(() => Math.random() - 0.5);
    setFilledBoxes(filledBoxes.sort(() => Math.random() - 0.5));
    const newBoxNames = [];
    setBoxNames([]);
    filledBoxes.forEach(function (item, index) {
      newBoxNames.push({
        key: item,
        value: mixedList[index],
      });
    });
    setBoxNames(newBoxNames);
  };

  return (
    <div className="App">
      <div className='gridInstallning'>
        <label>Rader:</label>
        <input type="number" max="50" value={rows} onChange={(e) => setRows(Math.max(0, Math.min(e.target.value, 50)))} />
        <label>Kolumner:</label>
        <input type="number" max="50" value={columns} onChange={(e) => setColumns(Math.max(0, Math.min(e.target.value, 50)))} />
        <label>Storlek:</label>
        <input type="number" label="Rutstorkek: " value={cellSize} max="300" onChange={(e) => setCellSize(e.target.value, 300)} />
      </div>
      <button onClick={handleExportToPDF}>Exportera till PDF</button>
      <Grid rows={rows} columns={columns} boxes={boxes} setBoxes={setBoxes} names={names} boxNames={boxNames} setBoxNames={setBoxNames} filledBoxes={filledBoxes} cellSize={cellSize} setCellSize={setCellSize} />
      <button onClick={handleMixNames}>Slumpa</button>
      <div className='gridInstallning' id='kebaben'>
        <p>Namnimport</p>
        <textarea id="namesInput" rows="10" cols="30" placeholder="Ett namn per rad"></textarea>
        <button onClick={handleMassImportNames}>Importera namn</button>
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
