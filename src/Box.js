import React, { useEffect, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImUnlocked } from "react-icons/im";
import { ImLock } from "react-icons/im";
import { isTablet } from "react-device-detect";
import { editingMode } from "./Grid";

function findValueByKey(list, key) {
  if (list === "tom") {
    return 0;
  } else {
    const foundItem = list.find((item) => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}

const Box = ({
  position,
  groupName,
  setLåstaNamn,
  contextMenu,
  updateFixa,
  setUpdateFixa,
  setContextMenu,
  showContextMenu,
  låstaNamn,
  boxes,
  showBorders,
  setBoxes,
  fixa,
  names,
  bytaPlatser,
  id,
  originalid,
  keyChange,
  boxNames,
  setBoxNames,
  filledBoxes,
  setFilledBoxes,
  editingMode,
}) => {
  const [isFilled, setIsFilled] = useState(false);
  const [nameValue, setNameValue] = useState("tom");
  const [färg, setFärg] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const namesDeepCopy = JSON.parse(JSON.stringify(names));
  const isBeta = true;
  var newNames = namesDeepCopy;
  var namesWithIndex = newNames.map((name, index) => ({
    name,
    originalIndex: index,
  }));
  const setShowContextMenu = (bool) => {
    const newContextMenu = [];
    console.log("context");
    if (bool) {
      newContextMenu.push(id);
      setContextMenu(newContextMenu);
    } else {
      for (let i = 0; i < contextMenu.length; i++) {
        if (contextMenu[i] !== id) {
          newContextMenu.push(låstaNamn[i]);
        }
        setContextMenu(newContextMenu);
      }
    }
  };
  const sortedNames = namesWithIndex
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(function (item) {
      return item.name !== "";
    });
  const handleLåsaNamn = () => {
    const isCurrentlyLocked = låstaNamn.includes(id);
    const updatedLåstaNamn = isCurrentlyLocked
      ? låstaNamn.filter((lockedId) => lockedId !== id)
      : [...låstaNamn, id];

    setLåstaNamn(updatedLåstaNamn);
  };

  const ipadContext = () => {
    const newContextMenu = [];
    newContextMenu.push(id);
    setShowContextMenu(newContextMenu);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);

    setContextMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const handleContextMenuTom = (e) => {
    e.preventDefault();
  };
  const handleClick = (e) => {
    if (showContextMenu) {
      setShowContextMenu(false);
    }
  };
  const handleBoxClick = () => {
    if (editingMode) {
      if (!isFilled) {
        const newName = "tom";
        console.log(boxNames[id]);
        if (newName) {
          setIsFilled(true);
          setFilledBoxes([...filledBoxes, id]);
        }
      }
    } else {
      return;
    }
  };

  const handleRemoveBox = () => {
    setIsFilled(false);
    if (låstaNamn.includes(id)) {
      setLåstaNamn((prevLåstaNamn) =>
        prevLåstaNamn.filter((lockedId) => lockedId !== id)
      );
    }
    setFilledBoxes((prevFilledBoxes) =>
      prevFilledBoxes.filter((boxId) => boxId !== id)
    );
    if (nameValue !== "tom" && nameValue !== "" && nameValue) {
      const newBoxNames = boxNames.filter((box) => box.key !== id);
      setBoxNames(newBoxNames.length ? newBoxNames : "tom");
    }
  };

  const handleDragStart = (e) => {
    const idInfo = { ny: id, original: originalid };
    
    e.dataTransfer.setData("boxId", "ny: " + id + "original: " + originalid);
  };

  useEffect(() => {
    if (document.getElementById(id).getElementsByClassName("name")[0]) {
      if (
        document
          .getElementById(id)
          .getElementsByClassName("name")[0]
          .style.fontSize.startsWith("0.")
      ) {
        document
          .getElementById(id)
          .getElementsByClassName("name")[0].style.fontSize = "20px";
        fixa();
      }
    }
    setNameValue(findValueByKey(boxNames, id));
    if (filledBoxes.includes(id)) {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [boxNames, setNameValue, id, filledBoxes]);
  useEffect(() => {
    fixa();
    let isMounted = true;

    if (isMounted) {
      setNameValue(names[findValueByKey(boxNames, id)]);
    }
    if (groupName == "schack") {
      setFärg(nameValue.split(";")[0]);
    }
    fixa();
    return () => {
      isMounted = false;
    };
  }, [boxNames, setNameValue, id, filledBoxes, isFilled, names]);

  useEffect(() => {
    // Listen for clicks to handle hiding the context menu
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [showContextMenu]);
  return (
    <div
      className={`box ${färg ? färg : ""}`}
      onMouseUp={handleBoxClick}
      onDragStart={handleDragStart}
      draggable={isFilled && editingMode}
      id={id}
      data-originalid={originalid}
      style={{ gridArea: position }}
      onContextMenu={names[1] ? handleContextMenu : handleContextMenuTom}
    >
      <div
        className={`box ${filledBoxes.includes(id) ? "filled" : ""} ${
          färg ? färg : ""
        }  ${låstaNamn.includes(id) && showBorders ? "låst" : ""}`}
      >
        {isFilled && (
          <button
            className="papperskorg"
            style={{ visibility: showBorders ? "visible" : "hidden" }}
            onClick={handleRemoveBox}
          >
            <RiDeleteBin6Line />
          </button>
        )}
        {isFilled && (
          <button
            className="låsKnappBox"
            style={{ visibility: showBorders ? "visible" : "hidden" }}
            onClick={handleLåsaNamn}
          >
            {låstaNamn.includes(id) ? <ImLock /> : <ImUnlocked />}
          </button>
        )}
        {isFilled && isTablet && !isBeta && (
          <button
            onClick={ipadContext}
            style={{
              visibility: showBorders ? "visible" : "hidden",
              color: "black",
            }}
            className="låsKnappBox"
          >
            <ImUnlocked />
          </button>
        )}
      </div>
      <div
        className={`boxNamn ${låstaNamn.includes(id) ? "låstBoxNamn" : ""} ${
          nameValue ? "" : "tom"
        }`}
      >
        {isFilled && (
          <span id={id} className={"name"} data-originalid={originalid}>
            {groupName === "schack" ? nameValue.split(";")[1] : nameValue}
          </span>
        )}
      </div>
      {showContextMenu && (
        <div
          style={{
            zIndex: 7,
            flexDirection: "column",
            position: isTablet ? "relative" : "fixed",
            top: isTablet ? "50%" : contextMenuPosition.y,
            left: isTablet ? "50%" : contextMenuPosition.x,
            display: "flex",
            height: "300px",
            maxHeight: "300x",
          }}
        >
          <ul
            className="custom-context-menu"
            style={{
              listStyle: "none",
              padding: "10px",
              display: "block",
              backgroundColor: "white",
              overflowY: "scroll",
              flex: "1",
              border: "1px solid #ddd",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              borderRadius: "5px",
            }}
          >
            {sortedNames.map(({ name, originalIndex }, index) => (
              <li
                className="högerKlick"
                key={"context-" + index}
                onClick={() => {
                  const newBoxNames = [];
                  for (let i = 0; i < boxNames.length; i++) {
                    if (boxNames[i].key != id) {
                      newBoxNames.push(boxNames[i]);
                    }
                  }
                  const key = id;
                  const value = originalIndex;
                  newBoxNames.push({ key, value });
                  if (!filledBoxes.includes(id)) {
                    setFilledBoxes([...filledBoxes, id]);
                  }
                  setBoxNames(newBoxNames);
                  setShowContextMenu(false);
                  setUpdateFixa(!updateFixa);
                  return;
                }}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Box;
