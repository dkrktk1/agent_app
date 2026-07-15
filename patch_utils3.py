import re

with open('src/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  // Update today's metric
  if (!p.metrics) p.metrics = {};
  p.metrics.acwr = calculateACWR(p.schedules, todayStr);"""

replacement = """  // Update today's metric
  if (!p.metrics) p.metrics = {};
  p.metrics.acwr = calculateACWR(p.schedules, todayStr);
  
  const todayCareEvent = recentCare.find((e: any) => e.date === todayStr);
  if (todayCareEvent) {
    p.metrics.rpe = todayCareEvent.rpe || 0;
    p.metrics.gripRaw = todayCareEvent.grip || 0;
    p.metrics.grip = parseFloat(((todayCareEvent.grip - 50) / 50 * 100).toFixed(1));
    p.metrics.sleep = todayCareEvent.sleep || 0;
    
    if (p.metrics.acwr >= 1.5 || p.metrics.grip <= -10 || p.metrics.sleep < 6) p.status = "danger";
    else if (p.metrics.acwr >= 1.3 || p.metrics.grip <= -5) p.status = "warning";
    else p.status = "normal";
  }
"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found!")

with open('src/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
