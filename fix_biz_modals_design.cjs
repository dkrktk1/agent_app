const fs = require('fs');
let code = fs.readFileSync('src/components/BizTab.tsx', 'utf8');

code = code.replace(
  /<div className="fixed inset-0 z-\[2000\] flex items-center justify-center p-4 bg-black\/60 backdrop-blur-sm" onClick=\{\(\) => setIsInventoryModalOpen\(false\)\}>/g,
  '<div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center" onClick={() => setIsInventoryModalOpen(false)}>'
);

code = code.replace(
  /<div className="bg-\[var\(--card-bg\)\] w-full max-w-md rounded-\[24px\] shadow-\[0_8px_32px_rgba\(0,0,0,0\.25\)\] border border-\[var\(--card-border\)\] flex flex-col p-6" onClick=\{e => e\.stopPropagation\(\)\}>/g,
  '<div className="card-chart bg-[var(--card-bg)] w-full max-w-md rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6" onClick={e => e.stopPropagation()}>'
);

code = code.replace(
  /<div className="fixed inset-0 z-\[2000\] flex items-center justify-center p-4 bg-black\/60 backdrop-blur-sm" onClick=\{\(\) => setIsSponsorshipModalOpen\(false\)\}>/g,
  '<div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center" onClick={() => setIsSponsorshipModalOpen(false)}>'
);

code = code.replace(
  /<h2 className="text-xl font-bold text-white m-0">/g,
  '<h3 className="text-lg font-bold text-white mb-0">'
);

fs.writeFileSync('src/components/BizTab.tsx', code);
