import re

# ComprehensiveStatusDashboard.tsx
with open('src/components/ComprehensiveStatusDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('text-[10px] sm:text-xs', 'text-[13px]')
content = content.replace('text-[11px] sm:text-sm', 'text-[13px]')

with open('src/components/ComprehensiveStatusDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# CareTab.tsx
with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('text-[10px] sm:text-xs', 'text-[13px]')
content = content.replace('text-[10px] sm:text-sm', 'text-[13px]')

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
