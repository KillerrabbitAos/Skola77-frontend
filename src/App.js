import React, { useState } from 'react';
import './App.css';
import Grid from './Grid';
import Box from './Box';

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
      
  <Grid rows={rows} columns={columns} boxes={boxes} setBoxes={setBoxes} names={names} boxNames={boxNames} setBoxNames={setBoxNames} filledBoxes={filledBoxes} cellSize={cellSize} setCellSize={setCellSize} />
      <button onClick={handleMixNames}>Slumpa</button>
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
