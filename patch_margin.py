import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="number" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => setEditSalary(e.target.value)} />
                  </div>
                  
                </div>
                <div className="px-6 pb-6 mt-[12px] shrink-0">
                  <div className="flex gap-2 w-full">
                    {isAgent && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1 h-[30px] flex items-center justify-center text-[14px]" onClick={handleSaveProfile}>저장하기</button>
                  </div>
                </div>"""

replacement = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="number" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => setEditSalary(e.target.value)} />
                  </div>
                  
                  <div className="flex gap-2 w-full mt-[12px] shrink-0">
                    {isAgent && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1 h-[30px] flex items-center justify-center text-[14px]" onClick={handleSaveProfile}>저장하기</button>
                  </div>
                </div>"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
