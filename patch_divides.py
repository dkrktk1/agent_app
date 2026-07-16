import re

# ScheduleTab.tsx
with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className="flex flex-col flex-1 divide-y divide-[var(--card-border)] w-full"',
    'className="flex flex-col flex-1 w-full"'
)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# MyPageTab.tsx
with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    'className="flex flex-col divide-y divide-[var(--card-border)]"',
    'className="flex flex-col"'
)

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

