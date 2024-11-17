import React, { useState } from "react";

const NamnRuta = ({ namn, setNamn, index }) => {
  const [currentName, setCurrentName] = useState(namn);
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setNamn(currentName, index);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (event) => {
    setCurrentName(event.target.value);
  };

  return (
    <input
      value={currentName}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      className={`text-[20px] ml-[1vw] w-[90%] ${
        !isFocused ? "truncate" : "w-full" 
      }`}
      style={{
        transition: "width 0.3s ease", 
        zIndex: "200", 
      }}
    />
  );
};

export default NamnRuta;