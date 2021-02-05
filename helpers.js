const { supplyCache } = require("./data");

const getIndex = (arr, testFn, start = 0) => {
  for (var i = start; i < arr.length; i++) {
    if (testFn(arr[i])) {
      return i;
    }
  }
};

const getMinedCoinsCount = (from, to) => {
  return supplyCache[to] - supplyCache[from];
};

module.exports = { getIndex, getMinedCoinsCount };
