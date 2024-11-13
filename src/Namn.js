import React, { useState, useEffect } from "react";
import ExcelToTextConverter from "./ExcelToTextConverter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isMobile, isTablet } from "react-device-detect";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { data as initialData } from "./data";

const NameList = ({}) => {
  return (
    <div>
      <div className="flex">
        <div className="aspect-square w-[25vw]"></div>
        <textarea
          className="aspect-[2/1] w-[50vw]"
          placeholder={`Ett namn per rad:
Artur
Bosse
Sam 
etc...
`}
        ></textarea>
        <div className="aspect-square w-[25vw] flex flex-row justify-center items-center text text-[5vw]">Lägg till</div>
      </div>
    </div>
  );
};

export default NameList;
