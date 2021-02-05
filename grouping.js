const { HOUR, DAY, WEEK, MONTH, QUARTER, YEAR } = require("./constants");
const { timeData } = require("./data");
const { getIndex } = require("./helpers");

const GROUPS = [HOUR, DAY, WEEK, MONTH, QUARTER];

const GROUPINFO = GROUPS.reduce((a, group) => {
  let startTimestamp = group * (parseInt(timeData[0] / group, 10) + 1); // plus 1 for start of next
  let endTimestamp =
    group * parseInt(timeData[timeData.length - 1] / group, 10);

  if (group === WEEK) {
    // adjust so weeks start on monday
    startTimestamp =
      group * (parseInt((timeData[0] - 3 * DAY) / group, 10) + 1) + 4 * DAY;
    endTimestamp =
      group * parseInt((timeData[timeData.length - 1] - 3 * DAY) / group, 10) +
      4 * DAY;
  }

  const totalGroups = (endTimestamp - startTimestamp) / group;

  const startIndex = getIndex(timeData, time => time >= startTimestamp);
  const endIndex = getIndex(timeData, time => time > endTimestamp, startIndex);

  return {
    ...a,
    [group]: {
      startTimestamp,
      endTimestamp,
      totalGroups,
      startIndex,
      endIndex
    }
  };
}, {});

const getGroupTimestamp = (i, group) => {
  const { startTimestamp } = GROUPINFO[group];
  return startTimestamp + group * i;
};

const groupData = {};
const getGroupData = (i, group) => {
  if (groupData[group] === undefined) {
    groupData[group] = {};
  }

  if (groupData[group][i] !== undefined) {
    return groupData[group][i];
  }

  let firstSlice = 0;
  if (groupData[group][i - 1] !== undefined) {
    firstSlice = groupData[group][i - 1].endIndex;
  }

  const startTimestamp = getGroupTimestamp(i, group);
  const endTimestamp = getGroupTimestamp(i + 1, group);

  const startIndex = getIndex(
    timeData,
    time => time >= startTimestamp,
    firstSlice
  );
  const endIndex = getIndex(timeData, time => time > endTimestamp, startIndex);

  groupData[group][i] = {
    startTimestamp,
    endTimestamp,
    startIndex,
    endIndex
  };

  return groupData[group][i];
};

const processGroupData = group => {
  const { totalGroups } = GROUPINFO[group];

  return processor => {
    const data = [];
    for (var i = 0; i < totalGroups; i++) {
      const { startIndex, endIndex } = getGroupData(i, group);
      data.push(processor({ startIndex, endIndex, totalGroups, group }, i));
    }
    return data;
  };
};

module.exports = { GROUPS, GROUPINFO, processGroupData };
