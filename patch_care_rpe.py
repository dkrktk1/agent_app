import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace existingIndex update
old_update = """    if (existingIndex !== -1) {
      p.schedules[existingIndex].acwr = parseFloat(newAcwr);
      p.schedules[existingIndex].grip = overallGrip;
      p.schedules[existingIndex].gripLeft = gl;
      p.schedules[existingIndex].gripRight = gr;
      p.schedules[existingIndex].sleep = sleepDuration;
    } else {
      p.schedules.push({ date: dateStr, title: '[컨디셔닝] 당일 지표 측정', place: '트레이닝 센터', acwr: parseFloat(newAcwr), grip: overallGrip, gripLeft: gl, gripRight: gr, sleep: sleepDuration, sleepStart: sleepStart, sleepEnd: sleepEnd });
    }"""

new_update = """    if (existingIndex !== -1) {
      p.schedules[existingIndex].acwr = parseFloat(newAcwr);
      p.schedules[existingIndex].grip = overallGrip;
      p.schedules[existingIndex].gripLeft = gl;
      p.schedules[existingIndex].gripRight = gr;
      p.schedules[existingIndex].sleep = sleepDuration;
      p.schedules[existingIndex].sleepStart = sleepStart;
      p.schedules[existingIndex].sleepEnd = sleepEnd;
      p.schedules[existingIndex].rpe = Number(logRpe) || 0;
      p.schedules[existingIndex].duration = logDurationNum;
    } else {
      p.schedules.push({ date: dateStr, title: '[컨디셔닝] 당일 지표 측정', place: '트레이닝 센터', acwr: parseFloat(newAcwr), grip: overallGrip, gripLeft: gl, gripRight: gr, sleep: sleepDuration, sleepStart: sleepStart, sleepEnd: sleepEnd, rpe: Number(logRpe) || 0, duration: logDurationNum });
    }"""

if old_update in content:
    content = content.replace(old_update, new_update)
else:
    print("Warning: Could not find exact update block in CareTab.tsx")

# Also, when the user opens the daily log in CareTab, are they loading existing values?
# CareTab does not seem to load existing log values when opening the modal, it just defaults to 7 and 120.
# Wait, let's check setIsDailyLogOpen.

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

