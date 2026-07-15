import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken inputs
content = content.replace('/ className="', ' className="')
# Check if there is another /> at the end already.
# It became required / className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none" />
# It should be required className="w-full..." />

content = content.replace('required / className="', 'required className="')

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
