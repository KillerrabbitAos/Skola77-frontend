import React from "react";

const GridControls = ({
  rows,
  cols,
  setRows,
  setCols,
  grid,
  setGrid,
  deletedItems,
  setDeletedItems,
}) => {
  // Logic for handling rows
  const ändraRader = (e) => {
    const inputValue = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    let newRows = isNaN(inputValue) || inputValue === "" ? "" : Math.max(1, inputValue);

    if (newRows === "") {
      setRows("");
      return;
    }

    const removedItems = [];
    const newGrid = [];

    for (let rowIndex = 0; rowIndex < newRows; rowIndex++) {
      if (rowIndex < rows) {
        newGrid.push(grid[rowIndex]);
      } else {
        newGrid.push(Array.from({ length: cols }, () => ({ id: null, person: 0 })));
      }
    }

    if (newRows < rows) {
      for (let rowIndex = newRows; rowIndex < rows; rowIndex++) {
        const removedRow = { index: rowIndex, data: grid[rowIndex] };
        removedItems.push(removedRow);
      }
      setDeletedItems((prev) => [...prev, ...removedItems]);
    }

    setGrid(newGrid);
    setRows(newRows);
  };

  // Logic for handling columns
  const ändraKolumner = (e) => {
    const inputValue = e.target.value === "" ? "" : parseInt(e.target.value, 10);
    let newCols = isNaN(inputValue) || inputValue === "" ? "" : Math.max(1, inputValue);

    if (newCols === "") {
      setCols("");
      return;
    }

    const newGrid = grid.map((row, rowIndex) => {
      if (newCols > cols) {
        for (let colIndex = cols; colIndex < newCols; colIndex++) {
          row.push({ id: null, person: 0 });
        }
      } else {
        const removedItems = row.slice(newCols).map((cell, colIndex) => ({
          ...cell,
          rowIndex,
          colIndex: colIndex + newCols,
        }));
        setDeletedItems((prev) => [...prev, ...removedItems]);
        row = row.slice(0, newCols);
      }
      return row;
    });

    setGrid(newGrid);
    setCols(newCols);
  };

  return (
    <div className="grid-controls">
      <input
        type="number"
        min="1"
        value={rows === "" ? "" : rows}
        onChange={ändraRader}
      />
      <input
        type="number"
        min="1"
        value={cols === "" ? "" : cols}
        onChange={ändraKolumner}
      />
    </div>
  );
};

export default GridControls;
