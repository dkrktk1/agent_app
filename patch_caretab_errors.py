import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_reset = """          if (existing) {
             setLogRpe(existing.rpe || 7);
             setLogDuration(existing.duration || '');"""

replace_reset = """          if (existing) {
             if (existing.sessions && Array.isArray(existing.sessions)) {
                 setTrainingSessions(existing.sessions);
             } else {
                 const d = existing.duration || '';
                 const r = existing.rpe || '';
                 if (d || r) {
                    setTrainingSessions([
                      { id: 'match', name: '경기 시간(분)', duration: '', rpe: '', isFixed: true },
                      { id: 'weight', name: '웨이트 트레이닝 시간(분)', duration: '', rpe: '', isFixed: true },
                      { id: 'skill', name: '기술 훈련 시간(분)', duration: '', rpe: '', isFixed: true },
                      { id: 'legacy', name: '기존 기록', duration: d, rpe: r, isFixed: false }
                    ]);
                 }
             }"""

content = content.replace(target_reset, replace_reset)

target_reset_else = """          } else {
             setLogRpe(7);
             setLogDuration('');"""

replace_reset_else = """          } else {
             setTrainingSessions([
                { id: 'match', name: '경기 시간(분)', duration: '', rpe: '', isFixed: true },
                { id: 'weight', name: '웨이트 트레이닝 시간(분)', duration: '', rpe: '', isFixed: true },
                { id: 'skill', name: '기술 훈련 시간(분)', duration: '', rpe: '', isFixed: true }
             ]);"""

content = content.replace(target_reset_else, replace_reset_else)

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
