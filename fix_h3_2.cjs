const fs = require('fs');
let code = fs.readFileSync('src/components/BizTab.tsx', 'utf8');

code = code.replace(
  /<h3 className="text-lg font-bold text-white mb-0">₩\{player.contracts.proposalVal.toLocaleString\(\)\}<\/h2>/g,
  '<h2>₩{player.contracts.proposalVal.toLocaleString()}</h2>'
);

fs.writeFileSync('src/components/BizTab.tsx', code);
