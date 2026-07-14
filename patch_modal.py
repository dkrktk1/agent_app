import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = r"""      \{deleteConfirmModal.isOpen && \(
        <div className="fixed inset-0 z-\[1200\] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-\[#2a2a2a\] rounded-2xl p-6 max-w-sm w-full border border-\[rgba\(255,255,255,0\.1\)\] shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">항목 삭제</h3>
            <p className="text-gray-400 text-sm mb-6">정말 삭제하시겠습니까\? 이 작업은 되돌릴 수 없습니다\.</p>
            <div className="flex gap-3">
              <button 
                onClick=\{\(\) => setDeleteConfirmModal\(\{ isOpen: false, id: null, type: null \}\)\} 
                className="flex-1 py-3 bg-\[rgba\(255,255,255,0\.05\)\] hover:bg-\[rgba\(255,255,255,0\.1\)\] text-white rounded-xl text-sm font-bold transition-colors border border-\[rgba\(255,255,255,0\.1\)\]"
              >
                취소
              </button>
              <button 
                onClick=\{confirmDelete\} 
                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-bold transition-colors border border-red-500/20"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      \)}"""

new_code = """      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-2 text-center">항목 삭제</h3>
            <p className="text-gray-400 text-sm text-center mb-6">정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: false, id: null, type: null })} 
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                취소
              </button>
              <button 
                onClick={confirmDelete} 
                className="flex-1 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-colors border border-red-500/20"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}"""

content = re.sub(old_code, new_code, content)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
