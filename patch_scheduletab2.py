import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """    let updatedSchedules = [...(player.schedules || [])];
    updatedSchedules.splice(editingEventOriginalIndex, 1);
    if (onUpdatePlayer) {
      onUpdatePlayer({ ...player, schedules: updatedSchedules });
    }"""

replacement = """    let p = JSON.parse(JSON.stringify(player));
    let updatedSchedules = [...(p.schedules || [])];
    updatedSchedules.splice(editingEventOriginalIndex, 1);
    p.schedules = updatedSchedules;
    p = rebuildChartsFromSchedules(p);
    
    if (onUpdatePlayer) {
      onUpdatePlayer(p);
    }"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in ScheduleTab delete event!")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
