const fs = require('fs');

const fixFile = (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(/<div className="flex flex-col gap-4">(\s*<TimeSelect value=\{sleepStart\})/g, '<div className="flex flex-col gap-4 pl-2 border-l-2 border-[rgba(255,255,255,0.1)] ml-2 mt-2">$1');
  fs.writeFileSync(filepath, content);
};

fixFile('src/components/CareTab.tsx');
fixFile('src/components/ScheduleTab.tsx');
