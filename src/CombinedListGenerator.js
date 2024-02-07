// CombinedListGenerator.js
const generateCombinedList = (list2, list3, defaultValue, names) => {
    const maxUniqueNumber = Math.min(list3.length - 1, list2.length); // Maximum unique number is the length of list3 - 1 or the length of list2, whichever is smaller
  
    // Shuffle the list2 array to ensure each item is used only once
    const shuffledList2 = shuffleArray(list2);
  
    let combinedList = [];
    let value = 1;
  
    // Create a set of names that correspond to "tom stol"
    const tomStolNames = new Set(names.filter(name => name === "tom stol"));
  
    // Iterate over list3 and use each item from list2 sequentially until list3 is exhausted
    for (let i = 0; i < list3.length; i++) {
      const key = shuffledList2[i % shuffledList2.length]; // Take items from list2 sequentially
  
      // Assign value only if it doesn't lead to "tom stol" in the names list
      if (!tomStolNames.has(value)) {
        combinedList.push({ key, value });
      }
  
      value++;
  
      // Reset value to 1 if it exceeds the maximum unique number
      if (value > maxUniqueNumber) {
        value = 1;
      }
    }
  
    // Assign remaining items in list2 the default value
    for (let i = list3.length; i < list2.length; i++) {
      const key = shuffledList2[i];
      const itemValue = tomStolNames.has(defaultValue) ? 0 : defaultValue;
      combinedList.push({ key, value: itemValue });
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
  