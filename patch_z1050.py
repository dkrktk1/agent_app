import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className="fixed inset-0 z-[1050] overflow-y-auto bg-black/60',
    'className="fixed inset-0 z-[1050] overflow-y-auto overflow-x-hidden bg-black/60'
)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
