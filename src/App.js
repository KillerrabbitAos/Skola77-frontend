import React, { useState } from 'react';
import './App.css';
import Grid from './Grid'; // Se till att importera Grid-komponenten om den finns i en annan fil

const App = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [boxes, setBoxes] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [names, setNames] = useState([]);

  const handleAddName = () => {
    if (nameInput.trim() !== '') {
      setNames([...names, nameInput]);
      setNameInput('');
    }
  };

  const handleMixNames = () => {
    if (names.length === 0 || boxes.length === 0) return;

    // Implementera logiken för att blanda och placera namn slumpmässigt på lådorna
  };

  return (
    <div className="App">
      <div class='gridInstallning'>
        <label>Rader:</label>
        <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
        <label>Kolumner:</label>
        <input type="number" value={columns} onChange={(e) => setColumns(e.target.value)} />
      </div>
      <Grid rows={rows} columns={columns} boxes={boxes} setBoxes={setBoxes} names={names} />
      <div class='gridInstallning'>
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
