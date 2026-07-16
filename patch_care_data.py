import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """  const gripHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    left: s.gripLeft || 0,
    right: s.gripRight || 0,
    grip: s.grip || 0
  }));

  const acwrHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    rpe: s.rpe || 0,
    duration: s.duration || 0,
    acwr: s.acwr || 0
  }));

  const sleepHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    duration: s.sleep || 0,
    sleepStart: s.sleepStart || '00:00',
    sleepEnd: s.sleepEnd || '00:00'
  }));"""

replacement = """  const gripHistoryData = realCareSchedules.filter((s: any) => s.gripLeft > 0 || s.gripRight > 0 || s.grip > 0).map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    left: s.gripLeft || 0,
    right: s.gripRight || 0,
    grip: s.grip || 0
  }));

  const acwrHistoryData = realCareSchedules.filter((s: any) => s.rpe > 0 || s.duration > 0 || s.acwr > 0).map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    rpe: s.rpe || 0,
    duration: s.duration || 0,
    acwr: s.acwr || 0
  }));

  const sleepHistoryData = realCareSchedules.filter((s: any) => s.sleep > 0).map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    duration: s.sleep || 0,
    sleepStart: s.sleepStart || '00:00',
    sleepEnd: s.sleepEnd || '00:00'
  }));"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
