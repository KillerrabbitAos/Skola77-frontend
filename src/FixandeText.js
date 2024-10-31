import React, { useEffect, useRef, useState } from "react";

function ResizableText() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [fontSize, setFontSize] = useState(100); // Start with a large font size

  const adjustFontSize = () => {
    if (!containerRef.current || !textRef.current) return;

    let newFontSize = fontSize;
    textRef.current.style.fontSize = `${newFontSize}px`;

    // Reduce font size until the text fits within the container
    while (
      textRef.current.scrollWidth > containerRef.current.clientWidth ||
      textRef.current.scrollHeight > containerRef.current.clientHeight
    ) {
      newFontSize -= 1;
      textRef.current.style.fontSize = `${newFontSize}px`;
    }

    setFontSize(newFontSize);
  };

  useEffect(() => {
    adjustFontSize();
    window.addEventListener("resize", adjustFontSize);
    return () => window.removeEventListener("resize", adjustFontSize);
  }, [fontSize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "200px",
        height: "100px",
        border: "1px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <span
        ref={textRef}
        style={{
          fontSize: `${fontSize}px`,
          whiteSpace: "nowrap",
        }}
      >
        Resize Me!
      </span>
    </div>
  );
}

export default ResizableText;
