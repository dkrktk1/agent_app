import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <span className="material-icons-round">calendar_today</span>
                    <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} onKeyDown={e => e.preventDefault()} onClick={e => { try { e.currentTarget.showPicker(); } catch (err) {} }} max="9999-12-31" required />
                  </div>"""

new_code = """                  <div className="input-group !mb-0">
                    <span className="material-icons-round">calendar_today</span>
                    <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>"""

content = content.replace(old_code, new_code)

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
