import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """      {isDailyLogOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header"><h4>지표 입력</h4><span className="material-icons-round close-btn" onClick={() => setIsDailyLogOpen(false)}>close</span></div>
            <div className="modal-body flex flex-col gap-6">"""

new_code = """      {isDailyLogOpen && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">지표 입력</h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setIsDailyLogOpen(false)}>close</span>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-6">"""

content = content.replace(old_code, new_code)

old_code_footer = """            <button 
              onClick={handleSaveLog}
              className="mt-6 py-4 rounded-xl text-base font-bold transition-all btn-primary"
            >
              저장
            </button>
          </div>
        </div>
      )}"""

new_code_footer = """            </div>
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">
              <button 
                onClick={handleSaveLog}
                className="w-full py-4 rounded-xl text-base font-bold transition-all btn-primary"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}"""

content = content.replace(old_code_footer, new_code_footer)

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
