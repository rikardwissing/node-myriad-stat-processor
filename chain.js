const EMISSION_SCHEDULE = [
  [967680, 1000],
  [1935360, 500],
  [3749760, 250],
  [[3749760 + 120960 * 1], 250 / 2],
  [[3749760 + 120960 * 2], 250 / 2 / 2],
  [[3749760 + 120960 * 3], 250 / 2 / 2 / 2],
  [[3749760 + 120960 * 4], 250 / 2 / 2 / 2 / 2],
  [[3749760 + 120960 * 5], 250 / 2 / 2 / 2 / 2 / 2],
  [[3749760 + 120960 * 6], 250 / 2 / 2 / 2 / 2 / 2 / 2]
];

const ALGOS = [
  "sha256",
  "scrypt",
  "groestl",
  "skein",
  "qubit",
  "yescrypt",
  "argon2d"
];

const ALGO_START_BLOCKS = [0, 0, 0, 0, 0, 1764003, 2772001];
const ALGO_END_BLOCKS = [
  999999999,
  999999999,
  999999999,
  2771995,
  1763997,
  999999999,
  999999999
];

module.exports = {
  EMISSION_SCHEDULE,
  ALGOS,
  ALGO_START_BLOCKS,
  ALGO_END_BLOCKS
};
