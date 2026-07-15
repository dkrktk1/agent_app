import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """                        {s.acwr !== undefined && <span>ACWR: {s.acwr}</span>}"""

replacement = """                        {s.acwr !== undefined && <span>ACWR: {Number(s.acwr).toFixed(2)}</span>}"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in ScheduleTab 512!")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
