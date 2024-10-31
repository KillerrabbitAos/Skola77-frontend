// Grid3.js
import React, { useState } from "react";
import { data } from "./data"; // Import your data
import Klassrum from "./Klassrum"; // Import the new Klassrum component
import "./Grid.css"; // Import the CSS file

const Grid3 = () => {
  const [names, setNames] = useState(data.klasser[0].personer);
  const [rows, setRows] = useState(data.klassrum[0].rows);
  const [cols, setCols] = useState(data.klassrum[0].cols);
  const [grid, setGrid] = useState(data.klassrum[0].grid);
  const [gridData, setGridData] = useState("");

  const ändraRader = (e) => {
    const inputValue = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    let newRows = isNaN(inputValue) || inputValue === "" ? "" : Math.max(1, inputValue);

    if (newRows === "") {
      setRows("");
      return;
    }
    
    const newGrid = Array.from({ length: newRows }, (_, rowIndex) =>
      grid[rowIndex] ? grid[rowIndex] : Array.from({ length: cols }, () => ({ id: null, person: 0 }))
    );
    setGrid(newGrid);
    setRows(newRows);
  };

  const ändraKolumner = (e) => {
    const inputValue = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    let newCols = isNaN(inputValue) || inputValue === "" ? "" : Math.max(1, inputValue);

    if (newCols === "") {
      setCols("");
      return;
    }

    const newGrid = grid.map((row) => {
      if (newCols > cols) {
        return [...row, ...Array.from({ length: newCols - cols }, () => ({ id: null, person: 0 }))];
      } else {
        return row.slice(0, newCols);
      }
    });

    setGrid(newGrid);
    setCols(newCols);
  };

  const spara = () => {
    const dataToSave = JSON.stringify({ grid: grid, cols: cols, rows: rows });
    setGridData(dataToSave);
    console.log("griddata: " + dataToSave);
  };
  

  return (
    <div>
      <input
        type="number"
        min="1"
        value={rows === "" ? "" : rows}
        onChange={ändraRader}
      />
      <input
        type="number"
        min="1"
        value={cols === "" ? "" : cols}
        onChange={ändraKolumner}
      />

      <button onClick={spara} className="bg-green-500 h-10 text-white float-end mr-10 mt-3">Spara</button>
      <Klassrum
        rows={rows}
        columns={cols}
        grid={grid}
        setGrid={setGrid}
        names={names}
      />

<ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
  <li
    className="font-bold text-xl p-2 cursor-pointer"
    onClick={() => {
      setGrid(Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ id: null, person: 0 }))));
    }}
  >
    ny klass...
  </li>

  {data.klassrum.map((klassrum, index) => (
    <li
      key={klassrum.name || index}
      className="font-bold text-xl p-2 cursor-pointer"
      onClick={() => {
        setGrid(klassrum.grid);
        setRows(klassrum.rows);
        setCols(klassrum.cols);
      }}
    >
      {klassrum.name}
    </li>
  ))}
</ul>


    </div>
  );
};

export default Grid3;
