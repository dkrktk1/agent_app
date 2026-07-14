import re
with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', marginLeft: '4px' }}>생년월일</label>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">calendar_today</span>
                    <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                </div>"""

new_code = """                <div className="input-group-select">
                  <label>생년월일</label>
                  <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required />
                </div>"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched AuthScreen")
else:
    print("Could not find AuthScreen old code")

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
