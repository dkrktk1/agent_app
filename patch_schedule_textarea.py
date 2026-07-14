import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                  <div className="input-group" style={{ height: 'auto', alignItems: 'flex-start' }}>
                    <span className="material-icons-round" style={{ marginTop: '12px' }}>notes</span>
                    <textarea 
                      placeholder="세부내용" 
                      value={newEventDetails} 
                      onChange={e => setNewEventDetails(e.target.value)}
                      className="bg-transparent border-none text-white text-[15px] outline-none flex-1 py-3 min-h-[80px] resize-none"
                      style={{ paddingLeft: '8px' }}
                    />
                  </div>"""

new_code = """                  <div className="flex flex-col mb-4">
                    <textarea 
                      placeholder="세부내용" 
                      value={newEventDetails} 
                      onChange={e => setNewEventDetails(e.target.value)}
                      className="w-full bg-[rgba(0,0,0,0.25)] border border-[var(--card-border)] rounded-2xl p-4 text-white text-[14px] outline-none min-h-[100px] resize-none focus:border-[var(--primary-color)] transition-colors"
                    />
                  </div>"""

content = content.replace(old_code, new_code)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
