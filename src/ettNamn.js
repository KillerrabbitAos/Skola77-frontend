import React, { useEffect, useState } from 'react';
import { IoIosLock } from "react-icons/io";
import { IoIosUnlock } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

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
    <li  key={index}>
        <div id={originalIndex} draggable="true" onDragStart={handleDragStart} className={`namnILista ${låstaNamn.includes(originalIndex) ? 'låst' : 'upplåst'}`}>    
        <div className='grå'></div>
        <button onClick={() => handleRemoveName(originalIndex)}><RiDeleteBin6Line /></button>
   <p>{name}</p>
   <button className='låsKnapp' onClick={handleLåsaNamn}>{låstaNamn.includes(originalIndex) ? <IoIosLock /> : <IoIosUnlock />}</button> 
    </div>
    </li>
)
}
export default Namn;