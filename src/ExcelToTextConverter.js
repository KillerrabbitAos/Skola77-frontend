import React from "react";
import * as XLSX from "xlsx";
import "./styles.css";

const ExcelToTextConverter = React.forwardRef(({ setNames, names }, filRef) => {
  const convertExcelToText = async (file) => {
    try {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
            type: "array",
          });

          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          const cellAddresses = Object.keys(sheet);

          const textData = cellAddresses.map((cellAddress) => {
            const cellData = sheet[cellAddress];
            return cellData ? cellData.v : "";
          });

          const newNames = textData.filter((text) => text !== undefined);
          const combinedNames = names.concat(newNames);
          const prevNames = names;
          setNames([...prevNames, ...combinedNames]);
        } catch (error) {
          console.error("Error parsing Excel data:", error);
        }
      };

      fileReader.readAsArrayBuffer(new Blob([file]));
    } catch (error) {
      console.error("Error converting Excel to text:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (fileExtension !== "xlsx") {
        const continueImport = window.confirm(
          'Filformatet är inte ".xlsx". Detta kan vara för att du laddande ned kalkylarket i ett annat filformat. Om du tror att detta är fel och vill fortsätta importen ändå, klicka "ok" annars klicka "avbryt".'
        );
        if (!continueImport) {
          e.target.value = null;
          return;
        }
      }

      convertExcelToText(selectedFile);
    }
  };

  return (
    <input
      ref={filRef}
      id="file-upload"
      type="file"
      onChange={handleFileChange}
    />
  );
});

export default ExcelToTextConverter;
