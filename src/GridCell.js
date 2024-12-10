import React, { useEffect, useState, useRef } from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import { RiDeleteBin6Line } from "react-icons/ri";
import "./Grid.css";
import debounce from "lodash.debounce";

function adjustAndStoreFontSize(textElement, containerElement) {
  let vw = 1;
  let rem = 0.5;
  if (textElement.value == 0) {
    return 10;
  }
  const applyFontSize = () => {
    textElement.style.fontSize = `calc(${vw}vw + ${rem}rem)`;
  };

  applyFontSize();

  while (
    textElement.scrollWidth > containerElement.clientWidth ||
    textElement.scrollHeight > containerElement.clientHeight
  ) {
    vw -= 0.1;
    rem -= 0.05;

    applyFontSize();
  }

  const finalFontSize = `calc(${vw}vw + ${rem}rem)`;
  textElement.style.fontSize = finalFontSize;
  console.log("Final font size stored:", finalFontSize);

  return finalFontSize;
}

const GridCell = ({
  dragging,
  edit,
  rowIndex,
  over,
  overId,
  overPerson,
  activePerson,
  overBool,
  activeId,
  overNamn,
  colIndex,
  cell,
  högerklicksmeny,
  omvänd,
  names,
  setGrid,
  grid,
  klar,
  rows,
  setHögerklicksmeny,
  cords,
  setFontSize,
  columns,
  låstaBänkar,
  updateSize,
  overbench,
  setLåstaBänkar,
  fontSize,
}) => {
  const { setNodeRef } = useDroppable({
    id: `${rowIndex}-${colIndex}`,
  });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const divRef = useRef(null);

  const textRef = useRef(null);
  const previewRef = useRef(null);
  const previewDivRef = useRef(null);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const meny = (
    <div
      style={{
        position: "absolute",
        left: `calc(${mousePosition.x - 10}px - 1px)`,
        top: `calc(${mousePosition.y + 25}px - 1px)`,
        maxHeight: "200px",
        backgroundColor: "white",
        borderRadius: "5%",
        border: "1px solid black",
        zIndex: "200",
        overflowY: "scroll",
        overflowX: "hidden",
          width:"11vw",
        listStyleType: "none",
      }}
    >
      {names
        .map((namn, index) => {
          return { namn: namn, originalIndex: index };
        })
        .sort((a, b) => {
          if (a.namn.toLowerCase() < b.namn.toLowerCase()) {
            return -1;
          }
          if (a.namn.toLowerCase() > b.namn.toLowerCase()) {
            return 1;
          }
          return 0;
        })
        .map((name) => (
          <li
            className={"högerklicksmenyalternativ"}
            key={`h-${name.originalIndex}`}
            onMouseDown={(e) => {
              e.stopPropagation();
              setGrid(
                grid.map((rad) =>
                  rad.map((ruta) => ({
                    id: ruta.id,
                    person:
                      ruta.id === cell.id ? name.originalIndex : ruta.person,
                  }))
                )
              );

              setHögerklicksmeny(false);
            }}
          >
            {name.namn}
          </li>
        ))}
    </div>
  );
  const visaHögerklicksmeny = (event) => {
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setMousePosition({ x: offsetX, y: offsetY });
    setHögerklicksmeny(cords);
  };

  useEffect(() => {
    if (over && overId !== activeId && activePerson) {
      const targetElement = document.getElementById(activePerson);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setPosition({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        });
      }
    } else {
      setPosition({ x: 0, y: 0 });
    }
  }, [over, overId, activeId, activePerson]);

  const musenNer = (e) => {
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const musenUpp = (e) => {
    const dx = Math.abs(e.clientX - startPos.x);
    const dy = Math.abs(e.clientY - startPos.y);
    const dragLängd = 5;

    if (dx < dragLängd && dy < dragLängd) {
      e.stopPropagation();
      removeItem();
    }
  };

  const musenUppTaBort = (e) => {
    const dx = Math.abs(e.clientX - startPos.x);
    const dy = Math.abs(e.clientY - startPos.y);
    const dragLängd = 5;

    if (dx < dragLängd && dy < dragLängd) {
      e.stopPropagation();
      lås();
    }
  };

  const handleCellClick = () => {
    if (!cell.id) {
      const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
      newGrid[rowIndex][colIndex] = {
        id: `item-${Date.now()}`,
        person: 0,
      };
      setGrid(newGrid);
    }
  };
  const lås = () => {
    !låstaBänkar.includes(cell.id)
      ? setLåstaBänkar(
          cell.person
            ? [...låstaBänkar, cell.id, cell.person]
            : [...låstaBänkar, cell.id]
        )
      : setLåstaBänkar(
          låstaBänkar.filter((sak) => sak !== cell.id && sak !== cell.person)
        );
  };
  const removeItem = () => {
    const newGrid = grid.map((row) => row.map((c) => ({ ...c })));
    newGrid[rowIndex][colIndex] = { id: null, person: 0 }; // Reset cell to empty
    setGrid(newGrid);
  };

  const {
    attributes,
    listeners,
    setNodeRef: draggableRef,
    transform,
  } = useDraggable({
    id: `${rowIndex}-${colIndex}`,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `translate3d(${position.x}px, ${position.y}px, 0)`,
    width: "100%",
    height: "100%",
    background: "black",
    background:
      låstaBänkar.includes(cell.id) && cell.person === 0
        ? "repeating-linear-gradient(45deg, #b3b3b34d, #0003 10px, #0000004d 0, #0000004d 20px)"
        : "white",
    border: dragging ? "2px solid black" : "none",
    touchAction: "none",
    zIndex: dragging || högerklicksmeny === cords ? "99" : "1",
    position: over ? "absolute" : "relative",
    textAllign: "center",
    margin: "auto",
  };
  const style2 = {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    border: "none",
    touchAction: "none",
    zIndex: dragging ? "99" : "1",
    position: "absolute",
    borderRadius: "10px",
    textAllign: "center",
    margin: "auto",
  };
  const buttons = !klar ? (
    <div className="buttons">
      <button
        className={`removeButton rounded-[17%] rounded-tr-none ${
          !omvänd ? "!" : ""
        }rounded-${omvänd ? "tl" : "bl"}-none rounded-br-none`}
        onMouseDown={musenNer}
        onMouseUp={musenUpp}
      >
        <RiDeleteBin6Line
          style={{
            height: "75%",
            width: "75%",
            color: "white",
            margin: "auto",
          }}
        />
      </button>
      <button
        className={`removeButton rounded-[17%] rounded-tl-none rounded-${
          omvänd ? "tr" : "br"
        }-none !rounded-bl-none !bg-gray-400`}
        onMouseDown={musenNer}
        onMouseUp={musenUppTaBort}
      >
        {!låstaBänkar.includes(cell.id) ? (
          <svg
            style={{ height: "80%", marginLeft: "5%", margin: "auto" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M144 144c0-44.2 35.8-80 80-80c31.9 0 59.4 18.6 72.3 45.7c7.6 16 26.7 22.8 42.6 15.2s22.8-26.7 15.2-42.6C331 33.7 281.5 0 224 0C144.5 0 80 64.5 80 144l0 48-16 0c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-240 0 0-48z"
              fill="white"
            />
          </svg>
        ) : (
          <svg
            style={{ height: "80%", marginLeft: "5%", margin: "auto" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"
              fill="white"
            />
          </svg>
        )}
      </button>
    </div>
  ) : (
    <div
      className={`h-1/2 bg-gray-400 rounded-[17%] ${
        !omvänd ? "!" : ""
      }rounded-${omvänd ? "tl" : "bl"}-none rounded-${
        omvänd ? "tr" : "br"
      }-none`}
    ></div>
  );
  useEffect(() => {
    if (cell.person !== 0) {
      if (låstaBänkar.includes(cell.id)) {
        setLåstaBänkar(
          låstaBänkar.filter((sak) => sak !== cell.id && sak !== cell.person)
        );
        setLåstaBänkar(
          cell.person
            ? [...låstaBänkar, cell.id, cell.person]
            : [...låstaBänkar, cell.id]
        );
      }
      const text =
        dragging && previewRef.current
          ? previewRef.current
          : textRef.current
          ? textRef.current
          : null;
      const div =
        dragging && previewDivRef.current
          ? previewDivRef.current
          : divRef.current
          ? divRef.current
          : null;

      if (text && div) {
        const newFontSize = adjustAndStoreFontSize(text, div);

        setFontSize((prevFontSize) => {
          const existing = prevFontSize.find(
            (f) => f.id === names[cell.person]
          );
          if (existing && existing.size === newFontSize) {
            return prevFontSize;
          }

          const updatedFontSizeList = prevFontSize.filter(
            (f) => f.id !== names[cell.person]
          );
          updatedFontSizeList.push({
            id: names[cell.person],
            size: newFontSize,
          });
          return updatedFontSizeList;
        });
      }
    }
  }, [cell.person, columns, rows, klar]);

  return (
    <div
      id={cords}
      onContextMenu={visaHögerklicksmeny}
      ref={setNodeRef}
      onClick={handleCellClick}
      className={`grid-cell ${cell.id ? "active" : ""} rounded-[10%]`}
      style={{
        border: over ? "2px solid gray" : klar ? "none" : "2px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2f2f2",
        width: "90%",
        height: "90%",
        zIndex: dragging || högerklicksmeny === cords ? "99" : "1",
      }}
    >
      {högerklicksmeny === cords && meny}
      {!overNamn.some((row) => row.includes(null)) &&
        overId &&
        dragging &&
        overId !== cords && (
          <div style={style2}>
            {!omvänd && buttons}
            <div
              ref={previewDivRef}
              style={{
                height: "50%",
                display: "grid",
                fontSize: `${fontSize.map(
                  (namn) => namn === overId && namn.fontSize
                )}px`,
              }}
            >
              <div
                style={{ textAlign: "center" }}
                className="justify-center flex-row flex items-center"
                ref={previewRef}
              >
                {overNamn}
              </div>
            </div>
            {omvänd && buttons}
          </div>
        )}

      {cell.id ? (
        <div
          ref={draggableRef}
          {...listeners}
          {...attributes}
          style={style}
          className="rounded-[10%]"
        >
          {!omvänd && buttons}

          <div
            ref={divRef}
            style={{
              height: "50%",
              display: "grid",
            }}
          >
            <div
              style={{ textAlign: "center" }}
              className="justify-center flex-row flex items-center"
              ref={textRef}
            >
              {names[cell.person]}
            </div>
          </div>

          {omvänd && buttons}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default GridCell;
