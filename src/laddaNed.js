import React from 'react';
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";
import { json } from 'react-router-dom';

const DownloadJSON = ({ data, fileName }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["name"]);

  const downloadJSON = () => {
    const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement('a');
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
        }
      else {
          json.stringify(selectedFile)
          const backup = JSON.parse(selectedFile)
          backup.map((cookieName) => {
            if (cookieName) {
              Cookies.set(cookieName.split(":")[0], cookieName.split(":")[1], {
                expires: 365,
              });
            }
          });
        }
      }
      }

  
  return (
    <div>
    <button onClick={downloadJSON}>Download JSON</button>
    <input type="file" onChange={handleFileChange}></input>
    </div>
  );
}

export default DownloadJSON;