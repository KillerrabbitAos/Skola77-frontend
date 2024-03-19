import React from "react";
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";
import { json } from "react-router-dom";

const DownloadJSON = ({ data, fileName }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);

  const downloadJSON = () => {
    const jsonData = new Blob([data], {
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (fileExtension !== "json") {
        alert(
          'Filformatet är inte ".json". Kolla så att du har valt rätt fil.'
        );
      } else {
        var reader = new FileReader();
        reader.readAsText(selectedFile, "UTF-8");
        reader.onload = function (evt) {
          const backup = JSON.parse(evt.target.result)
          const backup2 = backup.map((item) => {})
          console.log(backup2) 
          backup.map((cookieName) => {
            if (cookieName) {
              Cookies.set(cookieName.split(":")[0], cookieName.split(":")[1], {
                expires: 365,
              });
            }
          });
        };
      }
    }
  }


  return (
    <div>
      <button style={{fontWeight: "bolder"}}onClick={downloadJSON}>Säkerhetskopiera på fil</button>
      <div style={{display: "grid",}}>
      <label htmlFor="backup">Importera backupfil</label>
      <input id="backup" type="file" onChange={handleFileChange}></input>
      </div>
    </div>
  );
};

export default DownloadJSON;
