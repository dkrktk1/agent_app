import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = r"""        level: item.initialLevel \?\? \(\(item.history && item.history.length > 0\) \? item.history\[0\].level : item.level\)"""
new_code = r"""        level: item.initialLevel ?? item.level"""

content = re.sub(old_code, new_code, content)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
