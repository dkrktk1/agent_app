export const PART_NAMES: Record<string, string> = {
  'head': '머리',
  'face': '얼굴',
  'neck': '목',
  'chest': '가슴',
  'upper-back': '등',
  'lower-back': '허리',
  'trapezius': '승모근',
  'shoulders': '어깨',
  'biceps': '이두근',
  'triceps': '삼두근',
  'forearms': '전완근',
  'palm': '손바닥',
  'back_of_hand': '손등',
  'abs': '복부',
  'obliques': '옆구리',
  'glutes': '둔근',
  'thighs': '허벅지',
  'hamstrings': '햄스트링',
  'knees': '무릎',
  'tibialis': '전경골근',
  'calves': '종아리',
  'feet': '발',
  'ankles': '발목',
  'achilles': '아킬레스건'
};

export const getPartName = (id: string) => {
  const parts = id.split('_');
  const viewSide = parts.pop();
  const side = parts.pop();
  const region = parts.join('_');

  let name = PART_NAMES[region] || region;

  if (side === 'left') return `왼쪽 ${name}`;
  if (side === 'right') return `오른쪽 ${name}`;
  return name;
};

export function formatKoreanCurrency(amount: string | number | undefined | null): string {
  if (!amount && amount !== 0 && amount !== '0') return '-';
  const num = typeof amount === 'string' ? parseInt(amount.replace(/[^0-9]/g, ''), 10) : amount;
  if (isNaN(num)) return '-';
  if (num === 0) return '0원';
  
  if (num >= 100000000) {
    const eok = Math.floor(num / 100000000);
    const rest = num % 100000000;
    if (rest === 0) return `${eok.toLocaleString()}억원`;
    
    const cheon = Math.floor(rest / 10000000);
    const man = Math.floor((rest % 10000000) / 10000);
    
    let restStr = '';
    if (cheon > 0) restStr += `${cheon}천`;
    if (man > 0) restStr += (cheon > 0 ? ` ${man}` : `${man}`);
    if (restStr.trim().length > 0) restStr += '만원';
    
    return `${eok.toLocaleString()}억 ${restStr.trim()}`;
  } else if (num >= 10000) {
    const cheon = Math.floor(num / 10000000);
    const man = Math.floor((num % 10000000) / 10000);
    const rest = num % 10000;
    
    let str = '';
    if (cheon > 0) str += `${cheon}천`;
    if (man > 0) str += (cheon > 0 ? ` ${man}` : `${man}`);
    if (str.length > 0) str += '만원';
    
    if (rest > 0) {
      str += (str.length > 0 ? ` ${rest.toLocaleString()}원` : `${rest.toLocaleString()}원`);
    }
    return str.trim();
  } else {
    return `${num.toLocaleString()}원`;
  }
}

export function downloadSampleCSV(role: string) {
  let csvContent = "";
  let filename = "";

  if (role === "batter") {
    csvContent = "Date,G,PA,AB,H,HR,RBI,SO,BB,BatSpeed(mph),SprintSpeed(ft/s)\n" +
                 "2026-06-18,1,4,4,2,1,2,0,0,71.5,27.4\n" +
                 "2026-06-19,1,5,4,1,0,0,1,1,70.2,27.1\n" +
                 "2026-06-20,1,4,4,0,0,0,2,0,68.9,26.9\n" +
                 "2026-06-22,1,4,3,0,0,0,2,1,68.0,26.8\n" +
                 "2026-06-23,1,4,4,0,0,0,3,0,67.8,26.7";
    filename = "kang_stat_sheet.csv";
  } else {
    csvContent = "Date,IP,H,ER,BB,SO,Velo(mph),ReleaseHeight(m),VerticalBreak(in)\n" +
                 "2026-06-10,6.0,4,1,1,8,96.5,1.84,18.2\n" +
                 "2026-06-16,5.1,6,3,2,6,95.1,1.80,17.4\n" +
                 "2026-06-22,4.2,8,5,4,4,94.0,1.75,16.0";
    filename = "yoon_stat_sheet.csv";
  }

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export function calculateACWR(schedules: any[], targetDateStr: string): number {
  if (!schedules || !Array.isArray(schedules)) return 0;
  
  // parse targetDateStr which is 'MM/DD' format. Assuming current year (or 2026).
  const currentYear = new Date().getFullYear();
  const [mStr, dStr] = targetDateStr.split('/');
  if (!mStr || !dStr) return 0;
  
  const targetDate = new Date(currentYear, parseInt(mStr) - 1, parseInt(dStr));
  
  const dailyWorkloads: Record<string, number> = {};
  
  const past28Days = [];
  for (let i = 0; i < 28; i++) {
    const d = new Date(targetDate);
    d.setDate(d.getDate() - i);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    past28Days.push(`${month}/${day}`);
  }
  
  past28Days.forEach(dateStr => {
    const daySchedules = schedules.filter(s => s.date === dateStr);
    let dailyLoad = 0;
    daySchedules.forEach(s => {
      const duration = Number(s.duration) || 0;
      const rpe = Number(s.rpe) || 0;
      dailyLoad += duration * rpe;
    });
    dailyWorkloads[dateStr] = dailyLoad;
  });
  
  let acuteLoad = 0;
  for (let i = 0; i < 7; i++) {
    acuteLoad += dailyWorkloads[past28Days[i]] || 0;
  }
  
  let chronicLoadSum = 0;
  for (let i = 0; i < 28; i++) {
    chronicLoadSum += dailyWorkloads[past28Days[i]] || 0;
  }
  const chronicLoad = chronicLoadSum / 4;
  
  if (chronicLoad === 0) return 0;
  const acwr = acuteLoad / chronicLoad;
  return Number(acwr.toFixed(2));
}

export const rebuildChartsFromSchedules = (player: any) => {
  const p = { ...player };
  if (!p.schedules) p.schedules = [];
  
  // Filter out any schedules that don't match MM/DD format (e.g. YYYY-MM-DD ones that aren't on calendar)
  p.schedules = p.schedules.filter((s: any) => typeof s.date === 'string' && s.date.includes('/') && s.date.length === 5);

  // Sort schedules by date
  const sortedSchedules = [...p.schedules].sort((a, b) => a.date.localeCompare(b.date));
  
  // Filter for care events
  const careEvents = sortedSchedules.filter((s: any) => s.title === '[컨디셔닝] 당일 지표 측정');
  
  // Take the last 7
  const recentCare = careEvents.slice(-7);
  
  const d = new Date();
  const todayStr = String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0');

  p.gripChartData = {
      labels: recentCare.map((e: any) => e.date === todayStr ? "오늘" : e.date),
      values: recentCare.map((e: any) => e.grip || 0),
      leftValues: recentCare.map((e: any) => e.gripLeft || 0),
      rightValues: recentCare.map((e: any) => e.gripRight || 0)
  };
  
  p.sleepChartData = recentCare.map((e: any) => ({
      date: e.date === todayStr ? "오늘" : e.date,
      sleepDuration: e.sleep || 0
  }));
  
  p.acwrGraphData = recentCare.map((e: any) => {
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


  
  return p;
};
