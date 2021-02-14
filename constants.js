const HOUR = 60 * 60;
const QUARTER_DAY = HOUR * 6;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const QUARTER = MONTH * 3;
const YEAR = DAY * 365;

const GROUP_NAMES = {
  [HOUR]: "1h",
  [QUARTER_DAY]: "6h",
  [DAY]: "1d",
  [WEEK]: "1w",
  [MONTH]: "1m",
  [QUARTER]: "1q",
  [YEAR]: "1y"
};

const IMPORT_DIR = process.argv[2] || "./data";
const EXPORT_DIR = process.argv[3] || "./export";

module.exports = {
  HOUR,
  DAY,
  QUARTER_DAY,
  WEEK,
  MONTH,
  QUARTER,
  YEAR,
  GROUP_NAMES,
  IMPORT_DIR,
  EXPORT_DIR
};
