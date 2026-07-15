import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<div className="p-6 pb-4 overflow-y-auto flex flex-col gap-[16px]">',
    '<div className="p-6 overflow-y-auto flex flex-col gap-[16px]">'
)

content = content.replace(
    '<div className="p-6 pt-4 border-t border-[rgba(255,255,255,0.05)] shrink-0">',
    '<div className="p-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">'
)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
