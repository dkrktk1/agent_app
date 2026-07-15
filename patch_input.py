import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="number" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => setEditSalary(e.target.value)} />
                  </div>"""

replacement = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">연봉</label>
                    <input type="text" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editSalary} onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditSalary(val === '' ? '' : Number(val).toLocaleString());
                    }} />
                  </div>"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("marker not found")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
