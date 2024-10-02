import React, { useEffect, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

const Namn = ({
  name,
  originalIndex,
  index,
  handleRemoveName,
  låstaNamn,
  setLåstaNamn,
  handleUpdateName, // Lägg till en funktion för att hantera namnuppdateringar
  names,
  setNames
}) => {
  const [editedName, setEditedName] = useState(name);

  useEffect(() => {
    setEditedName(name); // Uppdatera den redigerade texten om 'name' ändras
  }, [name]);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("namn", originalIndex);
  };

  const handleLåsaNamn = () => {
    if (!låstaNamn.includes(originalIndex)) {
      setLåstaNamn((prevLåstaNamn) => [...prevLåstaNamn, originalIndex]);
    } else {
      const newLåstaNamn = [];
      for (let i = 0; i < låstaNamn.length; i++) {
        if (låstaNamn[i] !== originalIndex) {
          newLåstaNamn.push(låstaNamn[i]);
        }
      }
      setLåstaNamn(newLåstaNamn);
    }
  };

  const handleChange = (e) => {
    const newName = e.target.value;
    setEditedName(newName);

    const newNames = [...names];  // Skapa en kopia av names
    newNames[originalIndex] = newName;  // Uppdatera det specifika namnet
    setNames(newNames);
  
  };

  return (
    <li key={index}>
      <div
        id={originalIndex}
        draggable="true"
        onDragStart={handleDragStart}
        className={`namnILista ${
          låstaNamn.includes(originalIndex) ? "låst" : "upplåst"
        }`}
      >
        <div className="grå"></div>
        <button className="bin" onClick={() => handleRemoveName(originalIndex)}>
          <RiDeleteBin6Line />
        </button>
        <div style={{ width: "134px", display: "contents" }} className="namnTxt">
          <input
            value={editedName}
            onChange={handleChange} // Använd handleChange för att uppdatera namnet
          />
        </div>
        <button className="låsKnapp" onClick={handleLåsaNamn}>
          {låstaNamn.includes(originalIndex) ? <IoIosLock /> : <IoIosUnlock />}
        </button>
      </div>
    </li>
  );
};

export default Namn;
