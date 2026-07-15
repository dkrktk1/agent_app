import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker1 = """  const acwrStatusText = isAcwrEmpty ? '측정값 없음' : latestAcwr >= 1.5 ? '부상 위험' : latestAcwr >= 1.3 ? '주의' : '최적';"""
replacement1 = """  const acwrStatusText = isAcwrEmpty ? '측정값 없음' : latestAcwr >= 1.5 ? '부상 위험' : latestAcwr >= 1.3 ? '주의' : '최적';

  const maxAcwrVal = Math.max(2.0, ...(player.acwrGraphData || []).map((d: any) => d.acwr || 0));
  const acwrYAxisMax = maxAcwrVal > 2.0 ? Math.ceil(maxAcwrVal * 2) / 2 : 2.0;
  const acwrYAxisTicks = [0.5, 0.8, 1.3, 1.5];
  for (let i = 2.0; i <= acwrYAxisMax; i += 0.5) {
    acwrYAxisTicks.push(i);
  }"""

if marker1 in content:
    content = content.replace(marker1, replacement1)
else:
    print("Warning: marker1 not found!")

marker2 = """<YAxis domain={[0.5, 2.0]} ticks={[0.5, 0.8, 1.3, 1.5, 2.0]} stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />"""
replacement2 = """<YAxis domain={[0.5, acwrYAxisMax]} ticks={acwrYAxisTicks} stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />"""

if marker2 in content:
    content = content.replace(marker2, replacement2)
else:
    print("Warning: marker2 not found!")

marker3 = """<ReferenceArea y1={1.5} y2={2.0} {...{fill: "#ef4444", fillOpacity: 0.15}} />"""
replacement3 = """<ReferenceArea y1={1.5} y2={acwrYAxisMax} {...{fill: "#ef4444", fillOpacity: 0.15}} />"""

if marker3 in content:
    content = content.replace(marker3, replacement3)
else:
    print("Warning: marker3 not found!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
