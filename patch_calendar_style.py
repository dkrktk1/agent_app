import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<div className="bg-[#1C2331] rounded-2xl p-4 border border-[rgba(255,255,255,0.05)]">',
    '<div className="bg-black rounded-[24px] p-4 border border-[var(--card-border)]">'
)

content = content.replace(
    '<div className="bg-[#1C2331] rounded-xl p-4 text-center text-gray-500 border border-[rgba(255,255,255,0.05)]">',
    '<div className="bg-black rounded-[24px] p-4 text-center text-gray-500 border border-[var(--card-border)]">'
)

content = content.replace(
    'className="bg-[#1C2331] text-white"',
    'className="bg-black text-white"'
)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
