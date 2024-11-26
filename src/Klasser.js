import React, { useState, useEffect, useRef } from "react";
import { data as originalData } from "./data";
import NamnRuta from "./Namn";
import ExcelToTextConverter from "./ExcelToTextConverter";
import { isMobile, isTablet } from "react-device-detect";
import { compress } from "lz-string";
import { height } from "@fortawesome/free-solid-svg-icons/fa0";
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

const Klasser = ({ }) => {
  const [namn, setNamn] = useState([""]);
  const textrutaRef = useRef(null);
  const [visaLaddaKlassrum, setVisaLaddaKlassrum] = useState(false);
  const [kolumner, setKolumner] = useState(10);
  const [klassnamn, setKlassnamn] = useState(null);
  const [klassId, setKlassId] = useState(null);
  const [klassnamntext, setKlassnamntext] = useState("ny klass");
  const [data, setData] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");

  const defaultKlass = "ny klass";
  async function checkLoginStatus() {
    setData(originalData);
  }
  function sparaData(nyData) {
    setData(nyData);
  }

  function sparaDta(nyData) {
    fetch("http://192.168.50.107:3000/api/updateData", {
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
  async function checLoginStatus() {
    const response = await fetch("http://192.168.50.107:3000/api/getKlassrum");
    const result = await response.json();
    const parsedData = JSON.parse(result[0].data);
    setData(parsedData);
    const klassrum = parsedData.klassrum;
    const klasser = parsedData.klasser;

    console.log("Klassrum:", klassrum);
    console.log("Klasser:", klasser);
  }


  const handleButtonClick = async () => {
    if (!textareaValue.trim()) {
      alert("Textarea är tom! Skriv in data innan du skickar.");
      return;
    }

    try {
      const response = await fetch("https://auth.skola77.com:3005/updateData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: textareaValue }),
      });

      if (response.ok) {
        alert("Data skickades framgångsrikt!");
        setTextareaValue("");
      } else {
        alert("Misslyckades med att skicka data. Kontrollera servern.");
      }
    } catch (error) {
      console.error("Ett fel inträffade:", error);
      alert("Ett nätverksfel inträffade.");
    }
  }

  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
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
    let newData = data;
    let nyttKlassNamn = nyttNamn
      ? nyttNamn
      : klassId || klassnamntext !== defaultKlass
        ? klassnamntext
        : prompt("Vad heter klassen?");
    if (klassnamn !== klassnamntext) {
      while (newData.klasser.some((klass) => klass.namn === nyttKlassNamn)) {
        nyttKlassNamn = prompt(
          "Du har redan lagt in en klass som heter så. Skriv ett namn som skiljer sig åt."
        );
      }
    }
    if (!nyttKlassNamn) {
      return;
    }
    if (klassId) {
      newData.klasser = data.klasser.map((klass) => {
        if (klass.id === klassId) {
          return {
            id: klass.id,
            namn: nyttKlassNamn,
            personer: namn,
          };
        } else {
          return klass;
        }
      });
    } else {
      const nyttId = generateUniqueId();
      setKlassId(nyttId);
      newData.klasser.push({
        id: nyttId,
        namn: nyttKlassNamn,
        personer: namn,
      });
    }
    console.log(newData);

    sparaData(newData);

    setKlassnamn(nyttKlassNamn);
    setKlassnamntext(nyttKlassNamn);
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
                  const newNamn = [...prevNamn];
                  newNamn.splice(namnObj.orginalIndex, 1);
                  console.log(namnObj.orginalIndex);
                  return newNamn;
                });
              }}
              className="bg-red-600 aspect-square h-[100%] flex flex-row items-center justify-center text-white text-center"
            >
              p
            </div>
          </div>
        )),
      Math.floor(window.outerWidth / 220)
    );
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
              p
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
    <div>
      <ExcelToTextConverter ref={filRef} names={namn} setNames={setNamn} />
      {visaLaddaKlassrum && (
        <div
          className="bg-[#4CAF50]"
          style={{
            position: "absolute",
            top: "calc(50vh - 122px)",
            left: "calc(50vw - 98.905px)",
            listStyle: "none",
          }}
        >
          <div className="bg-[#4CAF50] text-white font-semibold flex h-8 text-xl justify-center items-center">
            Sparade klasser:{" "}
          </div>
          <div className="border-8 border-t-0 border-[#4CAF50]">
            <div className="bg-white h-[236px] overflow-y-scroll border-8 border-t-0 border-[#4CAF50]">
              <li
                key={"nyKlass"}
                className="font-bold hover:bg-slate-100 text-xl p-2 cursor-pointer"
                onClick={() => {
                  setNamn([""]);
                  setKlassId(null);
                  const nyttNamn = prompt("Vad ska din nya klass heta?");
                  if (!nyttNamn) {
                    return;
                  }
                  setVisaLaddaKlassrum(false);
                  spara(nyttNamn);
                }}
              >
                ny klass...
              </li>
              {data.klasser.map((klass) => {
                return (
                  <li
                    key={klass.id}
                    className="font-bold hover:bg-slate-100 text-xl p-2 cursor-pointer"
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
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="flex">
        <div>
          <div
            style={{
              height: window.outerWidth > window.outerHeight ? "7vw" : "13vw",
            }}
            className={`bg-[#4CAF50] border-b text-white w-[25vw] flex cursor-pointer flex-row text-[5vw] justify-center items-center`}
            onClick={() => spara()}
          >
            Spara
          </div>
          <div
            onClick={() => {
              setVisaLaddaKlassrum(!visaLaddaKlassrum);
            }}
            style={{
              height: window.outerWidth > window.outerHeight ? "7vw" : "13vw",
            }}
            className={`bg-[#4CAF50] border-t  text-white w-[25vw] flex cursor-pointer flex-row text-[5vw] justify-center items-center`}
          >
            Ladda
          </div>
        </div>
        <textarea
          ref={textrutaRef}
          style={{
            fontSize:
              window.outerWidth > window.outerHeight ? "1.8vw" : "2.5vw",
            height: window.outerWidth > window.outerHeight ? "14vw" : "26vw",
          }}
          className={`w-[50vw]`}
          placeholder={`Ett namn per rad:
Artur
Bosse
Sam 
etc...
`}
        ></textarea>
        <div
          className={`cursor-pointer border bg-[#4CAF50] text-white w-[25vw] h-[window.outerWidth > window.outerHeight ? "6.25" : "12.5vw"] flex flex-row justify-center items-center text-[5vw]`}
          onClick={läggTillNamn}
        >
          Lägg till
        </div>
      </div>
      <div className="grid grid-cols-3 w-full">
        <div
          className="text-center items-center border-[#af4cab] mr-0.5 rounded-none flex cursor-pointer justify-center text-white text-[2vw] rounded-[4px] font-semibold border bg-[#af4cab]"
          onClick={() => {
            filRef.current.click();
          }}
        >
          importera namn från kalkylark
        </div>
        <div
          className="text-center rounded-[4px] cursor-pointer items-center flex justify-center text-white text-[2vw] font-semibold rounded-none border-[#af4cab] bg-[#af4cab]"
          onClick={taBortEfternamn}
        >
          ta bort efternamn
        </div>

        <div className="text-4xl text-center m-3">
          {
            <input
              className="text-[4vw] h-[6vw] truncate w-[90%] bg-inherit text-center outline-none m-3"
              onChange={(e) => {
                setKlassnamntext(e.target.value);
              }}
              value={klassnamntext}
            />
          }
        </div>
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


      <hr/>


      <div id="bossesDevHörna">
        <h1>Bosses devhörna</h1>
        <textarea
          id="nyDataTillServern"
          placeholder="ny data:"
          style={{ height: 200 }}
          value={textareaValue}
          onChange={handleTextareaChange}
        ></textarea>
        <button id="iväg" onClick={handleButtonClick}>
          Skicka
        </button>
      </div>

    </div>
  );
};

export default Klasser;
