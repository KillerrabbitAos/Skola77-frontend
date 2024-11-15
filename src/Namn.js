import React, { useState, useEffect, useRef } from "react";
import { data } from "./data";
function divideArray(array, delar) {
  const parts = delar < array.length ? delar : array.length;
  let result = [];
  let partSize = Math.floor(array.length / parts);
  let remainder = array.length % parts;

  for (let i = 0; i < parts; i++) {
    let extra = i < remainder ? 1 : 0;
    result.push(
      array.slice(
        i * partSize + Math.min(i, remainder),
        (i + 1) * partSize + extra
      )
    );
  }

  return result;
}

const NameList = ({}) => {
  const [namn, setNamn] = useState([""]);
  const textrutaRef = useRef(null);
  const [visaLaddaKlassrum, setVisaLaddaKlassrum] = useState(false);
  const [kolumner, setKolumner] = useState(10);
  const [klassnamn, setKlassnamn] = useState(null)
  const läggTillNamn = () => {
    setNamn((prevNamn) => [
      ...prevNamn,
      ...textrutaRef.current.value
        .split("\n")
        .filter((namn) => namn.trim() !== ""),
    ]);
    textrutaRef.current.value = "";
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
            top: "45vh",
            left: "45vw",
            width: "10vw",
            height: "10vw",
            backgroundColor: "white"
          }}
        >
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
                  setVisaLaddaKlassrum(false)
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

export default NameList;
