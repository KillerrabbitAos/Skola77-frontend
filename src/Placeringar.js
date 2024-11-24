import { useState, useEffect, useRef } from "react";
import Klassrum from "./Klassrum";
import { data as originalData } from "./data";
import NameList from "./Klasser";
import "./Animationer.css";
function generateUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function divideArray(list, x) {
  if (x <= 0) throw new Error("Number of parts must be greater than 0.");
  const result = [];
  const partSize = Math.floor(list.length / x);
  let remainder = list.length % x;
  let start = 0;

  for (let i = 0; i < x; i++) {
    const end = start + partSize + (remainder > 0 ? 1 : 0);
    result.push(list.slice(start, end));
    start = end;
    if (remainder > 0) remainder--;
  }

  return result;
}

const myList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const dividedLists = divideArray(myList, 3);

console.log(dividedLists);
async function scaleToFit(content, setUpdateSize, updateSize) {
  // A4 or Letter page dimensions in inches
  const pageWidth = 8.27; // A4 width in inches (Letter: 8.5)
  const pageHeight = 11.69; // A4 height in inches (Letter: 11)

  // Dynamically calculate DPI
  const dpi = calculateDPI();

  // Get content dimensions in pixels
  const contentWidth = content.offsetWidth;
  const contentHeight = content.offsetHeight;

  // Convert page dimensions to pixels
  const printableWidth = pageWidth * dpi;
  const printableHeight = pageHeight * dpi;

  // Calculate the required scaling factor
  const scaleX = printableWidth / contentWidth;
  const scaleY = printableHeight / contentHeight;

  // Choose the smaller scaling factor to maintain aspect ratio
  const scale = Math.min(scaleX, scaleY);

  // Apply scaling with CSS
  content.style.transformOrigin = "top left"; // Set the origin for scaling
  content.style.transform = `scale(${scale})`;

  // Adjust layout to prevent clipping
  const scaledWidth = contentWidth * scale;
  const scaledHeight = contentHeight * scale;
  content.style.width = `${scaledWidth}px`;
  content.style.height = `${scaledHeight}px`;

  // Optional: Add margins for better page alignment
  content.style.margin = "0 auto";

  // Trigger the print dialog
  setUpdateSize(!updateSize);
  await new Promise((resolve) => setTimeout(resolve, 500));
  window.print();

  // Reset styles after printing
  content.style.transform = "";
  content.style.transformOrigin = ""; // Reset to default
  content.style.width = "";
  content.style.height = "";
  content.style.margin = "";
}

// Function to calculate DPI dynamically
function calculateDPI() {
  // Create an element for testing DPI
  const dpiTest = document.createElement("div");
  dpiTest.style.width = "1in"; // Set width to 1 inch
  dpiTest.style.position = "absolute"; // Prevent affecting layout
  dpiTest.style.visibility = "hidden"; // Hide from view
  document.body.appendChild(dpiTest);

  // Measure the width in pixels
  const dpi = dpiTest.offsetWidth;

  // Remove the test element
  document.body.removeChild(dpiTest);

  return dpi * window.devicePixelRatio; // Adjust for pixel density
}

const SkapaPlaceringar = () => {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(7);
  const [grid, setGrid] = useState(
    Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ id: null, person: 0 }))
    )
  );
  const [data, setData] = useState(null);
  const [klassrumsId, setKlassrumsId] = useState(null);
  const [updateSize, setUpdateSize] = useState(false);
  const [kolumner, setKolumner] = useState(3);
  const [frånvarande, setFrånvarande] = useState([]);
  const [klassnamn, setKlassnamn] = useState(null);
  const [namn, setNamn] = useState(["", "orm"]);
  const [låstaBänkar, setLåstaBänkar] = useState([]);
  const [klar, setKlar] = useState(false);
  const [omvänd, setOmvänd] = useState(false);
  const [klassId, setKlassId] = useState(null);
  const [klassrumsnamn, setKlassrumsnamn] = useState(null);
  const [placeringsId, setPlaceringsId] = useState(null);
  async function checkLoginStatus() {
    setData(originalData);
  }
  function sparaData(nyData) {
    setData(nyData);
  }
  const content = useRef(null);
  const väljKLassOchKlassrum =
    klassrumsnamn && klassnamn ? (
      <div className="krnkn h-[70px] flex items-center justify-center">
        <div className="text-2xl m-3 flex text-center font-bold">
          <div
            onClick={() => {
              setNamn([""]);
              setGrid(
                grid.map((rad) => rad.map(({ id }) => ({ id, person: 0 })))
              );

              setKlassnamn(null);
            }}
          >
            {klassnamn}
          </div>
          <div className="mx-1">i</div>
          <div
            onClick={() => {
              setGrid(
                Array.from({ length: rows }, () =>
                  Array.from({ length: cols }, () => ({
                    id: null,
                    person: 0,
                  }))
                )
              );
              setRows(6);
              setCols(7);
              setKlassrumsnamn(null);
              setKlassrumsId(null);
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
            <h2
              onClick={() => {
                setNamn([""]);
                setGrid(
                  grid.map((rad) => rad.map(({ id }) => ({ id, person: 0 })))
                );

                setKlassnamn(null);
              }}
              className="text-xl font-bold"
            >{`${klassnamn} i`}</h2>
          </div>
        ) : (
          <div className="w-52">
            <h2 className="text-xl mt-2 font-bold">Klass</h2>
            <ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
              {data &&
                data.klasser.map((klass) => {
                  return (
                    <li
                      key={klass.id}
                      className="font-bold text-xl p-2 cursor-pointer"
                      onClick={() => {
                        setNamn(klass.personer);
                        setKlassnamn(klass.namn);
                        setKlassId(klass.id);
                      }}
                    >
                      {klass.namn}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}

        {klassrumsnamn ? (
          <div className="flex justify-center items-center">
            <h2
              onClick={() => {
                setGrid(
                  Array.from({ length: rows }, () =>
                    Array.from({ length: cols }, () => ({
                      id: null,
                      person: 0,
                    }))
                  )
                );
                setRows(6);
                setCols(7);
                setKlassrumsnamn(null);
                setKlassrumsId(null);
              }}
              className="text-xl font-bold"
            >{`i ${klassrumsnamn}`}</h2>
          </div>
        ) : (
          <div className="w-52">
            <h2 className="text-xl mt-2 font-bold">Klassrum</h2>
            <ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
              {data &&
                data.klassrum.map((klassrum) => {
                  return (
                    <li
                      key={klassrum.id}
                      className="font-bold text-xl p-2 cursor-pointer"
                      onClick={() => {
                        setGrid(klassrum.grid);
                        setRows(klassrum.rows);
                        setCols(klassrum.cols);
                        setKlassrumsnamn(klassrum.namn);
                        setKlassrumsId(klassrum.id);
                      }}
                    >
                      {klassrum.namn}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    );
  async function chekLoginStatus() {
    const response = await fetch("http://192.168.50.107:3000/api/getKlassrum");
    const result = await response.json();
    const parsedData = JSON.parse(result[0].data);
    setData(parsedData);
    const klassrum = parsedData.klassrum;
    const klasser = parsedData.klasser;

    console.log("Klassrum:", klassrum);
    console.log("Klasser:", klasser);
  }
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
    checkLoginStatus();
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
      {placeringsId || (data && !data.placeringar[0]) ? (
        <div className="w-full grid grid-cols-10">
          {placeringsId ? (
            <div
              onClick={() => {
                setNamn([""]);
                setKlassnamn(null);
                setKlassId(null);
                setKlassrumsId(null);
                setKlassrumsnamn(null);
                setPlaceringsId(null);
                setGrid(
                  Array.from({ length: rows }, () =>
                    Array.from({ length: cols }, () => ({
                      id: null,
                      person: 0,
                    }))
                  )
                );
                setRows(6);
                setCols(7);
              }}
              className="w-[10vw] bg-green-500 h-[4vw] place-self-start flex justify-center items-center"
            ><img className="h-[4vw]" src="/pil-vänster.png"/></div>
          ) : (
            <div></div>
          )}
          <div className="col-span-8">{väljKLassOchKlassrum}</div>
        </div>
      ) : (
        <div className="w-52 m-auto">
          <h2 className="text-xl mt-2 font-bold">Placeringar</h2>
          <ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
            <li
              key={"ny placering"}
              className="font-bold text-xl p-2 cursor-pointer"
              onClick={() => {
                const beng = generateUniqueId();
                setNamn([""]);
                setKlassnamn(null);
                setKlassId(null);
                setKlassrumsId(null);
                setKlassrumsnamn(null);

                setPlaceringsId(JSON.parse(JSON.stringify(beng)));
              }}
            >
              ny placering
            </li>
            {data &&
              data.placeringar.map((placering) => {
                return (
                  <li
                    key={placering.id}
                    className="font-bold text-xl p-2 cursor-pointer"
                    onClick={() => {
                      setNamn(placering.klass.personer);
                      setKlassnamn(placering.klass.namn);
                      setKlassrumsId(placering.klassrum.id);
                      setKlassrumsnamn(placering.klassrum.namn);
                      setKlassId(placering.klass.id);
                      setGrid(placering.klassrum.grid);
                      setCols(placering.klassrum.cols);
                      setPlaceringsId(placering.id);
                      setRows(placering.klassrum.rows);
                    }}
                  >
                    {placering.namn}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      <div ref={content} style={{ zIndex: "100" }}>
        <Klassrum
          edit={false}
          updateSize={updateSize}
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
      </div>
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
          onClick={async () => {
            setKlar(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await scaleToFit(content.current, setUpdateSize, updateSize);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setKlar(false);
          }}
        >
          skrivUt
        </button>
        <button
          style={{ padding: "20px" }}
          className="bg-[#4CAF50] text-white"
          onClick={() => {
            let nyData = data;
            let index = (klassnamn || "en tom klass") + " i " + (klassrumsnamn || "ett tomt klassrum");
            if (
              data.placeringar.some(
                (placering) => placering.id === placeringsId
              )
            ) {
              nyData.placeringar = data.placeringar.map((placering) => {
                if (placering.id === placeringsId) {
                  return {
                    id: placeringsId,
                    namn: index,
                    klassrum: {
                      id: klassrumsId,
                      namn: klassrumsnamn,
                      grid: grid,
                      cols: cols,
                      rows: rows,
                    },
                    klass: { id: klassId, namn: klassnamn, personer: namn },
                  };
                } else {
                  return { placering };
                }
              });
            } else {
              const nyttId = generateUniqueId();
              setPlaceringsId(nyttId);
              nyData.placeringar.push({
                id: nyttId,
                namn: index,
                klassrum: {
                  id: klassrumsId,
                  namn: klassrumsnamn,
                  grid: grid,
                  cols: cols,
                  rows: rows,
                },
                klass: { id: klassId, namn: klassnamn, personer: namn },
              });
            }
            console.log(nyData);
            sparaData(nyData);
          }}
        >
          spara
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
