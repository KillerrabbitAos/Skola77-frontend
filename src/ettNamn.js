import React, { useEffect, useState } from 'react';


const Namn = ({ name, originalIndex, index, handleRemoveName, låstaNamn, setLåstaNamn }) => {


    const handleDragStart = (e) => {
        console.log(e)
        e.dataTransfer.setData("namn", originalIndex);
      };

      const handleLåsaNamn = () => {
        if (!låstaNamn.includes(originalIndex)){
        setLåstaNamn((prevLåstaNamn) => [...prevLåstaNamn, originalIndex])
      }
      else{
        const newLåstaNamn = [] 
        for (let i = 0; i < låstaNamn.length; i++){
            if (låstaNamn[i] !== originalIndex){
                newLåstaNamn.push(låstaNamn[i])
            }
            setLåstaNamn(newLåstaNamn);
        }
      }
    }

return(
    <li id={originalIndex} draggable="true" onDragStart={handleDragStart} className={`namnILista ${låstaNamn.includes(originalIndex) ? 'låst' : ''}`} key={index}>
        <button onClick={() => handleRemoveName(originalIndex)}>Ta bort</button>
   {name}
   <button className='låsKnapp' onClick={handleLåsaNamn}></button> 
    </li>
)
}
export default Namn;