import React, { useState } from 'react';
import Grid from './Grid'; // Importera Grid-komponenten om den finns i en annan fil
import './App.css'; // Importera CSS-filen för stilar om du har någon

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

    const shuffledNames = [...names];
    for (let i = shuffledNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }

    const updatedBoxes = boxes.map((box, index) => ({
      ...box,
      name: shuffledNames[index % shuffledNames.length],
    }));

    setBoxes(updatedBoxes);
  };

  return (
    <div className="App">
      <div>
        <label>Rows:</label>
        <input type="number" value={rows} onChange={(e) => setRows(e.target.value)} />
        <label>Columns:</label>
        <input type="number" value={columns} onChange={(e) => setColumns(e.target.value)} />
      </div>
      <Grid rows={rows} columns={columns} boxes={boxes} setBoxes={setBoxes} />
      <div>
        <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
        <button onClick={handleAddName}>Add Name</button>
      </div>
      <div>
        <button onClick={handleMixNames}>Mix Names</button>
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
