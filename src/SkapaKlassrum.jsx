import React, { useState, useEffect } from "react";
import { data as originalData } from "./data.js";
import Klassrum from "./Klassrum";
import "./Grid.css";
function generateUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
const Grid3 = () => {
  const [names, setNames] = useState([""]);
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(7);
  const [grid, setGrid] = useState([
    [
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: "item-1728395558391",
        person: 0,
      },
      {
        id: "item-1728395558639",
        person: 0,
      },
    ],
    [
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: "item-1728395560144",
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
    ],
    [
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: "item-1728395557488",
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
    ],
    [
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
    ],
    [
      {
        id: "item-1728395563304",
        person: 0,
      },
      {
        id: "item-1728395562912",
        person: 0,
      },
      {
        id: "item-1728395557831",
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: "item-1728395562504",
        person: 0,
      },
      {
        id: "item-1728395559832",
        person: 0,
      },
    ],
    [
      {
        id: null,
        person: 0,
      },
      {
        id: "item-1728395561288",
        person: 0,
      },
      {
        id: "item-1728395560888",
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
      {
        id: null,
        person: 0,
      },
    ],
  ]);
  const [data, setData] = useState(null);
  const [klassrumsnamn, setKlassrumsNamn] = useState(null);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [gridData, setGridData] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [klassrumsId, setKlassrumsId] = useState(null);
  function sparaData(nyData) {
    setData(nyData);
  }
  function sparaDat(nyData) {
    setData(nyData);
    fetch("http://192.168.50.107:3000/api/updateData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nyData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
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
  async function checkLoginStatus() {
    setData(originalData);
  }
  async function checLoginStatus() {
    const response = await fetch("http://192.168.50.107:3000/api/getKlassrum");
    const result = await response.json();
    const parsedData = JSON.parse(result[0].data);
    setData(parsedData);
    const klassrum = parsedData.klassrum;
    const klasser = parsedData.klasser;

    console.log("Klassrum:", klassrum);
    console.log("Klasser:", klasser);
  }

  const spara = () => {
    let newData = data;

    let nyttNamn = klassrumsnamn
      ? klassrumsnamn
      : prompt("Vad heter klassrummet?");
    const nyttId = generateUniqueId();
    setKlassrumsId(nyttId);
    newData.klassrum.push({
      id: nyttId,
      namn: nyttNamn,
      rows: rows,
      cols: cols,
      grid: grid,
    });
    sparaData(newData);
  };
  useEffect(() => {
    checkLoginStatus();
  }, []);
  return (
    <div>
      <div className="flex">
        <div className="flex flex-grow">
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
        </div>
        <button
          onClick={spara}
          className="bg-green-500 h-10 text-white float-end mr-10 mt-3"
        >
          Spara
        </button>
      </div>
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
            setKlassrumsNamn(null);
            setGrid(
              Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => ({ id: null, person: 0 }))
              )
            );
          }}
        >
          nytt klassrum
        </li>
        {data &&
          data.klassrum.map((klassrum) => {
            return (
              <li
                key={klassrum.id}
                className="font-bold hover:bg-slate-100 text-xl p-2 cursor-pointer"
                onClick={() => {
                  setGrid(klassrum.grid);
                  setCols(klassrum.cols);
                  setRows(klassrum.rows);
                  setKlassrumsNamn(klassrum.namn);
                }}
              >
                {klassrum.namn}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Grid3;
