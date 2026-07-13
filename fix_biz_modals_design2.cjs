const fs = require('fs');
let code = fs.readFileSync('src/components/BizTab.tsx', 'utf8');

code = code.replace(
  /<div className="flex flex-col gap-1\.5">/g,
  '<div>'
);
code = code.replace(
  /<label className="text-sm font-medium text-gray-400">/g,
  '<label className="text-sm font-bold text-white mb-3 block">'
);
code = code.replace(
  /className="w-full bg-\[rgba\(255,255,255,0\.05\)\] border border-\[rgba\(255,255,255,0\.1\)\] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-\[var\(--primary-color\)\] transition-colors"/g,
  'className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors"'
);

fs.writeFileSync('src/components/BizTab.tsx', code);
