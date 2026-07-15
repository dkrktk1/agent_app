import re

with open('src/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  p.acwrGraphData = recentCare.map((e: any) => ({
      date: e.date === todayStr ? "오늘" : e.date,
      acwr: e.acwr || 0
  }));"""

replacement = """  p.acwrGraphData = recentCare.map((e: any) => {
      const calculatedAcwr = calculateACWR(p.schedules, e.date);
      // Update schedule's acwr to be accurate
      const schedIndex = p.schedules.findIndex((s: any) => s === e);
      if (schedIndex !== -1) {
          p.schedules[schedIndex].acwr = calculatedAcwr;
      }
      return {
          date: e.date === todayStr ? "오늘" : e.date,
          acwr: calculatedAcwr
      };
  });
  
  // Update today's metric
  if (!p.metrics) p.metrics = {};
  p.metrics.acwr = calculateACWR(p.schedules, todayStr);
"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found!")

with open('src/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
