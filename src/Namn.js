import React, { useState, useEffect } from "react";
import Namn from "./ettNamn";
import ExcelToTextConverter from "./ExcelToTextConverter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMobile, isTablet } from "react-device-detect";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

function fitTextToContainer(container, element, maxFontSizePx) {
  for (let i = 0; i < 20; i++) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const widthScale = containerWidth / elementWidth;
    const heightScale = containerHeight / elementHeight;

    const minScale = Math.min(widthScale, heightScale);

    const currentFontSize = window.getComputedStyle(element).fontSize;
    let newFontSize = parseFloat(currentFontSize) * minScale;

    newFontSize = Math.min(newFontSize, maxFontSizePx);

    element.style.fontSize = newFontSize + "px";

    const scaledElementWidth = element.offsetWidth * minScale;
    const scaledElementHeight = element.offsetHeight * minScale;

    const offsetX = (containerWidth - scaledElementWidth) / 2;
    const offsetY = (containerHeight - scaledElementHeight) / 2;
    element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
}

const NameList = () => {
  const [data, setData] = useState({
    klassrum: [
      {
        name: "H221",
        grid: [
          [
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: "item-1728395558391", person: 1 },
            { id: "item-1728395558639", person: 1 },
          ],
          [
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: "item-1728395560144", person: 1 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
          ],
          [
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: "item-1728395557488", person: 1 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
          ],
          [
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
          ],
          [
            { id: "item-1728395563304", person: 1 },
            { id: "item-1728395562912", person: 1 },
            { id: "item-1728395557831", person: 1 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: "item-1728395562504", person: 1 },
            { id: "item-1728395559832", person: 1 },
          ],
          [
            { id: null, person: 0 },
            { id: "item-1728395561288", person: 1 },
            { id: "item-1728395560888", person: 1 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
            { id: null, person: 0 },
          ],
        ],
        cols: 7,
        rows: 6,
      },
    ],
    klasser: [
      {
        namn: "peters klass",
        personer: [
          "",
          "8A",
          "8B",
          "8C",
          "8D",
          "Alexander",
          "Alexander",
          "Rasmus",
          "Sammy",
          "Roham",
          "Oscar",
          "Alicia",
          "Tore",
          "Isac",
          "Hugo",
          "Maja",
          "Alice",
          "Prodromos",
          "Gabriel",
          "Ali k",
          "Katerina",
          "Oscar B",
          "Isabella",
          "Tassen",
          "Tilde",
          "Elisabeth",
          "Jamie",
          "Nike",
          "Elsa",
          "Anna",
          "Iman",
          "Anna",
          "Emil",
          "Alexia",
          "Alva",
          "Astrid",
          "Markus",
          "Sid",
          "Hampus",
          "Hannes",
          "William",
          "Bosse",
          "Lylly",
          "Joel",
          "Otto",
          "Erika",
          "Vincent",
          "Ali G",
          "Mona",
          "Walter",
          "Ellin",
          "Ellen",
          "Maria",
          "Klara",
          "Thea",
          "Philip",
          "Turid",
          "Sueda",
          "Sador",
          "Hedvig",
          "Ines",
          "Hampus",
          "Linnèa",
          "Danielle",
          "Vera",
          "William",
          "Sofia",
          "Emilia",
          "Emilia",
          "Erik",
          "Astrid",
          "Filicia",
          "Hussein",
          "Eli",
          "Signe",
          "Annie",
          "Jakob",
          "Moa",
          "Andrea",
          "Inès",
          "Emil",
          "Farhiya",
          "Wilma",
          "Stella",
          "Isak",
          "Arvid",
          "Viggo",
          "Linus",
          "Oliver",
          "Samuel",
          "Jakob",
          "Eliot",
          "Eric",
          "Artur",
          "Noah",
          "Isak",
          "Malcolm",
          "Tony",
          "Aria",
          "Noah",
          "Livia",
          "Sixsten",
          "Alex",
          "Matilda",
          "Ryan",
          "Uktam",
          "Olle",
          "Altan",
          "Juni",
          "Maja",
          "Rebecca",
          "Stina",
          "Kevin",
          "Melike",
          "Elin",
          "Elsa",
          "Gabriel",
          "Lo",
          "Enisa",
          "Myra",
          "Alsu",
          "Ida",
          "Madeleine",
          "Kiara",
          "Astrid",
          "Oscar W",
          "Stella",
          "Tindra",
          "Julia",
          "Alvina",
          "Sofia",
          "Ceasar",
        ],
      },
      {
        namn: "7G",
        personer: [
          "",
          "henry",
          "Kalle",
          "Fredrik",
          "carl",
          "Johan",
          "Artur",
          "Mattias",
        ],
      },
    ],
  });
  const [låstaNamn, setLåstaNamn] = useState([]);
  const [names, setNames] = useState([""]);
  const [columns, setColumns] = useState(3);
  const [efternamnStarForst, setEfternamnStarForst] = useState(true);
  const [laddaKlass, setLaddaKlass] = useState(false);
  const [klassnamn, setKlassnamn] = useState(null);

  const handleRemoveName = (index) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
  };

  function applyFontSizesToClass(className) {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const container = element.parentElement;
      fitTextToContainer(container, element, 25);
    }
  }

  const fixa = () => {
    applyFontSizesToClass("name");
  };

  const läggTillNamn = () => {
    const textarea = document.getElementById("namesInput");
    const textareaContent = textarea.value
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    setNames((prevNames) => [...prevNames, ...textareaContent]);
    textarea.value = "";
  };

  const taBortEfternamn = () => {
    setNames((förraNamn) =>
      förraNamn.map((namn) =>
        efternamnStarForst ? namn.split(" ").slice(-1)[0] : namn.split(" ")[0]
      )
    );
    fixa();
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newColumns = Math.floor(width / 260);
      setColumns(Math.max(newColumns, 1));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedNamesWithIndex = names
    .map((name, index) => ({ name, originalIndex: index }))
    .filter(({ name }) => name !== "")
    .sort((a, b) => a.name.localeCompare(b.name));

  const columnSize = Math.ceil(sortedNamesWithIndex.length / columns);
  const columnsArray = Array.from({ length: columns }, (_, columnIndex) =>
    sortedNamesWithIndex.slice(
      columnIndex * columnSize,
      (columnIndex + 1) * columnSize
    )
  );

  const andraCheckboxvarde = (e) => setEfternamnStarForst(e.target.checked);

  const sparaNamn = () => {
    if (klassnamn) {
      const updatedData = data.klasser.map((klass) => {
        if (klass.namn === klassnamn) {
          console.log({ ...klass, personer: names })
          return { ...klass, personer: names };
          
        }
        return klass;
      });
      setData({ ...data, klasser: updatedData });
      console.log(data)
    } else {
      console.log("free")
      const nyttKlassnamn = prompt("Vad ska klassen heta?");
      if (nyttKlassnamn && names.length > 1) {
        const updatedData = {
          ...data,
          klasser: [...data.klasser, { namn: nyttKlassnamn, personer: names }],
        };
        setData(updatedData);
        console.log(updatedData);
      } else {
        alert("Klassen måste ha ett namn och personer.");
      }
    }
  };

  return (
    <div className="container">
      <div className="inputSection">
        <div className="flex flex-col items-start">
          <div className="flex items-start">
            <button className="rounded-none border border-black border-t border-l border-b-0 border-r-0 custom-button w-[196px] h-[200px]  bg-[#38b438] text-white font-bold shadow-lg hover:opacity-90 active:opacity-80 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all flex items-center justify-center" onClick={sparaNamn}>
              <FontAwesomeIcon icon={faFloppyDisk} size="4x" />
            </button>

            <div className="">
              <div class="w-[600px] h-[150px] flex">
                <textarea
                  id="namesInput"
                  rows="10"
                  className="rounded-md w-80"
                  placeholder="Ett namn per rad"
                ></textarea>

                <button className="addButton ml-2" onClick={läggTillNamn}>
                  Lägg till...
                </button>
              </div>
            </div>
          </div>
        </div>

        <ul className="overflow-y-scroll w-52 h-48 border border-black mt-2">
          <li
            className="font-bold text-xl p-2 cursor-pointer"
            onClick={() => {
              setNames([""]);
              setKlassnamn(null);
            }}
          >
            ny klass...
          </li>
          {data.klasser
            .slice()
            .reverse()
            .map((klass) => (
              <li
                key={klass.namn}
                className="font-bold text-xl p-2 cursor-pointer"
                onClick={() => {
                  setNames(klass.personer);
                  setKlassnamn(klass.namn);
                }}
              >
                {klass.namn}
              </li>
            ))}
        </ul>
      </div>

      {klassnamn && (
  <div className="justify-center flex w-full items-center mb-4 mt-1">
    <button
      className="mr-4 font-bold text-lg bg-[#38b438] text-white border-1 ejEfternamn hover:bg-[#36a636] transition duration-300 px-4 py-2 rounded"
      onClick={taBortEfternamn}
    >
      Ta bort efternamn
    </button>
    <h2 className="font-bold text-xl text-[#333]">
      {klassnamn}
    </h2>

    <button
      className="mr-4 font-bold text-lg bg-inherit text-[#f2f2f2]   transition  duration-300 px-4 py-2 rounded"
      
    >
      Ta bort afrika!
    </button>

  </div>
)}


      <div className="nameList gap-10">
        {columnsArray.map((column, columnIndex) => (
          <div key={columnIndex} className="column">
            <ul className="list-none">
              {column.map(({ name, originalIndex }) => (
                <Namn
                  key={originalIndex}
                  name={name}
                  originalIndex={originalIndex}
                  handleRemoveName={handleRemoveName}
                  låstaNamn={låstaNamn}
                  setLåstaNamn={setLåstaNamn}
                  names={names}
                  setNames={setNames}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NameList;
