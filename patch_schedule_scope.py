import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_declare = """       const logDurationNum = totalDuration;
       const logRpe = totalDuration > 0 ? (totalLoad / totalDuration) : 0;
       const curAcute = logRpe * logDurationNum;"""

replace_declare = """       logDurationNum = totalDuration;
       logRpe = totalDuration > 0 ? (totalLoad / totalDuration) : 0;
       const curAcute = logRpe * logDurationNum;"""

content = content.replace(target_declare, replace_declare)

target_pre_declare = """    let acwr = 1.0;
    let grip = 0;
    let gripLeft = 0;
    let gripRight = 0;"""

replace_pre_declare = """    let acwr = 1.0;
    let grip = 0;
    let gripLeft = 0;
    let gripRight = 0;
    let logDurationNum = 0;
    let logRpe = 0;"""

content = content.replace(target_pre_declare, replace_pre_declare)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
