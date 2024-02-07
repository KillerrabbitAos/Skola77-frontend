import React from 'react';

const NameList = ({ names, handleRemoveName }) => {
  // Create an array of objects with name and originalIndex properties
  const namesWithIndex = names.map((name, index) => ({ name, originalIndex: index }));

  // Sort the names alphabetically by their name property
  const sortedNames = namesWithIndex.sort((a, b) => a.name.localeCompare(b.name));

  // Calculate the number of names in each column
  const columnSize = Math.ceil(sortedNames.length / 3);

  // Divide the sorted names array into three columns
  const columns = [];
  for (let i = 0; i < 3; i++) {
    columns.push(sortedNames.slice(i * columnSize, (i + 1) * columnSize));
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Render each column */}
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} style={{ flex: 1 }}>
          <ul>
            {column.map(({ name, originalIndex }, index) => (
              <li key={index}>
                {name}
                <button onClick={() => handleRemoveName(originalIndex)}>Ta bort</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NameList;
