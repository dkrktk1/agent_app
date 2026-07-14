import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_default = r"""  const defaultPainData: PainData = \{
    'shoulders_right_front': \{ level: 3, reason: '훈련 중 부딪혀서 부상 재발\(과거 수술 부위\)', initialDate: '2026-07-01' \},
    'head_center_back': \{ level: 4, reason: '경기 중 헤딩 상황에서 찢어짐', initialDate: '2026-07-02' \},
    'lower-back_center_back': \{ level: 2, reason: '스트레칭 하다가 삐끗함', initialDate: '2026-07-03' \},
    'calves_right_back': \{ level: 5, reason: '부상 내용 미입력', initialDate: '2026-07-04' \},
  \};"""

new_default = """  const defaultPainData: PainData = {
    'shoulders_right_front': { level: 3, initialLevel: 3, reason: '훈련 중 부딪혀서 부상 재발(과거 수술 부위)', initialDate: '2026-07-01', history: [{date: '2026-07-01', level: 3}] },
    'head_center_back': { level: 4, initialLevel: 4, reason: '경기 중 헤딩 상황에서 찢어짐', initialDate: '2026-07-02', history: [{date: '2026-07-02', level: 4}] },
    'lower-back_center_back': { level: 2, initialLevel: 2, reason: '스트레칭 하다가 삐끗함', initialDate: '2026-07-03', history: [{date: '2026-07-03', level: 2}] },
    'calves_right_back': { level: 5, initialLevel: 5, reason: '부상 내용 미입력', initialDate: '2026-07-04', history: [{date: '2026-07-04', level: 5}] },
  };"""

content = re.sub(old_default, new_default, content)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
