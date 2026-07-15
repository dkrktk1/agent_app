import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the 'care' inputs inside ScheduleTab
content = content.replace('<label className="text-sm font-bold text-white mb-3 block">', '<label className="text-[13px] font-bold text-white mb-[6px] block">')
content = content.replace('<div className="flex flex-col gap-4 pl-2 border-l-2 border-[rgba(255,255,255,0.1)] ml-2 mt-2">', '<div className="flex flex-col gap-[12px] mt-[6px]">')

old_input_care = 'className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm outline-none focus:border-[#3b82f6]"'
new_input_care = 'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none transition-colors"'
content = content.replace(old_input_care, new_input_care)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
