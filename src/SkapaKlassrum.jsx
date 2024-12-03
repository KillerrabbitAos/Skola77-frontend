import React, { useState, useEffect } from "react";
import { data as originalData } from "./data.js";
import { isTablet, isMobile } from "react-device-detect";
import Klassrum from "./Klassrum";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Grid.css";
import Overlay from "./Overlay.jsx";

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
  const [sparat, setSparat] = useState(true);
  const [laddarKlassrum, setLaddarKlassrum] = useState(true);
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
  const [klassrumsnamn, setKlassrumsnamn] = useState(null);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [gridData, setGridData] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [klassrumsId, setKlassrumsId] = useState(null);
  const [vägg, setVägg] = useState(
    window.outerWidth ? window.outerWidth > 700 : !isMobile || isTablet
  );
  const [laddaKlassrum, setLaddaKlassrum] = useState(false);
  const [nyttNamn, setNyttNamn] = useState(null);

  function sparaData(nyData) {
    console.log(nyData);
    setData(nyData);
    var dataStr = JSON.stringify(nyData);
    console.log(dataStr);
    fetch("https://auth.skola77.com/updateData", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: dataStr,
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
  const laddaMeny = laddaKlassrum && data && (
    <Overlay style={{ top: "97px" }}>
      <ul className="overflow-y-scroll rounded-[8px] scrollbar overflow-x-hidden scrollbar-thin scrollbar-track-rounded-[8px] scrollbar-track-transparent scrollbar-thumb-black w-52 h-48 border bg-white border-black">
        <li
          className="font-bold text-xl p-2 cursor-pointer"
          onClick={() => {
            setKlassrumsnamn(null);
            setLaddaKlassrum(false);
            setKlassrumsId(null)
            setNyttNamn(null);
            setGrid(
              Array.from({ length: rows }, () =>
                Array.from({ length: cols }, () => ({
                  id: null,
                  person: 0,
                }))
              )
            );
          }}
        >
          nytt klassrum
        </li>
        {data.klassrum.map((klassrum) => {
          return (
            <li
              key={klassrum.id}
              className="font-bold hover:bg-slate-100 text-xl p-2 cursor-pointer"
              onClick={() => {
                if (
                  sparat ||
                  window.confirm(
                    "Du har osparade ändringar. Vill du fortsätta ändå? Om inte, tryck på avbryt och spara först."
                  )
                ) {
                  setGrid(klassrum.grid);
                  setCols(klassrum.cols);
                  setKlassrumsId(klassrum.id);
                  setLaddaKlassrum(false);
                  setLaddarKlassrum(true);
                  setNyttNamn(null);
                  setRows(klassrum.rows);
                  setKlassrumsnamn(klassrum.namn);
                }
              }}
            >
              {klassrum.namn}
            </li>
          );
        })}
      </ul>
    </Overlay>
  );
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
  const taBortKlassrum = (id) => {
    let nyData = data;
    nyData.klassrum = nyData.klassrum.filter((klassrum) => klassrum.id !== id);
    sparaData(nyData);
    setKlassrumsnamn(null);
    setLaddaKlassrum(false);
    setNyttNamn(null);
    setGrid(
      Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          id: null,
          person: 0,
        }))
      )
    );
  };
  async function checkLoginStatus() {
    const response = await fetch("https://auth.skola77.com/home", {
      credentials: "include",
    });
    const result = await response.json();

    const parsedData = JSON.parse(result.data);
    console.log(parsedData);

    setData(parsedData);
    const klassrum = parsedData.klassrum;
    const klasser = parsedData.klasser;

    console.log("Klassrum:", klassrum);
    console.log("Klasser:", klasser);
  }

  const spara = () => {
    let newData = data;
    if (klassrumsId) {
      newData.klassrum[
        data.klassrum.findIndex((klassrum) => klassrum.id === klassrumsId)
      ] = {
        id: klassrumsId,
        namn: nyttNamn || klassrumsnamn || "Namlöst klassrum",
        rows: rows,
        cols: cols,
        grid: grid,
      };

      console.log(newData);
      sparaData(newData);
      setSparat(true);
    } else {
      let nyttNamn = prompt("Vad heter klassrummet?");
      setKlassrumsnamn(nyttNamn);
      setLaddarKlassrum(true);
      const nyttId = generateUniqueId();
      setKlassrumsId(nyttId);
      newData.klassrum.push({
        id: nyttId,
        namn: nyttNamn,
        rows: rows,
        cols: cols,
        grid: grid,
      });
      console.log(newData + " 1");
      sparaData(newData);
      setSparat(true);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);
  useEffect(() => {
    const uppdatera = () => {
      setVägg(window.outerWidth > 700);
    };
    window.addEventListener("resize", uppdatera);
    return () => {
      window.removeEventListener("resize", uppdatera);
    };
  }, []);
  useEffect(() => {
    if (!laddarKlassrum) {
      setSparat(false);
    } else {
      setLaddarKlassrum(false);
    }
  }, [cols, rows, grid, nyttNamn, klassrumsId]);
  return (
    <div>
      <div className="w-full top-[70px] relative"></div>
      <div className="flex flex-wrap">
        <div className="flex flex-grow flex-wrap">
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
            <div>
              <div className="text-center text-2xl">Rader</div>
              <input
                type="number"
                min="1"
                value={rows}
                onChange={(e) => ändraRader(parseInt(e.target.value) - rows)}
              />
            </div>
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
            <div>
              <div className="text-center text-2xl">Kolumner</div>
              <input
                type="number"
                min="1"
                value={cols}
                onChange={(e) => ändraKolumner(parseInt(e.target.value) - cols)}
              />
            </div>
          )}
        </div>
        <div className="flex">
          <div className="flex">
            {klassrumsId && (
              <div className="h-full flex justify-center items-center">
                <div
                  className="bg-red-500 flex justify-center items-center text-white aspect-square h-10 rounded-lg mr-2 "
                  onClick={() => {
                    taBortKlassrum(klassrumsId);
                  }}
                >
                  <RiDeleteBin6Line />
                </div>
              </div>
            )}
            <div className="relative h-full flex items-center mr-5 justify-center">
              {data && data.klassrum.length > 0 && (
                <div>
                  <button
                    onClick={() => {
                      setLaddaKlassrum(!laddaKlassrum);
                    }}
                    className="bg-green-500 h-10 rounded-lg text-white w-52"
                  >
                    Ladda
                  </button>

                  <div className="relative">{laddaMeny}</div>
                </div>
              )}
            </div>
          </div>
          <div className="h-full flex items-center justify-center">
            <button
              onClick={spara}
              className="bg-green-500 rounded-lg h-10 text-white float-end mr-10"
            >
              Spara
            </button>
          </div>
        </div>
      </div>

      <input
        onChange={(e) => setNyttNamn(e.target.value)}
        onBlur={() => setKlassrumsnamn(nyttNamn || "Namnlöst klassrum")}
        className="text-center margin-auto w-[100vw] bg-inherit mx-0 text-center outline-none text-3xl"
        value={
          nyttNamn
            ? nyttNamn
            : nyttNamn === ""
            ? ""
            : klassrumsnamn || "Nytt klassrum"
        }
      />

      <div
        className={
          vägg &&
          "m-auto p-5 px-12 w-fit fit-content rounded-lg border-black border-4 mt-4 m-3"
        }
      >
        <Klassrum
          rows={rows}
          låstaBänkar={låstaBänkar}
          setLåstaBänkar={setLåstaBänkar}
          columns={cols}
          grid={grid}
          setGrid={setGrid}
          names={names}
        />
      </div>
    </div>
  );
};

export default Grid3;
