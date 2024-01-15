import React, { useState } from 'react';
import './App.css';
import Grid from './Grid';
import Box from './Box';
function fitTextToContainer(container, element) {
  // Get the container and element dimensions
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const elementWidth = element.offsetWidth;
  const elementHeight = element.offsetHeight;

  // Calculate the scaling factor for both width and height
  const widthScale = containerWidth / elementWidth;
  const heightScale = containerHeight / elementHeight;

  // Determine the minimum scaling factor to fit the element within the container
  const minScale = Math.min(widthScale, heightScale);

  // Calculate the new font size
  const currentFontSize = window.getComputedStyle(element).fontSize;
  const newFontSize = parseFloat(currentFontSize) * minScale;

  // Apply the new font size to the element
  element.style.fontSize = newFontSize + 'px';
}

// Example Usage:
// Assuming you have HTML like this:
// <div id="container" style="width: 300px; height: 200px;">
//   <p id="textElement">This is some text.</p>
// </div>

// Get container and element references
const container = document.getElementById('container');
const element = document.getElementById('textElement');

// Call the function



// Function to apply new font sizes to elements with a specific class


// Replace 'your-class-name' with the actual class name you want to target


const App = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [boxes, setBoxes] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [names, setNames] = useState([]);
  const [boxNames, setBoxNames] = useState('tom');
  const [filledBoxes, setFilledBoxes] = useState([]);
  const [cellSize, setCellSize] = useState(70) 

  const handleAddName = () => {
    if (nameInput.trim() !== '') {
      setNames([...names, nameInput]);
      setNameInput('');
    }
  };
  function applyFontSizesToClass(className) {
    const elements = document.getElementsByClassName(className);
  
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const container = element.parentElement;
  
        fitTextToContainer(container, element);
    }
  }
  
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
  }
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
      
  <Grid rows={rows} columns={columns} boxes={boxes} setBoxes={setBoxes} names={names} boxNames={boxNames} setBoxNames={setBoxNames} filledBoxes={filledBoxes} cellSize={cellSize} setCellSize={setCellSize} setFilledBoxes={setFilledBoxes} />
      <button onClick={handleMixNames}>Slumpa</button>
      <button onClick={fixa}></button>
      <div className='gridInstallning' id='kebaben'>
        
        <textarea id="namesInput" rows="10" cols="30" placeholder="Ett namn per rad"></textarea>

        <button onClick={handleMassImportNames}>Massimportera namn</button>
        <p>Eller....</p>
        <input type="text" id='namnSingel' placeholder='Ett namn i taget' value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
        
        <button onClick={handleAddName}>Lägg till namn</button>
      </div>
      <div>
        <ul>
          {names.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
