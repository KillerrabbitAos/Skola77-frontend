import React, { useState, useEffect, useRef } from "react";
import { data } from "./data";
import NamnRuta from "./Namn";
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

const Klasser = ({}) => {
  const [namn, setNamn] = useState([""]);
  const textrutaRef = useRef(null);
  const [visaLaddaKlassrum, setVisaLaddaKlassrum] = useState(false);
  const [kolumner, setKolumner] = useState(10);
  const [klassnamn, setKlassnamn] = useState(null);
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
      {visaLaddaKlassrum && (
        <div
          style={{
            position: "absolute",
            top: "calc(50vh - 88px)",
            left: "calc(50vw - 62.5px)",
            listStyle: "none",
            backgroundColor: "white",
          }}
        >
          <li
            key={"nyKlass"}
            className="font-bold text-xl p-2 cursor-pointer"
            onClick={() => {
              setNamn([""]);
              setKlassnamn(null);
              setVisaLaddaKlassrum(false);
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
                  setNamn(klass.personer);
                  setKlassnamn(klass.namn);
                  setVisaLaddaKlassrum(false);
                }}
              >
                {klass.namn}
              </li>
            ))}
        </div>
      )}
      <div className="flex">
        <div>
          <div className="bg-[#4CAF50] border h-[12.5vw] text-white w-[25vw] flex cursor-pointer flex-row text-[5vw] justify-center items-center">
            Spara
          </div>
          <div
            onClick={() => {
              setVisaLaddaKlassrum(!visaLaddaKlassrum);
            }}
            className="bg-[#4CAF50] border h-[12.5vw] text-white w-[25vw] flex cursor-pointer flex-row text-[5vw] justify-center items-center"
          >
            Ladda
          </div>
        </div>
        <textarea
          ref={textrutaRef}
          className="aspect-[2/1] w-[50vw]"
          placeholder={`Ett namn per rad:
Artur
Bosse
Sam 
etc...
`}
        ></textarea>
        <div
          className="cursor-pointer aspect-square border bg-[#4CAF50] text-white w-[25vw] flex flex-row justify-center items-center text-[5vw]"
          onClick={läggTillNamn}
        >
          Lägg till
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
    </div>
  );
};

export default Klasser;
