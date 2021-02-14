const { ALGOS, ALGO_START_BLOCKS, ALGO_END_BLOCKS } = require("./chain");
const { YEAR } = require("./constants");
const { getMinedCoinsCount } = require("./helpers");
const {
  timeData,
  algoData,
  transactionData,
  algoDifficulties,
  difficultyData,
  prevBlockSameAlgo,
  nextBlockSameAlgo
} = require("./data");

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
      (endIndex - startIndex)
  );

const inflationProcessor = ({ startIndex, endIndex, group }, i) => {
  const circulatingBefore = getMinedCoinsCount(0, startIndex);
  const minedCoins = getMinedCoinsCount(startIndex, endIndex);
  return (minedCoins * (YEAR / group)) / circulatingBefore;
};

const workSecondsProcessor = (
  { startIndex, endIndex, group, startTimestamp, endTimestamp },
  i
) => {
  return ALGOS.map((_, algoI) => {
    let summedDifficulty = 0;
    let firstFound = false;

    for (var i = startIndex; i < endIndex; i++) {
      if (algoI === algoData[i]) {
        if (firstFound) {
          // skip first one since we take that into account in the next loop
          summedDifficulty += difficultyData[i];
        }

        firstFound = true;
      }
    }

    if (
      ALGO_START_BLOCKS[algoI] < startIndex &&
      ALGO_END_BLOCKS[algoI] > startIndex
    ) {
      for (var i = startIndex - 1; i > 0; i--) {
        if (algoI === algoData[i]) {
          const periodDuration = endTimestamp - startTimestamp;
          let timeToMine = endTimestamp - timeData[i];
          let timeSpentInPeriod = periodDuration;

          if (nextBlockSameAlgo[i] !== -1) {
            const nextTimestamp = timeData[nextBlockSameAlgo[i]];
            timeToMine = nextTimestamp - timeData[i];
            timeSpentInPeriod = nextTimestamp - startTimestamp;
            if (periodDuration < timeSpentInPeriod) {
              timeSpentInPeriod = periodDuration; // cannot spend more time in period than possible
            }
          } else {
            // if next not found it means that zero work might be done
            break;
          }

          const timeShare = timeSpentInPeriod / timeToMine;
          summedDifficulty += difficultyData[i] * timeShare;
          break;
        }
      }
    }

    if (
      ALGO_START_BLOCKS[algoI] < endIndex &&
      ALGO_END_BLOCKS[algoI] > endIndex
    ) {
      for (var i = endIndex; i < algoData.length; i++) {
        if (algoI === algoData[i]) {
          const periodDuration = endTimestamp - startTimestamp;

          let timeToMine = timeData[i] - startTimestamp;
          let timeSpentInPeriod = periodDuration;

          if (prevBlockSameAlgo[i] !== -1) {
            const prevTimestamp = timeData[prevBlockSameAlgo[i]];
            timeToMine = timeData[i] - prevTimestamp;
            timeSpentInPeriod = endTimestamp - prevTimestamp;
            if (periodDuration < timeSpentInPeriod) {
              timeSpentInPeriod = periodDuration; // cannot spend more time in period than possible
            }
          }

          const timeShare = timeSpentInPeriod / timeToMine;
          summedDifficulty += difficultyData[i] * timeShare;
          break;
        }
      }
    }

    return summedDifficulty / group;
  });
};

module.exports = {
  transactionProcessor,
  blocksProcessor,
  algoBlocksProcessor,
  minedCoinsProcessor,
  outstandingProcessor,
  inflationProcessor,
  difficultyProcessor,
  workSecondsProcessor
};
