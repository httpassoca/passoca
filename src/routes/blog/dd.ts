export const reverseYears = (obj) => {
  // Convert the object entries to an array, sort them by the year in descending order
  const sortedArray = Object.entries(obj).sort((a, b) => Number(b[0]) - Number(a[0]));
  // Convert it back to an object if needed, or you can just return the sorted array
  const reversedObject = {};
  for (const [year, data] of sortedArray) {
    reversedObject[year] = data;
  }
  return reversedObject; // Or return sortedArray if you want an array instead
}
