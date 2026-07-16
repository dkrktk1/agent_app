import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">생년월일</span>
                      <span className="font-semibold text-sm text-white">{editBirthdate || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">연봉</span>
                      <span className="font-semibold text-sm text-white">{formatKoreanCurrency(editSalary)}</span>
                    </div>"""

replacement1 = """                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">생년월일</span>
                      <span className="font-semibold text-sm text-white">{editBirthdate || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">입단 연도</span>
                      <span className="font-semibold text-sm text-white">{editJoinYear || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">연봉</span>
                      <span className="font-semibold text-sm text-white">{formatKoreanCurrency(editSalary)}</span>
                    </div>"""

if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced target1")
else:
    print("Could not find target1")

target2 = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">생년월일</label>
                    <input type="date" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="text" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditSalary(val === '' ? '' : Number(val).toLocaleString());
                    }} />
                  </div>"""

replacement2 = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">생년월일</label>
                    <input type="date" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">입단 연도</label>
                    <input type="date" placeholder="입단 연도 (예: 2024)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editJoinYear} onChange={e => setEditJoinYear(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="text" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditSalary(val === '' ? '' : Number(val).toLocaleString());
                    }} />
                  </div>"""

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced target2")
else:
    print("Could not find target2")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
