import re
with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("""              <div>
                <label className="text-sm font-bold text-white mb-3 block">날짜</label>
                <div className="input-group !mb-0">
                  <span className="material-icons-round">calendar_today</span>
                  <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} max="9999-12-31" />
                </div>
              </div>""", """              <div className="input-group-select">
                <label>날짜</label>
                <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} max="9999-12-31" />
              </div>""")

content = content.replace("""              <div>
                <label className="text-sm font-bold text-white mb-3 block">날짜</label>
                <div className="input-group !mb-0">
                  <span className="material-icons-round">calendar_today</span>
                  <input type="date" value={sponsDate} onChange={e => setSponsDate(e.target.value)} max="9999-12-31" />
                </div>
              </div>""", """              <div className="input-group-select">
                <label>날짜</label>
                <input type="date" value={sponsDate} onChange={e => setSponsDate(e.target.value)} max="9999-12-31" />
              </div>""")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched BizTab")
