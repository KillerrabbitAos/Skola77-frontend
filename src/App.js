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
  const [boxNames, setBoxNames] = useState('tom')
  const [filledBoxes, setFilledBoxes] = useState([])
  const handleAddName = () => {
    if (nameInput.trim() !== '') {
      setNames([...names, nameInput]);
      setNameInput('');
    }
  };

  const handleMixNames = () => {
    var mixedList = names.sort(() => Math.random() - 0.5);
    setFilledBoxes(filledBoxes.sort(() => Math.random() - 0.5));
    var newBoxNames = []
    setBoxNames([])
    filledBoxes.forEach(function (item, index){
      newBoxNames.push({
        key: item,
        value: mixedList[index]
      });
    });
    setBoxNames(newBoxNames); 
  };

  return (
    <div className="App">
      <div className='gridInstallning'>
        <label>Rader:</label>
        <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
        <label>Kolumner:</label>
        <input type="number" value={columns} onChange={(e) => setColumns(e.target.value)} />
      </div>
      <Grid rows={rows} columns={columns} boxes={boxes} setBoxes={setBoxes} names={names} boxNames={boxNames} setBoxNames={setBoxNames} filledBoxes={filledBoxes} />
      <div className='gridInstallning'>
        <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
        <button onClick={handleAddName}>Lägg till namn</button>
      </div>
      <div>
        <button onClick={handleMixNames}>Slumpa</button>
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
