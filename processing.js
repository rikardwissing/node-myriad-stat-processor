const { ALGOS } = require("./chain");
const { YEAR } = require("./constants");
const { getMinedCoinsCount } = require("./helpers");
const { algoData, transactionData, algoDifficulties } = require("./data");

const transactionProcessor = ({ startIndex, endIndex }) => {
  const txWindow = transactionData.slice(startIndex, endIndex);
  return txWindow.reduce((a, c) => a + c, 0);
};

const blocksProcessor = ({ startIndex, endIndex }) => endIndex - startIndex;

const algoBlocksProcessor = ({ startIndex, endIndex }) => {
  const algoWindow = algoData.slice(startIndex, endIndex);
  return ALGOS.map((_, i) => algoWindow.filter(a => a === i).length);
};

const minedCoinsProcessor = ({ startIndex, endIndex }) =>
  getMinedCoinsCount(startIndex, endIndex);

const outstandingProcessor = ({ endIndex }, i) =>
  getMinedCoinsCount(0, endIndex);

const difficultyProcessor = ({ startIndex, endIndex }) =>
  algoDifficulties.map(
    difficulties =>
      difficulties.slice(startIndex, endIndex).reduce((a, c) => a + c, 0) /
      difficulties.length
  );

const inflationProcessor = ({ startIndex, endIndex, group }, i) => {
  const circulatingBefore = getMinedCoinsCount(0, startIndex);
  const minedCoins = getMinedCoinsCount(startIndex, endIndex);
  return (minedCoins * (YEAR / group)) / circulatingBefore;
};

module.exports = {
  transactionProcessor,
  blocksProcessor,
  algoBlocksProcessor,
  minedCoinsProcessor,
  outstandingProcessor,
  inflationProcessor,
  difficultyProcessor
};
