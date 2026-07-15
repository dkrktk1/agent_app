import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  const latestAcwr = player.metrics?.acwr ?? 0;
  const isAcwrEmpty = latestAcwr === 0;"""

replacement = """  const todayObj = new Date();
  const monthStr = String(todayObj.getMonth() + 1).padStart(2, '0');
  const dStr = String(todayObj.getDate()).padStart(2, '0');
  const todayDateStr = `${monthStr}/${dStr}`;
  const todayCare = player.schedules?.find((s: any) => s.date === todayDateStr && s.title?.includes('[컨디셔닝]'));
  const todayLoad = todayCare ? (todayCare.rpe || 0) * (todayCare.duration || 0) : null;

  const latestAcwr = player.metrics?.acwr ?? 0;
  const isAcwrEmpty = latestAcwr === 0;"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in CareTab 462!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
