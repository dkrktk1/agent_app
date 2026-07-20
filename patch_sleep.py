import re

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # ScheduleTab.tsx
    content = content.replace('sleepDuration = Number((durationMins / 60).toFixed(1));', 'sleepDuration = Number((durationMins / 60).toFixed(2));')
    content = content.replace('sleep = Number((durationMins / 60).toFixed(1));', 'sleep = Number((durationMins / 60).toFixed(2));')
    
    # CareTab.tsx
    content = content.replace('sleepDuration = Number(((endMin - startMin) / 60).toFixed(1));', 'sleepDuration = Number(((endMin - startMin) / 60).toFixed(2));')
    
    # MainApp.tsx
    content = content.replace('sleep: parseFloat(sleep.toFixed(1)),', 'sleep: parseFloat(sleep.toFixed(2)),')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

replace_in_file('src/components/ScheduleTab.tsx')
replace_in_file('src/components/CareTab.tsx')
replace_in_file('src/components/MainApp.tsx')
