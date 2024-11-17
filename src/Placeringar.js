import { useState, useEffect } from "react";
import Klassrum from "./Klassrum";
import { data } from "./data";
import NameList from "./Klasser";
import "./Animationer.css";
function divideArray(array, parts) {
  let result = [];
  let partSize = Math.floor(array.length / parts);

  for (let i = 0; i < parts; i++) {
    result.push(array.slice(i * partSize, (i + 1) * partSize));
  }

  return result;
}

const myList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const dividedLists = divideArray(myList, 3);

console.log(dividedLists);

const SkapaPlaceringar = () => {
  const [grid, setGrid] = useState(data.klassrum["H221"].grid);
  const [rows, setRows] = useState(data.klassrum["H221"].rows);
  const [cols, setCols] = useState(data.klassrum["H221"].cols);
  const [kolumner, setKolumner] = useState(3);
  const [frånvarande, setFrånvarande] = useState([]);
  const [klassnamn, setKlassnamn] = useState(null);
  const [namn, setNamn] = useState(["", "orm"]);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [klar, setKlar] = useState(false);
  const [omvänd, setOmvänd] = useState(false);
  const [klassrumsnamn, setKlassrumsnamn] = useState(null);
  const väljKLassOchKlassrum =
    klassrumsnamn && klassnamn ? (
      <div className="krnkn h-[30px] flex items-center justify-center">
        <div className="text-xl flex text-center font-bold">
          <div
            onClick={() => {
              setNamn([""]);
              setKlassnamn(null);
            }}
          >
            {klassnamn}
          </div>
          <div className="mx-1">i</div>
          <div
            onClick={() => {
              setGrid(data.klassrum["H221"].grid);
              setRows(data.klassrum["H221"].rows);
              setCols(data.klassrum["H221"].cols);
              setKlassrumsnamn(null);
            }}
          >
            {klassrumsnamn}
          </div>
        </div>
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
              {Object.keys(data.klasser)
                .slice()
                .reverse()
                .map((klassKey) => {
                  const klass = data.klasser[klassKey];
                  return (
                    <li
                      key={klassKey}
                      className="font-bold text-xl p-2 cursor-pointer"
                      onClick={() => {
                        setNamn(klass.personer);
                        setKlassnamn(klassKey);
                      }}
                    >
                      {klassKey}
                    </li>
                  );
                })}
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
                      setKlassrumsnamn(klassrumKey);
                    }}
                  >
                    {klassrumKey}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );

  const slumpa = () => {
    const nyGrid = [];
    const namnAttSlumpa = [];
    console.log(låstaBänkar);

    namn.forEach(
      (namn, index) =>
        !(
          låstaBänkar.includes(index) ||
          frånvarande.includes(index) ||
          index === 0
        ) && namnAttSlumpa.push(index)
    );

    namnAttSlumpa.sort(() => Math.random() - 0.5);
    let slumpIndex = 0;

    grid.forEach((rad) => {
      const nyRad = [];
      rad.forEach((plats) => {
        let person = 0;

        if (plats.id) {
          if (låstaBänkar.includes(plats.id)) {
            person = plats.person;
          } else if (slumpIndex < namnAttSlumpa.length) {
            person = namnAttSlumpa[slumpIndex];
            slumpIndex++;
          } else {
            person = 0;
          }
        }

        nyRad.push({
          id: plats.id,
          person,
        });
      });
      nyGrid.push(nyRad);
    });

    setGrid(nyGrid);
  };

  const namnILista =
    namn &&
    divideArray(
      namn
        .map((namn, index) => ({ namn: namn, orginalIndex: index }))
        .sort((a, b) => a.namn.localeCompare(b.namn))
        .slice(1)
        .map((namnObj) => (
          <div
            key={namnObj.orginalIndex}
            className="text-lg border-solid m-[5px] border-[3px] w-[315px] h-[50px]"
          >
            <div className="flex justify-between items-center w-full">
              <div className="truncate">{namnObj.namn}</div>
              <div>
                {frånvarande.includes(namnObj.orginalIndex) ? (
                  <div
                    onClick={() => {
                      setFrånvarande((prevFrånvarande) =>
                        prevFrånvarande.filter(
                          (namnObj2) => namnObj2 !== namnObj.orginalIndex
                        )
                      );
                    }}
                    className="bg-red-500 align-middle justify-center flex-row flex items-center text-center h-[45px] text-white w-[175px] rounded-[5px]"
                  >
                    frånvarande
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setFrånvarande((prevFrånvarande) => [
                        ...prevFrånvarande,
                        namnObj.orginalIndex,
                      ]);
                    }}
                    className="bg-green-500 align-middle justify-center flex-row flex items-center text-center h-[45px] text-white w-[175px] rounded-[5px]"
                  >
                    <span>närvarande</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )),
      Math.floor(window.outerWidth / 320)
    );
  useEffect(() => {
    window.addEventListener("resize", () => {
      setKolumner(namnILista.length);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setKolumner(namnILista.length);
      });
    };
  }, []);
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
          {!klar ? "Klar" : "Fortsätt redigera"}
        </button>
        <button
          style={{ padding: "20px" }}
          className="bg-[#4CAF50] text-white"
          onClick={() => {
            setOmvänd(!omvänd);
          }}
        >
          Byt till {omvänd ? "elevperspektiv" : "lärarperspektiv"}
        </button>
      </div>
      <div
        className="m-auto"
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {namnILista.map((kolumn) => (
          <div>{kolumn}</div>
        ))}
      </div>
    </div>
  );
};

export default SkapaPlaceringar;
