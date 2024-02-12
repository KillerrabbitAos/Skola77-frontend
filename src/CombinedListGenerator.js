const generateCombinedList = (list2, list4, defaultValue, names) => {
  const maxUniqueNumber = Math.min(list4.length - 1, list2.length);

  const shuffledList2 = shuffleArray(list2);
  const list4DeepCopy = JSON.parse(JSON.stringify(list4));
  const list3 = shuffleArray(list4DeepCopy);

  let combinedList = [];
  let usedIndexes = new Set();

  // Iterate over list3 and use each item from list2 sequentially until list3 is exhausted
  let i = 0;
  for (; i < list3.length && combinedList.length < shuffledList2.length; i++) {
    const key = shuffledList2[combinedList.length]; // Use the next key from shuffledList2

    let randomIndex = Math.floor(Math.random() * names.length);
    while (usedIndexes.has(randomIndex)) {
      randomIndex = Math.floor(Math.random() * names.length);
    }
    usedIndexes.add(randomIndex);

    let value = randomIndex;

    if (names[value] !== "") {
      combinedList.push({ key, value });
    }

    if (value > maxUniqueNumber) {
      value = 1;
    }
    if (value > maxUniqueNumber) {
      value = 1;
    }
  }

  // If there are remaining items in list2, use them with default value
  for (; i < shuffledList2.length; i++) {
    const key = shuffledList2[i];
    const itemValue = names.includes("") ? 0 : defaultValue;
    combinedList.push({ key, value: itemValue });
  }

  return combinedList;
};

const shuffleArray = (array1) => {
  let array = array1.slice(); // Copying the array to avoid modifying the original
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default generateCombinedList;