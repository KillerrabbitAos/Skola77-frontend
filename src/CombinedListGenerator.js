const generateCombinedList = (list2, list4, defaultValue, names, låstaNamn, boxNames) => {
  const maxUniqueNumber = Math.min(list4.length - 1, list2.length);
  const combinedList = [];
  const shuffledList2 = []
  const addLater = []
  const list4DeepCopy = JSON.parse(JSON.stringify(list4));
  const list3 = shuffleArray(list4DeepCopy);
  const shuffledList2Deep = JSON.parse(JSON.stringify(shuffleArray(list2)));
  
console.log(list2)
  for (let i = 0; i < list2.length; i++){
  if (låstaNamn.includes(list2[i])) {
    console.log("kebab")
    const foundItem = boxNames.find(item => item.key === list2[i])
    if (foundItem){
      console.log("orm")
      addLater.push(foundItem)
     // usedIndexes.add(JSON.parse(JSON.stringify(foundItem.value)))
      console.log(foundItem)
    }
  }
  else{
  shuffledList2.push(list2[i])
  }
}
let usedIndexes = new Set();
console.log(usedIndexes)
console.log(shuffledList2)
shuffleArray(shuffledList2)

  let i = 0;
  for (; i < list3.length && combinedList.length < shuffledList2.length; i++) {
    const key = shuffledList2[combinedList.length];

    let randomIndex = Math.floor(Math.random() * names.length);
    while (usedIndexes.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * names.length);
    }
    usedIndexes.add(randomIndex);

    let value = randomIndex;

    if (names[value] !== "" && !låstaNamn.includes(value)) {
      combinedList.push({ key, value });
    }

    if (value > maxUniqueNumber) {
      value = 1;
    }
    if (value > maxUniqueNumber) {
      value = 1;
    }
  }


  for (; i < shuffledList2.length; i++) {
    const key = shuffledList2[i];
    const itemValue = names.includes("") ? 0 : defaultValue;
    combinedList.push({ key, value: itemValue });
  }
  
  console.log(combinedList)
  const combinedListMerged = [...combinedList, ...addLater]
  return(combinedListMerged)
};

const shuffleArray = (array1) => {
  let array = array1.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default generateCombinedList;