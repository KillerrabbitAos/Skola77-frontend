import React, { useEffect, useState } from "react";

const NamnRuta = ({ namn, setNamn, index, allaNamn }) => {
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
  useEffect(() => {setCurrentName(allaNamn[index])}, [allaNamn]);
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
