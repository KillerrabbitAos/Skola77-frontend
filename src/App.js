import React, { useState } from 'react';
import './App.css';
import Grid from './Grid';
import Box from './Box';
const App = () => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [boxes, setBoxes] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [names, setNames] = useState([]);
  const [boxNames, setBoxNames] = useState('tom');
  const [filledBoxes, setFilledBoxes] = useState([]);
  const [cellSize, setCellSize] = useState(70) 

  const handleAddName = () => {
    if (nameInput.trim() !== '') {
      setNames([...names, nameInput]);
      setNameInput('');
    }
  };

  const handleMassImportNames = () => {
    const newNames = [];
    const textarea = document.getElementById('namesInput');
    const textareaContent = textarea.value.split('\n');

    for (const name of textareaContent) {
      if (name.trim() !== '') {
        newNames.push(name);
      }
    }

    setNames([...names, ...newNames]);
    textarea.value = '';
  };

  const handleMixNames = () => {
    const mixedList = names.sort(() => Math.random() - 0.5);
    setFilledBoxes(filledBoxes.sort(() => Math.random() - 0.5));
    const newBoxNames = [];
    setBoxNames([]);
    filledBoxes.forEach(function (item, index) {
      newBoxNames.push({
        key: item,
        value: mixedList[index],
      });
    });
    setBoxNames(newBoxNames);
    for (let i = 0; i < document.getElementsByClassName('name').length; i++) {
    var name = document.getElementsByClassName('name')
    var positionInfo = name[i].getBoundingClientRect();
    var width = positionInfo.width;
    while(width > cellSize){
        var style = window.getComputedStyle(name[i], null).getPropertyValue('font-size');
        var fontSize = parseFloat(style); 
// now you have a proper float for the font size (yes, it can be a float, not just an integer)
        name[i].style.fontSize = (fontSize - 1) + 'px';
        var positionInfo = name[i].getBoundingClientRect();
        var width = positionInfo.width;
      }
    while(width < cellSize){
       var style = window.getComputedStyle(name[i], null).getPropertyValue('font-size');
        var fontSize = parseFloat(style); 
// now you have a proper float for the font size (yes, it can be a float, not just an integer)
        name[i].style.fontSize = (fontSize + 1) + 'px';
        var positionInfo = name[i].getBoundingClientRect();
        var width = positionInfo.width;
      }
    while(width > cellSize){
        var style = window.getComputedStyle(name[i], null).getPropertyValue('font-size');
        var fontSize = parseFloat(style); 
// now you have a proper float for the font size (yes, it can be a float, not just an integer)
        name[i].style.fontSize = (fontSize - 1) + 'px';
        var positionInfo = name[i].getBoundingClientRect();
        var width = positionInfo.width;
      }
  }
