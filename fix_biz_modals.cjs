const fs = require('fs');
let code = fs.readFileSync('src/components/BizTab.tsx', 'utf8');

// Replace Inventory modal
code = code.replace(
  '<div className="modal-overlay z-[2000]" onClick={() => setIsInventoryModalOpen(false)}>',
  '<div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsInventoryModalOpen(false)}>'
);
code = code.replace(
  '<div className="modal-content !max-w-md" onClick={e => e.stopPropagation()}>',
  '<div className="bg-[var(--card-bg)] w-full max-w-md rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] flex flex-col p-6" onClick={e => e.stopPropagation()}>'
);

// Replace Sponsorship modal
code = code.replace(
  '<div className="modal-overlay z-[2000]" onClick={() => setIsSponsorshipModalOpen(false)}>',
  '<div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setIsSponsorshipModalOpen(false)}>'
);
code = code.replace(
  '<div className="modal-content !max-w-md" onClick={e => e.stopPropagation()}>',
  '<div className="bg-[var(--card-bg)] w-full max-w-md rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] flex flex-col p-6" onClick={e => e.stopPropagation()}>'
);

// We should also replace the modal headers/body/footers with Tailwind since we are not using standard CSS
code = code.replace(
  /<div className="modal-header">/g,
  '<div className="flex justify-between items-center mb-6">'
);
code = code.replace(
  /<h2>/g,
  '<h2 className="text-xl font-bold text-white m-0">'
);
code = code.replace(
  /<button className="icon-btn"/g,
  '<button className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]"'
);

code = code.replace(
  /<div className="modal-body flex flex-col gap-4">/g,
  '<div className="flex flex-col gap-4 mb-6">'
);

code = code.replace(
  /<div className="form-group">/g,
  '<div className="flex flex-col gap-1.5">'
);
code = code.replace(
  /<label>/g,
  '<label className="text-sm font-medium text-gray-400">'
);
code = code.replace(
  /className="form-control"/g,
  'className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--primary-color)] transition-colors"'
);

code = code.replace(
  /<div className="modal-footer flex gap-2">/g,
  '<div className="flex gap-2">'
);
code = code.replace(
  /className="btn-primary flex-1 py-3"/g,
  'className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"'
);
code = code.replace(
  /className="btn-danger flex-1 py-3"/g,
  'className="flex-1 bg-red-500/20 text-red-400 font-bold py-3 rounded-lg hover:bg-red-500/30 transition-colors"'
);

fs.writeFileSync('src/components/BizTab.tsx', code);
