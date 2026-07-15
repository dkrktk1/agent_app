import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """    let p = JSON.parse(JSON.stringify(player));
    if (!p.metrics) p.metrics = {};
    p.metrics.rpe = logRpe; 
    p.metrics.gripRaw = overallGrip;
    p.metrics.grip = parseFloat(dev);
    p.metrics.sleep = sleepDuration;

    const today = new Date();"""

replacement = """    let p = JSON.parse(JSON.stringify(player));

    const today = new Date();"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in CareTab!")

marker2 = """    p = rebuildChartsFromSchedules(p);
    
    if (p.metrics.acwr >= 1.5 || p.metrics.grip <= -10 || p.metrics.sleep < 6) p.status = "danger";
    else if (p.metrics.acwr >= 1.3 || p.metrics.grip <= -5) p.status = "warning";
    else p.status = "normal";
    onUpdatePlayer(p); setIsDailyLogOpen(false); alert("오늘의 컨디셔닝 상태가 실시간 반영되었습니다!");"""

replacement2 = """    p = rebuildChartsFromSchedules(p);
    onUpdatePlayer(p); setIsDailyLogOpen(false); alert("오늘의 컨디셔닝 상태가 실시간 반영되었습니다!");"""

if marker2 in content:
    content = content.replace(marker2, replacement2)
else:
    print("Warning: marker2 not found in CareTab!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
