import React, { useEffect, useState } from 'react';


const Namn = ({ name, originalIndex, index, handleRemoveName }) => {

    const handleDragStart = (e) => {
        console.log(e)
        e.dataTransfer.setData('boxId', 'ny: ' + 'box-10' + 'original: ' + 'box-10');
      };


return(
    <li id={originalIndex} draggable="true" onDragStart={handleDragStart} key={index}>
        {name}
        <button onClick={() => handleRemoveName(originalIndex)}>Ta bort</button>
    </li>
)
}
export default Namn;