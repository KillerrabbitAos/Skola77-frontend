import React, { useState } from "react";

const NamnRuta = ({ namn, setNamn, index }) => {
  const [currentName, setCurrentName] = useState(namn);

  const handleBlur = () => {
    setNamn(currentName, index);  
  };

  const handleChange = (event) => {
    setCurrentName(event.target.value);  
  };

  return (
    <input
      value={currentName}
      onChange={handleChange}
      onBlur={handleBlur}  
      className="text-[20px] ml-[1vw] overflow-x-scroll scrollbar-none w-[90%]"
    />
  );
};

export default NamnRuta;
