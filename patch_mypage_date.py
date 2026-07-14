import re
with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("""                  <div className="input-group !mb-0">
                    <span className="material-icons-round">calendar_today</span>
                    <input type="date" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>""", """                  <div className="input-group-select !mb-0">
                    <label>생년월일</label>
                    <input type="date" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>""")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched MyPageTab")
