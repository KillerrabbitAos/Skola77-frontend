import React, { useState, useEffect, useRef } from "react";
import { data } from "./data";
function divideArray(array, delar) {
  const parts = delar < array.length ? delar : 1;

  let result = [];
  let partSize = Math.floor(array.length / parts);

  for (let i = 0; i < parts; i++) {
    result.push(array.slice(i * partSize, (i + 1) * partSize));
  }

  return result;
}
const NameList = ({}) => {
  const [namn, setNamn] = useState([""]);
  const textrutaRef = useRef(null);
  const [kolumner, setKolumner] = useState(10);
  const läggTillNamn = () => {
    setNamn((prevNamn) => [
      ...prevNamn,
      ...textrutaRef.current.value
        .split("\n")
        .filter((namn) => namn.trim() !== ""),
    ]);
    textrutaRef.current.value = "";
  };
  const namnLista =
    namn &&
    divideArray(
      namn
        .map((namn, index) => ({ namn: namn, orginalIndex: index }))
        .sort((a, b) => a.namn.localeCompare(b.namn))
        .slice(1)
        .map((namnObj) => (
          <div className="bg-white w-[200px] h-[40px] m-1 border flex flex-row justify-start items-center">
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
      <div className="flex">
        <div className="aspect-square w-[25vw] flex cursor-pointer flex-row text-[5vw] justify-center items-center">
          Spara
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
          className="cursor-pointer aspect-square w-[25vw] flex flex-row justify-center items-center text-[5vw]"
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
        {kolumner && namnLista.map((kolumn) => <div>{kolumn}</div>)}
      </div>
    </div>
  );
};

export default NameList;
