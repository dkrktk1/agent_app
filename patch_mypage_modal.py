import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code_start = """      {editingPlayerId && selectedPlayer && (
        <div className="modal active z-50">
          <div className="modal-content-wide max-w-sm overflow-hidden">
            {!isEditMode ? ("""

new_code_start = """      {editingPlayerId && selectedPlayer && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            {!isEditMode ? ("""

content = content.replace(old_code_start, new_code_start)

old_code_header_1 = """              <>
                <div className="modal-header shrink-0">
                  <h4 className="text-[14px]">선수 프로필</h4>
                  <div className="flex gap-2 items-center">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(true)} title="수정">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>edit</span>
                    </button>
                    <span className="material-icons-round close-btn" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); }}>close</span>
                  </div>
                </div>
                <div className="modal-body flex-1 min-h-0 flex flex-col items-center py-6 overflow-y-auto">"""

new_code_header_1 = """              <>
                <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
                  <h4 className="text-[14px] font-bold text-white flex items-center gap-2">선수 프로필</h4>
                  <div className="flex gap-2 items-center">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(true)} title="수정">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>edit</span>
                    </button>
                    <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); }}>close</span>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto flex flex-col items-center">"""

content = content.replace(old_code_header_1, new_code_header_1)

old_code_header_2 = """              <>
                <div className="modal-header shrink-0">
                  <div className="flex items-center gap-2">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(false)} title="뒤로가기">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_back</span>
                    </button>
                    <h4 className="text-[14px]">선수 프로필 수정</h4>
                  </div>
                  <span className="material-icons-round close-btn" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); setIsEditMode(false); }}>close</span>
                </div>
                <div className="modal-body flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pb-6 px-1">"""

new_code_header_2 = """              <>
                <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(false)} title="뒤로가기">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_back</span>
                    </button>
                    <h4 className="text-[14px] font-bold text-white flex items-center gap-2">선수 프로필 수정</h4>
                  </div>
                  <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); setIsEditMode(false); }}>close</span>
                </div>
                <div className="p-6 overflow-y-auto flex flex-col gap-3">"""

content = content.replace(old_code_header_2, new_code_header_2)

old_code_footer_2 = """                  <div className="flex flex-col gap-2 mt-2 shrink-0">
                    <div className="flex gap-2">
                      {isAgent && (
                        <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                      )}
                      <button className="btn-primary flex-1" onClick={handleSaveProfile}>저장하기</button>
                    </div>
                  </div>
                </div>
              </>"""

new_code_footer_2 = """                </div>
                <div className="p-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">
                  <div className="flex gap-2 w-full">
                    {isAgent && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1" onClick={handleSaveProfile}>저장하기</button>
                  </div>
                </div>
              </>"""

content = content.replace(old_code_footer_2, new_code_footer_2)

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
