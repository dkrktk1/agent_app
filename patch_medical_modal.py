import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace fixed inset-0 ... overflow-y-auto with overflow-y-auto overflow-x-hidden
content = content.replace(
    'className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60',
    'className="fixed inset-0 z-[1100] overflow-y-auto overflow-x-hidden bg-black/60'
)

# And similarly for timeline modal if any
content = content.replace(
    'className="fixed inset-0 z-[1200] overflow-y-auto bg-black/60',
    'className="fixed inset-0 z-[1200] overflow-y-auto overflow-x-hidden bg-black/60'
)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
