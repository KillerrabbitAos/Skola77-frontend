import { useState } from "react";
import Klassrum from "./Klassrum";
import { data } from "./data";
import NameList from "./Namn";
import "./Animationer.css";

const SkapaPlaceringar = () => {
  const [grid, setGrid] = useState(data.klassrum[0].grid);
  const [rows, setRows] = useState(data.klassrum[0].rows);
  const [cols, setCols] = useState(data.klassrum[0].cols);
  const [klassnamn, setKlassnamn] = useState(null);
  const [namn, setNamn] = useState(["", "orm"]);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [klar, setKlar] = useState(false);
  const [omvänd, setOmvänd] = useState(false);
  const [klassrumsnamn, setKlassrumsnamn] = useState(null);
  const väljKLassOchKlassrum =
    klassrumsnamn && klassnamn ? (
      <div className="krnkn h-[30px] flex items-center justify-center">
        <h2 className="text-xl text-center font-bold">
          {klassnamn} i {klassrumsnamn}
        </h2>
      </div>
    ) : (
      <div className="flex flex-wrap justify-center gap-4">
        {klassnamn ? (
          <div className="flex justify-center items-center">
            <h2 className="text-xl font-bold">{`${klassnamn} i`}</h2>
          </div>
        ) : (
          <div className="w-52">
            <h2 className="text-xl font-bold">Klass</h2>
            <ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
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
            </ul>
          </div>
        )}

        {klassrumsnamn ? (
          <div className="flex justify-center items-center">
            <h2 className="text-xl font-bold">{`i ${klassrumsnamn}`}</h2>
          </div>
        ) : (
          <div className="w-52">
            <h2 className="text-xl font-bold">Klassrum</h2>
            <ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
              {data.klassrum.map((klassrum, index) => (
                <li
                  key={klassrum.name || index}
                  className="font-bold text-xl p-2 cursor-pointer"
                  onClick={() => {
                    setGrid(klassrum.grid);
                    setRows(klassrum.rows);
                    setCols(klassrum.cols);
                    setKlassrumsnamn(klassrum.name);
                  }}
                >
                  {klassrum.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );

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
      {väljKLassOchKlassrum}
      <Klassrum
        edit={false}
        låstaBänkar={låstaBänkar}
        setLåstaBänkar={setLåstaBänkar}
        grid={grid}
        columns={cols}
        rows={rows}
        setGrid={setGrid}
        klar={klar}
        reverse={omvänd}
        setReverse={setOmvänd}
        names={namn}
      />{" "}
      <div className="flex gap-4 w-full flex-wrap justify-center">
        <button
          style={{ padding: "20px" }}
          className="bg-[#4CAF50] text-white"
          onClick={slumpa}
        >
          Slumpa
        </button>
        <button
          style={{ padding: "20px" }}
          className="bg-[#4CAF50] text-white"
          onClick={() => {
            setKlar(!klar);
          }}
        >
          Klar
        </button>
        <button
          style={{ padding: "20px" }}
          className="bg-[#4CAF50] text-white"
          onClick={() => {
            setOmvänd(omvänd ? false : true);
          }}
        >
          Byt till {omvänd ? "elevperspektiv" : "lärarperspektiv"}
        </button>
      </div>
      {namn && (
        <div>
          {namn
            .map((namn, index) => {
              return { namn: namn, orginalIndex: index };
            })
            .sort((a, b) => a.namn.localeCompare(b.namn))
            .map((namnObj) => (
              <div key={namnObj.orginalIndex} className="inline-block w-[50px] h-[50px] bg-red-500">{namnObj.namn}</div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SkapaPlaceringar;
