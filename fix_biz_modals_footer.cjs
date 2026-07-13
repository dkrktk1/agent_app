const fs = require('fs');
let code = fs.readFileSync('src/components/BizTab.tsx', 'utf8');

code = code.replace(
  /<div className="flex gap-2">/g,
  '<div className="flex gap-3">'
);

code = code.replace(
  /className="flex-1 bg-red-500\/20 text-red-400 font-bold py-3 rounded-lg hover:bg-red-500\/30 transition-colors"/g,
  'className="flex-1 bg-red-500/20 text-red-400 text-sm font-bold py-3 rounded-xl hover:bg-red-500/30 transition-colors"'
);

code = code.replace(
  /className="flex-1 bg-\[var\(--primary-color\)\] text-\[var\(--bg-color\)\] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"/g,
  'className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] text-sm font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"'
);

fs.writeFileSync('src/components/BizTab.tsx', code);
