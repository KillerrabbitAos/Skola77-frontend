const generateCombinedList = (list2, list4, defaultValue, names) => {
  const maxUniqueNumber = Math.min(list4.length - 1, list2.length); 

  const shuffledList2 = shuffleArray(list2);
  const list4DeepCopy = JSON.parse(JSON.stringify(list4));
  const list3 = shuffleArray(list4DeepCopy);

  let combinedList = [];
  let value = 1;
  const tomStolNames = new Set(names.filter(name => name === "tom stol"));
  var usedIndexes = [];

  // Iterate over list3 and use each item from list2 sequentially until list3 is exhausted
  for (let i = 0; i < list3.length && i < shuffledList2.length; i++) {
      const key = shuffledList2[i];
      let randomIndex = Math.floor(Math.random() * names.length);
      while (usedIndexes.includes(randomIndex)){
          randomIndex = Math.floor(Math.random() * names.length);
      }
      usedIndexes.push(randomIndex);
      value = randomIndex;

      if (names[value] !== "tom stol") {
          combinedList.push({ key, value });
      }

      if (value > maxUniqueNumber) {
          value = 1;
      }
  }

  // Assign remaining items in list2 the default value
  for (let i = combinedList.length; i < list2.length; i++) {
      const key = shuffledList2[i];
      const itemValue = tomStolNames.has(defaultValue) ? 0 : defaultValue;
      combinedList.push({ key, value: itemValue });
  }

  return combinedList;
}

const shuffleArray = (array1) => {
  let array = array1.slice(); // Copying the array to avoid modifying the original
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default generateCombinedList;
