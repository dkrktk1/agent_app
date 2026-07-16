import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className={`flex flex-col p-4 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors`}',
    'className={`flex flex-col py-3 px-2 first:pt-0 last:pb-0 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors`}'
)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
