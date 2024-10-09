import React, { useEffect, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

const Namn = ({
  name,
  originalIndex,
  handleRemoveName,
  låstaNamn,
  setLåstaNamn,
  names,
  setNames,
  placeringsVy
}) => {
  const [editedName, setEditedName] = useState(name);

  useEffect(() => {
    setEditedName(name); // Update edited name when 'name' prop changes
  }, [name]);

  const handleLåsaNamn = () => {
    if (!låstaNamn.includes(originalIndex)) {
      setLåstaNamn((prevLåstaNamn) => [...prevLåstaNamn, originalIndex]);
    } else {
      const newLåstaNamn = låstaNamn.filter((index) => index !== originalIndex);
      setLåstaNamn(newLåstaNamn);
    }
  };

  const handleChange = () => {
    const newNames = [...names]; 
    newNames[originalIndex] = editedName; 
    setNames(newNames);
  };

  return (
    <li key={originalIndex}>
      <div
        id={originalIndex}
        className={`namnILista ${
          låstaNamn.includes(originalIndex) ? "låst" : "upplåst"
        }`}
      >
        <div className="grå"></div>
        <button className="bin" style={{marginTop: "10px"}} onClick={() => handleRemoveName(originalIndex)}>
          <RiDeleteBin6Line />
        </button>
        <div style={{ width: "134px", display: "contents" }} className="namnTxt">
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleChange}
          />
        </div>
        {placeringsVy &&<button className="låsKnapp" onClick={handleLåsaNamn}>
          {låstaNamn.includes(originalIndex) ? <IoIosLock /> : <IoIosUnlock />}
        </button>}
      </div>
    </li>
  );
};

export default Namn;
