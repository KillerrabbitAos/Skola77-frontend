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
  useEffect(() => {
    setKolumner(divideArray(namn, 3));
  }, []);
  return (
    <div>
      <div className="flex">
        <div className="aspect-square w-[25vw] flex flex-row text-[5vw] justify-center items-center">
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
          className="aspect-square w-[25vw] flex flex-row justify-center items-center text-[5vw]"
          onClick={läggTillNamn}
        >
          Lägg till
        </div>
      </div>
      <div>
        {kolumner.map((namn) =>
          namn
            .map((namn, index) => {
              return { namn: namn, orginalIndex: orginalIndex };
            })
            .map((namn) => (
              <div className="bg-white w-[40vw] m-1 border flex flex-row justify-start items-center">
                <div className="text-[4vw] w-[90%]">{namn.namn}</div>
                <div className="bg-red-600 aspect-square w-[10%] text-white text-center">
                  p
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default NameList;
