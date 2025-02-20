import React, { useEffect, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { ImUnlocked } from "react-icons/im";
import { ImLock } from "react-icons/im";
import { isTablet } from "react-device-detect";
import { FaChessKing } from "react-icons/fa";
import {
  TbChess,
  TbChessFilled,
  TbChessKnight,
  TbChessKnightFilled,
  TbChessBishop,
  TbChessBishopFilled,
  TbChessRook,
  TbChessRookFilled,
  TbChessKing,
  TbChessQueen,
  TbChessKingFilled,
  TbChessQueenFilled,
} from "react-icons/tb";

function findValueByKey(list, key) {
  if (list === "tom") {
    return 0;
  } else {
    const foundItem = list.find((item) => item.key === key);
    return foundItem ? foundItem.value : null;
  }
}

const SchackBox = ({
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
  i,
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

  // Existing useEffect and handlers

  // Context menu handlers
  const handleContextMenu = (e) => {
    e.preventDefault(); // Prevent default right-click menu
    setShowContextMenu(true); // Show custom context menu
    // Set position for the context menu
    setContextMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });
  };
  const handleContextMenuTom = (e) => {
    e.preventDefault();
  };
  const handleClick = (e) => {
    // Hide context menu when clicking anywhere else
    if (showContextMenu) {
      setShowContextMenu(false);
    }
  };
  const handleBoxClick = () => {
    if (!isFilled) {
      const newName = "tom";
      console.log(boxNames[id]);
      if (newName) {
        setIsFilled(true);
        setFilledBoxes([...filledBoxes, id]);
      }
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
    e.currentTarget.classList.add("dragging");
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
      onMouseUp={handleBoxClick}
      onDragStart={handleDragStart}
      draggable={isFilled ? true : false}
      id={id}
      className="schackPjäs"
      data-originalid={originalid}
      style={{
        gridArea: position,
        width: "100%",
        height: "100%",
        backgroundColor: `${
          (parseInt(i / 8) + i) % 2 === 1 ? "lightgray" : "white"
        }`,
      }}
      onContextMenu={handleContextMenuTom}
    >
      {nameValue === "vit;bonde" ? (
        <TbChess />
      ) : nameValue === "svart;bonde" ? (
        <TbChessFilled />
      ) : nameValue === "vit;springare" ? (
        <TbChessKnight />
      ) : nameValue === "svart;springare" ? (
        <TbChessKnightFilled />
      ) : nameValue === "vit;löpare" ? (
        <TbChessBishop />
      ) : nameValue === "svart;löpare" ? (
        <TbChessBishopFilled />
      ) : nameValue === "vit;torn" ? (
        <TbChessRook />
      ) : nameValue === "svart;torn" ? (
        <TbChessRookFilled />
      ) : nameValue === "vit;kung" ? (
        <TbChessKing />
      ) : nameValue === "svart;kung" ? (
        <TbChessKingFilled />
      ) : nameValue === "vit;dam" ? (
        <TbChessQueen />
      ) : nameValue === "svart;dam" ? (
        <TbChessQueenFilled />
      ) : (
        ""
      )}
    </div>
  );
};

export default SchackBox;
