const generateCombinedList = (list2, list4, defaultValue, names, låstaNamn) => {
  const maxUniqueNumber = Math.min(list4.length - 1, list2.length);

  const shuffledList2 = []
  const addLater = []
  const list4DeepCopy = JSON.parse(JSON.stringify(list4));
  const list3 = shuffleArray(list4DeepCopy);
  const shuffledList2Deep = JSON.parse(JSON.stringify(shuffleArray(list2)));
  for (let i = 0; i < shuffledList2Deep.length; i++){
  if (låstaNamn.includes(shuffledList2Deep[i])) {
    const foundItem = list4.find(item => item.key === shuffledList2Deep[i])
    if (foundItem){
      addLater.push(foundItem)
    }
  }
  shuffledList2.push(shuffledList2Deep[i])
}
  let combinedList = [];
  let usedIndexes = new Set();


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

  return combinedList;
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