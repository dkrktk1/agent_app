import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """                  <div className="input-group !mb-0">
                    <span className="material-icons-round">person</span>
                    <input type="text" placeholder="이름" value={editName} onChange={e => setEditName(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">소속 구단</label>
                    <select value={editTeam} onChange={e => setEditTeam(e.target.value)} required>"""

replacement = """                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">이름</label>
                    <input type="text" placeholder="이름" className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editName} onChange={e => setEditName(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">소속 구단</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[14px]" value={editTeam} onChange={e => setEditTeam(e.target.value)} required>"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker 1 not found")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
