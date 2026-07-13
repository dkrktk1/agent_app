const fs = require('fs');
let code = fs.readFileSync('src/components/CareTab.tsx', 'utf8');

const regex = /const submitDailyLog = \(\) => \{([\s\S]*?)onUpdatePlayer\(p\); setIsDailyLogOpen\(false\); alert\("오늘의 컨디셔닝 상태가 실시간 반영되었습니다!"\);\n  \};/m;

const replacement = `const submitDailyLog = () => {
    const gl = Number(logGripLeft) || 0;
    const gr = Number(logGripRight) || 0;
    const overallGrip = (gl + gr) / 2;

    const dev = ((overallGrip - 50) / 50 * 100).toFixed(1);
    const logDurationNum = Number(logDuration) || 120;
    const curAcute = logRpe * logDurationNum;
    
    const [h1, m1] = sleepStart.split(':').map(Number);
    const [h2, m2] = sleepEnd.split(':').map(Number);
    let sleepDuration = 0;
    if (h1 !== undefined && m1 !== undefined && h2 !== undefined && m2 !== undefined) {
      let startMin = h1 * 60 + m1;
      let endMin = h2 * 60 + m2;
      if (endMin < startMin) endMin += 24 * 60;
      sleepDuration = Number(((endMin - startMin) / 60).toFixed(1));
    }

    const prevChronic = player?.acwrChartData?.chronic?.[3] ?? 1;
    let newAcwr = "0.0";
    if (prevChronic > 0) {
      newAcwr = (curAcute / prevChronic).toFixed(2);
    }

    const p = JSON.parse(JSON.stringify(player));
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
    const dateStr = \`\${month}/\${d}\`;

    // update line charts
    if (!p.acwrGraphData) p.acwrGraphData = [];
    if (!p.sleepChartData) p.sleepChartData = [];

    const existingAcwrIndex = p.acwrGraphData.findIndex((d: any) => d.date === dateStr);
    if (existingAcwrIndex !== -1) {
      p.acwrGraphData[existingAcwrIndex].acwr = parseFloat(newAcwr);
    } else {
      if (p.acwrGraphData.length >= 7) p.acwrGraphData.shift();
      p.acwrGraphData.push({ date: dateStr, acwr: parseFloat(newAcwr) });
    }

    const existingSleepIndex = p.sleepChartData.findIndex((d: any) => d.date === dateStr);
    if (existingSleepIndex !== -1) {
      p.sleepChartData[existingSleepIndex].sleepDuration = sleepDuration;
    } else {
      if (p.sleepChartData.length >= 7) p.sleepChartData.shift();
      p.sleepChartData.push({ date: dateStr, sleepDuration: sleepDuration });
    }

    const lastLabel = p.gripChartData.labels[p.gripChartData.labels.length - 1];
    if (lastLabel === "오늘" || lastLabel === dateStr) {
      p.gripChartData.labels[p.gripChartData.labels.length - 1] = "오늘";
      p.gripChartData.values[p.gripChartData.values.length - 1] = overallGrip;
      p.gripChartData.leftValues[p.gripChartData.leftValues.length - 1] = gl;
      p.gripChartData.rightValues[p.gripChartData.rightValues.length - 1] = gr;
    } else {
      if (p.gripChartData.labels.length > 0 && p.gripChartData.labels[p.gripChartData.labels.length - 1] === "오늘") {
         p.gripChartData.labels[p.gripChartData.labels.length - 1] = dateStr; // replace old "오늘" with actual date, though we don't have it here. Let's just assume we shift it.
      }
      if (p.gripChartData.labels.length >= 7) {
        p.gripChartData.labels.shift();
        p.gripChartData.values.shift();
        p.gripChartData.leftValues.shift();
        p.gripChartData.rightValues.shift();
      }
      if (p.gripChartData.labels.length > 0) {
        p.gripChartData.labels[p.gripChartData.labels.length - 1] = "어제"; // Not exact but enough for UI
      }
      p.gripChartData.labels.push("오늘");
      p.gripChartData.values.push(overallGrip);
      p.gripChartData.leftValues.push(gl);
      p.gripChartData.rightValues.push(gr);
    }

    p.schedules = p.schedules || [];
    
    const existingIndex = p.schedules.findIndex((s: any) => s.date === dateStr && s.title === '[컨디셔닝] 당일 지표 측정');
    if (existingIndex !== -1) {
      p.schedules[existingIndex].acwr = parseFloat(newAcwr);
      p.schedules[existingIndex].grip = overallGrip;
      p.schedules[existingIndex].gripLeft = gl;
      p.schedules[existingIndex].gripRight = gr;
      p.schedules[existingIndex].sleep = sleepDuration;
    } else {
      p.schedules.push({ date: dateStr, title: '[컨디셔닝] 당일 지표 측정', place: '트레이닝 센터', acwr: parseFloat(newAcwr), grip: overallGrip, gripLeft: gl, gripRight: gr, sleep: sleepDuration });
    }

    onUpdatePlayer(p); setIsDailyLogOpen(false); alert("오늘의 컨디셔닝 상태가 실시간 반영되었습니다!");
  };`;

if(regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/components/CareTab.tsx', code);
    console.log("Replaced successfully.");
} else {
    console.log("Could not find regex match.");
}
