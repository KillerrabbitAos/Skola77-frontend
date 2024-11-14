import React, { useState, useEffect, useRef } from "react";
import { data } from "./data";
function divideArray(array, parts) {
  let result = [];
  let partSize = Math.floor(array.length / parts);

  for (let i = 0; i < parts; i++) {
    result.push(array.slice(i * partSize, (i + 1) * partSize));
  }

  return result;
}
const NameList = ({}) => {
  const [namn, setNamn] = useState(data.klasser[0].personer);
  const textrutaRef = useRef(null);
  const [kolumner, setKolumner] = useState([]);
  const läggTillNamn = () => {
    textrutaRef.current &&
      setNamn((prevNamn) => [...prevNamn, textrutaRef.current.value]);
  };
  const genereraNamn = () => {
    setKolumner(
      divideArray(
        namn
          .map((namn, index) => {
            return { namn: namn, orginalIndex: index };
          })
          .slice(1)
          .map((namnObj) => (
            <div className="bg-white w-[200px] h-[40px] m-1 border flex flex-row justify-start items-center">
              <div className="text-[20px] w-[90%]">{namnObj.namn}</div>

              <div
                style={{ color: "white", cursor: "pointer" }}
                onClick={() => {
                  setNamn((prevNamn) =>
                    prevNamn.slice(namnObj.orginalIndex)
                  );
                }}
                className="bg-red-600 aspect-square h-[100%] flex flex-row items-center justify-center text-white text-center"
              >
                p
              </div>
            </div>
          )),
        window.innerWidth / 100
      )
    );
  };
  useEffect(() => {
    window.addEventListener("resize", genereraNamn)
    genereraNamn();
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
      >{kolumner && kolumner.map((kolumn) => <div>{kolumn}</div>)}</div>
    </div>
  );
};

export default NameList;
