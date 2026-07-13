const fs = require('fs');
let code = fs.readFileSync('src/components/BizTab.tsx', 'utf8');

code = code.replace(
  /<h3 className="text-lg font-bold text-white mb-0">\{editingInventoryIndex !== null \? '지원 용품 수정' : '지원 용품 추가'\}<\/h2>/g,
  '<h3 className="text-lg font-bold text-white mb-0">{editingInventoryIndex !== null ? \'지원 용품 수정\' : \'지원 용품 추가\'}</h3>'
);

code = code.replace(
  /<h3 className="text-lg font-bold text-white mb-0">\{editingSponsorshipIndex !== null \? '스폰서쉽 수정' : '스폰서쉽 추가'\}<\/h2>/g,
  '<h3 className="text-lg font-bold text-white mb-0">{editingSponsorshipIndex !== null ? \'스폰서쉽 수정\' : \'스폰서쉽 추가\'}</h3>'
);

fs.writeFileSync('src/components/BizTab.tsx', code);
