const {
  EMISSION_SCHEDULE,
  ALGOS,
  ALGO_START_BLOCKS,
  ALGO_END_BLOCKS
} = require("./chain");
const { IMPORT_DIR } = require("./constants");

const lastPage = require(`${IMPORT_DIR}/last_page.json`);
const blockCount = require(`${IMPORT_DIR}/block_count.json`);

const difficultyData = [];
const timeData = [];
const algoData = [];
const transactionData = [];

for (var i = 1; i <= lastPage; i++) {
  difficultyData.push(...require(`${IMPORT_DIR}/${i}/difficulty.json`));
  timeData.push(...require(`${IMPORT_DIR}/${i}/mediantime.json`));
  algoData.push(...require(`${IMPORT_DIR}/${i}/pow_algo_id.json`));
  transactionData.push(...require(`${IMPORT_DIR}/${i}/tx.json`));
}

const supplyCache = [];
let minedCoins = 0;
for (var block = 0; block <= blockCount; block++) {
  const [_, emission] = EMISSION_SCHEDULE.find(([fb]) => block < fb);
  supplyCache.push(minedCoins);
  minedCoins += emission;
}
supplyCache.push(minedCoins);

const algoDifficulties = ALGOS.map((_, algoI) => {
  let lastDifficulty = 0;
  return difficultyData.map((d, i) => {
    if (algoData[i] === algoI) {
      lastDifficulty = d;
    }

    if (ALGO_END_BLOCKS[algoI] && i > ALGO_END_BLOCKS[algoI]) {
      lastDifficulty = 0;
    }

    return lastDifficulty;
  });
});

const prevArr = ALGOS.map(() => -1);
const prevBlockSameAlgo = algoData.map((d, i) => {
  const prev = prevArr[d];
  prevArr[d] = i;

  return prev;
});

const nextArr = ALGOS.map(() => -1);
const nextBlockSameAlgo = [...algoData]
  .reverse()
  .map((d, i) => {
    const next = nextArr[d];
    nextArr[d] = algoData.length - i - 1;

    return next;
  })
  .reverse();

module.exports = {
  lastPage,
  blockCount,
  difficultyData,
  timeData,
  algoData,
  transactionData,
  supplyCache,
  algoDifficulties,
  prevBlockSameAlgo,
  nextBlockSameAlgo
};
