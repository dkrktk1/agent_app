import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the duplicate className in TimeSelect
# <select value={ampm} onChange={handleAmPm} className="..." className="w-full h-[30px]..."
content = re.sub(r'className="[^"]*"\s+className="w-full h-\[30px\] bg-\[rgba\(255,255,255,0\.05\)\] border border-\[var\(--primary-color\)\] rounded-xl px-3 text-white text-\[13px\] outline-none"', r'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none"', content)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
