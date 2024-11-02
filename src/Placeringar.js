import { useState } from "react";
import Klassrum from "./Klassrum";
import { data } from "./data";
import NameList from "./Namn";

const SkapaPlaceringar = () => {
  const [grid, setGrid] = useState(data.klassrum[0].grid);
  const [rows, setRows] = useState(data.klassrum[0].rows);
  const [cols, setCols] = useState(data.klassrum[0].cols);
  const [Klassnamn, setKlassnamn] = useState(null);
  const [namn, setNamn] = useState(["", "orm"]);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [klar, setKlar] = useState(false)
  const slumpa = () => {
    const nyGrid = [];
    const användaNummer = [];
    grid.map((rad) => {
      const namnAttSlumpa = [];
      console.log(låstaBänkar);
      namn.forEach(
        (namn, index) =>
          !låstaBänkar.includes(index) && namnAttSlumpa.push(namn)
      );
      console.log(namnAttSlumpa);
      const nyRad = rad.map((plats, kolumn) => {
        if (
          plats.id &&
          namn.length > cols &&
          kolumn < cols &&
          !låstaBänkar.includes(plats.id)
        ) {
          let nummer = Math.floor(Math.random() * (namn.length - 1)) + 1;
          let orm = false;
          let i = 0;
          while (
            (låstaBänkar.includes(nummer) || användaNummer.includes(nummer)) &&
            i !== 10
          ) {
            console.log("has");
            nummer = Math.floor(Math.random() * (namn.length - 1)) + 1;
            if (
              låstaBänkar.includes(nummer) &&
              användaNummer.length === namnAttSlumpa.length - 1
            ) {
              nummer = 0;
              console.log(användaNummer);
              i = 10;
            }
            if (användaNummer.length === namnAttSlumpa.length - 1) {
              nummer = 0;
              console.log(användaNummer);
              i = 10;
            }
          }
          if (nummer !== 0) {
            användaNummer.push(nummer);
          }
          return {
            id: plats.id,
            person: nummer,
          };
        } else {
          return plats;
        }
      });
      nyGrid.push(nyRad);
    });
    setGrid(nyGrid);
  };

  return (
    <div>
      <Klassrum
        edit={false}
        låstaBänkar={låstaBänkar}
        setLåstaBänkar={setLåstaBänkar}
        grid={grid}
        setGrid={setGrid}
        klar={klar}
        names={namn}
      />{" "}
      <button onClick={slumpa}>Slumpa</button>
      {data.klasser
        .slice()
        .reverse()
        .map((klass) => (
          <li
            key={klass.namn}
            className="font-bold text-xl p-2 cursor-pointer"
            onClick={() => {
              setNamn(klass.personer);
              setKlassnamn(klass.namn);
            }}
          >
            {klass.namn}
          </li>
        ))}


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

export default SkapaPlaceringar;
