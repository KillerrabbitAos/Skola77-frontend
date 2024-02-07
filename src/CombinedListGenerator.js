const generateCombinedList = (list2, list3, defaultValue) => {
    const maxUniqueNumber = list3.length - 1; // Maximum unique number is the length of list3 - 1
  
    // Shuffle the list2 array to ensure each item is used only once
    const shuffledList2 = shuffleArray(list2);
  
    let combinedList = [];
    let value = 1;
  
    // Iterate over list3 and use each item from list2 sequentially until list3 is exhausted
    for (let i = 0; i < list3.length; i++) {
      const key = shuffledList2[i % shuffledList2.length]; // Take items from list2 sequentially
      combinedList.push({ key, value });
      value++;
  
      // Reset value to 1 if it exceeds the maximum unique number
      if (value > maxUniqueNumber) {
        value = 1;
      }
    }
  
    // Assign remaining items in list2 the default value
    for (let i = list3.length; i < list2.length; i++) {
      combinedList.push({ key: shuffledList2[i], value: defaultValue });
    }
  
    return combinedList;
  }
  
  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  export default generateCombinedList;
  
  