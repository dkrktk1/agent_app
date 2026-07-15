import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """    const normalSchedules = player?.schedules?.filter((s: any) => s.date === dateStr) || [];"""

replacement = """    const normalSchedules = player?.schedules?.map((s: any, idx: number) => ({ ...s, originalIndex: idx })).filter((s: any) => s.date === dateStr) || [];"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in ScheduleTab 431!")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
