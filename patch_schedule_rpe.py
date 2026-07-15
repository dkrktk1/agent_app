import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update save logic in ScheduleTab
content = re.sub(
    r'const newEvent: any = \{ date: formattedDate, title, place, time, details, acwr, grip, gripLeft, gripRight \};',
    r'const newEvent: any = { date: formattedDate, title, place, time, details, acwr, grip, gripLeft, gripRight };\n    if (newEventType === "care") {\n      newEvent.rpe = Number(logRpe) || 0;\n      newEvent.duration = Number(logDuration) || 0;\n    }',
    content
)

# 2. Update load logic in ScheduleTab
content = content.replace(
    'setLogRpe(7); // LogRpe not saved in schedule, defaulting to 7',
    'setLogRpe(event.rpe || 7);'
)
content = content.replace(
    'setLogDuration(120); // Not saved in schedule, defaulting to 120',
    'setLogDuration(event.duration || 120);'
)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

