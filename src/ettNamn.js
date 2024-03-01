import React, { useEffect, useState } from 'react';


const Namn = ({ name, originalIndex, index, handleRemoveName }) => {

    const handleDragStart = (e) => {
        console.log(e)
        e.dataTransfer.setData("namn", originalIndex);
      };


return(
    <li id={originalIndex} draggable="true" onDragStart={handleDragStart} key={index}>
        <button onClick={() => handleRemoveName(originalIndex)}>Ta bort</button>
   {name} 
    </li>
)
}
export default Namn;