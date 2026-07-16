import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# ACWR Title
content = content.replace(
    '<h4 className="text-left m-0">ACWR (급성/만성 부하 비율) 추이 그래프</h4>',
    '<h4 className="text-left m-0 text-[13px]">ACWR (급성/만성 부하 비율) 추이 그래프</h4>'
)

# ACWR Button
content = content.replace(
    'className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors shrink-0"',
    'className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-[13px] transition-colors shrink-0"'
)

# Grip Title
content = content.replace(
    '<h4 style={{ marginBottom: 0 }}>최근 7일 악력 추이</h4>',
    '<h4 className="text-[13px]" style={{ marginBottom: 0 }}>최근 7일 악력 추이</h4>'
)

# Grip Button
content = content.replace(
    'className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors"',
    'className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-[13px] transition-colors"'
)

# Sleep Title
content = content.replace(
    '<h4 className="text-left m-0">최근 7일 수면 패턴 (Sleep Trend)</h4>',
    '<h4 className="text-left m-0 text-[13px]">최근 7일 수면 패턴 (Sleep Trend)</h4>'
)

# Sleep Button
# Notice: Grip button and Sleep button might have the same class name string in the previous step.
# Wait, they DO have the exact same class string. So the Grip Button replacement above actually replaces both! 
# Let's double check by just running the python script.

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
