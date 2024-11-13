import React, { useState, useEffect, useRef } from "react";
import ExcelToTextConverter from "./ExcelToTextConverter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMobile, isTablet } from "react-device-detect";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { data } from "./data";

const NameList = ({}) => {
  const [namn, setNamn] = useState([data.klasser[0].personer]);
  const textrutaRef = useRef(null);
  const läggTillNamn = () => {
    textrutaRef.current &&
      setNamn((prevNamn) => [...prevNamn, textrutaRef.current.value]);
  };
  return (
    <div>
      <div className="flex">
        <div className="aspect-square w-[25vw]"></div>
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
          className="aspect-square w-[25vw] flex flex-row justify-center items-center text text-[5vw]"
          onClick={läggTillNamn}
        >
          Lägg till
        </div>
      </div>
      <div>
        {namn.map((namn) => (
          <div>{namn}</div>
        ))}
      </div>
    </div>
  );
};

export default NameList;
