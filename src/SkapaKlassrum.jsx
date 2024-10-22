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
    if (newRows > rows){
      setGrid(newGrid);
    }
    
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
        return row
      }
    });

    setGrid(newGrid);
    setCols(newCols);
  };

  const spara = () => {
    console.log(
      JSON.stringify({ grid: grid, cols: cols, rows: rows, names: names })
    );
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

      <button onClick={spara}>spara</button>
      <Klassrum rows={rows} columns={cols} grid={grid} setGrid={setGrid} names={names} />
    </div>
  );
};

export default Grid3;
