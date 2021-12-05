const match = (arr1, arr2) => {
  let first = arr1.slice(0);
  let second = arr2.slice(0);
  first.sort();
  second.sort();
  if (first.length !== second.length) return false;

  for (let i = 0; i < first.length; i++)
    if (first[i] !== second[i]) return false;
  return true;
};

export default match;
