import React from 'react';
import Box from './Box'; // Se till att importera Box-komponenten om den finns i en annan fil

const Grid = ({ rows, columns, boxes, setBoxes, names }) => {
  const generateBoxes = () => {
    const generatedBoxes = [];
    const totalBoxes = rows * columns;

    for (let i = 0; i < totalBoxes; i++) {
      const row = Math.floor(i / columns) + 1;
      const col = (i % columns) + 1;
      const position = `${row} / ${col} / ${row + 1} / ${col + 1}`;

      // Om det finns fler namn än lådor, loopa runt i namnlistan
      const name = names[i % names.length];

      generatedBoxes.push(
        <Box
          key={`box-${i}`}
          id={`box-${i}`}
          position={position}
          boxes={boxes}
          setBoxes={setBoxes}
          name={name}
        />
      );
    }
    return generatedBoxes;
  };

  return (
    <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)`, gap: '5px' }}>
      {generateBoxes()}
    </div>
  );
};

export default Grid;

