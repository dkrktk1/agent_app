import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    let gripRight = 0;"""

replace = """    let gripRight = 0;
    let logDurationNum = 0;
    let logRpe = 0;"""

content = content.replace(target, replace)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
