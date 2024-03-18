import React from 'react';

const DownloadJSON = ({ data, fileName }) => {
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
      if (fileExtension !== "JSON") {
        alert(
          'Filformatet är inte ".JSON". Kolla så att du har valt rätt fil.'
        );
        }
      else {
        onClick={() => {
          const backup = 
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

  }
  return (
    <div>
    <button onClick={downloadJSON}>Download JSON</button>
    <input type="file" onChange={handleFileChange}></input>
    </div>
  );
}

export default DownloadJSON;