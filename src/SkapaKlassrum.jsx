import React, { useState, useEffect } from "react";
import { data } from "./data";
import Klassrum from "./Klassrum";
import "./Grid.css";

const Grid3 = () => {
  const [names, setNames] = useState(data.klasser["peters klass"].personer);
  const [rows, setRows] = useState(data.klassrum["H221"].rows);
  const [cols, setCols] = useState(data.klassrum["H221"].cols);
  const [grid, setGrid] = useState(data.klassrum["H221"].grid);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [gridData, setGridData] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const ändraRader = (ändring) => {
    let newRows = Math.max(1, rows + ändring);
    if (newRows > grid.length) {
      const newGrid = Array.from({ length: newRows }, (_, rowIndex) =>
        grid[rowIndex]
          ? grid[rowIndex]
          : Array.from({ length: cols }, () => ({ id: null, person: 0 }))
      );
      setGrid(newGrid);
    }
    setRows(newRows);
  };

  const ändraKolumner = (ändring) => {
    let newCols = Math.max(1, cols + ändring);
    const newGrid = grid.map((row) =>
      newCols > cols
        ? [
            ...row,
            ...Array.from({ length: newCols - cols }, () => ({
              id: null,
              person: 0,
            })),
          ]
        : row
    );
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
      {isTouchDevice ? (
        <div className="flex items-center">
          <span id="skola77ärbra">Rader</span>
          <button onClick={() => ändraRader(-1)} className="sänkKnapp">
            -
          </button>
          <button onClick={() => ändraRader(1)} className="höjKnapp">
            +
          </button>
        </div>
      ) : (
        <input
          type="number"
          min="1"
          value={rows}
          onChange={(e) => ändraRader(parseInt(e.target.value) - rows)}
        />
      )}

      {isTouchDevice ? (
        <div className="flex items-center">
          <span id="skola77ärbra">Kolumner</span>
          <button onClick={() => ändraKolumner(-1)} className="sänkKnapp">
            -
          </button>
          <button onClick={() => ändraKolumner(1)} className="höjKnapp">
            +
          </button>
        </div>
      ) : (
        <input
          type="number"
          min="1"
          value={cols}
          onChange={(e) => ändraKolumner(parseInt(e.target.value) - cols)}
        />
      )}

      <button
        onClick={spara}
        className="bg-green-500 h-10 text-white float-end mr-10 mt-3"
      >
        Spara
      </button>

      <Klassrum
        rows={rows}
        låstaBänkar={låstaBänkar}
        setLåstaBänkar={setLåstaBänkar}
        columns={cols}
        grid={grid}
        setGrid={setGrid}
        names={names}
      />

      <ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
        <li
          className="font-bold text-xl p-2 cursor-pointer"
          onClick={() => {
            setGrid(
              Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => ({ id: null, person: 0 }))
              )
            );
          }}
        >
          ny klass...
        </li>
        {Object.keys(data.klassrum).map((klassrumKey, index) => {
          const klassrum = data.klassrum[klassrumKey];
          return (
            <li
              key={klassrumKey || index}
              className="font-bold text-xl p-2 cursor-pointer"
              onClick={() => {
                setGrid(klassrum.grid);
                setRows(klassrum.rows);
                setCols(klassrum.cols);
              }}
            >
              {klassrumKey}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Grid3;
