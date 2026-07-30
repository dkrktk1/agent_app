import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace logRpe and logDuration with trainingSessions
content = content.replace("const [logRpe, setLogRpe] = useState<number | ''>(7);", """const [trainingSessions, setTrainingSessions] = useState<any[]>([
    { id: 'match', name: '경기 시간', duration: '', rpe: '', isFixed: true },
    { id: 'weight', name: '웨이트 트레이닝 시간', duration: '', rpe: '', isFixed: true },
    { id: 'skill', name: '기술 훈련 시간', duration: '', rpe: '', isFixed: true }
  ]);""")
content = content.replace("const [logDuration, setLogDuration] = useState<number | ''>('');", "")

calc_replace = """       const gl = Number(newEventGripLeft) || 0;
       const gr = Number(newEventGripRight) || 0;
       const overallGrip = (gl + gr) / 2;

       const dev = ((overallGrip - 50) / 50 * 100).toFixed(1);
       
       let totalDuration = 0;
       let totalLoad = 0;
       trainingSessions.forEach(session => {
         const d = Number(session.duration) || 0;
         const r = Number(session.rpe) || 0;
         if (d > 0 && r > 0) {
           totalDuration += d;
           totalLoad += (d * r);
         }
       });
       
       const logDurationNum = totalDuration;
       const logRpe = totalDuration > 0 ? (totalLoad / totalDuration) : 0;
       const curAcute = logRpe * logDurationNum;"""

target_calc = """       const gl = Number(newEventGripLeft) || 0;
       const gr = Number(newEventGripRight) || 0;
       const overallGrip = (gl + gr) / 2;

       const dev = ((overallGrip - 50) / 50 * 100).toFixed(1);
       const logDurationNum = Number(logDuration) || 0;
       const curAcute = (Number(logRpe) || 0) * logDurationNum;"""

content = content.replace(target_calc, calc_replace)

target_push = """newEvent.rpe = Number(logRpe) || 0;
      newEvent.duration = Number(logDuration) || 0;"""

replace_push = """newEvent.rpe = logRpe;
      newEvent.duration = logDurationNum;
      newEvent.sessions = trainingSessions;"""

content = content.replace(target_push, replace_push)

# Fix edit initialization
target_edit = """        setLogRpe(event.rpe || 7);
        setLogDuration(event.duration || '');"""

replace_edit = """        if (event.sessions && Array.isArray(event.sessions)) {
          setTrainingSessions(event.sessions);
        } else {
          const d = event.duration || '';
          const r = event.rpe || '';
          if (d || r) {
             setTrainingSessions([
               { id: 'match', name: '경기 시간', duration: '', rpe: '', isFixed: true },
               { id: 'weight', name: '웨이트 트레이닝 시간', duration: '', rpe: '', isFixed: true },
               { id: 'skill', name: '기술 훈련 시간', duration: '', rpe: '', isFixed: true },
               { id: 'legacy', name: '기존 기록', duration: d, rpe: r, isFixed: false }
             ]);
          } else {
             setTrainingSessions([
               { id: 'match', name: '경기 시간', duration: '', rpe: '', isFixed: true },
               { id: 'weight', name: '웨이트 트레이닝 시간', duration: '', rpe: '', isFixed: true },
               { id: 'skill', name: '기술 훈련 시간', duration: '', rpe: '', isFixed: true }
             ]);
          }
        }"""

content = content.replace(target_edit, replace_edit)


ui_target_start = '<div>\n                    <div className="flex justify-between items-end">\n                      <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">일일 훈련 부하(ACWR 계산용)</label>'
ui_target_end = 'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none transition-colors" />\n                  </div>'

start_idx = content.find(ui_target_start)
end_idx = content.find(ui_target_end, start_idx) + len(ui_target_end)

if start_idx != -1 and end_idx != -1:
    ui_replace = """              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[13px] font-bold text-white">일일 훈련 부하 (ACWR)</label>
                  <span className="text-[11px] text-[var(--primary-color)]">
                    총 부하량: {trainingSessions.reduce((acc, s) => acc + ((Number(s.duration) || 0) * (Number(s.rpe) || 0)), 0)}
                  </span>
                </div>
                
                {trainingSessions.map((session, index) => (
                  <div key={session.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      {session.isFixed ? (
                         <label className="text-[13px] font-bold text-gray-200">{session.name}</label>
                      ) : (
                         <input 
                           type="text" 
                           placeholder="훈련 이름" 
                           value={session.name} 
                           onChange={e => {
                             const newSessions = [...trainingSessions];
                             newSessions[index].name = e.target.value;
                             setTrainingSessions(newSessions);
                           }} 
                           className="bg-transparent text-[13px] font-bold text-white border-b border-[var(--primary-color)] outline-none w-2/3"
                         />
                      )}
                      {!session.isFixed && (
                         <button onClick={() => {
                           const newSessions = [...trainingSessions];
                           newSessions.splice(index, 1);
                           setTrainingSessions(newSessions);
                         }} className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300">
                           <span className="material-icons-round text-[14px]">delete</span>삭제
                         </button>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-[11px] font-normal text-gray-400 mb-[4px] block">소요 시간(분)</label>
                        <input 
                          type="number" 
                          min="0"
                          placeholder="예: 60"
                          value={session.duration}
                          onChange={e => {
                             const newSessions = [...trainingSessions];
                             newSessions[index].duration = e.target.value === '' ? '' : Number(e.target.value);
                             setTrainingSessions(newSessions);
                          }}
                          className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl text-white text-[13px] outline-none transition-colors" 
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[11px] font-normal text-gray-400 mb-[4px] block">RPE 강도(1~10)</label>
                        <input 
                          type="number" 
                          min="1" max="10"
                          placeholder="예: 7"
                          value={session.rpe}
                          onChange={e => {
                             const newSessions = [...trainingSessions];
                             newSessions[index].rpe = e.target.value === '' ? '' : Number(e.target.value);
                             setTrainingSessions(newSessions);
                          }}
                          className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl text-white text-[13px] outline-none transition-colors" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button onClick={() => {
                  const newId = 'session_' + Date.now();
                  setTrainingSessions([...trainingSessions, { id: newId, name: '', duration: '', rpe: '', isFixed: false }]);
                }} className="w-full h-[36px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-gray-300 text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors mt-1">
                  <span className="material-icons-round text-[16px]">add</span> 추가 훈련 입력하기
                </button>
              </div>"""
    content = content[:start_idx] + ui_replace + content[end_idx:]
    print("Replaced UI")
else:
    print("UI Target not found")


with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
