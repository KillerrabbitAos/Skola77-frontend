import { useState, useEffect, useRef } from "react";
import Klassrum from "./Klassrum";
import { data as originalData } from "./data";
import NameList from "./Klasser";
import "./Animationer.css";
import Overlay from "./Overlay";
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
  const [placeringsnamn, setPlaceringsnamn] = useState(null);
  const [visaKlassmeny, setVisaklassmeny] = useState(true);
  const [visaKlassrumsmeny, setVisaklassrumsmeny] = useState(true);
  const [vägg, setVägg] = useState(false);
  const klassrumsmenyRef = useRef(null);
  const klassmenyRef = useRef(null);
  const [klassmenykord, setKlassmenykord] = useState([1]);
  const [klassrumsmenykord, setKlassrumsmenykord] = useState([1]);
  const [nyttPlaceringsnamn, setNyttPlaceringsnamn] = useState(null);
  async function checkLoginStatus() {
    setData(originalData);
  }
  function sparaData(nyData) {
    setData(nyData);
  }

  const content = useRef(null);
  const väljKLassOchKlassrum = (
    <div className="flex flex-wrap justify-center gap-4">
      <div
        ref={klassmenyRef}
        className="w-fit justify-center items-center flex"
      >
        <div style={{ height: "46px" }}>
          <h2 className="text-xl mt-2 font-bold mr-1">Klass: </h2>
        </div>
        <div
          style={{
            position: "relative",
            width: "180px",
            height: "46px",
          }}
          className="!h-[46px]"
        >
          <Overlay>
            <ul
              style={{
                height: visaKlassmeny ? "12rem" : "46px",
              }}
              className="overflow-y-scroll scrollbar-none place-self-start bg-[#f1f1f1] w-52 border border-black"
            >
              {visaKlassmeny ? (
                data && (
                  <div>
                    <div className="flex">
                      <li
                        className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                        onClick={() => setVisaklassmeny(false)}
                      >
                        <div className="flex justify-center items-center">
                          <div className="w-[155px] truncate">
                            {klassnamn || "Välj klass..."}
                          </div>
                          <img className="w-[20px]" src="/nerpil.png"></img>
                        </div>
                      </li>
                    </div>
                    {data.klasser.map((klass) => {
                      if (klass.id !== klassId) {
                        return (
                          <li
                            key={klass.id}
                            className="font-bold text-xl p-2 cursor-pointer"
                            onClick={() => {
                              setNamn(klass.personer);
                              setKlassnamn(klass.namn);
                              setKlassId(klass.id);
                              setGrid((prevGrid) =>
                                prevGrid.map((rad) =>
                                  rad.map((ruta) => {
                                    return { id: ruta.id, person: 0 };
                                  })
                                )
                              );
                              setVisaklassmeny(false);
                            }}
                          >
                            {klass.namn}
                          </li>
                        );
                      }
                    })}
                  </div>
                )
              ) : (
                <div
                  className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                  onClick={() => {
                    setVisaklassmeny(true);
                  }}
                >
                  <div className="flex justify-center items-center">
                    <div className="w-[155px] truncate">
                      {klassnamn || "Välj klass..."}
                    </div>
                    <img
                      style={{
                        rotate: !visaKlassmeny && "90deg",
                        animationName: visaKlassmeny ? "vridNer" : "vridUpp",
                        animationDuration: "0.1s",
                      }}
                      className="w-[20px]"
                      src="/nerpil.png"
                    ></img>
                  </div>
                </div>
              )}
            </ul>
          </Overlay>
        </div>
      </div>

      {
        <div className="w-fit flex justify-center items-center">
          <div style={{ height: "46px" }}>
            <h2 ref={klassrumsmenyRef} className="text-xl mt-2 font-bold mr-1">
              Klassrum:{" "}
            </h2>
          </div>
          <div
            style={{
              position: "relative",
              width: "180px",
              height: "46px",
            }}
            className="!h-[46px]"
          >
            <Overlay>
              <ul
                style={{
                  height: visaKlassrumsmeny ? "12rem" : "46px",
                }}
                className="overflow-y-scroll scrollbar-none place-self-start bg-[#f1f1f1] w-52 border border-black"
              >
                {visaKlassrumsmeny ? (
                  data && (
                    <div>
                      <div className="flex">
                        <li
                          className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                          onClick={() => setVisaklassrumsmeny(false)}
                        >
                          <div className="flex justify-center items-center">
                            <div className="w-[155px]">
                              {klassrumsnamn || "Välj klassrum..."}
                            </div>
                            <img className="w-[20px]" src="/nerpil.png"></img>
                          </div>
                        </li>
                      </div>
                      {data.klassrum.map((klassrum, index) => {
                        if (klassrum.id !== klassrumsId) {
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
                                setVisaklassrumsmeny(false);
                              }}
                            >
                              {klassrum.namn}
                            </li>
                          );
                        }
                      })}
                    </div>
                  )
                ) : (
                  <div
                    className="font-bold text-xl overflow-hidden truncate p-2 cursor-pointer"
                    onClick={() => {
                      setVisaklassrumsmeny(true);
                    }}
                  >
                    <div className="flex justify-center items-center">
                      <div className="w-[155px] truncate">
                        {klassrumsnamn || "Välj klassrum"}
                      </div>
                      <img
                        style={{
                          rotate: !visaKlassrumsmeny && "90deg",
                          animationName: visaKlassrumsmeny
                            ? "vridNer"
                            : "vridUpp",
                          animationDuration: "0.1s",
                        }}
                        className="w-[20px]"
                        src="/nerpil.png"
                      ></img>
                    </div>
                  </div>
                )}
              </ul>
            </Overlay>
          </div>
        </div>
      }
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
  const sparaKlass = (index) => {
    let nyData = data;

    if (data.placeringar.some((placering) => placering.id === placeringsId)) {
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
          return placering;
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
  };
  const slumpa = () => {
    const nyGrid = [];
    const namnAttSlumpa = [];
    console.log(låstaBänkar);
    namn.forEach((namn, index) => {
      if (namn === "") {
        låstaBänkar.push(index);
      }
    });

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
        .filter((namn) => namn.namn !== "")
        .map(
          (namnObj) =>
            namnObj.namn !== "" && (
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
            )
        ),
      Math.floor(window.outerWidth / 330)
    );
  useEffect(() => {
    setVisaklassrumsmeny(!klassrumsnamn);
    setVisaklassmeny(!klassnamn);
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
                setPlaceringsnamn(null);
                setNyttPlaceringsnamn(null);
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
              className="w-[10vw] bg-green-500 h-[4vw] place-self-start flex justify-center items-center cursor-pointer"
            >
              <img className="h-[4vw]" src="/pil-vänster.png" />
            </div>
          ) : (
            <div></div>
          )}
          <div className="col-span-8">
            <div className="">
              {(nyttPlaceringsnamn || klassnamn || klassrumsnamn) && (
                <div className="text-3xl mt-3 flex justify-center text-center font-bold">
                  <input
                    value={
                      nyttPlaceringsnamn ||
                      (nyttPlaceringsnamn === ""
                        ? nyttPlaceringsnamn
                        : (klassnamn || "") + " i " + (klassrumsnamn || ""))
                    }
                    onChange={(e) => setNyttPlaceringsnamn(e.target.value)}
                    onBlur={() =>
                      nyttPlaceringsnamn ===
                        (klassnamn || "") + " i " + (klassrumsnamn || "") ||
                      nyttPlaceringsnamn === ""
                        ? setNyttPlaceringsnamn(
                            (klassnamn || "") + " i " + (klassrumsnamn || "")
                          )
                        : setPlaceringsnamn(nyttPlaceringsnamn)
                    }
                    className="text-3xl mt-3 flex w-fit justify-center text-center"
                  />
                </div>
              )}
              <div className="mt-1">{väljKLassOchKlassrum}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-52 m-auto">
          <h2 className="text-xl mt-2 font-bold">Dina placeringar</h2>
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
                setVisaklassmeny(true);
                setVisaklassrumsmeny(true);
                setPlaceringsId(JSON.parse(JSON.stringify(beng)));
              }}
            >
              ny placering...
            </li>
            {data &&
              data.placeringar.map((placering) => {
                return (
                  <li
                    key={placering.id}
                    className="font-bold text-xl p-2 cursor-pointer"
                    onClick={() => {
                      const klasserDict = Object.fromEntries(
                        data.klasser.map((klass) => [klass.id, klass])
                      );
                      const klassrumDict = Object.fromEntries(
                        data.klassrum.map((klassrum) => [klassrum.id, klassrum])
                      );

                      const currentKlass = klasserDict[placering.klass.id];
                      const currentKlassrum =
                        klassrumDict[placering.klassrum.id];

                      if (!currentKlass || !currentKlassrum) {
                        return;
                      }
                      const bänkarMedPersoner = [];
                      placering.klassrum.grid.map((rad, y) =>
                        rad.map(
                          (cell, x) =>
                            cell.person &&
                            bänkarMedPersoner.push({
                              kord: `${x}-${y}`,
                              person: cell.person,
                            })
                        )
                      );
                      setNamn(currentKlass.personer);

                      setKlassnamn(currentKlass.namn);
                      setVisaklassmeny(false);
                      setVisaklassrumsmeny(false);
                      setKlassrumsId(placering.klassrum.id);
                      setKlassrumsnamn(currentKlassrum.namn);
                      setKlassId(placering.klass.id);
                      setGrid(
                        currentKlassrum.grid.map((rad, y) =>
                          rad.map((cell, x) => {
                            const nyttId = generateUniqueId();
                            const bänkmatch = bänkarMedPersoner.find(
                              (bänk) => bänk.kord === `${x}-${y}`
                            );
                            return {
                              id: bänkmatch ? JSON.stringify(nyttId) : cell.id,
                              person: bänkmatch
                                ? bänkmatch.person
                                : cell.person,
                            };
                          })
                        )
                      );
                      setCols(currentKlassrum.cols);
                      setPlaceringsId(placering.id);
                      setRows(currentKlassrum.rows);
                      setPlaceringsnamn(placering.namn);
                    }}
                  >
                    {placering.namn ||
                      (placering.klass.namn || "en tom klass") +
                        " i " +
                        (placering.klassrum.namn || "ett tomt klassrum")}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
      
      <>
        {klassrumsnamn && (
          <div className="" ref={content} style={{ zIndex: "100" }}>
            <div className="my-3">
              <div
                className={
                  vägg &&
                  "m-auto p-5 w-fit fit-content rounded-lg border-black border-8 m-3"
                }
              >
                <Klassrum
                  extra={rows > 10 && !placeringsId && !data.placeringar.some(placering => placering.rows > 10) && "Psst, alla namn hamnar längst ner på sidan."}
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
            </div>
          </div>
        )}
        {klassnamn && klassrumsnamn && (
          <div className="flex gap-4 w-full flex-wrap justify-center">
            <button
              style={{ padding: "20px" }}
              className="bg-green-500 text-white"
              onClick={slumpa}
            >
              Slumpa
            </button>
            <button
              style={{ padding: "20px" }}
              className="bg-green-500 text-white"
              onClick={async () => {
                setKlar(true);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                await scaleToFit(content.current, setUpdateSize, updateSize);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                setKlar(false);
              }}
            >
              Skriv ut
            </button>
            {klassnamn && klassrumsnamn && (
              <div className="w-[130px]">
                <button
                  style={{ padding: "20px" }}
                  className="bg-green-500 rounded-b-none border-solid border-black border  text-white"
                  onClick={() => {
                    sparaKlass(placeringsnamn);
                  }}
                >
                  spara
                </button>
                <button
                  style={{ padding: "20px" }}
                  className="bg-green-500 border border-t-0 border-black border-solid rounded-t-none text-white"
                  onClick={() => {
                    let index = prompt("Vad ska placeringen heta?");
                    while (
                      data.placeringar.some(
                        (placering) => placering.namn === index
                      )
                    ) {
                      index = prompt(
                        "Du har redan lagt in en placering som heter så. Skriv ett namn som skiljer sig åt."
                      );
                    }
                    setPlaceringsnamn(index);
                    sparaKlass(index);
                  }}
                >
                  spara som
                </button>
              </div>
            )}

            <button
              style={{ padding: "20px" }}
              className="bg-green-500 text-white"
              onClick={() => {
                setKlar(!klar);
              }}
            >
              {!klar ? "Klar" : "Fortsätt redigera"}
            </button>
            <button
              style={{ padding: "20px" }}
              className="bg-green-500 text-white"
              onClick={() => {
                setOmvänd(!omvänd);
              }}
            >
              Byt till {omvänd ? "elevperspektiv" : "lärarperspektiv"}
            </button>
          </div>
        )}
        {klassnamn && (
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
        )}
      </>
    </div>
  );
};

export default SkapaPlaceringar;
