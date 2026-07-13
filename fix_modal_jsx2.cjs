const fs = require('fs');
let code = fs.readFileSync('src/components/MedicalTab.tsx', 'utf8');

const modalJsx = `
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#2a2a2a] rounded-2xl p-6 max-w-sm w-full border border-[rgba(255,255,255,0.1)] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">항목 삭제</h3>
            <p className="text-gray-400 text-sm mb-6">정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: false, id: null, type: null })} 
                className="flex-1 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white rounded-xl text-sm font-bold transition-colors border border-[rgba(255,255,255,0.1)]"
              >
                취소
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-bold transition-colors border border-red-500/20"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(/    <\/div>\n  \);\n\}\n?$/, modalJsx + '\n    </div>\n  );\n}\n');
fs.writeFileSync('src/components/MedicalTab.tsx', code);
