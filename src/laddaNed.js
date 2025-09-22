import React from "react";
import Cookies from "js-cookie";
import { useState } from "react";
import { useCookies } from "react-cookie";

const DownloadJSON = ({ fileName }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);
  const [data, setData] = useState(new Map());
const [userData, setUserData] = useState()
  async function checkLoginStatus() {
    const response = await fetch('http://localhost:3005/home', {
      credentials: 'include'
    });
    const result = await response.json();

    if (result.loggedin) {
      const userDataString = result.data;
      setData(userDataString);
      return userDataString;
    }
    return "";
  }

  const downloadJSON = async () => {
    const loggedInData = await checkLoginStatus(); 

    if (!loggedInData) {
      alert("Du måste vara inloggad för att ladda ner filen.");
      return; // Avbryt om användaren inte är inloggad
    }

    const jsonData = new Blob([loggedInData], {
      type: "application/json",
    });

    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement("a");
    link.href = jsonURL;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleFileChange = async () => {
    const loggedInData = await checkLoginStatus();

    if (!loggedInData) {
      alert("Du måste vara inloggad för att importera data.");
      return; // Avbryt om användaren inte är inloggad
    }

    try {
      const parsedData = JSON.parse(loggedInData);
      parsedData.map((cookieName) => {
        if (cookieName) {
          Cookies.set(cookieName.split(":")[0], cookieName.split(":")[1], {
            expires: 365,
          });
        }
      });
      alert("Datan har importerats och cookies har satts.");
    } catch (error) {
      console.error("Kunde inte parsa JSON-data:", error);
      alert("Fel uppstod vid import av data.");
    }
  };

  return (
    <div id="backupDiv">
      <button id="backupButton" onClick={downloadJSON}>Säkerhetskopiera på fil</button>
      <div id="div2">
        <label htmlFor="backup">Importera data:</label>
        <button id="importButton" onClick={handleFileChange}>Importera data</button>
      </div>
    </div>
  );
};

export default DownloadJSON;
