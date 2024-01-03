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
    console.log("Names:", names);
    console.log("Boxes:", boxes);
    
    
    const unfilledBoxes = boxes.filter(box => !box.filled);
    const filledBoxes = boxes.filter(box => box.filled && box.assignedName === '');
  
    if (filledBoxes.length === 0) return;
  
    const availableNames = names.slice();
    const usedNames = new Set();
  
    filledBoxes.forEach(box => {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      const randomName = availableNames[randomIndex];
  
      box.assignedName = randomName;
      usedNames.add(randomName);
  
      availableNames.splice(randomIndex, 1);
    });
  
    unfilledBoxes.forEach(box => {
      box.assignedName = '';
    });
  
    setBoxes([...boxes]);
    const updatedBoxes = [...unfilledBoxes, ...filledBoxes];
    setBoxes(updatedBoxes);
  };

  return (
    <div className="App">
      <div className='gridInstallning'>
        <label>Rader:</label>
        <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
        <label>Kolumner:</label>
        <input type="number" value={columns} onChange={(e) => setColumns(e.target.value)} />
      </div>
      <Grid rows={rows} columns={columns} boxes={boxes} setBoxes={setBoxes} names={names} />
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