import React from "react";

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p style={textStyle}><b>Skola77 2</b> <u>Flamingo</u></p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: "#f8f9fa",
  padding: "3px 5px",
  position: "fixed",
  bottom: "0",
  width: "100%",
  textAlign: "center",
  boxShadow: "0px -1px 5px rgba(0,0,0,0.1)",
};

const textStyle = {
  margin: 0,
  fontSize: "16px",
  color: "#555",
};

export default Footer;
