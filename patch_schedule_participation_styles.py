import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                    <div className="input-group-select !mb-0">
                      <label>출전 여부</label>
                      <div className="flex gap-2">
                        <button 
                          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors border ${!newEventParticipating ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipating(false)}
                        >
                          결장
                        </button>
                        <button 
                          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors border ${newEventParticipating ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipating(true)}
                        >
                          출전
                        </button>
                      </div>
                    </div>
                    
                    {newEventParticipating && (
                      <div className="flex gap-2">
                        <button 
                          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors border ${newEventParticipationType === '선발' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipationType('선발')}
                        >
                          선발
                        </button>
                        <button 
                          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors border ${newEventParticipationType === '교체' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipationType('교체')}
                        >
                          교체
                        </button>
                      </div>
                    )}"""

new_code = """                    <div className="input-group-select !mb-0">
                      <label>출전 여부</label>
                      <div className="flex gap-2 mt-[10px]">
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${!newEventParticipating ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipating(false)}
                        >
                          결장
                        </button>
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventParticipating ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipating(true)}
                        >
                          출전
                        </button>
                      </div>
                    </div>
                    
                    {newEventParticipating && (
                      <div className="flex gap-2 mt-[10px]">
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventParticipationType === '선발' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipationType('선발')}
                        >
                          선발
                        </button>
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventParticipationType === '교체' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipationType('교체')}
                        >
                          교체
                        </button>
                      </div>
                    )}"""

content = content.replace(old_code, new_code)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
