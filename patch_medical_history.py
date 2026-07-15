import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "history: [{date: '2026-07-01', level: 3}]",
    "history: [{date: '2026-07-01', level: 3, reason: '훈련 중 부딪혀서 부상 재발(과거 수술 부위)'}]"
)
content = content.replace(
    "history: [{date: '2026-07-02', level: 4}]",
    "history: [{date: '2026-07-02', level: 4, reason: '경기 중 헤딩 상황에서 찢어짐'}]"
)
content = content.replace(
    "history: [{date: '2026-07-03', level: 2}]",
    "history: [{date: '2026-07-03', level: 2, reason: '스트레칭 하다가 삐끗함'}]"
)
content = content.replace(
    "history: [{date: '2026-07-04', level: 5}]",
    "history: [{date: '2026-07-04', level: 5, reason: '부상 내용 미입력'}]"
)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
