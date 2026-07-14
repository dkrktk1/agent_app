import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """      {isAddModalOpen && (
        <div className="modal active z-50">
          <div className="modal-content max-w-sm">
            <div className="modal-header">
              <h4>{editingEventOriginalIndex !== null ? '일정 수정' : '일정 추가'}</h4>
              <span className="material-icons-round close-btn" onClick={closeModal}>close</span>
            </div>
            <div className="modal-body flex flex-col gap-4">"""

new_code = """      {isAddModalOpen && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                {editingEventOriginalIndex !== null ? '일정 수정' : '일정 추가'}
              </h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={closeModal}>close</span>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-4">"""

content = content.replace(old_code, new_code)

old_code_footer = """                <button className="btn-primary w-full py-3 rounded-xl font-bold mt-2" onClick={handleAddEvent}>
                  {editingEventOriginalIndex !== null ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}"""

new_code_footer = """              </div>
            </div>
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">
              <button className="btn-primary w-full py-4 rounded-xl font-bold" onClick={handleAddEvent}>
                {editingEventOriginalIndex !== null ? '수정' : '추가'}
              </button>
            </div>
          </div>
        </div>
      )}"""

content = content.replace(old_code_footer, new_code_footer)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
