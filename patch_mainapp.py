import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'rebuildChartsFromSchedules' not in content:
    content = content.replace("import { BASE_PLAYER_TEMPLATE } from '../lib/constants';", "import { BASE_PLAYER_TEMPLATE } from '../lib/constants';\nimport { rebuildChartsFromSchedules } from '../utils';")

old_create_sample = r"""  const createSamplePlayer = \(\) => \{
    const today = new Date\(\);
    const dates = \[\];
    for \(let i = 6; i >= 0; i--\) \{
      const d = new Date\(today\);
      d\.setDate\(d\.getDate\(\) - i\);
      const month = String\(d\.getMonth\(\) \+ 1\)\.padStart\(2, '0'\);
      const day = String\(d\.getDate\(\)\)\.padStart\(2, '0'\);
      dates\.push\(`\$\{month\}/\$\{day\}`\);
    \}

    const sampleId = `sample_\$\{Date\.now\(\)\}`;
    const samplePlayer = \{
      \.\.\.BASE_PLAYER_TEMPLATE,
      id: sampleId,
      name: "김샘플",
      team: "서울 스나이퍼스",
      age: "1995-05-15",
      position: "투수",
      number: "42",
      handedness: "우투우타",
      salary: "150,000,000원",
      role: "player",
      status: "warning",
      profileImg: "https://images.unsplash.com/photo-1542385151-efd9000785a0\?w=150",
      metrics: \{
        acwr: 1\.4,
        grip: -5,
        hrv: 55,
        rpe: 7,
        weight: 85,
        weightTarget: 83,
        gripRaw: 45,
        gripBaseline: 50,
        sleep: 5\.5
      \},
      acwrGraphData: \[
        \{ date: dates\[0\], acwr: 0\.9 \},
        \{ date: dates\[1\], acwr: 1\.0 \},
        \{ date: dates\[2\], acwr: 1\.1 \},
        \{ date: dates\[3\], acwr: 1\.2 \},
        \{ date: dates\[4\], acwr: 1\.1 \},
        \{ date: dates\[5\], acwr: 1\.3 \},
        \{ date: dates\[6\], acwr: 1\.4 \}
      \],
      sleepChartData: \[
        \{ date: dates\[0\], sleepDuration: 8\.0 \},
        \{ date: dates\[1\], sleepDuration: 7\.5 \},
        \{ date: dates\[2\], sleepDuration: 7\.0 \},
        \{ date: dates\[3\], sleepDuration: 6\.5 \},
        \{ date: dates\[4\], sleepDuration: 8\.0 \},
        \{ date: dates\[5\], sleepDuration: 6\.0 \},
        \{ date: dates\[6\], sleepDuration: 5\.5 \}
      \],
      gripChartData: \{
        labels: dates\.slice\(-4\),
        values: \[48, 49, 46, 45\],
        leftValues: \[47, 48, 45, 44\],
        rightValues: \[49, 50, 47, 46\]
      \}
    \};
    updatePlayer\(sampleId, samplePlayer\);
  \};"""

new_create_sample = """  const createSamplePlayer = () => {
    const today = new Date();
    
    const sampleId = `sample_${Date.now()}`;
    const schedules = [];
    
    // Generate 30 days of data
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const acwr = 0.8 + (Math.random() * 0.7); // 0.8 to 1.5
      const gripLeft = 40 + Math.floor(Math.random() * 10);
      const gripRight = 42 + Math.floor(Math.random() * 10);
      const grip = (gripLeft + gripRight) / 2;
      const sleep = 5 + (Math.random() * 4); // 5 to 9 hours
      
      schedules.push({
        date: dateStr,
        title: '[컨디셔닝] 당일 지표 측정',
        place: '트레이닝 센터',
        acwr: parseFloat(acwr.toFixed(2)),
        grip: parseFloat(grip.toFixed(1)),
        gripLeft: gripLeft,
        gripRight: gripRight,
        sleep: parseFloat(sleep.toFixed(1)),
        sleepStart: '23:00',
        sleepEnd: '07:00'
      });
    }

    let samplePlayer = {
      ...BASE_PLAYER_TEMPLATE,
      id: sampleId,
      name: "김샘플",
      team: "서울 스나이퍼스",
      age: "1995-05-15",
      position: "투수",
      number: "42",
      handedness: "우투우타",
      salary: "150,000,000원",
      role: "player",
      status: "warning",
      profileImg: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=150",
      schedules: schedules
    };
    
    samplePlayer = rebuildChartsFromSchedules(samplePlayer);
    
    updatePlayer(sampleId, samplePlayer);
  };"""

content = re.sub(old_create_sample, new_create_sample, content)

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
