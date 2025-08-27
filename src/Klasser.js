import React, { useState, useEffect, useRef } from "react";
import { data as originalData } from "./data";
import NamnRuta from "./Namn";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { RiCheckLine } from "react-icons/ri";
import Footer from "./sidor/footer";
import ExcelToTextConverter from "./ExcelToTextConverter";
import { isMobile, isTablet } from "react-device-detect";
import { compress } from "lz-string";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import stängKnapp from "./imgs/close-116.svg";

function generateUniqueId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function divideArray(lista, x) {
  if (x <= 0) throw new Error("Number of parts must be greater than 0.");
  const result = [];
  const list = lista.filter((namn) => namn !== "");
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

const Klasser = ({}) => {
  const [namn, setNamn] = useState([""]);
  const textrutaRef = useRef(null);
  const [visaLaddaKlassrum, setVisaLaddaKlassrum] = useState(false);
  const [kolumner, setKolumner] = useState(10);
  const [klassnamn, setKlassnamn] = useState(null);
  const [klassId, setKlassId] = useState(null);
  const [engelska, setEngelska] = useState(true)
 
  const [data, setData] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [klassnamntext, setKlassnamntext] = useState(
    engelska ? "new class" : "ny klass"
  );
 

  const sidebarRef = useRef(null);
  const handleMouseDown = (e) => {
    const startX = e.clientX;
    const startWidth = sidebarRef.current.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + moveEvent.clientX - startX;
      setSidebarWidth(Math.max(200, Math.min(newWidth, 400)));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const defaultKlass = engelska ? "new class" : "ny klass";
  async function checkLoginStatus() {
    setData(originalData);
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
  const filRef = useRef(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);
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
        window.location.href = "https://auth.skola77.com?skola77";
      }
    } catch (fetchError) {
      console.error("Fel vid hämtning av data:", fetchError);
      window.location.href = "https://auth.skola77.com?skola77";
    }
  }

  useEffect(() => {
    setKlassnamntext(engelska ? "new class" : "ny klass");
  }, [engelska]);
  

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const nyKlass = () => {
    const nyttId = generateUniqueId();
    const nyttNamn = prompt(
      engelska
        ? "What should your new class be called?"
        : "Vad ska din nya klass heta?"
    );

    if (!nyttNamn) return;

    setNamn([""]);
    setKlassId(nyttId);
    setKlassnamntext(nyttNamn);
    setKlassnamn(nyttNamn);

    const nyData = { ...data };
    nyData.klasser.push({
      id: nyttId,
      namn: nyttNamn,
      personer: [],
    });

    setData(nyData);
    sparaData(nyData);
    setVisaLaddaKlassrum(false);
  };

  const läggTillNamn = () => {
    const textareaContent = textrutaRef.current.value
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

    setNamn((prevNames) => [...prevNames, ...textareaContent]);
    textrutaRef.current.value = "";
  };
  const updateName = (newName, index) => {
    setNamn((prevNamn) => {
      const updatedNamn = [...prevNamn];
      updatedNamn[index] = newName;
      return updatedNamn;
    });
  };

  const spara = (nyttNamn) => {
    setIsSaving(true);

    const nyttKlassNamn =
      nyttNamn || klassnamntext || prompt(engelska ? "What is the class called?" : "Vad heter klassen?");
    if (!nyttKlassNamn) {
      setIsSaving(false);
      return;
    }

    const nyData = { ...data };

    if (klassId) {
      nyData.klasser = nyData.klasser.map((klass) =>
        klass.id === klassId
          ? { ...klass, namn: nyttKlassNamn, personer: namn }
          : klass
      );
    } else {
      const nyttId = generateUniqueId();
      setKlassId(nyttId);
      nyData.klasser.push({
        id: nyttId,
        namn: nyttKlassNamn,
        personer: namn,
      });
    }

    setData(nyData);
    sparaData(nyData);

    setKlassnamn(nyttKlassNamn);
    setKlassnamntext(nyttKlassNamn);

    setTimeout(() => setIsSaving(false), 1500);
  };

  const taBortEfternamn = () => {
    setNamn((förraNamn) => förraNamn.map((namn) => namn.split(" ")[0]));
  };
  const namnILista =
    namn &&
    divideArray(
      namn
        .map((namn, index) => ({ namn: namn, orginalIndex: index }))
        .sort((a, b) => a.namn.localeCompare(b.namn))
        .slice(1)
        .filter((namnObj1) => namnObj1.namn !== "")
        .map((namnObj) => (
          <div
            key={namnObj.orginalIndex}
            className="bg-white w-[200px]  h-[40px] m-1 border flex flex-row justify-start items-center"
          >
            <div className="text-[20px] ml-[1vw] overflow-visible w-[90%]">
              <NamnRuta
                namn={namnObj.namn}
                allaNamn={namn}
                setNamn={updateName}
                index={namnObj.orginalIndex}
              />
            </div>

            <div
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => {
                setNamn((prevNamn) => {
                  const newNamn = prevNamn.map((namn, index) => {
                    return index === namnObj.orginalIndex ? "" : namn;
                  });
                  console.log(namnObj.orginalIndex);
                  return newNamn;
                });
              }}
              className="bg-red-600 aspect-square h-[100%] flex flex-row items-center justify-center text-white text-center"
            >
              <RiDeleteBin6Line />
            </div>
          </div>
        )),
      Math.floor(window.outerWidth / 220)
    );
  const taBortKlass = (id) => {
    let nyData = data;
    nyData.klasser = nyData.klasser.filter((klass) => klass.id !== id);
    setData(nyData);
    sparaData(nyData);
  };
  const namnLista =
    namn &&
    divideArray(
      namn
        .map((namn, index) => ({ namn: namn, orginalIndex: index }))
        .sort((a, b) => a.namn.localeCompare(b.namn))
        .slice(1)
        .map((namnObj) => (
          <div
            key={namnObj.orginalIndex}
            className="bg-white w-[200px] h-[40px] m-1 border flex flex-row justify-start items-center"
          >
            <div className="text-[20px] w-[90%]">
              <div>{namnObj.namn}</div>
            </div>

            <div
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => {
                setNamn((prevNamn) => {
                  const newNamn = prevNamn.map(namn, (index) =>
                    index === namnObj.orginalIndex ? "" : namn
                  );
                  return newNamn;
                });
              }}
              className="bg-red-600 aspect-square h-[100%] flex flex-row items-center justify-center text-white text-center"
            >
              <RiDeleteBin6Line />
            </div>
          </div>
        )),
      kolumner
    );
  useEffect(() => {
    const uppdateraKolumner = () => {
      setKolumner(Math.floor(window.outerWidth / 216));
    };
    uppdateraKolumner();
    window.addEventListener("resize", uppdateraKolumner);
    return () => {
      window.removeEventListener("resize", uppdateraKolumner);
    };
  }, []);
  useEffect(() => {
    setKolumner(Math.floor(window.outerWidth / 216));
  }, [namn]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {isSidebarVisible && (
        <div
          ref={sidebarRef}
          className={`bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4 overflow-hidden relative
          w-full lg:w-[${sidebarWidth}px]`}
          style={{ maxWidth: sidebarWidth }}
        >
          <button
            onClick={() => spara()}
            className="w-full py-2 bg-green-600 text-white font-bold text-lg rounded shadow hover:bg-green-700 flex items-center justify-center"
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <RiCheckLine size={24} className="mr-2" />
              </span>
            ) : engelska ? (
              "Save"
            ) : (
              "Spara"
            )}
          </button>
  
          <button
            onClick={() => setVisaLaddaKlassrum(!visaLaddaKlassrum)}
            className="w-full py-2 bg-green-600 text-white font-bold text-lg rounded shadow hover:bg-green-700"
          >
            {engelska ? "My classes" : "Mina klasser"}
          </button>
          <button
            className="w-full py-2 bg-purple-600 text-white font-bold rounded shadow hover:bg-purple-700"
            onClick={() => {
              filRef.current.click();
            }}
          >
            {engelska
              ? "Import names from Excel sheet"
              : "Importera namn från kalkylark"}
          </button>
  
          <ExcelToTextConverter ref={filRef} names={namn} setNames={setNamn} />
          <button
            onClick={taBortEfternamn}
            className="w-full py-2 bg-purple-600 text-white font-bold rounded shadow hover:bg-purple-700"
          >
            {engelska ? "Remove surnames" : "Ta bort efternamn"}
          </button>
  
          <div
            className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 w-2 cursor-ew-resize h-full"
            onMouseDown={handleMouseDown}
          ></div>
        </div>
      )}
  
      <button
        className={`p-2 bg-gray-200 text-gray-600 rounded-full shadow-lg fixed top-4 left-4 lg:hidden
        ${isSidebarVisible ? "" : "bg-gray-300"}`}
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      >
        {isSidebarVisible ? (
          <RiArrowLeftSLine size={24} />
        ) : (
          <RiArrowRightSLine size={24} />
        )}
      </button>
  
      <div className="flex-1 p-4">
        <div className="text-4xl text-center m-3">
          <div className="relative group">
            <input
              className="truncate w-[90%] bg-inherit outline-none text-center border-b-2 border-transparent focus:border-b-green-600 transition-all duration-300"
              onChange={(e) => {
                setKlassnamntext(e.target.value);
              }}
              value={klassnamntext}
              onBlur={() => spara(klassnamntext)}
              placeholder={
                engelska ? "Enter class name here..." : "Skriv klassnamn här..."
              }
            />
            <RiCheckLine
              size={24}
              className={`absolute right-[-30px] top-1/2 transform -translate-y-1/2 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer`}
              onClick={() => spara(klassnamntext)}
            />
          </div>
        </div>
  
        {klassnamntext !== "ny klass" && (
          <div
            className="fixed bottom-10 right-5 flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 cursor-pointer"
            onClick={() => {
              if (
                window.confirm(
                  engelska
                    ? "Are you sure you want to delete this class? If not, press cancel."
                    : "Är du säker på att du vill radera klassen? Om inte, tryck på avbryt."
                )
              ) {
                let nyData = data;
                nyData.klasser = nyData.klasser.filter(
                  (klass) => klass.id !== klassId
                );
                sparaData(nyData);
                setNamn([""]);
                setKlassId(null);
                setKlassnamn(null);
                setKlassnamntext("ny klass");
              }
            }}
          >
            <RiDeleteBin6Line className="w-8 h-8" />
          </div>
        )}
  
        {visaLaddaKlassrum && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-96">
              <div className="bg-green-600 text-white text-lg font-bold p-4 rounded-t-lg flex items-center justify-between">
                <span>{engelska ? "Saved classes" : "Sparade klasser"}</span>
                <img
                  src={stängKnapp}
                  style={{ width: "15%", cursor: "pointer" }}
                  alt="Close"
                  onClick={() => setVisaLaddaKlassrum(false)}
                />
              </div>
              <ul className="p-4 max-h-60 overflow-y-auto">
                <li
                  key="nyKlass"
                  className="p-2 text-lg font-bold hover:bg-gray-100 cursor-pointer"
                  onClick={nyKlass}
                >
                  {engelska ? "New class..." : "Ny klass..."}
                </li>
                {data.klasser.map((klass) => (
                  <li
                    key={klass.id}
                    className="p-2 text-lg font-bold hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNamn(klass.personer);
                      setKlassId(klass.id);
                      setKlassnamn(klass.namn);
                      setKlassnamntext(klass.namn);
                      setVisaLaddaKlassrum(false);
                    }}
                  >
                    {klass.namn}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
  
        <textarea
          ref={textrutaRef}
          className="w-full p-4 border rounded-lg text-lg shadow resize-none"
          placeholder={`${
            engelska ? "One name per row" : "Ett namn per rad"
          }:\nArtur\nBosse\netc...`}
          style={{ minHeight: "10rem" }}
        ></textarea>
  
        <button
          onClick={läggTillNamn}
          className="w-full py-2 mt-4 bg-green-600 text-white font-bold text-lg rounded shadow hover:bg-green-700"
        >
          {engelska ? "Add" : "Lägg till"}
        </button>
  
        <div className="mt-4 text-lg font-semibold">
          {`${engelska ? "Number of students" : "Antal elever"}: ${
            namn
              .map((namn, index) => ({ namn: namn, orginalIndex: index }))
              .sort((a, b) => a.namn.localeCompare(b.namn))
              .slice(1)
              .filter((namnObj1) => namnObj1.namn !== "").length
          }`}
        </div>
  
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {namnILista.map((kolumn, index) => (
            <span key={index} className="text-lg font-medium">
              {kolumn}
            </span>
          ))}
        </div>
      </div>
      <Footer isFixed={true} />
    </div>
  );
  
};

export default Klasser;
