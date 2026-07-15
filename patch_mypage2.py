import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker2 = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">포지션</label>
                    <select value={editPosition} onChange={e => setEditPosition(e.target.value)} required>"""

replacement2 = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">포지션</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editPosition} onChange={e => setEditPosition(e.target.value)} required>"""

marker3 = """                  <div className="input-group !mb-0">
                    <span className="material-icons-round">tag</span>
                    <input type="text" placeholder="등번호 (예: 11)" value={editNumber} onChange={e => setEditNumber(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">투타</label>
                    <select value={editHandedness} onChange={e => setEditHandedness(e.target.value)} required>"""

replacement3 = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">등번호</label>
                    <input type="text" placeholder="등번호 (예: 11)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editNumber} onChange={e => setEditNumber(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">투타</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editHandedness} onChange={e => setEditHandedness(e.target.value)} required>"""

marker4 = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">생년월일</label>
                    <input type="date" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">payments</span>
                    <input type="number" placeholder="연봉 (단위: 원)" value={editSalary} onChange={e => setEditSalary(e.target.value)} />
                  </div>
                  
                </div>
                <div className="px-6 pb-6 mt-[12px] shrink-0">
                  <div className="flex gap-2 w-full">
                    {isAgent && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1 h-[30px] flex items-center justify-center text-[14px]" onClick={handleSaveProfile}>저장하기</button>
                  </div>"""

replacement4 = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">생년월일</label>
                    <input type="date" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="number" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => setEditSalary(e.target.value)} />
                  </div>
                  
                </div>
                <div className="px-6 pb-6 mt-[24px] shrink-0">
                  <div className="flex gap-2 w-full">
                    {isAgent && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1 h-[30px] flex items-center justify-center text-[14px]" onClick={handleSaveProfile}>저장하기</button>
                  </div>"""

content = content.replace(marker2, replacement2)
content = content.replace(marker3, replacement3)
content = content.replace(marker4, replacement4)

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
