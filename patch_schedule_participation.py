import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                  <div className="flex flex-col gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl">
                    <label className="text-sm font-bold text-white flex items-center justify-between">
                      출전 여부
                      <input 
                        type="checkbox" 
                        checked={newEventParticipating} 
                        onChange={(e) => setNewEventParticipating(e.target.checked)}
                        className="w-4 h-4 accent-[var(--primary-color)]"
                      />
                    </label>
                    
                    {newEventParticipating && ("""

new_code = """                  <div className="flex flex-col gap-3">
                    <div className="input-group-select !mb-0">
                      <label>출전 여부</label>
                      <select value={newEventParticipating ? 'yes' : 'no'} onChange={(e) => setNewEventParticipating(e.target.value === 'yes')}>
                        <option value="yes">출전</option>
                        <option value="no">결장</option>
                      </select>
                    </div>
                    
                    {newEventParticipating && ("""

content = content.replace(old_code, new_code)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
