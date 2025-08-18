import React, { useState, useEffect } from "react";
import { data as originalData } from "./data.js";
import { isTablet, isMobile } from "react-device-detect";
import Klassrum from "./Klassrum";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Grid.css";
import Overlay from "./Overlay.jsx";
import { RiCheckLine, RiSaveLine } from "react-icons/ri";
import Footer from './sidor/footer.jsx';



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
  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        id: null,
        person: 0,
      }))
    )
  );
  const [data, setData] = useState(null);
  const [klassrumsnamn, setKlassrumsnamn] = useState(null);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [engelska, setEngelska] = useState(true)
  const [gridData, setGridData] = useState("");
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [klassrumsId, setKlassrumsId] = useState(null);
  const [vägg, setVägg] = useState(
    window.outerWidth ? window.outerWidth > 700 : !isMobile || isTablet
  );
  const [laddaKlassrum, setLaddaKlassrum] = useState(false);
  const [nyttNamn, setNyttNamn] = useState(null);

  const [isSaved, setIsSaved] = useState(false);


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
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={() => setLaddaKlassrum(false)} // Stäng popup när man klickar utanför menyn
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-4 relative"
        onClick={(e) => e.stopPropagation()} // Hindra stängning om man klickar på menyn
      >
        {/* Grön topp med hel bakgrund */}
        <div className="bg-green-500 h-16 rounded-t-lg flex justify-between items-center px-4">
          <h2 className="text-white font-bold text-lg">
            {engelska ? "Select Classroom" : "Välj Klassrum"}
          </h2>
          <button
            className="text-white text-3xl font-bold"
            onClick={() => setLaddaKlassrum(false)}
          >
            ×
          </button>
        </div>
        
        {/* Meny-lista */}
        <ul className="overflow-y-scroll rounded-[8px] scrollbar-thin scrollbar-track-rounded-[8px] scrollbar-track-transparent scrollbar-thumb-black max-h-[70vh] mt-4">
          <li
            className="font-bold text-xl p-4 cursor-pointer hover:bg-gray-100"
            onClick={() => {
              setKlassrumsnamn(null);
              setLaddaKlassrum(false);
              setKlassrumsId(null);
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
            {engelska ? "new classroom" : "nytt klassrum"}
          </li>
          {data.klassrum.map((klassrum) => (
            <li
              key={klassrum.id}
              className="font-bold hover:bg-gray-100 text-xl p-4 cursor-pointer"
              onClick={() => {
                if (
                  sparat ||
                  window.confirm(
                    engelska
                      ? "You have unsaved changes. Are you sure you want to continue? If not, press cancel and save first."
                      : "Du har osparade ändringar. Vill du fortsätta ändå? Om inte, tryck på avbryt och spara först."
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
          ))}
        </ul>
      </div>
    </div>
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
    setKlassrumsId(null);
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
    try {
        const response = await fetch("https://auth.skola77.com/home", {
            credentials: "include",
        });
        const result = await response.json();

        try {
            const parsedData = JSON.parse(result.data);
            setEngelska(JSON.parse(result.settings).engelska)
            setData(parsedData);
            const klassrum = parsedData.klassrum;
            const klasser = parsedData.klasser;

            console.log("Klassrum:", klassrum);
            console.log("Klasser:", klasser);
        } catch (parseError) {
            console.error("Kunde inte parsa data:", parseError);
            //window.location.href = "https://auth.skola77.com?skola77";
        }
    } catch (fetchError) {
        console.error("Fel vid hämtning av data:", fetchError);
        window.location.href = "https://auth.skola77.com?skola77";
    }
}
const spara = () => {
  let newData = data;
  if (klassrumsId) {
    newData.klassrum[
      data.klassrum.findIndex((klassrum) => klassrum.id === klassrumsId)
    ] = {
      id: klassrumsId,
      namn: nyttNamn || klassrumsnamn || (engelska ? "Untitled classroom" : "Namlöst klassrum"),
      rows: rows,
      cols: cols,
      grid: grid,
    };

    console.log(newData);
    sparaData(newData);
    setSparat(true);
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false); 
    }, 2000);
  } else {
    let nyttNamn = prompt(engelska ? "What's the classroom called?" : "Vad heter klassrummet?");
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
    setIsSaved(true);

    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
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
              <span id="skola77ärbra">{engelska ? "Rows" : "Rader"}</span>
              <button onClick={() => ändraRader(-1)} className="sänkKnapp">
                -
              </button>
              <button onClick={() => ändraRader(1)} className="höjKnapp">
                +
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center text-2xl">{engelska ? "Rows" : "Rader"}</div>
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
              <span id="skola77ärbra">{engelska ? "Columns" : "Kolumner"}</span>
              <button onClick={() => ändraKolumner(-1)} className="sänkKnapp">
                -
              </button>
              <button onClick={() => ändraKolumner(1)} className="höjKnapp">
                +
              </button>
            </div>
          ) : (
            <div>
              <div className="text-center text-2xl">{engelska ? "Columns" : "Kolumner"}</div>
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
                    className="bg-green-500 h-10 rounded-lg text-white w-32"
                  >
                    {engelska ? "My classrooms" : "Mina klassrum"}
                  </button>

                  <div className="relative">{laddaMeny}</div>
                </div>
              )}
            </div>
          </div>
          <div className="relative h-full flex items-center mr-5 justify-center">
  <div className="h-full flex items-center justify-center">
    <button
      onClick={spara}
      className={`bg-green-500 h-10 rounded-lg text-white w-32 mr-5 flex items-center justify-center ${isSaved ? "bg-green-700" : ""}`}
    >
      {isSaved ? (
        <RiCheckLine size={20} className="mr-2" />
      ) : (
        (engelska ? "Save" : "Spara")
      )}
    </button>
  </div>
</div>



        </div>
      </div>

      <input
        onChange={(e) => setNyttNamn(e.target.value)}
        onBlur={() => setKlassrumsnamn(nyttNamn || "Namnlöst klassrum")}
        className="text-center margin-auto w-[100vw] bg-inherit mx-0 outline-none text-3xl"
        value={
          nyttNamn
            ? nyttNamn
            : nyttNamn === ""
            ? ""
            : klassrumsnamn || (engelska ? "New classroom" : "Nytt klassrum")
        }
      />

      <div
        className={
          vägg &&
          "m-auto p-5 px-12 w-fit fit-content rounded-lg border-black border-4 mt-4"
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
          engelska={engelska}
        />
      </div>
      <Footer />

    </div>
  );
};

export default Grid3;
