import React from 'react';
import Namn from './ettNamn';
const NameList = ({ names, handleRemoveName, låstaNamn, setLåstaNamn, namnRader, visaNamn, setNames}) => {
  const rader = namnRader
  const namesDeepCopy = JSON.parse(JSON.stringify(names));
  var newNames = namesDeepCopy
  var namesWithIndex = (newNames.map((name, index) => ({ name, originalIndex: index})))
  // Create an array of objects with name and originalIndex properties
  

  // Sort the names alphabetically by their name property
  const sortedNames = namesWithIndex.sort((a, b) => a.name.localeCompare(b.name)).filter(function(item) {
    return item.name !== ""
})

  // Calculate the number of names in each column
  const columnSize = Math.ceil(sortedNames.length / rader);

  // Divide the sorted names array into three columns
  const columns = [];
  for (let i = 0; i < rader; i++) {
    columns.push(sortedNames.slice(i * columnSize, (i + 1) * columnSize));
  }

  return (
    <div style={{ display: 'flex'}}>
      {visaNamn && (
      columns.map((column, columnIndex) => (
        <div key={columnIndex} style={{ flex: 1,  }}>
          <ul>
            {column.map(({ name, originalIndex }, index) => (
              <Namn
                index={index}
                name={name}
                originalIndex={originalIndex}
                handleRemoveName={handleRemoveName}
                låstaNamn={låstaNamn}
                setLåstaNamn={setLåstaNamn}
                names={names}
                setNames={setNames}
              />
            ))}
          </ul>
        </div>
      ))
            )}
    </div>
  );
};

export default NameList;
