import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_func = r"""    const calcGripAvg = \(arr\?: number\[\]\) => \{
    if \(\!arr \|\| arr\.length === 0\) return 0;
    const valid = arr\.filter\(v => v > 0\);
    if \(valid\.length === 0\) return 0;
    return Number\(\(valid\.reduce\(\(a, b\) => a \+ b, 0\) / valid\.length\)\.toFixed\(1\)\);
  \};
  const gripLeftBaseline = calcGripAvg\(player\?\.gripChartData\?\.leftValues\);
  const gripRightBaseline = calcGripAvg\(player\?\.gripChartData\?\.rightValues\);"""

new_func = """  const calcTop3Avg = (prop: string) => {
    if (!player?.schedules || player.schedules.length === 0) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    const validValues = player.schedules
      .filter((s: any) => s.date >= thirtyDaysAgoStr && s[prop] !== undefined && s[prop] > 0)
      .map((s: any) => s[prop])
      .sort((a: number, b: number) => b - a)
      .slice(0, 3);
      
    if (validValues.length === 0) return 0;
    return Number((validValues.reduce((a: number, b: number) => a + b, 0) / validValues.length).toFixed(1));
  };

  const gripLeftBaseline = calcTop3Avg('gripLeft');
  const gripRightBaseline = calcTop3Avg('gripRight');"""

content = re.sub(old_func, new_func, content)

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
