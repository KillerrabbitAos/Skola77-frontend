import { useState, useEffect, useRef } from "react";
import Klassrum from "./Klassrum";
import { data as originalData } from "./data";
import NameList from "./Klasser";
import { RiDeleteBin6Line } from "react-icons/ri";
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

function sparaData(nyData) {
  fetch("https://auth.skola77.com/updateData", {
    credentials: "include",
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
  const centeredRect = content.offsetWidth / 2;

  const left = centeredRect;
  await new Promise((resolve) => setTimeout(resolve, 200));
  content.style.top = "0px";
  content.style.position = "absolute";

  content.style.left = `calc(50% - ${left}px)`;

  // Trigger the print dialog
  setUpdateSize(!updateSize);
  await new Promise((resolve) => setTimeout(resolve, 500));
  window.print();

  // Reset styles after printing
  content.style.left = "";
  content.style.position = "relative";
  content.style.transform = "";
  content.style.transformOrigin = ""; // Reset to default
  content.style.width = "";
  content.style.height = "";
  content.style.margin = "";
}

// Function to calculate DPI dynamically
function calculateDPI() {
  // Create a hidden element to test DPI
  const dpiTest = document.createElement("div");
  dpiTest.style.width = "1in"; // Set width to 1 inch
  dpiTest.style.height = "1in"; // Optional: height to 1 inch for consistency
  dpiTest.style.position = "absolute"; // Avoid layout interference
  dpiTest.style.visibility = "hidden"; // Ensure it's not visible
  document.body.appendChild(dpiTest);

  // Measure the width in pixels
  const dpi = dpiTest.offsetWidth;

  // Remove the test element from the DOM
  document.body.removeChild(dpiTest);

  return dpi; // Return the raw DPI value
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
  const [sparat, setSparat] = useState(true);
  const [klassrumsnamn, setKlassrumsnamn] = useState(null);
  const [placeringsId, setPlaceringsId] = useState(null);
  const [placeringsnamn, setPlaceringsnamn] = useState(null);
  const [visaKlassmeny, setVisaklassmeny] = useState(true);
  const [visaKlassrumsmeny, setVisaklassrumsmeny] = useState(true);
  const [vägg, setVägg] = useState(false);
  const klassrumsmenyRef = useRef(null);
  const [laddarPlacering, setLaddarPlacering] = useState(false);
  const klassmenyRef = useRef(null);
  const [klassmenykord, setKlassmenykord] = useState([1]);
  const [klassrumsmenykord, setKlassrumsmenykord] = useState([1]);
  const [nyttPlaceringsnamn, setNyttPlaceringsnamn] = useState(null);

  const nameDiv = useRef(null);
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
          <Overlay style={{ zIndex: "600" }}>
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
  async function checkLoginStatus() {
    const response = await fetch("https://auth.skola77.com/home", {
      credentials: "include",
    });
    const result = await response.json();
    const parsedData = JSON.parse(result.data);
    setData(parsedData);
    const klassrum = parsedData.klassrum;
    const klasser = parsedData.klasser;

    console.log("Klassrum:", klassrum);
    console.log("Klasser:", klasser);
  }
  const sparaPlacering = (index) => {
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
    nyData = {
      klasser: [
        {
          id: "9D._nameValues",
          namn: "9D.",
          personer: [
            "",
            "Alsu",
            "Hussein",
            "Jakob",
            "Kevin",
            "Juni",
            "Julia",
            "Oliver",
            "Isak",
            "Livia",
            "Tilde",
            "Eric",
            "Markus",
            "Elsa",
            "Vera",
            "Emilia",
            "Gabriel",
            "Tore",
            "Katerina",
            "Ines",
            "William",
            "Mona",
            "Turid",
            "Otto",
            "Maria",
            "Amanda",
            "Astrid",
            "Sammy",
            "Alice",
            "Rasmus",
            "Malcolm",
            "Emil L",
            "Emil B",
          ],
        },
        {
          id: "9A, sv._nameValues",
          namn: "9A, sv.",
          personer: [
            "",
            "Alexander",
            "Roham",
            "Isac",
            "Oscar",
            "Anna",
            "Sid",
            "Erika",
            "Walter",
            "Klara",
            "Hampus",
            "William",
            "Erik",
            "Eli",
            "Moa",
            "Arvid",
            "Samuel",
            "Artur",
            "Sixten",
            "Maja",
            "Melike",
            "Lo",
            "Ida",
            "Alvina",
            "Bosse",
            "Betty",
          ],
        },
        {
          id: "8B_nameValues",
          namn: "8B",
          personer: [
            "",
            "Maya",
            "Justin",
            "Anton",
            "Elsa",
            "Tim",
            "Emmy",
            "Joel",
            "Theo",
            "Astor",
            "Enkhjin",
            "Dante",
            "Rathin",
            "Tuva",
            "Maximus",
            "Hugo",
            "Max",
            "Vincent",
            "Tyra",
            "Elvin",
            "Stella",
            "Astrid",
            "Sid",
            "Taley",
            "John",
            "Zackarias",
            "Freja",
            "Victor",
            "Lea",
            "Malte",
            "Tilda",
          ],
        },
        {
          id: "8A_nameValues",
          namn: "8A",
          personer: [
            "",
            "Mlak",
            "Tyra",
            "Nathalie",
            "Eliah",
            "Nicole",
            "Vera",
            "Aness",
            "Filip",
            "Anton",
            "Alva",
            "Qianmiao",
            "Jeremias",
            "Gabriel",
            "Albin",
            "Anja",
            "Adam",
            "Asal",
            "Linnea",
            "Gabriel",
            "William",
            "Elisa",
            "Måns",
            "Emil",
            "Fred",
            "Norah",
            "Isabelle",
            "Lucas",
            "Sebastian",
          ],
        },
        {
          id: "9A, hela_nameValues",
          namn: "9A, hela",
          personer: [
            "",
            "Alexander",
            "Roham",
            "Isac",
            "Prodromos",
            "Oscar B",
            "Betty",
            "Anna",
            "Alexia",
            "Sid",
            "Bosse",
            "Erika",
            "Walter",
            "Klara",
            "Sueda",
            "Hampus",
            "William",
            "Erik",
            "Eli",
            "Moa",
            "Farhiya",
            "Arvid",
            "Samuel",
            "Artur",
            "Tony",
            "Sixten",
            "Uktam",
            "Maja",
            "Melike",
            "Lo",
            "Ida",
            "Oscar W",
            "Alvina",
          ],
        },
        {
          id: "9A, sv_nameValues",
          namn: "9A, sv",
          personer: [
            "",
            "Alexander",
            "Roham",
            "Isac",
            "Oscar",
            "Elisabeth (Betty)",
            "Anna",
            "Sid",
            "Bo (Bosse)",
            "Erika",
            "Walter",
            "Klara",
            "Hampus",
            "William",
            "Erik",
            "Eli",
            "Moa",
            "Arvid",
            "Samuel",
            "Artur",
            "Sixten",
            "Maja",
            "Melike",
            "Lo",
            "Ida",
            "Alvina",
          ],
        },
        {
          id: "9D_nameValues",
          namn: "9D",
          personer: [
            "",
            "Alsu",
            "Hussein",
            "Jakob",
            "Kevin",
            "Juni",
            "Julia",
            "Oliver",
            "Emil",
            "Isak",
            "Livia",
            "Tilde",
            "Eric",
            "Markus",
            "Elsa",
            "Vera",
            "Emilia",
            "Gabriel",
            "Tore",
            "Katerina",
            "Ines",
            "William",
            "Emil",
            "Mona",
            "Turid",
            "Otto",
            "Maria",
            "Amanda",
            "Astrid",
            "Sammy",
            "Alice",
            "Rasmus",
            "Malcolm",
          ],
        },
        {
          id: "9C_nameValues",
          namn: "9C",
          personer: [
            "",
            "Ali G",
            "Ali K.E",
            "Alicia",
            "Altan",
            "Anna",
            "Annie",
            "Astrid",
            "Danielle",
            "Ellen",
            "Elliot",
            "Elsa",
            "Emilia",
            "Felicia",
            "Hannes",
            "Hedvig",
            "Hilar",
            "Inés",
            "Isak",
            "Joel",
            "Linus",
            "Maja",
            "Matilda",
            "Myra",
            "Nike",
            "Noah",
            "Ryan",
            "Stella",
            "Stina",
            "Taseen",
            "Tindra",
            "Tobias",
          ],
        },
        {
          id: "8A, ny_nameValues",
          namn: "8A, ny",
          personer: [
            "",
            "Mlak",
            "Nathalie",
            "Eliah",
            "Nicole",
            "Vera",
            "Filip",
            "Anton",
            "Alva",
            "Qianmiao",
            "Jeremias",
            "Albin",
            "Anja",
            "Adam",
            "Asal",
            "Linnea",
            "William",
            "Elisa",
            "Måns",
            "Emil",
            "Fred",
            "Norah",
            "Isabelle",
            "Lucas",
            "Sebastian",
            "Gabriel M",
            "Gabriel S",
          ],
        },
        {
          id: "8A, ny ny_nameValues",
          namn: "8A, ny ny",
          personer: [
            "",
            "Mlak",
            "Nathalie",
            "Eliah",
            "Nicole",
            "Vera",
            "Filip",
            "Anton",
            "Alva",
            "Qianmiao",
            "Jeremias",
            "Albin",
            "Anja",
            "Adam",
            "Linnea",
            "William",
            "Elisa",
            "Måns",
            "Emil",
            "Fred",
            "Norah",
            "Isabelle",
            "Lucas",
            "Sebastian",
            "Gabriel M",
            "Gabriel S",
            "Wilma",
          ],
        },
        {
          id: "9B_nameValues",
          namn: "9B",
          personer: [
            "",
            "Enisa",
            "Oscar",
            "Hampus",
            "Wilma",
            "Gabriel",
            "Astrid",
            "Stella",
            "Olle",
            "Ellen",
            "Hugo",
            "Andrea",
            "Iman",
            "Alva",
            "Sofia",
            "Noah",
            "Thea",
            "Sador",
            "Jamie",
            "Jakob",
            "Signe",
            "Isabella",
            "Aria",
            "Viggo",
            "Vincent",
            "Alexander",
            "Julia",
            "Alex",
            "Linnéa",
            "Rebecca",
            "Madeleine",
            "Elin",
            "Lilly",
          ],
        },
      ],
      klassrum: [
        {
          grid: [
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
              {
                id: null,
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "8367e56d-a2c6-4a4c-a957-46c85b472321",
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
                id: "697a9241-00e8-456e-ab1e-f8c2f6ccaadf",
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
                id: "915d09a0-5588-4b31-a5bf-bd17d15599e7",
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
                id: "31ed3aaa-31b3-4563-a98c-4822a82b7b45",
                person: 0,
              },
              {
                id: "7770d00d-e6bc-445c-9fe7-8300f433e7ef",
                person: 0,
              },
              {
                id: "f8d7050a-9bac-4913-8eec-f807f09d0809",
                person: 0,
              },
              {
                id: "25e7da5d-7103-4466-8b4e-f8c1d8805b32",
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
                id: "72f57e6a-d675-4395-9791-99527eeb64e5",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "fb842210-510f-4f5b-acba-40cc755eecd5",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "f4abb949-a0e1-4ab7-9977-a661fae26898",
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
                id: "1b925d40-3e2b-4bdf-bc62-81ebb26c3ddc",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "4186c9fc-b701-4e8c-8bfa-9a1b4d3781ff",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "f82311c1-bd81-4f6f-b052-e3c3fbbdab5a",
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
                id: "60de2321-97b1-4e84-8b61-57191ac9c0ce",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "5c1a4fcc-a42b-42b2-bfc1-e1c2f1c655c7",
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
                id: "2a4432f5-492a-4135-90a9-d97d849598b9",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "cfd9ecf8-d947-40fc-ad5c-b20f72be0bdc",
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
                id: "a2a17432-503f-4920-8ded-569acb0f2dae",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "e7f1f74b-faaf-4921-853c-de2ffc691651",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "dda96d06-27d9-47a6-b897-beb2bff96067",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "6bbffff2-9f9e-4ca3-be45-eae12ff23891",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "0d19dd09-85a3-4e11-964c-90d16eba4ea3",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "a769084e-a315-45d7-b04d-9db43043e954",
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
              {
                id: "7cfe640c-caef-41e3-9db5-f0354ef7bf8f",
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
                id: "832d46ab-a8d5-4fad-aaf3-bf7b772e6286",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "f7faac93-e5e3-4c9b-a052-4396afc248e3",
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
                id: "50f20128-fee6-45cf-997f-6d62534600cb",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "de25cae7-00b7-44d0-8091-8709efaba99e",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "0d1ab6d7-9853-4f68-a21a-06abd6ae3b60",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "28a79adc-414c-45cb-892f-bf1248f54482",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "bbdaa646-6428-41bf-b2e6-bc174015fb20",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "1d593c07-7440-4206-9f3b-b88f74d47afa",
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
              {
                id: null,
                person: 0,
              },
              {
                id: "14765d7b-9ec3-4fdd-aec2-b219724010c5",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "fbbb43ce-4bcf-4bf7-96f7-85dc2fb2fdf4",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "933d7a47-b1ba-42cf-b57b-c3f7bc51ec10",
                person: 0,
              },
            ],
          ],
          id: "H221, prov… _gridValues",
          namn: "H221, prov… ",
          cols: 13,
          rows: 13,
        },
        {
          grid: [
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
                id: "b0a29f71-dee6-42ba-b2ca-88b526df620b",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "627ff31b-6283-4b34-a3f4-2e233471ad56",
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
                id: null,
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "35402732-1fad-4d93-b0c3-5e17ba1f0d36",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "803a9a58-100b-43d1-b7b1-3d163532c96b",
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
                id: "5d714dc8-dc39-448a-ac94-cc37fe5daf18",
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
                id: "2d055eb4-258a-48c5-ada9-ce71d704d90d",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "68aad546-7fc6-409e-8083-4fc0700dd133",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "7c55e155-35df-4366-b850-e6480bb5403b",
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
                id: "edfceb66-3583-41e4-bed9-0832bc8edd0d",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "20265535-a669-4f61-89bb-a233a0c3b092",
                person: 0,
              },
              {
                id: "2f978313-6b55-4fda-bde1-db24158acf84",
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
              {
                id: null,
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "e7de7d41-73ac-427c-ae4f-edf69a58d66a",
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
                id: "b61e5429-fd2d-4d4d-a0f1-6185f1c4f518",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "e424791d-e850-4d7d-982b-abe8d2a43dc8",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "8f3a998d-7411-4770-9915-3010a4af5e5b",
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
                id: "d4e29f11-ac70-4e8f-8728-366661ce5716",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "993eda13-ae92-4264-953f-698f8618c87b",
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
                id: "e9607c9e-bed0-425b-96da-bb24fa59a2f7",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "e43b0624-ea10-4670-a782-1f4c18bc6231",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "389f36be-ce19-4994-b5b3-61ccf26b6f1d",
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
                id: "2f4dc27d-9de8-48ca-a158-c141f97763c7",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "53d6aeae-fcd9-4ba5-8bb0-aeef8b3b7390",
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
                id: "bd886307-08fd-41af-8756-8fb98754d0b3",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "2d0f079d-d633-40e5-b13e-f6e5f9df7d1c",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "2381fd1e-28ec-476c-aebc-e6b23b716a88",
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
                id: "e17c56dc-a028-46af-b7e5-ec415d7e2a9d",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "813497f9-5f50-4704-8c83-9b031afc68d4",
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
                id: "83382d5c-542e-4150-b212-23f641ac7515",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "41ea0d06-15ee-4e2f-80a4-bc987dda01b4",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "851df112-7984-4703-b94c-59ac02d50dc7",
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
                id: "e4d91960-f8d9-4be7-818e-70411e415a93",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "9b0082e9-9b5e-4fb5-b4c4-fb8b0919cae4",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
            ],
          ],
          id: "H221, prov_gridValues",
          namn: "H221, prov",
          cols: 12,
          rows: 13,
        },
        {
          grid: [
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
              {
                id: "187bd436-d9e8-4422-aa8d-c7130fe73343",
                person: 0,
              },
              {
                id: "94cec6f4-590d-4516-96eb-69d7840d1d42",
                person: 0,
              },
              {
                id: "00502a17-63ce-4854-87ea-c699ea433939",
                person: 0,
              },
              {
                id: "14019e6c-4928-458e-9b42-ab02df5fc432",
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
                id: "02cabd36-47a3-4dff-843f-54f8c39b93c0",
                person: 0,
              },
              {
                id: "48f51dd8-90a2-4c1e-bb0c-3ce84f766d6c",
                person: 0,
              },
              {
                id: "83548691-9adf-4d33-b5e1-5e25144e9313",
                person: 0,
              },
              {
                id: "45613d5a-06c7-45ce-92e1-6e0e93fdb9ed",
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
              {
                id: "90589407-1795-48f8-b0ce-471f95b4fdce",
                person: 0,
              },
              {
                id: "e0f65f00-7472-4216-8241-32a5e0447c57",
                person: 0,
              },
              {
                id: "6ea2d7f3-6694-49b8-9e48-c9aa3ff41980",
                person: 0,
              },
              {
                id: "a726403a-6ae9-4f85-b002-6952f4cf4a29",
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
                id: "906892e3-0cdd-45c9-b206-6828bddc4282",
                person: 0,
              },
              {
                id: "03f4be0f-47a8-445e-83b1-e27576619819",
                person: 0,
              },
              {
                id: "7e6d207a-ab2b-400b-bc2a-563ef916813c",
                person: 0,
              },
              {
                id: "bd87bc10-506e-45b4-89f8-9514c0505cbc",
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
              {
                id: "fb7d1244-26f3-4193-81ad-5687f29cec59",
                person: 0,
              },
              {
                id: "a4ac656a-067b-4921-b3e2-81d42a2512d0",
                person: 0,
              },
              {
                id: "195b6849-8889-4497-9563-cbebe7430705",
                person: 0,
              },
              {
                id: "48cc9926-caf0-460b-904c-e0d494d36aa5",
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
                id: "59775679-17c5-40b3-8e96-c77c24df64d0",
                person: 0,
              },
              {
                id: "cfe203d7-a458-45b2-a3f1-cf724d4bdf64",
                person: 0,
              },
              {
                id: "74385e62-d4cd-43dc-bcbb-4b191b66e84c",
                person: 0,
              },
              {
                id: "d1529d7d-c7e7-405d-a0da-b308af8e2f06",
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
              {
                id: "ba257ad6-d9f2-4f55-a4b8-89db3ab99fa2",
                person: 0,
              },
              {
                id: "29a7b95c-83b0-4e63-807a-68abb2980fb3",
                person: 0,
              },
              {
                id: "9bf9f65f-77d2-4c13-9025-7e5cc6059471",
                person: 0,
              },
              {
                id: "81bacebb-e76d-4089-8cb0-0d3fa510f348",
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
              {
                id: "074036b4-e28f-4701-9670-48aff18ce7c2",
                person: 0,
              },
              {
                id: "ba695628-1cab-4457-918e-d2e3922bc586",
                person: 0,
              },
              {
                id: "2e858c54-8a73-4ae1-af7b-25b2b53f9c5a",
                person: 0,
              },
              {
                id: "b40983b8-5c99-4894-8fa2-b5a2e22521af",
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
          ],
          id: "H221_gridValues",
          namn: "H221",
          cols: 13,
          rows: 13,
        },
        {
          grid: [
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
                id: "b78acb0d-cf61-47ce-bea2-448eb044b41a",
                person: 0,
              },
              {
                id: "857ecdd1-5141-4a9f-9aee-650450511717",
                person: 0,
              },
              {
                id: "d2b8f6e2-f080-486b-8820-5cd50bb038df",
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
                id: "9ff50f47-98ba-4ed2-ad7b-f96fa5691f06",
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
                id: "e83eb55f-f368-423f-a67c-f77fed1331c3",
                person: 0,
              },
              {
                id: "bd7f1fdc-b89f-4710-9f92-68594c8411cd",
                person: 0,
              },
              {
                id: "89ae145f-e435-4ce2-99e0-8aba2dfde368",
                person: 0,
              },
            ],
            [
              {
                id: null,
                person: 0,
              },
              {
                id: "f36d79d5-1adb-48cf-91d3-320b52fd7ce7",
                person: 0,
              },
              {
                id: "b3904175-fd84-4b59-a35f-8404ea6e283c",
                person: 0,
              },
              {
                id: "d42a94b9-8fed-486a-aa31-08d6505ab35d",
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
                id: "d45e91a9-f17e-4f9f-9dc6-2e203295b8c5",
                person: 0,
              },
              {
                id: "1e744ff8-2d2e-40d4-a6f2-487ee4058808",
                person: 0,
              },
              {
                id: "b3eb68b6-fa75-450f-911a-d3ac25a3d21e",
                person: 0,
              },
            ],
            [
              {
                id: null,
                person: 0,
              },
              {
                id: "5527f0d2-4772-45fd-9686-fd56f0e4bd57",
                person: 0,
              },
              {
                id: "9985a7df-d3cb-4aa5-9943-fac337abec84",
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
                id: "a10e0899-17e3-4f41-b9f8-076338944087",
                person: 0,
              },
              {
                id: "392bd566-2385-4983-a5cc-f9747103e2ca",
                person: 0,
              },
              {
                id: "c65380ed-f73e-4eae-8433-065e18bd3c32",
                person: 0,
              },
            ],
            [
              {
                id: null,
                person: 0,
              },
              {
                id: "dc75e4ea-ec03-4c57-b457-dbd7817d1eb4",
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
                id: "d6d4dae4-cfec-482c-8656-6532c154e8fa",
                person: 0,
              },
              {
                id: "ab9eb0c1-3346-4b56-9b8a-aaffff144e79",
                person: 0,
              },
              {
                id: "08dc12b3-5353-46e6-ac39-5dc7e5252a46",
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
              {
                id: "a3b854a0-d299-4dd3-a67c-eab64e6ab74e",
                person: 0,
              },
              {
                id: "07c22c89-0796-4f58-996d-4606b0fc1521",
                person: 0,
              },
              {
                id: "8533e68e-a6af-4bc1-80b0-ce46845bab87",
                person: 0,
              },
            ],
            [
              {
                id: "ef70ef11-eb56-4747-a1ef-908592a2652b",
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
                id: "0ddad7ce-8c64-4153-802d-bb1ffa071ad8",
                person: 0,
              },
              {
                id: null,
                person: 0,
              },
              {
                id: "955e3c4f-ab2c-43fc-8ed2-99fddd3f57b4",
                person: 0,
              },
              {
                id: "3e9feebe-2a55-458a-9bb6-b1100f774553",
                person: 0,
              },
              {
                id: "fd1ce149-c952-4db5-a6f6-0607d56ad014",
                person: 0,
              },
            ],
          ],
          id: "H221, prov, ny_gridValues",
          namn: "H221, prov, ny",
          cols: 10,
          rows: 7,
        },
      ],
      placeringar: [
        {
          id: "9A, sv. i H221_values",
          namn: "9A, sv. i H221",
          klass: {
            id: "9A, sv._nameValues",
            namn: "9A, sv.",
            personer: [
              "",
              "Alexander",
              "Roham",
              "Isac",
              "Oscar",
              "Anna",
              "Sid",
              "Erika",
              "Walter",
              "Klara",
              "Hampus",
              "William",
              "Erik",
              "Eli",
              "Moa",
              "Arvid",
              "Samuel",
              "Artur",
              "Sixten",
              "Maja",
              "Melike",
              "Lo",
              "Ida",
              "Alvina",
              "Bosse",
              "Betty",
            ],
          },
          klassrum: {
            id: "H221_gridValues",
            namn: "H221",
            grid: [
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
                {
                  id: "fc7fa2e8-82be-49b1-a03a-9b89e25e4916",
                  person: 6,
                },
                {
                  id: "02db1e40-aee4-4d04-91c5-b270a4358c27",
                  person: 11,
                },
                {
                  id: "8bad9ed2-a6ed-4b6d-b141-3ee400e47482",
                  person: 18,
                },
                {
                  id: "07170eeb-3c99-4c3b-963e-4edd589d858c",
                  person: 7,
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
                  id: "d77f44ae-08cb-4c53-8b52-66bebcf335e9",
                  person: 23,
                },
                {
                  id: "1a8f2238-6d77-4668-8c64-d52e0be39d3a",
                  person: 0,
                },
                {
                  id: "2f358a2d-47f9-4cb2-b192-a92c7a2ab501",
                  person: 16,
                },
                {
                  id: "11dc250a-f60a-4e02-9be9-3a5f81a077dc",
                  person: 5,
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
                {
                  id: "cf8a392e-69fd-497d-bfba-f7c009832f98",
                  person: 19,
                },
                {
                  id: "37f2f65b-1baf-4cf1-9f9c-4d8220846d03",
                  person: 0,
                },
                {
                  id: "9aa2791e-ef1a-472f-a45e-48b9d19f890e",
                  person: 0,
                },
                {
                  id: "0b4e32ee-7129-4994-ada7-98149ee221ea",
                  person: 9,
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
                  id: "3c18e2e5-b240-4319-833d-3eac28d7a906",
                  person: 0,
                },
                {
                  id: "e350b4ce-b864-401e-9883-f74e1831e3c0",
                  person: 10,
                },
                {
                  id: "8bd8ccd6-98a0-4fea-98b5-403a9519d075",
                  person: 15,
                },
                {
                  id: "02288080-9feb-44f5-8579-03865cf7b023",
                  person: 24,
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
                {
                  id: "f0e72470-c1da-4945-ad72-f52f4c3c3051",
                  person: 8,
                },
                {
                  id: "48899a3d-0ae0-4e59-b98a-f7aac9f9e44e",
                  person: 22,
                },
                {
                  id: "c38becaf-ec3d-421d-88f0-3d51149b4199",
                  person: 0,
                },
                {
                  id: "d5279412-8fef-4ab4-9812-012a0e509861",
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
                  id: "1ccfec05-be21-411d-910c-cce6edbf00c2",
                  person: 2,
                },
                {
                  id: "2d3ec470-0fff-4ab0-87f0-e788d51b9da2",
                  person: 21,
                },
                {
                  id: "4baf730b-d60a-470f-8d9c-46e6abf2b332",
                  person: 17,
                },
                {
                  id: "e9d8ba6d-0cf3-4ea7-bc8b-9981a1aa2946",
                  person: 13,
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
                {
                  id: "5d72c481-cd5a-497a-b403-84b58ffdbe53",
                  person: 12,
                },
                {
                  id: "84a4c3c2-164d-4982-9898-32cd656bf9ca",
                  person: 3,
                },
                {
                  id: "db7d63ce-c969-46e9-8fa1-b8dc084008b9",
                  person: 14,
                },
                {
                  id: "b18a9357-e5ac-4484-bda4-64995cb613b3",
                  person: 25,
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
                {
                  id: "35ca09f1-6652-49ff-bd29-3d438ed5acdd",
                  person: 20,
                },
                {
                  id: "9e1dae1c-bc7d-46ab-ad4f-eef00aa19b8d",
                  person: 4,
                },
                {
                  id: "103072d5-b951-4c58-a078-db3cf9d7cb4e",
                  person: 1,
                },
                {
                  id: "03bcaa7c-c072-4e75-8e82-0d29456a1a8d",
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
            ],
            cols: 13,
            rows: 13,
          },
        },
        {
          id: "9D, SH_values",
          namn: "9D, SH",
          klass: {
            id: "b59b5868-2b9e-466a-9372-5b66d25c4c25",
            namn: "okänt",
            personer: [
              "",
              "Alsu",
              "Hussein",
              "Jakob",
              "Kevin",
              "Juni",
              "Julia",
              "Oliver",
              "Isak",
              "Livia",
              "Tilde",
              "Eric",
              "Markus",
              "Elsa",
              "Vera",
              "Emilia",
              "Gabriel",
              "Tore",
              "Katerina",
              "Ines",
              "William",
              "Mona",
              "Turid",
              "Otto",
              "Maria",
              "Amanda",
              "Astrid",
              "Sammy",
              "Alice",
              "Rasmus",
              "Malcolm",
              "Emil L",
              "Emil B",
            ],
          },
          klassrum: {
            id: "f1345842-bd70-4a7d-82a4-7d16dd80dce8",
            namn: "okänt",
            grid: [
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
                {
                  id: "90d613cb-fe3c-42a0-8cf8-90f302620625",
                  person: 24,
                },
                {
                  id: "090a9448-11e9-4300-ae5f-acd537d9e9d4",
                  person: 23,
                },
                {
                  id: "acef6cc8-d22b-4476-85f9-3fbf8d0072bc",
                  person: 17,
                },
                {
                  id: "080e6e0d-a71a-47bf-90ed-676d23aa3850",
                  person: 1,
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
                  id: "40632f3c-da49-4c6b-807d-992c5fc5fdb9",
                  person: 2,
                },
                {
                  id: "56dc0f06-8d79-492c-aa80-a2f1517b10c7",
                  person: 0,
                },
                {
                  id: "e1fd554a-34d6-424b-9cbd-5be58214aae2",
                  person: 0,
                },
                {
                  id: "71ee4b6e-ed40-4f9a-8025-5a3ab5886b2f",
                  person: 3,
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
                {
                  id: "355a3198-593c-446c-9487-8d4c0738dba9",
                  person: 12,
                },
                {
                  id: "61fe8eca-9516-43fd-bcf0-8ef0a8f722ee",
                  person: 18,
                },
                {
                  id: "113ddb23-3013-4b0f-aa12-6ffd1e052351",
                  person: 7,
                },
                {
                  id: "b179ef31-aaf8-4454-a7aa-be45740eb215",
                  person: 11,
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
                  id: "079d8ad6-b8ba-4655-a690-4252fff12d03",
                  person: 14,
                },
                {
                  id: "92969a38-8644-4436-9b26-4035eee1d166",
                  person: 4,
                },
                {
                  id: "78ef37b0-dc68-424d-bbe4-5e007eead5a3",
                  person: 9,
                },
                {
                  id: "1fd58166-a86c-4297-bad0-4bbcc308475e",
                  person: 10,
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
                {
                  id: "079f67cb-7f37-4094-8b82-d84271b63dd9",
                  person: 16,
                },
                {
                  id: "622c3214-3d62-45bc-83f9-82c021f855c0",
                  person: 6,
                },
                {
                  id: "2deaa644-6a06-43ad-8854-98f71c3e405d",
                  person: 30,
                },
                {
                  id: "1b73b552-8378-4e75-be7b-db6b3c48f99b",
                  person: 15,
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
                  id: "92d20a80-54f0-4925-b743-4b7dd02b7bbd",
                  person: 22,
                },
                {
                  id: "33b08f73-209b-456e-8dac-b90cdd282906",
                  person: 26,
                },
                {
                  id: "e526386e-5ed1-41f1-a206-b89a639c274c",
                  person: 13,
                },
                {
                  id: "817a48eb-d10a-4790-bf98-18786ad3e372",
                  person: 5,
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
                {
                  id: "e20d384b-4561-4550-ab1f-9ac7826bf659",
                  person: 31,
                },
                {
                  id: "b6d2addc-2155-42b1-bd14-729e6c9137c5",
                  person: 29,
                },
                {
                  id: "5a6500fd-8eff-442c-9858-fa37c37fb439",
                  person: 20,
                },
                {
                  id: "5d0cd4fa-74fc-4bfc-b708-1bf205c1737c",
                  person: 19,
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
                {
                  id: "6f493e8c-3c53-480f-ade9-e89424470dd5",
                  person: 25,
                },
                {
                  id: "294d718e-93b0-419b-94c7-106670e08d1b",
                  person: 28,
                },
                {
                  id: "f35f92b2-cd77-44ce-86c0-bcd0a516885d",
                  person: 27,
                },
                {
                  id: "bb5d4902-288b-4c8f-86d9-50ffb3e21574",
                  person: 32,
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
            ],
            cols: 13,
            rows: 13,
          },
        },
        {
          id: "8A, ny i H221, prov, ny_values",
          namn: "8A, ny i H221, prov, ny",
          klass: {
            id: "8A, ny_nameValues",
            namn: "8A, ny",
            personer: [
              "",
              "Mlak",
              "Nathalie",
              "Eliah",
              "Nicole",
              "Vera",
              "Filip",
              "Anton",
              "Alva",
              "Qianmiao",
              "Jeremias",
              "Albin",
              "Anja",
              "Adam",
              "Asal",
              "Linnea",
              "William",
              "Elisa",
              "Måns",
              "Emil",
              "Fred",
              "Norah",
              "Isabelle",
              "Lucas",
              "Sebastian",
              "Gabriel M",
              "Gabriel S",
            ],
          },
          klassrum: {
            id: "H221, prov, ny_gridValues",
            namn: "H221, prov, ny",
            grid: [
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
                  id: "33028295-4d3b-4486-bae6-1d450eda1489",
                  person: 0,
                },
                {
                  id: "c6837c16-0d68-44be-b7cc-30786c561a8d",
                  person: 21,
                },
                {
                  id: "940b570a-4c6a-4cb1-982d-573120c0c108",
                  person: 3,
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
                  id: "e4fe98fe-f7ac-4e0b-b8c6-eb01eb0b59ca",
                  person: 9,
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
                  id: "bf86ce81-59f3-4772-9d5b-69729897b099",
                  person: 8,
                },
                {
                  id: "6518c975-fac7-4a92-93cb-70fc3a00f6b2",
                  person: 0,
                },
                {
                  id: "ba2e8a94-8f24-46d4-aecd-9ba57b6d8a67",
                  person: 7,
                },
              ],
              [
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "8263b3df-b557-4f7c-9a55-3f883ea150b1",
                  person: 22,
                },
                {
                  id: "96d0f76a-5656-44ae-b1b6-8fcd94acf6cb",
                  person: 24,
                },
                {
                  id: "55625937-0d80-45d5-aba9-5ffd4630e546",
                  person: 5,
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
                  id: "f2fe4396-efe3-4b17-91a7-8debb0d62db4",
                  person: 1,
                },
                {
                  id: "8f05a0b1-75c7-4200-8d43-8d3fdcd77f1a",
                  person: 11,
                },
                {
                  id: "6712bfd7-e4d7-440c-bd47-f5aa42b7ac7a",
                  person: 17,
                },
              ],
              [
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "7ae1fcfc-056c-472b-8487-f18b774c3b75",
                  person: 23,
                },
                {
                  id: "c4963f56-8693-45c2-a4b1-58b34fb47224",
                  person: 25,
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
                  id: "b1f05b48-6d79-473c-8cbf-225e586d06d0",
                  person: 2,
                },
                {
                  id: "e9025ebe-b279-445e-b07c-5e40190f6fc3",
                  person: 0,
                },
                {
                  id: "bdb5db5b-ffcc-419e-b283-5233010ca942",
                  person: 12,
                },
              ],
              [
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "923eb723-fec9-4d36-be96-fe4d5804a8aa",
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
                  id: "1d34a227-dc3f-4159-8c00-fce1882ad830",
                  person: 26,
                },
                {
                  id: "44a2cf7f-0828-4617-b58b-ae1e4508e924",
                  person: 0,
                },
                {
                  id: "13b6bd58-02d7-4479-8889-0584c3f43849",
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
                {
                  id: "4ab45a25-d76c-4f3e-88d9-cdb2a9fcf3f8",
                  person: 15,
                },
                {
                  id: "4b477f1b-1e3f-4432-8778-a32c43b20f21",
                  person: 20,
                },
                {
                  id: "33ca27b7-8758-41cc-a867-0f5583f59880",
                  person: 4,
                },
              ],
              [
                {
                  id: "6175c8a4-5519-4387-bb94-8c92e1d5ff61",
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
                  id: "fcda54e8-8f47-471d-8fb9-ffe5305e84ba",
                  person: 13,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "9a382a46-dcc4-4074-b9b1-5717b0e62b0e",
                  person: 6,
                },
                {
                  id: "3a8d2d1e-335f-484f-ae6a-0a0bc8ddfd41",
                  person: 18,
                },
                {
                  id: "8a3626ea-483f-4ee2-b0db-06fa73caa9cb",
                  person: 10,
                },
              ],
            ],
            cols: 10,
            rows: 7,
          },
        },
        {
          id: "8B i H221, prov, ny_values",
          namn: "8B i H221, prov, ny",
          klass: {
            id: "8B_nameValues",
            namn: "8B",
            personer: [
              "",
              "Maya",
              "Justin",
              "Anton",
              "Elsa",
              "Tim",
              "Emmy",
              "Joel",
              "Theo",
              "Astor",
              "Enkhjin",
              "Dante",
              "Rathin",
              "Tuva",
              "Maximus",
              "Hugo",
              "Max",
              "Vincent",
              "Tyra",
              "Elvin",
              "Stella",
              "Astrid",
              "Sid",
              "Taley",
              "John",
              "Zackarias",
              "Freja",
              "Victor",
              "Lea",
              "Malte",
              "Tilda",
            ],
          },
          klassrum: {
            id: "H221, prov, ny_gridValues",
            namn: "H221, prov, ny",
            grid: [
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
                  id: "709137a3-429f-4a32-a1e4-ca4c05464c91",
                  person: 11,
                },
                {
                  id: "962a2859-af1d-47f1-82cb-ff2f0c7b04cc",
                  person: 23,
                },
                {
                  id: "6d990ee7-93ea-4592-828a-19faea0588b2",
                  person: 28,
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
                  id: "dea1906f-a4d9-4213-814f-326e9d353c89",
                  person: 6,
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
                  id: "d4f4154e-6c60-489f-82f1-6ecbe13cbb99",
                  person: 7,
                },
                {
                  id: "2139eef8-dbbe-40e6-90ce-b5a6ac46292f",
                  person: 19,
                },
                {
                  id: "bf2f74d8-9edb-4639-9cb9-85d9b1315681",
                  person: 1,
                },
              ],
              [
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "96ccfb37-91c3-49ef-a949-341f9188c631",
                  person: 8,
                },
                {
                  id: "0d8e8880-18a3-474c-8a5d-00e74b69469a",
                  person: 22,
                },
                {
                  id: "241c6b09-3bce-4911-8f35-9e811a56ea52",
                  person: 16,
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
                  id: "8f8770e7-c1c3-421b-ad23-56ec4d2e296b",
                  person: 25,
                },
                {
                  id: "2ce5a009-9597-492a-ba1c-28859ec7d0b0",
                  person: 14,
                },
                {
                  id: "9ed10fdb-a58b-445d-9561-9d597dee2338",
                  person: 27,
                },
              ],
              [
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "1eabbc38-9c8d-4be2-b4f7-79820e47b3f8",
                  person: 26,
                },
                {
                  id: "d696a417-7b3e-4449-9b5c-9d15a4bf8e1d",
                  person: 21,
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
                  id: "8ad79426-1d33-4918-b267-4a83da484254",
                  person: 20,
                },
                {
                  id: "d67687b7-3f9c-4f70-9286-efb81422a593",
                  person: 17,
                },
                {
                  id: "7400ec00-d114-4383-aca2-bd867a70e041",
                  person: 10,
                },
              ],
              [
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "a304800b-2f81-4f03-9f99-274cf1eec77e",
                  person: 18,
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
                  id: "3724bb6f-9fc4-42cd-a51e-a3f6673cf39e",
                  person: 0,
                },
                {
                  id: "95722986-af04-40f1-b416-90174a4b6525",
                  person: 30,
                },
                {
                  id: "ea130111-26b0-4d1e-a0fa-ff80032aa780",
                  person: 12,
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
                {
                  id: "b7c31755-6a8d-48cf-8e4e-d84072a99c80",
                  person: 29,
                },
                {
                  id: "dc8e192b-55ac-4d68-af27-3a9aa6d3329e",
                  person: 0,
                },
                {
                  id: "ffe56cb5-7cc5-47e4-8fa8-645f6fc735dd",
                  person: 9,
                },
              ],
              [
                {
                  id: "1098d74d-7969-4ec1-a9b2-20bcf3d26f0f",
                  person: 13,
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
                  id: "a3170c03-1e05-4523-9878-74b7c4790fcc",
                  person: 2,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "77b59dc2-9ad4-4b8d-aa25-13004fc77055",
                  person: 24,
                },
                {
                  id: "9b15dbcc-9fc6-4225-b96b-9ce9056227ee",
                  person: 15,
                },
                {
                  id: "d3f718c8-f4fb-4239-811b-e65d98375d98",
                  person: 5,
                },
              ],
            ],
            cols: 10,
            rows: 7,
          },
        },
        {
          id: "9C i H221_values",
          namn: "9C i H221",
          klass: {
            id: "9C_nameValues",
            namn: "9C",
            personer: [
              "",
              "Ali G",
              "Ali K.E",
              "Alicia",
              "Altan",
              "Anna",
              "Annie",
              "Astrid",
              "Danielle",
              "Ellen",
              "Elliot",
              "Elsa",
              "Emilia",
              "Felicia",
              "Hannes",
              "Hedvig",
              "Hilar",
              "Inés",
              "Isak",
              "Joel",
              "Linus",
              "Maja",
              "Matilda",
              "Myra",
              "Nike",
              "Noah",
              "Ryan",
              "Stella",
              "Stina",
              "Taseen",
              "Tindra",
              "Tobias",
            ],
          },
          klassrum: {
            id: "H221_gridValues",
            namn: "H221",
            grid: [
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
                {
                  id: "b4137529-c05b-41d1-bbf6-c35e00b91db7",
                  person: 2,
                },
                {
                  id: "fbcffb3a-d22d-4b97-a3f5-647c5ee554d0",
                  person: 19,
                },
                {
                  id: "cff929e7-f5eb-44f2-a6a7-501709abd8ed",
                  person: 8,
                },
                {
                  id: "541daf60-9180-4f5e-90d4-22eb7297c664",
                  person: 7,
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
                  id: "98ab3584-dcb7-4aa4-b60d-3f970099568b",
                  person: 15,
                },
                {
                  id: "a79e5f93-3e59-4095-a0e0-5d4848584bad",
                  person: 26,
                },
                {
                  id: "4edf7b72-e8ef-4713-b24c-f88238b1632c",
                  person: 1,
                },
                {
                  id: "f8b5feea-c4c4-40d0-a5be-a6967b5e4d7d",
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
                {
                  id: "d5a7a6ec-a41a-4c82-9864-15ab01dc6491",
                  person: 30,
                },
                {
                  id: "ca461382-a65e-43c7-a42b-55fad6536e35",
                  person: 3,
                },
                {
                  id: "95610668-b25f-4e20-beea-1bc2163c203f",
                  person: 12,
                },
                {
                  id: "13adb846-ac09-41bf-a728-535da6fd1dfe",
                  person: 10,
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
                  id: "713bdeeb-5539-47fe-a74f-f3e556d9f157",
                  person: 23,
                },
                {
                  id: "877018c9-5b29-4458-bce5-97697c769448",
                  person: 17,
                },
                {
                  id: "bb117494-0c36-4190-9589-3667284a612a",
                  person: 9,
                },
                {
                  id: "b5d5a58f-c45a-4011-961e-6f69e83d23f1",
                  person: 22,
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
                {
                  id: "05607b09-3097-4c6b-ab9f-6140710def38",
                  person: 29,
                },
                {
                  id: "8998fe05-7a64-40a2-a690-1666e4e7c0e1",
                  person: 24,
                },
                {
                  id: "121b915a-5783-4f33-ae88-16e3981af687",
                  person: 18,
                },
                {
                  id: "8f9ff719-6b90-408e-bd68-43f5ce6c17e3",
                  person: 21,
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
                  id: "cac2d026-b85a-49a4-8774-c894ed4650d6",
                  person: 31,
                },
                {
                  id: "26bf6783-32c3-4d89-a304-690502685285",
                  person: 25,
                },
                {
                  id: "bbdb2cd2-bc27-416d-a62a-c9bd32b89395",
                  person: 14,
                },
                {
                  id: "f2906228-4623-4094-a68b-30e591795fe3",
                  person: 11,
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
                {
                  id: "8ba2aebd-a14d-45e2-9159-697a9a63d09e",
                  person: 13,
                },
                {
                  id: "fce2ebee-9fc6-425a-8dd4-13f7d8244b02",
                  person: 16,
                },
                {
                  id: "291b8e24-81ad-49fe-98b9-613d01c04c79",
                  person: 28,
                },
                {
                  id: "162ae161-70bc-489b-822c-6f880dc789d9",
                  person: 27,
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
                {
                  id: "9ad55ed5-6fa6-4732-a95b-bc6983d35545",
                  person: 4,
                },
                {
                  id: "3f446a92-58f4-46d6-9f20-16cf22178b03",
                  person: 5,
                },
                {
                  id: "128ef4cf-5f4c-49b5-81c7-1a3624b21c58",
                  person: 20,
                },
                {
                  id: "6a966b2b-5c15-4980-b083-299e69e71f48",
                  person: 6,
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
            ],
            cols: 13,
            rows: 10,
          },
        },
        {
          id: "9B i H221_values",
          namn: "9B i H221",
          klass: {
            id: "9B_nameValues",
            namn: "9B",
            personer: [
              "",
              "Enisa",
              "Oscar",
              "Hampus",
              "Wilma",
              "Gabriel",
              "Astrid",
              "Stella",
              "Olle",
              "Ellen",
              "Hugo",
              "Andrea",
              "Iman",
              "Alva",
              "Sofia",
              "Noah",
              "Thea",
              "Sador",
              "Jamie",
              "Jakob",
              "Signe",
              "Isabella",
              "Aria",
              "Viggo",
              "Vincent",
              "Alexander",
              "Julia",
              "Alex",
              "Linnéa",
              "Rebecca",
              "Madeleine",
              "Elin",
              "Lilly",
            ],
          },
          klassrum: {
            id: "H221_gridValues",
            namn: "H221",
            grid: [
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
                {
                  id: "2fa554f5-3be1-4395-9344-d8884701c55e",
                  person: 3,
                },
                {
                  id: "93d29566-37f8-4aa0-9a15-a32df2a7df2c",
                  person: 7,
                },
                {
                  id: "3ef00476-0d32-4768-bdea-bb1be5c6c47e",
                  person: 25,
                },
                {
                  id: "36daa76f-9662-4bcf-adeb-7bbf10c5c8db",
                  person: 29,
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
                  id: "d99b68c6-522e-406a-8b37-3396699cefb8",
                  person: 26,
                },
                {
                  id: "97b8ae41-9ef7-454e-ac48-4626ca1484f2",
                  person: 10,
                },
                {
                  id: "cb5b463b-30ff-4e11-a1a5-d36374701281",
                  person: 19,
                },
                {
                  id: "28711e3d-d03e-437b-8356-58bc33743c9d",
                  person: 9,
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
                {
                  id: "aeded909-05af-4864-bfb4-cd27c5fbfcd7",
                  person: 6,
                },
                {
                  id: "fd609501-54a6-4d60-a885-2e0843232bf5",
                  person: 11,
                },
                {
                  id: "9f96d967-6af8-4946-98dd-83ef486bcf52",
                  person: 14,
                },
                {
                  id: "45c4319c-7355-49bd-a13b-6568cd0b8c5a",
                  person: 12,
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
                  id: "d970f2e0-cf5c-4d31-ae9a-135a2bb7c9da",
                  person: 15,
                },
                {
                  id: "f602c333-2cf5-4c7a-9006-106316ed686c",
                  person: 18,
                },
                {
                  id: "5d25d156-5291-43f8-95cb-2ca8923db9fa",
                  person: 16,
                },
                {
                  id: "0402a9f5-13a0-4aa6-be8e-691560c08873",
                  person: 28,
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
                {
                  id: "33e75959-1b93-4ffc-bae0-028302a14031",
                  person: 22,
                },
                {
                  id: "26e97c66-ef9a-4304-a094-699f88e84a89",
                  person: 13,
                },
                {
                  id: "88ae381f-52cd-4307-8aec-c1e2ce1bbcb8",
                  person: 24,
                },
                {
                  id: "2918502a-2c26-4d09-9634-39f1db54040e",
                  person: 27,
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
                  id: "6cd1ff8c-6ce8-4fa9-b61a-97272eb7b274",
                  person: 17,
                },
                {
                  id: "785d55cc-d86f-4d7d-93be-493d17a026bc",
                  person: 4,
                },
                {
                  id: "0f483007-9db2-4d2d-ac81-033a7a7dd5b3",
                  person: 32,
                },
                {
                  id: "bda11d83-9fc7-42f8-aecf-b78a57d33f5c",
                  person: 8,
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
                {
                  id: "21318f90-ed14-48e2-86df-73b368aadddd",
                  person: 31,
                },
                {
                  id: "cbbd5f5f-3f24-4135-b9e1-13d90b6612eb",
                  person: 20,
                },
                {
                  id: "533f64fa-73c9-4fbc-a198-3d49db4196b7",
                  person: 21,
                },
                {
                  id: "754e7e12-0bd0-4913-9023-22887ca8753e",
                  person: 30,
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
                {
                  id: "0291aab8-6c0c-462c-bacf-a2b04b01b00d",
                  person: 5,
                },
                {
                  id: "d685d342-f238-4fb5-bab2-e2f3a492feaf",
                  person: 2,
                },
                {
                  id: "68d03d4e-f0ae-4a4a-b46f-4a1fdbb98a29",
                  person: 23,
                },
                {
                  id: "3840c0b8-08c4-4cb3-9db3-0a0b871c16d8",
                  person: 1,
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
            ],
            cols: 13,
            rows: 10,
          },
        },
        {
          id: "9D, sv 3_values",
          namn: "9D, sv 3",
          klass: {
            id: "9c0823cd-0f83-407e-b218-adeb836ff646",
            namn: "okänt",
            personer: [
              "",
              "Alsu",
              "Hussein",
              "Jakob",
              "Kevin",
              "Juni",
              "Julia",
              "Oliver",
              "Isak",
              "Livia",
              "Tilde",
              "Eric",
              "Markus",
              "Elsa",
              "Vera",
              "Emilia",
              "Gabriel",
              "Tore",
              "Katerina",
              "Ines",
              "William",
              "Mona",
              "Turid",
              "Otto",
              "Maria",
              "Amanda",
              "Astrid",
              "Sammy",
              "Alice",
              "Rasmus",
              "Malcolm",
              "Emil L",
              "Emil B",
            ],
          },
          klassrum: {
            id: "14b108a0-9620-4214-817e-b516ca285169",
            namn: "okänt",
            grid: [
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
                {
                  id: "63a8dfe0-bfe7-4182-a6e7-5ce8b2170864",
                  person: 5,
                },
                {
                  id: "1e94edc8-94ce-4a45-95f8-d6734dd90365",
                  person: 20,
                },
                {
                  id: "f9a1c05d-d902-450f-9682-e2d9b105b315",
                  person: 30,
                },
                {
                  id: "bb11608d-990a-455e-a326-424fb7d8e03c",
                  person: 4,
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
                  id: "a34ed174-f9fa-4586-8c5d-41e2aee7c53b",
                  person: 10,
                },
                {
                  id: "405157d0-59f1-41cc-99d6-7da3182c2eae",
                  person: 17,
                },
                {
                  id: "696ff5cb-3c77-48e1-9d65-514d29d30026",
                  person: 23,
                },
                {
                  id: "6fe18845-cded-48b6-8abb-4c4101f9fcc9",
                  person: 18,
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
                {
                  id: "b052f6b3-0120-4795-a08d-6f20fc9b9a01",
                  person: 1,
                },
                {
                  id: "f580b9f8-0d9b-4aaa-adc9-faece3f9c378",
                  person: 25,
                },
                {
                  id: "7b77bfc9-336c-41d3-b178-3cf865086926",
                  person: 26,
                },
                {
                  id: "587174f6-38d5-43ec-bb85-a94d2372a8b8",
                  person: 31,
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
                  id: "5de78f29-dce9-4e36-8981-93f31dcf7def",
                  person: 14,
                },
                {
                  id: "d12e52f9-36af-4aa4-9de2-9ee3b89f3731",
                  person: 13,
                },
                {
                  id: "e50c8329-01a1-433a-90b1-7bef62aa0165",
                  person: 15,
                },
                {
                  id: "bc3bde45-ad09-4414-a7da-a57823f9ccf9",
                  person: 21,
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
                {
                  id: "d8f681c0-a054-4082-827e-e937528e620b",
                  person: 32,
                },
                {
                  id: "e66d8b13-0267-48f7-98b9-402fc1696e5a",
                  person: 9,
                },
                {
                  id: "1a79893b-b8d7-44fb-962d-66201ffc9d76",
                  person: 19,
                },
                {
                  id: "c0629099-a214-4ed3-9f34-711dde410a61",
                  person: 6,
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
                  id: "a452d4ca-b7b4-49fd-9f75-dd333d13263e",
                  person: 29,
                },
                {
                  id: "2bed969d-ff40-4f99-a075-644f7cb7b95f",
                  person: 24,
                },
                {
                  id: "66a4cc88-3757-40f3-8d30-7e91c2737874",
                  person: 16,
                },
                {
                  id: "08f236cc-9a08-4795-b642-d7c6f66bd744",
                  person: 22,
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
                {
                  id: "2be01282-c476-4d79-bdd0-4c435f3cbe8a",
                  person: 8,
                },
                {
                  id: "976bf3ba-0c0b-4027-baa5-efd02a1d2865",
                  person: 2,
                },
                {
                  id: "ed1cfcbb-6989-46fa-8969-dc75f8326ff2",
                  person: 3,
                },
                {
                  id: "8a77f8b2-a57f-415b-b082-b9f2aadcd0bb",
                  person: 12,
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
                {
                  id: "956cc3c1-0d44-4f2c-b2ea-7a00c21e84b3",
                  person: 7,
                },
                {
                  id: "b7f4d9ca-d7f9-4565-90e8-76ce9e3c36ba",
                  person: 27,
                },
                {
                  id: "2b8007a5-8890-4680-afa5-f21a83dfc9bd",
                  person: 28,
                },
                {
                  id: "0f05b780-0f62-460d-b1a6-52413f237eec",
                  person: 11,
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
            ],
            cols: 13,
            rows: 10,
          },
        },
        {
          id: "9A, Sv, 3_values",
          namn: "9A, Sv, 3",
          klass: {
            id: "f8570945-3068-4709-a521-774363c9511c",
            namn: "okänt",
            personer: [
              "",
              "Alexander",
              "Roham",
              "Isac",
              "Oscar",
              "Anna",
              "Sid",
              "Erika",
              "Walter",
              "Klara",
              "Hampus",
              "William",
              "Erik",
              "Eli",
              "Moa",
              "Arvid",
              "Samuel",
              "Artur",
              "Sixten",
              "Maja",
              "Melike",
              "Lo",
              "Ida",
              "Alvina",
              "Bosse",
              "Betty",
            ],
          },
          klassrum: {
            id: "781b3c21-a9a9-479d-a06b-0d96bac1a806",
            namn: "okänt",
            grid: [
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
                {
                  id: "71497a46-e787-4eb5-92d6-a2431568fe2c",
                  person: 15,
                },
                {
                  id: "e4962e12-684d-4a50-89ef-224318645f15",
                  person: 10,
                },
                {
                  id: "eafe5ea1-57a0-40da-9c10-31898bcbfd1a",
                  person: 11,
                },
                {
                  id: "40a23261-9f22-47cf-9ff3-15621fbbe77a",
                  person: 7,
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
                  id: "d7b1d8fc-d480-4f44-888f-f0539c2cc07c",
                  person: 13,
                },
                {
                  id: "e79516a7-f951-4c00-b744-d40b50dcb920",
                  person: 17,
                },
                {
                  id: "6535e0ab-216e-4b39-89fb-1b209120b151",
                  person: 2,
                },
                {
                  id: "dcdf20bf-55cd-4c17-83e0-0daa3022946e",
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
                {
                  id: "59bc283b-7c13-4e88-a692-dff737241ec2",
                  person: 3,
                },
                {
                  id: "5bf4cc82-4759-40e2-aee3-31c79c871a28",
                  person: 0,
                },
                {
                  id: "59d247c3-e8fd-48c8-a969-eb24d8c8c280",
                  person: 18,
                },
                {
                  id: "09c7f0c9-4be6-402b-b383-4bf173bb827f",
                  person: 16,
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
                  id: "3c8a3d3a-39e0-4a19-804d-e3b7aa5a6b3a",
                  person: 25,
                },
                {
                  id: "44546b87-cd06-438d-b8c8-7cb17bf46ea6",
                  person: 1,
                },
                {
                  id: "649c4be4-c3a0-487c-9222-2439c891caca",
                  person: 22,
                },
                {
                  id: "53f3e818-eb76-4065-8331-c289119dea63",
                  person: 20,
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
                {
                  id: "c6d6501f-f95f-4fca-a187-0305cdbcd789",
                  person: 6,
                },
                {
                  id: "3ed5ec53-22c3-4228-ae74-8552cfbe15f9",
                  person: 24,
                },
                {
                  id: "e2c4b13e-446a-4c18-a26e-27a85fd284a0",
                  person: 23,
                },
                {
                  id: "25977c6a-64c3-4a74-ac3b-dd13d436e582",
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
                  id: "5abe0147-efcf-486e-a97b-2f32172bca7b",
                  person: 0,
                },
                {
                  id: "04a662b0-263d-4340-a589-2eba9aca8497",
                  person: 0,
                },
                {
                  id: "bb5d7064-44d9-49e5-90a6-93d209b1e3f0",
                  person: 0,
                },
                {
                  id: "00d5c628-a77e-4d27-ba92-69315a66003f",
                  person: 14,
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
                {
                  id: "f2b73040-b0ab-4e11-98f7-ae58a50f7090",
                  person: 12,
                },
                {
                  id: "61c00bf3-f5f9-40a5-8c1f-be6eb73938ad",
                  person: 5,
                },
                {
                  id: "bd7c8fb9-3315-4fc6-babd-cca8f7e299fc",
                  person: 8,
                },
                {
                  id: "92666412-8613-4083-abb7-44dbde7dae78",
                  person: 4,
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
                {
                  id: "344790ae-c7b2-423f-a17a-c362145fb247",
                  person: 21,
                },
                {
                  id: "dd3a1512-aaf9-4891-a7b3-a6506f8a1248",
                  person: 9,
                },
                {
                  id: "f850a3d4-68b5-43c6-a72f-d3becd22e645",
                  person: 19,
                },
                {
                  id: "4dc2d8f2-2e94-49a5-aeac-5788d89e75f0",
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
            ],
            cols: 13,
            rows: 10,
          },
        },
        {
          id: "9A, hela i H221_values",
          namn: "9A, hela i H221",
          klass: {
            id: "9A, hela_nameValues",
            namn: "9A, hela",
            personer: [
              "",
              "Alexander",
              "Roham",
              "Isac",
              "Prodromos",
              "Oscar B",
              "Betty",
              "Anna",
              "Alexia",
              "Sid",
              "Bosse",
              "Erika",
              "Walter",
              "Klara",
              "Sueda",
              "Hampus",
              "William",
              "Erik",
              "Eli",
              "Moa",
              "Farhiya",
              "Arvid",
              "Samuel",
              "Artur",
              "Tony",
              "Sixten",
              "Uktam",
              "Maja",
              "Melike",
              "Lo",
              "Ida",
              "Oscar W",
              "Alvina",
            ],
          },
          klassrum: {
            id: "H221_gridValues",
            namn: "H221",
            grid: [
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
                {
                  id: "6e327bab-ae19-49a3-83e0-04c1e27221ef",
                  person: 10,
                },
                {
                  id: "ff99cbf8-e55c-404c-a929-e3d0404bb70b",
                  person: 30,
                },
                {
                  id: "3ba149af-c453-4dd0-9f58-36e129fe81f0",
                  person: 21,
                },
                {
                  id: "17745e77-a336-4425-9115-436806469440",
                  person: 17,
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
                  id: "c9342ce4-514b-48cb-963d-b1b36381d25a",
                  person: 16,
                },
                {
                  id: "96139428-a429-4656-9f3f-ae987c930b04",
                  person: 12,
                },
                {
                  id: "b0191b7f-cebb-40cb-a63a-b2c0f4a1c4bc",
                  person: 4,
                },
                {
                  id: "d9cb3363-f175-40fe-9b21-fc6844c29576",
                  person: 1,
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
                {
                  id: "6133ceee-6768-495b-8507-0d96513168ac",
                  person: 3,
                },
                {
                  id: "81a6ccee-2cd8-485c-9e11-b9962dc6ed9f",
                  person: 7,
                },
                {
                  id: "d4b90352-3ce7-4e41-b84c-2752ea52f865",
                  person: 20,
                },
                {
                  id: "28a09300-7699-42fe-b6be-3b1c817a24ca",
                  person: 15,
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
                  id: "b0cc3ceb-fa8e-45c4-978d-86dca8a2d61b",
                  person: 2,
                },
                {
                  id: "6b922abd-4c89-40de-b514-7c72bc35baff",
                  person: 32,
                },
                {
                  id: "4ebb7664-63f1-4f2d-abc6-95ea6cfdc7e4",
                  person: 14,
                },
                {
                  id: "e0d096c5-65f4-48a1-bc3c-830478c06aad",
                  person: 31,
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
                {
                  id: "1fa545ed-04f3-41f3-a796-e5ada4e27b28",
                  person: 29,
                },
                {
                  id: "db4d6586-5861-4ee8-85e9-cddefdec72d5",
                  person: 24,
                },
                {
                  id: "fc6c547d-76cd-4251-bf35-9c4854d3c710",
                  person: 28,
                },
                {
                  id: "8b1ec074-d46b-498f-b850-37ce17e8b9ee",
                  person: 23,
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
                  id: "e4dedb93-c2f1-42f3-876a-4d5749bc1bb4",
                  person: 9,
                },
                {
                  id: "9901cc98-e958-451e-8d79-34e0ab1e6227",
                  person: 27,
                },
                {
                  id: "d1546152-15ac-433e-9fb9-e6ed2e6e8aa0",
                  person: 8,
                },
                {
                  id: "19b8f95c-a523-4018-8712-0ec5e19b2062",
                  person: 22,
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
                {
                  id: "633f9f7a-2765-457d-ab0f-6328e0a8fbf0",
                  person: 5,
                },
                {
                  id: "a779d972-9d74-4409-a71e-195e4bcdbf47",
                  person: 11,
                },
                {
                  id: "585bde21-b161-42e7-b10a-004da0e211a0",
                  person: 25,
                },
                {
                  id: "b716f46e-39dd-406b-8cce-1d74ef3b07c7",
                  person: 13,
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
                {
                  id: "6fb5ad66-103b-4dce-81b0-2f3ab8196b0f",
                  person: 6,
                },
                {
                  id: "ff2ea9f0-842c-48c1-b17b-4216fd28e156",
                  person: 18,
                },
                {
                  id: "8f472359-46e7-4b26-8ca4-85a8c403a43f",
                  person: 26,
                },
                {
                  id: "d74bef1b-bda0-4108-a6a8-96990eb49dbf",
                  person: 19,
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
            ],
            cols: 13,
            rows: 13,
          },
        },
        {
          id: "9A, SH_values",
          namn: "9A, SH",
          klass: {
            id: "630bf117-1ff3-468c-88f6-ae48e8271530",
            namn: "okänt",
            personer: [
              "",
              "Alexander",
              "Roham",
              "Isac",
              "Prodromos",
              "Oscar B",
              "Betty",
              "Anna",
              "Alexia",
              "Sid",
              "Bosse",
              "Erika",
              "Walter",
              "Klara",
              "Sueda",
              "Hampus",
              "William",
              "Erik",
              "Eli",
              "Moa",
              "Farhiya",
              "Arvid",
              "Samuel",
              "Artur",
              "Tony",
              "Sixten",
              "Uktam",
              "Maja",
              "Melike",
              "Lo",
              "Ida",
              "Oscar W",
              "Alvina",
            ],
          },
          klassrum: {
            id: "7a0c81ee-d62b-4c7c-97b6-a24639355424",
            namn: "okänt",
            grid: [
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
                {
                  id: "7444de5a-e156-4914-8956-063562586d26",
                  person: 10,
                },
                {
                  id: "78c9d2d5-1eca-4739-8246-5082d738bc04",
                  person: 30,
                },
                {
                  id: "c1ea4eb5-47cc-421b-a22f-d1501defd9b1",
                  person: 21,
                },
                {
                  id: "8dc56345-b740-4402-b6c5-341c9a7794c0",
                  person: 17,
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
                  id: "eccd1f69-63ab-46b3-b3d6-08a969509abb",
                  person: 16,
                },
                {
                  id: "28113e50-662b-4a4a-910e-ae837348f929",
                  person: 12,
                },
                {
                  id: "715c13c4-b7a7-447b-a194-ef48a2e52cc4",
                  person: 4,
                },
                {
                  id: "2d314e98-c595-4cf1-adf7-384351f3e6cc",
                  person: 1,
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
                {
                  id: "87f3815f-48ff-49d5-b531-1639f3eea85b",
                  person: 3,
                },
                {
                  id: "a8ac3085-82f7-4f61-b8eb-3309a12b4fe9",
                  person: 7,
                },
                {
                  id: "6c31536a-ef26-4d71-835c-dfa5e37b0a97",
                  person: 20,
                },
                {
                  id: "6704439b-5c97-4c1a-acf0-dceea39bd772",
                  person: 15,
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
                  id: "61edcd13-9b49-4dbf-bdb6-5197bcfd919d",
                  person: 2,
                },
                {
                  id: "c95994e3-7eaf-414d-8aa8-ba4003618ab2",
                  person: 32,
                },
                {
                  id: "d71bb770-661d-4eda-8dba-c1e8ae7c4028",
                  person: 14,
                },
                {
                  id: "3f55b5a0-2191-4830-82fb-59ef1480028c",
                  person: 31,
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
                {
                  id: "9bb21e69-8aec-4756-a251-5c72882afae0",
                  person: 29,
                },
                {
                  id: "b2211c86-f458-4d9f-8101-ded5dde1010e",
                  person: 24,
                },
                {
                  id: "25a70b32-df30-4c81-9ea9-4cec0ebb8a9b",
                  person: 28,
                },
                {
                  id: "c0a05a81-e531-4912-96ff-bc9a69fbd169",
                  person: 23,
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
                  id: "3137633d-d7c2-4c75-bf8c-624b453cd427",
                  person: 9,
                },
                {
                  id: "68ecacb7-1094-489d-9638-6c47ed110379",
                  person: 27,
                },
                {
                  id: "ec4439dd-a8b3-4331-b3a7-aaf42a9e4f82",
                  person: 8,
                },
                {
                  id: "884ee910-a01b-443f-9c45-c9254c84b206",
                  person: 22,
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
                {
                  id: "fbd04c4b-7c80-40b9-a844-8ce48e08d468",
                  person: 5,
                },
                {
                  id: "3911a6ed-7dc4-4cd7-8179-a25910753c37",
                  person: 11,
                },
                {
                  id: "dddefd2c-8c29-4547-8b8d-a7bbe95f8d46",
                  person: 25,
                },
                {
                  id: "75054079-d487-4c60-abce-cea1f10d2a90",
                  person: 13,
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
                {
                  id: "323ae4fa-c8b3-4851-ab31-7a9b88cfa1c0",
                  person: 6,
                },
                {
                  id: "1a403d06-1249-474f-86b4-70632408f6ec",
                  person: 18,
                },
                {
                  id: "594ac669-4c5e-41c0-b603-9c1f35381262",
                  person: 26,
                },
                {
                  id: "0e0dea1e-1423-4489-a925-b85db337a217",
                  person: 19,
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
            ],
            cols: 13,
            rows: 13,
          },
        },
        {
          id: "9D, förberedelse, del a_values",
          namn: "9D, förberedelse, del a",
          klass: {
            id: "fc098eab-2f1a-4979-b00b-58a1969591b4",
            namn: "okänt",
            personer: [
              "",
              "Alsu",
              "Hussein",
              "Jakob",
              "Kevin",
              "Juni",
              "Julia",
              "Oliver",
              "Isak",
              "Livia",
              "Tilde",
              "Eric",
              "Markus",
              "Elsa",
              "Vera",
              "Emilia",
              "Gabriel",
              "Tore",
              "Katerina",
              "Ines",
              "William",
              "Mona",
              "Turid",
              "Otto",
              "Maria",
              "Amanda",
              "Astrid",
              "Sammy",
              "Alice",
              "Rasmus",
              "Malcolm",
              "Emil L",
              "Emil B",
            ],
          },
          klassrum: {
            id: "de72f281-15e8-4681-855a-60f81aa3ba0d",
            namn: "okänt",
            grid: [
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
                {
                  id: "be75191f-6c8e-4c17-a20e-1373e027a83b",
                  person: 5,
                },
                {
                  id: "87b7b4ed-323d-4496-b72d-e74ec06a0140",
                  person: 20,
                },
                {
                  id: "c7b07bf9-e8f8-48ef-bcf4-576ed248b577",
                  person: 30,
                },
                {
                  id: "f267bf89-8432-4285-bc36-679c6a829b4f",
                  person: 4,
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
                  id: "73c796ee-fdb2-4635-9bcf-57831be74c13",
                  person: 10,
                },
                {
                  id: "06dbb7e1-9d01-42b4-9b02-70b29692c271",
                  person: 17,
                },
                {
                  id: "7b30e00e-8cb1-4b42-a03f-984d664ce416",
                  person: 23,
                },
                {
                  id: "817e494d-ce97-422b-94fe-cc7bf6893377",
                  person: 18,
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
                {
                  id: "535d84c4-4ead-4f59-9d32-2b87f2e320c4",
                  person: 1,
                },
                {
                  id: "b70de4be-3a63-4e89-abc1-9987165742b5",
                  person: 25,
                },
                {
                  id: "9db8dad0-391a-488f-8bf2-dcac6ce4de40",
                  person: 26,
                },
                {
                  id: "c39ecb5e-0dfc-4e4b-9a03-3d066d999491",
                  person: 31,
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
                  id: "abdfe381-1622-433e-af9d-7119a74ed9cf",
                  person: 14,
                },
                {
                  id: "6969894c-7d08-44de-a416-14f0d6920b4f",
                  person: 13,
                },
                {
                  id: "f33700bc-2b9b-4879-bc4a-f3a1a47a8723",
                  person: 15,
                },
                {
                  id: "1bfc4dd0-a1f7-4c92-bb2b-643f972ddb97",
                  person: 21,
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
                {
                  id: "f31acbb4-ec16-419c-a633-01f7c0355ad6",
                  person: 32,
                },
                {
                  id: "06bb64bc-1b9d-448c-bf3c-9637992ce684",
                  person: 9,
                },
                {
                  id: "cb1cbfa1-ade7-4f6d-a503-6e975740d6c1",
                  person: 19,
                },
                {
                  id: "84fb7ec5-f4ce-4444-b529-5d11229739ec",
                  person: 6,
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
                  id: "e63c9134-26d1-4af1-b6f7-ce9c0ad08cec",
                  person: 29,
                },
                {
                  id: "e1936cbb-5492-41d3-996f-35b7058fdee4",
                  person: 24,
                },
                {
                  id: "f891eb24-a9b9-413c-97d1-b47ba19dbf6b",
                  person: 16,
                },
                {
                  id: "21350512-c173-43b5-87ff-fc4b33cd27c2",
                  person: 22,
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
                {
                  id: "2c714a24-7cc1-4cf8-a777-f56c63dd5243",
                  person: 8,
                },
                {
                  id: "58c16925-0e92-44f6-b2d5-4dc29312ee48",
                  person: 2,
                },
                {
                  id: "91ec233c-f3f8-46eb-beda-3e637787abbd",
                  person: 3,
                },
                {
                  id: "c8008deb-0b06-460d-b086-d9e4263b2148",
                  person: 12,
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
                {
                  id: "d2cad07b-39c1-482d-a7e6-049815a3b9c3",
                  person: 7,
                },
                {
                  id: "10d24924-0d4c-4c5d-869c-f7653fdaf741",
                  person: 27,
                },
                {
                  id: "b9b95941-6099-4370-a298-fcaaed5cde87",
                  person: 28,
                },
                {
                  id: "13b5d636-93f0-401e-8d88-5e5248356beb",
                  person: 11,
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
            ],
            cols: 13,
            rows: 10,
          },
        },
        {
          id: "9A, förberedelse, del A_values",
          namn: "9A, förberedelse, del A",
          klass: {
            id: "06fda09c-f4bd-4b16-ad0a-caf1bf03e0df",
            namn: "okänt",
            personer: [
              "",
              "Alexander",
              "Roham",
              "Isac",
              "Oscar",
              "Anna",
              "Sid",
              "Erika",
              "Walter",
              "Klara",
              "Hampus",
              "William",
              "Erik",
              "Eli",
              "Moa",
              "Arvid",
              "Samuel",
              "Artur",
              "Sixten",
              "Maja",
              "Melike",
              "Lo",
              "Ida",
              "Alvina",
              "Bosse",
              "Betty",
            ],
          },
          klassrum: {
            id: "31325158-f89c-4714-a5c9-95c24e4fe936",
            namn: "okänt",
            grid: [
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
                {
                  id: "9c4f0ba1-634b-441c-bedb-a636b995ba23",
                  person: 15,
                },
                {
                  id: "b7bf474b-d1a0-4c24-8f97-a0662f15b03a",
                  person: 10,
                },
                {
                  id: "88bc9728-08fb-4bfc-b553-d2e6317ee03c",
                  person: 11,
                },
                {
                  id: "ebd84115-365d-4c5d-a976-dfdc5292bcd6",
                  person: 7,
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
                  id: "64694882-a6a4-463a-852f-16879bb336a0",
                  person: 13,
                },
                {
                  id: "20063c8f-53c4-47e2-9c8d-618d1777513d",
                  person: 17,
                },
                {
                  id: "961e3397-5b91-434d-949e-57b4ad5553c3",
                  person: 2,
                },
                {
                  id: "36e260b6-5bc9-4e11-999e-3589f0df5943",
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
                {
                  id: "8df86c41-d215-4d42-b251-902210784b4a",
                  person: 3,
                },
                {
                  id: "8d1a26e2-d5cd-468e-a8b6-f1cf6288d403",
                  person: 0,
                },
                {
                  id: "5177277c-53a8-43f4-bfd6-8388ebc78700",
                  person: 18,
                },
                {
                  id: "1ec3fed7-178a-4d0d-89c4-8439b3be76b1",
                  person: 16,
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
                  id: "9037cad4-3506-4458-ab15-f76a84fed735",
                  person: 25,
                },
                {
                  id: "329a4c31-5728-47b0-be7f-9e53ad66e036",
                  person: 1,
                },
                {
                  id: "c5153026-2589-430b-8756-66baa3350fe9",
                  person: 22,
                },
                {
                  id: "4ba4da72-7891-43d4-802e-012341d5beb0",
                  person: 20,
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
                {
                  id: "8605b3fa-e0b0-415c-bdd8-e896aef6ba15",
                  person: 6,
                },
                {
                  id: "44745655-ad60-4cbc-a578-bf06e780e333",
                  person: 24,
                },
                {
                  id: "829ab097-8cc9-4909-9afe-f29c8597d93a",
                  person: 23,
                },
                {
                  id: "d072b03a-7882-4144-8228-ef5f25669e9d",
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
                  id: "11aaf50b-2fb8-4a7d-a2f4-69ecd33a51c8",
                  person: 0,
                },
                {
                  id: "4db27e37-99d3-4db1-b5b1-148d7eb0ae84",
                  person: 0,
                },
                {
                  id: "d9ae9b13-98df-4b6b-93a5-5a2ca715db0f",
                  person: 0,
                },
                {
                  id: "79fd1a07-d802-493c-bbd1-c5326ad050ce",
                  person: 14,
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
                {
                  id: "a34c4217-eeb5-46bc-bb21-b865dca6f5ab",
                  person: 12,
                },
                {
                  id: "5efcbae2-5015-463d-908c-bb5447823a52",
                  person: 5,
                },
                {
                  id: "7f61c915-7328-44e8-8f11-41f2b3325370",
                  person: 8,
                },
                {
                  id: "a5cd8ea3-08af-4bec-8222-195d41027967",
                  person: 4,
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
                {
                  id: "c2d30a4e-c9d1-4213-b76b-06c12055d57b",
                  person: 21,
                },
                {
                  id: "b3154fbe-5723-404a-af39-c0a579c9d8bd",
                  person: 9,
                },
                {
                  id: "e2e4d106-db9b-41a4-8ac9-087424e224af",
                  person: 19,
                },
                {
                  id: "6865a866-dd09-468a-8f5b-0c647dc3a256",
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
            ],
            cols: 13,
            rows: 10,
          },
        },
        {
          id: "8B i H221_values",
          namn: "8B i H221",
          klass: {
            id: "8B_nameValues",
            namn: "8B",
            personer: [
              "",
              "Maya",
              "Justin",
              "Anton",
              "Elsa",
              "Tim",
              "Emmy",
              "Joel",
              "Theo",
              "Astor",
              "Enkhjin",
              "Dante",
              "Rathin",
              "Tuva",
              "Maximus",
              "Hugo",
              "Max",
              "Vincent",
              "Tyra",
              "Elvin",
              "Stella",
              "Astrid",
              "Sid",
              "Taley",
              "John",
              "Zackarias",
              "Freja",
              "Victor",
              "Lea",
              "Malte",
              "Tilda",
            ],
          },
          klassrum: {
            id: "H221_gridValues",
            namn: "H221",
            grid: [
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
                {
                  id: "0df71f14-d85a-4a48-87a4-fa1c5884f70c",
                  person: 2,
                },
                {
                  id: "2d0bbf58-7b47-4b15-8851-2cfa60eca6b5",
                  person: 0,
                },
                {
                  id: "4e18bcf9-8095-4d0d-94cd-4bba0bd5a298",
                  person: 16,
                },
                {
                  id: "3400aca7-17e4-41ad-a63f-66f8cc469859",
                  person: 15,
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
                  id: "d9cf8b34-313a-4b94-b7c3-ea164fc6ce17",
                  person: 5,
                },
                {
                  id: "c844c7c3-0a8f-4122-bfd1-e880c6d89942",
                  person: 22,
                },
                {
                  id: "4c7202eb-fbe3-47a9-b165-251c4c3e44d8",
                  person: 6,
                },
                {
                  id: "823141c8-7da5-4081-a9fb-ab0fbcf6b5c2",
                  person: 13,
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
                {
                  id: "1372c085-f9b7-49a3-ba98-ff353df2e39b",
                  person: 29,
                },
                {
                  id: "b5401687-1379-454d-ade6-32f3d156fcfe",
                  person: 21,
                },
                {
                  id: "d7b1e1a8-7a54-47d8-bae1-2defdd048d7f",
                  person: 28,
                },
                {
                  id: "880e3730-6cf6-4712-b2f7-3913f2753359",
                  person: 11,
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
                  id: "d0409005-c6bb-44f3-92c8-648710d29288",
                  person: 8,
                },
                {
                  id: "99056b65-95fa-4492-8827-07be529b59a3",
                  person: 7,
                },
                {
                  id: "ca1e5cc9-29e3-4ef1-b97c-c27926c3b71f",
                  person: 4,
                },
                {
                  id: "a8d882c9-bcbe-4732-805a-2f2ef61355be",
                  person: 9,
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
                {
                  id: "945fe5a4-3c1a-4e93-98e8-38b9cacbf12d",
                  person: 26,
                },
                {
                  id: "7eb5a22b-51fe-4045-9866-f1041d538d00",
                  person: 3,
                },
                {
                  id: "aba31753-7c89-453f-8931-118f76b57a56",
                  person: 20,
                },
                {
                  id: "8fc8b5a0-bf2b-4270-acdf-471674562f44",
                  person: 18,
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
                  id: "15f3e71a-37e5-4507-8bdc-efadac8fb059",
                  person: 27,
                },
                {
                  id: "38752108-83d2-457c-8ed2-e4e12c6836f5",
                  person: 10,
                },
                {
                  id: "81962e87-8e64-474d-ab0f-bdaad9e7c78c",
                  person: 30,
                },
                {
                  id: "c2d783d1-7e38-4545-8e60-1de878b4f3c6",
                  person: 24,
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
                {
                  id: "006c34c6-0f85-4cca-a108-28081a6d33c6",
                  person: 17,
                },
                {
                  id: "0b58ee43-8a4a-4e6f-a2a7-6509cc6be5ce",
                  person: 14,
                },
                {
                  id: "eac58020-7a0d-423a-8562-b9cbb88b21eb",
                  person: 1,
                },
                {
                  id: "ad4b5a63-30ef-4814-bb75-c399bf9e0eef",
                  person: 23,
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
                {
                  id: "8bc1ced2-51b7-47fb-94ec-523589134905",
                  person: 0,
                },
                {
                  id: "1c26b5bd-1409-4c68-8154-6c9f8b8f2992",
                  person: 12,
                },
                {
                  id: "d3900a36-56d0-4b54-b350-b7df3634b939",
                  person: 25,
                },
                {
                  id: "fe7aa12b-4e87-4e59-99cb-ece8c5c6b8ef",
                  person: 19,
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
            ],
            cols: 13,
            rows: 10,
          },
        },
        {
          id: "8A, ny ny i H221, prov_values",
          namn: "8A, ny ny i H221, prov",
          klass: {
            id: "8A, ny ny_nameValues",
            namn: "8A, ny ny",
            personer: [
              "",
              "Mlak",
              "Nathalie",
              "Eliah",
              "Nicole",
              "Vera",
              "Filip",
              "Anton",
              "Alva",
              "Qianmiao",
              "Jeremias",
              "Albin",
              "Anja",
              "Adam",
              "Linnea",
              "William",
              "Elisa",
              "Måns",
              "Emil",
              "Fred",
              "Norah",
              "Isabelle",
              "Lucas",
              "Sebastian",
              "Gabriel M",
              "Gabriel S",
              "Wilma",
            ],
          },
          klassrum: {
            id: "H221, prov_gridValues",
            namn: "H221, prov",
            grid: [
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
                  id: "eed5a8bd-6cba-472f-8516-abf35d5b633a",
                  person: 15,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "bf4ea51b-c6c1-4417-9096-d8ae5bb263e4",
                  person: 5,
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
                  id: null,
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "f38c8dce-28b6-4f6f-bbe4-e9f1aa131325",
                  person: 18,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "92bfd8f8-0894-4d0b-8b5d-e593dfb5f12f",
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
                  id: "a0e8df9d-1090-4d6c-aa76-46dbddb799e1",
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
                  id: "877efed5-fa93-42d7-9f19-d9c51ba9664c",
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "7205f410-0784-4cc4-9e60-ef3c628a8c39",
                  person: 14,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "50666718-810b-49e6-88b6-e497baebd30f",
                  person: 16,
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
                  id: "94a666b4-6644-48e8-88bc-d0e13c15b7e0",
                  person: 13,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "7a8d1a59-51d8-4922-b1b8-2d1655e3f698",
                  person: 4,
                },
                {
                  id: "29ae8a3c-45eb-4500-992e-d77cc4abd724",
                  person: 24,
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
                {
                  id: null,
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "d2ae735b-e692-401e-9b7f-dd10d5d3d82c",
                  person: 12,
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
                  id: "dc9e43f0-5728-4ea8-becd-75e3016a1c59",
                  person: 21,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "dc006927-23f6-4062-a899-2982511340ca",
                  person: 7,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "d0316a51-14e5-4f9c-a7a5-d107fb920baf",
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
                  id: "01f792a9-7166-4eb5-9f86-35b9f72b91f8",
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "cb1c477c-f604-4a88-892a-b5b6b21ff370",
                  person: 1,
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
                  id: "a84244c3-e62b-49bd-9225-ddc04817af12",
                  person: 11,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "cba008d9-d542-4175-b5d5-a54720f75d2a",
                  person: 3,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "2a70a447-3bf1-4cb7-99d0-3afda0ebe5f2",
                  person: 6,
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
                  id: "22e6f360-047d-4bad-aa26-06e87d8080cf",
                  person: 23,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "93bcd8e8-131f-4292-9f98-e80e8bf7151b",
                  person: 2,
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
                  id: "77aaf446-802e-4d69-8fb0-f6ab2ec9f088",
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "8c98edef-b3ff-4d0e-ac54-ecb80991d41d",
                  person: 17,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "e6d90b65-c159-4c62-8259-e3973991cd56",
                  person: 10,
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
                  id: "53fd5a3a-3e63-4db9-9b85-3a7eace96a90",
                  person: 9,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "1500968f-9fa7-46d4-b9f2-7005a98b46c8",
                  person: 25,
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
                  id: "81377e3e-5d51-4972-840f-d058d9f70e47",
                  person: 20,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "c0c6df25-ea85-4a79-aa52-7a5030064c46",
                  person: 22,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "b5df4c04-7824-4acd-b91f-864e81c92303",
                  person: 19,
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
                  id: "9becf291-610b-4197-9323-798db668a891",
                  person: 8,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "f4e7c67f-4273-43e8-90ab-98f7725e07b3",
                  person: 26,
                },
                {
                  id: null,
                  person: 0,
                },
              ],
            ],
            cols: 12,
            rows: 13,
          },
        },
        {
          id: "8B i H221, prov_values",
          namn: "8B i H221, prov",
          klass: {
            id: "8B_nameValues",
            namn: "8B",
            personer: [
              "",
              "Maya",
              "Justin",
              "Anton",
              "Elsa",
              "Tim",
              "Emmy",
              "Joel",
              "Theo",
              "Astor",
              "Enkhjin",
              "Dante",
              "Rathin",
              "Tuva",
              "Maximus",
              "Hugo",
              "Max",
              "Vincent",
              "Tyra",
              "Elvin",
              "Stella",
              "Astrid",
              "Sid",
              "Taley",
              "John",
              "Zackarias",
              "Freja",
              "Victor",
              "Lea",
              "Malte",
              "Tilda",
            ],
          },
          klassrum: {
            id: "H221, prov_gridValues",
            namn: "H221, prov",
            grid: [
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
                  id: "1eddb670-5855-436c-a3c9-949317e5f5ba",
                  person: 1,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "b987f362-02d8-456f-8c97-635edaeb5980",
                  person: 16,
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
                  id: null,
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "8c7d2bec-d1d8-4d48-8aa7-82cfb6d0d945",
                  person: 3,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "79eec9e0-6ae9-4665-a1df-55d31fca9912",
                  person: 21,
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
                  id: "aaa3a978-a05f-422a-b51f-f7dd8e994bbf",
                  person: 15,
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
                  id: "63fb8af6-c55d-499e-b009-5396210e2814",
                  person: 2,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "f5b8f805-e612-4531-8820-9f5824e118d3",
                  person: 6,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "3f3bf570-f73e-4b49-8c7d-080f61ad6607",
                  person: 13,
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
                  id: "c32cf093-ae74-4ea5-91d0-89d67f3adbe1",
                  person: 28,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "fbdce3db-5c27-48e3-baf2-6cbdde9e9621",
                  person: 19,
                },
                {
                  id: "98fcc4d6-4889-4d4b-95cd-21e9a6886a32",
                  person: 24,
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
                {
                  id: null,
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "ac21cec1-6adf-44c8-893b-925e3460655d",
                  person: 11,
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
                  id: "8aed4420-b852-44b2-b7f1-53887b9d6809",
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "081e3da1-2547-44bb-847d-54f735d5854e",
                  person: 18,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "8a6a7843-adba-4c28-a589-0089e573cfa2",
                  person: 7,
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
                  id: "7bfa5d41-3e60-4425-a730-09fa88ccf32a",
                  person: 27,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "bbb42024-2cd7-48fc-a707-d7b29fba8b84",
                  person: 17,
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
                  id: "f65b9d32-abe6-41d6-b159-7331696da980",
                  person: 26,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "b8836ed8-61e8-45be-9259-1b79c4c951e9",
                  person: 20,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "10340698-8fb8-430c-aa30-4b5199a49aa4",
                  person: 30,
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
                  id: "38619a2c-89d2-4eca-b91c-c2db9e977640",
                  person: 9,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "0870ad44-56e4-4986-8965-781493f1e9b1",
                  person: 22,
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
                  id: "c176a361-23b5-4e7a-8f52-adccec9f6aac",
                  person: 25,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "83953709-0ad5-41d1-b010-ba844cbd646e",
                  person: 12,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "2b0a65ce-dac2-4d3f-8784-517210517df0",
                  person: 8,
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
                  id: "dd53b628-cd33-44be-a77e-7d5f60234c4e",
                  person: 5,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "f737dcb9-9ff4-42b3-a306-128d8a78c8ac",
                  person: 29,
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
                  id: "57d14878-8e39-4648-96eb-83faddb7c35a",
                  person: 10,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "5a3a3a12-fd0a-4884-8b31-533fcb5b4672",
                  person: 23,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "ea7a4291-2a81-4595-8818-0becbd11c13a",
                  person: 4,
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
                  id: "7c353afa-bcf0-4a42-b6f8-e52ad19a6723",
                  person: 14,
                },
                {
                  id: null,
                  person: 0,
                },
                {
                  id: "64aa7968-d829-4dc2-8722-8fdfeab9e6af",
                  person: 0,
                },
                {
                  id: null,
                  person: 0,
                },
              ],
            ],
            cols: 12,
            rows: 13,
          },
        },
      ],
    };
    setData(nyData);
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
  const taBortPlacering = (id = placeringsId) => {
    let nyData = data;
    nyData.placeringar = nyData.placering.filter(
      (placering) => placering.id !== id
    );
    setData(nyData);
    sparaData(nyData);
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
  useEffect(() => {
    if (laddarPlacering) {
      setLaddarPlacering(false);
    } else if (!laddarPlacering) {
      setSparat(false);
    }
  }, [placeringsnamn, grid, nyttPlaceringsnamn, klassrumsId, klassId]);
  return (
    <div>
      {placeringsId || (data && !data.placeringar[0]) ? (
        <div className="w-full grid grid-cols-10">
          {placeringsId ? (
            <div
              onClick={() => {
                if (
                  sparat ||
                  window.confirm(
                    "Du har osparade ändringar. Vill du gå tillbaka ändå? Om inte, tryck på avbryt och spara först."
                  )
                ) {
                  setNamn([""]);
                  setKlassnamn(null);
                  setKlassId(null);
                  setKlassrumsId(null);
                  setKlassrumsnamn(null);
                  setPlaceringsnamn(null);
                  setLaddarPlacering(true);
                  setSparat(true);
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
                  setSparat(true);
                }
              }}
              className="w-[100%] rounded-br-lg bg-green-500 h-[100%] place-self-start flex justify-center items-center cursor-pointer"
            >
              <img className="h-[50%]" src="/pil-vänster.png" />
            </div>
          ) : window.outerWidth > 850 && !(klassnamn && klassrumsnamn) ? (
            <div className="text-wrap text-xl scrollbar-none overflow-x-scroll border text-center">
              <div>
                {data.klasser.length > 0 && data.klassrum.length > 0
                  ? "Börja med att välja klass och klassrum "
                  : data.klassrum.length > 0
                  ? "Gå till klasser för att skapa en klass"
                  : data.klasser.length > 0
                  ? "Gå till klassrum för att skapa ett klassrum"
                  : `Du behöver skapa en klass och ett klassrum. Se menyn ${
                      window.outerWidth < window.outerHeight
                        ? "uppe till höger"
                        : "ovan"
                    }.`}
              </div>
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
                    className="text-3xl w-fit mt-3 flex justify-center text-center"
                  />
                </div>
              )}
              <div className="mt-1">{väljKLassOchKlassrum}</div>
            </div>
          </div>
          {placeringsId && (
            <div
              onClick={() => {
                if (
                  window.confirm(
                    "Är du säker på att du vill radera placeringen? Om inte, tryck på avbryt."
                  )
                ) {
                  let nyData = data;
                  nyData.placeringar = nyData.placeringar.filter(
                    (placering) => placering.id !== placeringsId
                  );
                  setData(nyData);
                  sparaData(nyData);
                  setNamn([""]);
                  setKlassnamn(null);
                  setKlassId(null);
                  setKlassrumsId(null);
                  setKlassrumsnamn(null);
                  setPlaceringsnamn(null);
                  setLaddarPlacering(true);
                  setSparat(true);
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
                  setSparat(true);
                }
              }}
              className="w-[100%] rounded-bl-lg bg-red-500 h-[100%] place-self-start flex justify-center items-center cursor-pointer"
            >
              <RiDeleteBin6Line
                style={{
                  height: "65%",
                  width: "65%",
                  color: "white",
                  margin: "auto",
                }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          {data && data.placeringar.length > 0 && (
            <div>
              <h2 className="text-3xl mt-2">Dina placeringar</h2>
              <ul className="overflow-y-scroll divide-y-2 scrollbar w-[98vw] m-auto scrollbar-none  h-full border border-black mt-2">
                {data &&
                  data.placeringar.map((placering) => {
                    return (
                      <li
                        key={placering.id}
                        className="font-semibold text-2xl p-2 cursor-pointer"
                        onClick={() => {
                          const klasserDict = Object.fromEntries(
                            data.klasser.map((klass) => [klass.id, klass])
                          );
                          const klassrumDict = Object.fromEntries(
                            data.klassrum.map((klassrum) => [
                              klassrum.id,
                              klassrum,
                            ])
                          );
                          let klassrumBorttagen;
                          let klassBorttagen;
                          if (!klasserDict[placering.klass.id]) {
                            klassBorttagen = true;
                          }
                          if (!klasserDict[placering.klass.id]) {
                            klassrumBorttagen = true;
                          }
                          const currentKlass =
                            klasserDict[placering.klass.id] || placering.klass;

                          const currentKlassrum =
                            klassrumDict[placering.klassrum.id] || placering.klassrum;

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

                          setKlassnamn(currentKlassrum.namn);
                          setVisaklassmeny(false);
                          setVisaklassrumsmeny(false);
                          setKlassrumsId(placering.klassrum.id);
                          setKlassrumsnamn(currentKlassrum.namn);
                          setLaddarPlacering(true);
                          setKlassId(placering.klass.id);
                          setGrid(
                            currentKlassrum.grid.map((rad, y) =>
                              rad.map((cell, x) => {
                                const nyttId = generateUniqueId();
                                const bänkmatch = bänkarMedPersoner.find(
                                  (bänk) => bänk.kord === `${x}-${y}`
                                );
                                return {
                                  id: bänkmatch
                                    ? JSON.stringify(nyttId)
                                    : cell.id,
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
                          setNyttPlaceringsnamn(
                            placering.namn ||
                              (placering.klass.namn &&
                                placering.klassrum.namn &&
                                placering.klass.namn +
                                  " i " +
                                  placering.klassrum.namn) ||
                              null
                          );
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
          <ul className="overflow-y-hidden m-auto  w-[98vw] h-full border border-black mt-2">
            <li
              key={"ny placering"}
              className="font-semibold text-2xl p-2 cursor-pointer"
              onClick={() => {
                const beng = generateUniqueId();
                setNamn([""]);
                setKlassnamn(null);
                setKlassId(null);
                setKlassrumsId(null);
                setLaddarPlacering(true);
                setKlassrumsnamn(null);
                setVisaklassmeny(true);
                setPlaceringsnamn(null);
                setVisaklassrumsmeny(true);
                setPlaceringsId(JSON.parse(JSON.stringify(beng)));
              }}
            >
              Tryck här för att skapa en ny placering...
            </li>
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
                  extra={
                    !klar &&
                    rows > 10 &&
                    !placeringsId &&
                    !data.placeringar.some(
                      (placering) => placering.klassrum.rows > 10
                    ) && (
                      <span
                        className="cursor-pointer underline text-black"
                        onClick={() =>
                          nameDiv.current.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Psst... alla personer hittar du längst ner på sidan.
                      </span>
                    )
                  }
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
                    sparaPlacering(nyttPlaceringsnamn || placeringsnamn);
                    setSparat(true);
                  }}
                >
                  {`spara${!sparat && !laddarPlacering ? "*" : ""}`}
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
                    sparaPlacering(index);
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
            ref={nameDiv}
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
