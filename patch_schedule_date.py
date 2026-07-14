import re
with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("""              <div className="input-group">
                <span className="material-icons-round">calendar_today</span>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} max="9999-12-31" required />
              </div>""", """              <div className="input-group-select">
                <label>일정 날짜</label>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} max="9999-12-31" required />
              </div>""")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched ScheduleTab")
