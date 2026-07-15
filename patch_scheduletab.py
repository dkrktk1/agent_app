import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """       let sleepDuration = 0;
       if (sleepStart && sleepEnd) {
         const [startH, startM] = sleepStart.split(':').map(Number);
         const [endH, endM] = sleepEnd.split(':').map(Number);
         let durationMins = (endH * 60 + endM) - (startH * 60 + startM);
         if (durationMins < 0) durationMins += 24 * 60;
         sleepDuration = Number((durationMins / 60).toFixed(1));
       }

       const prevChronic = p?.acwrChartData?.chronic?.[3] ?? 1;
       let newAcwr = "0.0";
       if (prevChronic > 0) {
         newAcwr = (curAcute / prevChronic).toFixed(2);
       }

       if (!p.acwrChartData) p.acwrChartData = { acute: [0,0,0,0], chronic: [1,1,1,1], acwr: [0,0,0,0] };
       if (!p.gripChartData) p.gripChartData = { labels: [], values: [], leftValues: [], rightValues: [] };
       if (!p.gripChartData.labels) p.gripChartData.labels = [];
       if (!p.gripChartData.values) p.gripChartData.values = [];
       if (!p.gripChartData.leftValues) p.gripChartData.leftValues = [...p.gripChartData.values];
       if (!p.gripChartData.rightValues) p.gripChartData.rightValues = [...p.gripChartData.values];

       p.acwrChartData.acute[3] = curAcute;
       p.acwrChartData.acwr[3] = parseFloat(newAcwr);

       if (!p.metrics) p.metrics = {};
       p.metrics.rpe = Number(logRpe) || 0; 
       p.metrics.gripRaw = overallGrip;
       p.metrics.grip = parseFloat(dev);
       p.metrics.acwr = parseFloat(newAcwr);
       p.metrics.sleep = sleepDuration;
       if (p.metrics.acwr >= 1.5 || p.metrics.grip <= -10 || p.metrics.sleep < 6) p.status = "danger";
       else if (p.metrics.acwr >= 1.3 || p.metrics.grip <= -5) p.status = "warning";
       else p.status = "normal";

       // update line charts
       if (!p.acwrGraphData) p.acwrGraphData = [];
       if (!p.sleepChartData) p.sleepChartData = [];

       const existingAcwrIndex = p.acwrGraphData.findIndex((d: any) => d.date === formattedDate);
       if (existingAcwrIndex !== -1) {
         p.acwrGraphData[existingAcwrIndex].acwr = parseFloat(newAcwr);
       } else {
         if (p.acwrGraphData.length >= 7) p.acwrGraphData.shift();
         p.acwrGraphData.push({ date: formattedDate, acwr: parseFloat(newAcwr) });
       }

       const existingSleepIndex = p.sleepChartData.findIndex((d: any) => d.date === formattedDate);
       if (existingSleepIndex !== -1) {
         p.sleepChartData[existingSleepIndex].sleepDuration = sleepDuration;
       } else {
         if (p.sleepChartData.length >= 7) p.sleepChartData.shift();
         p.sleepChartData.push({ date: formattedDate, sleepDuration: sleepDuration });
       }
       p.acwrGraphData.sort((a: any, b: any) => a.date.localeCompare(b.date));
       p.sleepChartData.sort((a: any, b: any) => a.date.localeCompare(b.date));

       const lastLabel = p.gripChartData.labels.length > 0 ? p.gripChartData.labels[p.gripChartData.labels.length - 1] : "";
       if (lastLabel === "오늘" || lastLabel === formattedDate) {
         p.gripChartData.labels[p.gripChartData.labels.length - 1] = "오늘"; // Assuming today's entry
         p.gripChartData.values[p.gripChartData.values.length - 1] = overallGrip;
         p.gripChartData.leftValues[p.gripChartData.leftValues.length - 1] = gl;
         p.gripChartData.rightValues[p.gripChartData.rightValues.length - 1] = gr;
       } else {
         if (p.gripChartData.labels.length > 0 && p.gripChartData.labels[p.gripChartData.labels.length - 1] === "오늘") {
            p.gripChartData.labels[p.gripChartData.labels.length - 1] = "어제";
         }
         if (p.gripChartData.labels.length >= 7) {
           p.gripChartData.labels.shift();
           p.gripChartData.values.shift();
           p.gripChartData.leftValues.shift();
           p.gripChartData.rightValues.shift();
         }
         p.gripChartData.labels.push(formattedDate);
         p.gripChartData.values.push(overallGrip);
         p.gripChartData.leftValues.push(gl);
         p.gripChartData.rightValues.push(gr);
       }
       
       acwr = parseFloat(newAcwr);
       gripLeft = gl;
       gripRight = gr;
       grip = overallGrip;"""

replacement = """       let sleepDuration = 0;
       if (sleepStart && sleepEnd) {
         const [startH, startM] = sleepStart.split(':').map(Number);
         const [endH, endM] = sleepEnd.split(':').map(Number);
         let durationMins = (endH * 60 + endM) - (startH * 60 + startM);
         if (durationMins < 0) durationMins += 24 * 60;
         sleepDuration = Number((durationMins / 60).toFixed(1));
       }
       
       gripLeft = gl;
       gripRight = gr;
       grip = overallGrip;"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in ScheduleTab!")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
