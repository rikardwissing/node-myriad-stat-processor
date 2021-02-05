const fs = require("fs");

const { GROUP_NAMES, EXPORT_DIR } = require("./constants");
const { GROUPS } = require("./grouping");

const exportData = data => {
  data.forEach((groupData, i) => {
    const group = GROUPS[i];
    const groupName = GROUP_NAMES[group];

    Object.entries(groupData).forEach(([key, processedData]) => {
      console.log(`Saving to ${EXPORT_DIR}/${key}/${groupName}.json...`);
      fs.mkdirSync(`${EXPORT_DIR}/${key}`, { recursive: true });
      fs.writeFileSync(
        `${EXPORT_DIR}/${key}/${groupName}.json`,
        JSON.stringify(processedData)
      );
    });
  });
};

module.exports = { exportData };
