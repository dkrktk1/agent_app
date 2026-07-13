const fs = require('fs');

const fixFile = (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(/훈련 후 인지된 노력\(1~10\)/g, '인지된 훈련 강도(힘듦)');
  fs.writeFileSync(filepath, content);
};

fixFile('src/components/CareTab.tsx');
fixFile('src/components/ScheduleTab.tsx');
