import React from 'react';
import * as XLSX from 'xlsx';

const ExcelToTextConverter = ({ excelFile, setNames }) => {
  const convertExcelToText = async (file) => {
    try {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

    
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

      
          const cellAddresses = Object.keys(sheet);


          const textData = cellAddresses.map((cellAddress) => {
            const cellData = sheet[cellAddress];
            return cellData ? cellData.v : ''; 
          });


          setNames(textData.filter((text) => text !== undefined));
        } catch (error) {
          console.error('Error parsing Excel data:', error);
        }
      };

      fileReader.readAsArrayBuffer(new Blob([file]));
    } catch (error) {
      console.error('Error converting Excel to text:', error);
    }
  };

  return (
    <div>
      <div>
        <p>Importera namn från Excel (.xlsx):</p>
      </div>
      <input type="file" onChange={(e) => convertExcelToText(e.target.files[0])} />
    </div>
  );
};

export default ExcelToTextConverter;