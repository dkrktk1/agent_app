import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """    const prevChronic = player?.acwrChartData?.chronic?.[3] ?? 1;
    let newAcwr = "0.0";
    if (prevChronic > 0) {
      newAcwr = (curAcute / prevChronic).toFixed(2);
    }

    let p = JSON.parse(JSON.stringify(player));
    if (!p.acwrChartData) p.acwrChartData = { acute: [0,0,0,0], chronic: [1,1,1,1], acwr: [0,0,0,0] };
    if (!p.gripChartData) p.gripChartData = { labels: [], values: [], leftValues: [], rightValues: [] };
    if (!p.gripChartData.labels) p.gripChartData.labels = [];
    if (!p.gripChartData.values) p.gripChartData.values = [];
    if (!p.gripChartData.leftValues) p.gripChartData.leftValues = [...p.gripChartData.values];
    if (!p.gripChartData.rightValues) p.gripChartData.rightValues = [...p.gripChartData.values];

    p.acwrChartData.acute[3] = curAcute;
    p.acwrChartData.acwr[3] = parseFloat(newAcwr);

    if (!p.metrics) p.metrics = {};
    p.metrics.rpe = logRpe; 
    p.metrics.gripRaw = overallGrip;
    p.metrics.grip = parseFloat(dev);
    p.metrics.acwr = parseFloat(newAcwr);
    p.metrics.sleep = sleepDuration;
    if (p.metrics.acwr >= 1.5 || p.metrics.grip <= -10 || p.metrics.sleep < 6) p.status = "danger";
    else if (p.metrics.acwr >= 1.3 || p.metrics.grip <= -5) p.status = "warning";
    else p.status = "normal";

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `${month}/${d}`;


    p.schedules = p.schedules || [];
    
    const existingIndex = p.schedules.findIndex((s: any) => s.date === dateStr && s.title === '[컨디셔닝] 당일 지표 측정');
    if (existingIndex !== -1) {
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
    }

    p = rebuildChartsFromSchedules(p);"""

replacement = """    let p = JSON.parse(JSON.stringify(player));
    if (!p.metrics) p.metrics = {};
    p.metrics.rpe = logRpe; 
    p.metrics.gripRaw = overallGrip;
    p.metrics.grip = parseFloat(dev);
    p.metrics.sleep = sleepDuration;

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `${month}/${d}`;

    p.schedules = p.schedules || [];
    
    const existingIndex = p.schedules.findIndex((s: any) => s.date === dateStr && s.title === '[컨디셔닝] 당일 지표 측정');
    if (existingIndex !== -1) {
      p.schedules[existingIndex].grip = overallGrip;
      p.schedules[existingIndex].gripLeft = gl;
      p.schedules[existingIndex].gripRight = gr;
      p.schedules[existingIndex].sleep = sleepDuration;
      p.schedules[existingIndex].sleepStart = sleepStart;
      p.schedules[existingIndex].sleepEnd = sleepEnd;
      p.schedules[existingIndex].rpe = Number(logRpe) || 0;
      p.schedules[existingIndex].duration = logDurationNum;
    } else {
      p.schedules.push({ date: dateStr, title: '[컨디셔닝] 당일 지표 측정', place: '트레이닝 센터', grip: overallGrip, gripLeft: gl, gripRight: gr, sleep: sleepDuration, sleepStart: sleepStart, sleepEnd: sleepEnd, rpe: Number(logRpe) || 0, duration: logDurationNum });
    }

    p = rebuildChartsFromSchedules(p);
    
    if (p.metrics.acwr >= 1.5 || p.metrics.grip <= -10 || p.metrics.sleep < 6) p.status = "danger";
    else if (p.metrics.acwr >= 1.3 || p.metrics.grip <= -5) p.status = "warning";
    else p.status = "normal";"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in CareTab!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
