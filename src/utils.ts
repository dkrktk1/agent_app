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


export function parseToDateObj(dateVal: any, referenceDate: Date = new Date()): Date | null {
  if (!dateVal) return null;
  if (dateVal instanceof Date) {
    return new Date(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), 0, 0, 0, 0);
  }
  if (typeof dateVal === 'string') {
    const trimmed = dateVal.trim();
    if (/^\d{1,2}\/\d{1,2}$/.test(trimmed)) {
      const parts = trimmed.split('/');
      const m = parseInt(parts[0], 10);
      const d = parseInt(parts[1], 10);
      if (!isNaN(m) && !isNaN(d) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        const yr = referenceDate.getFullYear();
        let dateObj = new Date(yr, m - 1, d, 0, 0, 0, 0);
        // If the date is more than 30 days in the future, it was likely from late last year
        if (dateObj.getTime() - referenceDate.getTime() > 86400000 * 30) {
          dateObj.setFullYear(yr - 1);
        }
        return dateObj;
      }
    } else if (trimmed.includes('-') || trimmed.includes('/')) {
      const parsed = new Date(trimmed);
      if (!isNaN(parsed.getTime())) {
        return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 0, 0, 0, 0);
      }
    }
  }
  return null;
}

export function parseScheduleDateToObj(dateStr: string, referenceYear: number = new Date().getFullYear()): Date | null {
  return parseToDateObj(dateStr, new Date(referenceYear, 0, 1));
}

export function getFirstTrainingDate(schedules: any[], referenceDate: Date = new Date()): Date | null {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) return null;

  const validDates: Date[] = [];

  schedules.forEach(s => {
    if (!s || !s.date) return;
    const dObj = parseToDateObj(s.date, referenceDate);
    if (!dObj) return;

    if (
      (s.rpe !== undefined && Number(s.rpe) > 0) ||
      (s.duration !== undefined && Number(s.duration) > 0) ||
      (s.sleep !== undefined && Number(s.sleep) > 0) ||
      (s.grip !== undefined && Number(s.grip) > 0) ||
      (s.gripLeft !== undefined && Number(s.gripLeft) > 0) ||
      (s.gripRight !== undefined && Number(s.gripRight) > 0) ||
      (s.title && (s.title.includes('[컨디셔닝]') || s.title.includes('훈련') || s.title.includes('측정')))
    ) {
      validDates.push(dObj);
    }
  });

  if (validDates.length === 0) {
    schedules.forEach(s => {
      if (!s || !s.date) return;
      const dObj = parseToDateObj(s.date, referenceDate);
      if (dObj) validDates.push(dObj);
    });
  }

  if (validDates.length === 0) return null;

  // Sort dates in ascending order and deduplicate by timestamp
  const uniqueTimestamps = Array.from(new Set(validDates.map(d => d.getTime()))).sort((a, b) => a - b);
  const sortedDates = uniqueTimestamps.map(ts => new Date(ts));

  // Detect 14-day (2 weeks) or longer gap and reset firstDate to the new session start
  let firstDate = sortedDates[0];
  for (let i = 1; i < sortedDates.length; i++) {
    const diffTime = sortedDates[i].getTime() - sortedDates[i - 1].getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 14) {
      firstDate = sortedDates[i];
    }
  }

  return firstDate;
}

export function isAcwrSufficient(schedules: any[], targetDateStr?: string): boolean {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
    return false;
  }

  const now = new Date();
  let currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  if (targetDateStr && typeof targetDateStr === 'string') {
    const parsedTarget = parseToDateObj(targetDateStr, now);
    if (parsedTarget) {
      currentDate = parsedTarget;
    }
  }

  const firstDate = getFirstTrainingDate(schedules, currentDate);
  if (!firstDate) {
    return false;
  }

  const diffTime = currentDate.getTime() - firstDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 21) {
    return false;
  }

  return true;
}

export function calculateACWR(schedules: any[], targetDateStr: string): number {
  if (!schedules || !Array.isArray(schedules) || schedules.length === 0) return 0;
  
  const now = new Date();
  const targetDateObj = parseToDateObj(targetDateStr, now) || new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // 1. 최초 기록일(firstDate, 14일 이상 공백 시 리셋된 날짜)과 현재 점을 찍을 날짜(targetDateObj)의 경과 일수 계산
  const firstDate = getFirstTrainingDate(schedules, targetDateObj);
  if (!firstDate) {
    return 0;
  }

  const diffTime = targetDateObj.getTime() - firstDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let calculatedAcwr = 0; // ACWR 기본값을 무조건 0으로 강제 설정

  // 2. 21일이 경과했을 때만 진짜 계산식을 실행하도록 락(Lock) 걸기
  if (diffDays >= 21) {
    // targetDateObj 기준 최근 28일의 연속된 날짜 배열 생성
    const past28Days: { dateStr: string; dateObj: Date }[] = [];
    for (let i = 0; i < 28; i++) {
      const d = new Date(targetDateObj);
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      past28Days.push({ dateStr: `${month}/${day}`, dateObj: d });
    }

    const dailyWorkloads: Record<string, number> = {};

    past28Days.forEach(({ dateStr, dateObj }) => {
      // 리셋된 firstDate 이전의 과거 시즌 데이터는 제외
      if (dateObj.getTime() < firstDate.getTime()) {
        dailyWorkloads[dateStr] = 0;
        return;
      }

      const daySchedules = schedules.filter(s => {
        if (!s || !s.date) return false;
        const parsed = parseToDateObj(s.date, targetDateObj);
        if (parsed) {
          return parsed.getTime() === dateObj.getTime();
        }
        return s.date === dateStr;
      });

      let dailyLoad = 0;
      daySchedules.forEach(s => {
        const duration = Number(s.duration) || 0;
        const rpe = Number(s.rpe) || 0;
        dailyLoad += duration * rpe;
      });

      dailyWorkloads[dateStr] = dailyLoad;
    });

    // 최근 7일 총합 (급성 부하)
    let acuteLoad = 0;
    for (let i = 0; i < 7; i++) {
      acuteLoad += dailyWorkloads[past28Days[i].dateStr] || 0;
    }

    // 최근 28일 일평균 부하 (만성 부하)
    let chronicLoadSum = 0;
    for (let i = 0; i < 28; i++) {
      chronicLoadSum += dailyWorkloads[past28Days[i].dateStr] || 0;
    }

    // 만성 부하 (28일 총합 / 4 = 7일 기준 평균)
    const chronicLoad = chronicLoadSum / 4;

    if (chronicLoad > 0) {
      const acwr = acuteLoad / chronicLoad;
      calculatedAcwr = Number(acwr.toFixed(2));
    }
  }

  // 3. 데이터 반환 (21일 미만인 날짜는 calculatedAcwr가 0인 상태로 반환됨)
  return calculatedAcwr;
}

export function calculateGripBaselineAvg(
  schedules: any[],
  side: 'left' | 'right',
  todayVal: number = 0,
  referenceDate: Date = new Date()
): number {
  const prop = side === 'left' ? 'gripLeft' : 'gripRight';
  const todayObj = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate(), 0, 0, 0, 0);
  const twentyEightDaysAgo = new Date(todayObj.getTime() - 28 * 24 * 60 * 60 * 1000);

  const firstDate = getFirstTrainingDate(schedules, todayObj);
  const startBoundary = firstDate && firstDate.getTime() > twentyEightDaysAgo.getTime()
    ? firstDate
    : twentyEightDaysAgo;

  // Deduplicate by date (MM/DD) and exclude today
  const dateValueMap = new Map<string, { val: number; isConditioning: boolean }>();
  let todayScheduleVal = 0;

  if (schedules && Array.isArray(schedules)) {
    schedules.forEach((s: any) => {
      if (!s || !s.date) return;
      const val = Number(s[prop]) || 0;
      if (val <= 0) return;

      const schedDate = parseToDateObj(s.date, todayObj);
      if (!schedDate) return;

      const isCond = Boolean(s.title === '[컨디셔닝] 당일 지표 측정' || s.title?.includes('[컨디셔닝]'));

      if (schedDate.getTime() === todayObj.getTime()) {
        if (isCond || todayScheduleVal === 0) {
          todayScheduleVal = val;
        }
        return;
      }

      if (schedDate.getTime() >= startBoundary.getTime() && schedDate.getTime() < todayObj.getTime()) {
        const key = `${schedDate.getFullYear()}-${String(schedDate.getMonth() + 1).padStart(2, '0')}-${String(schedDate.getDate()).padStart(2, '0')}`;
        const existing = dateValueMap.get(key);
        if (!existing || (isCond && !existing.isConditioning) || isCond) {
          dateValueMap.set(key, { val, isConditioning: isCond });
        }
      }
    });
  }

  const pastValues = Array.from(dateValueMap.values()).map(item => item.val).filter(v => v > 0);

  if (pastValues.length > 0) {
    const sum = pastValues.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / pastValues.length).toFixed(1));
  }

  // 과거 기록이 아예 없고 오늘 첫 기록만 있다면 오늘 값을 평균으로 사용
  const fallbackToday = todayVal > 0 ? todayVal : todayScheduleVal;
  return fallbackToday > 0 ? Number(fallbackToday.toFixed(1)) : 0;
}

export const rebuildChartsFromSchedules = (player: any) => {
  const p = { ...player };
  if (!p.schedules) p.schedules = [];
  
  const d = new Date();
  const todayObj = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const todayStr = String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0');

  // Filter out any schedules that don't match MM/DD format (e.g. YYYY-MM-DD ones that aren't on calendar)
  p.schedules = p.schedules.filter((s: any) => typeof s.date === 'string' && s.date.includes('/') && s.date.length === 5);

  // Sort schedules by actual date
  const sortedSchedules = [...p.schedules].sort((a, b) => {
    const da = parseToDateObj(a.date, d)?.getTime() || 0;
    const db = parseToDateObj(b.date, d)?.getTime() || 0;
    return da - db;
  });

  // Group schedules by unique date so each day has exactly one consolidated care/metrics data point
  const dateMap = new Map<string, any>();
  for (const s of sortedSchedules) {
    if (!s.date) continue;
    const existing = dateMap.get(s.date);
    const isConditioning = s.title === '[컨디셔닝] 당일 지표 측정' || s.title?.includes('[컨디셔닝]');

    if (!existing) {
      dateMap.set(s.date, { ...s });
    } else {
      if (isConditioning) {
        const condSleep = (s.sleep !== undefined && s.sleep !== null && Number(s.sleep) > 0) ? Number(s.sleep) : null;
        const existSleep = (existing.sleep !== undefined && existing.sleep !== null && Number(existing.sleep) > 0) ? Number(existing.sleep) : null;
        dateMap.set(s.date, {
          ...existing,
          ...s,
          grip: (s.grip !== undefined && Number(s.grip) > 0) ? s.grip : existing.grip,
          gripLeft: (s.gripLeft !== undefined && Number(s.gripLeft) > 0) ? s.gripLeft : existing.gripLeft,
          gripRight: (s.gripRight !== undefined && Number(s.gripRight) > 0) ? s.gripRight : existing.gripRight,
          sleep: condSleep !== null ? condSleep : existSleep,
          sleepStart: condSleep !== null ? s.sleepStart : (existSleep !== null ? existing.sleepStart : ''),
          sleepEnd: condSleep !== null ? s.sleepEnd : (existSleep !== null ? existing.sleepEnd : ''),
          rpe: (s.rpe !== undefined && Number(s.rpe) > 0) ? s.rpe : existing.rpe,
          duration: (s.duration !== undefined && Number(s.duration) > 0) ? s.duration : existing.duration,
          sessions: s.sessions || existing.sessions
        });
      } else {
        if ((!existing.gripLeft || existing.gripLeft === 0) && s.gripLeft) existing.gripLeft = s.gripLeft;
        if ((!existing.gripRight || existing.gripRight === 0) && s.gripRight) existing.gripRight = s.gripRight;
        if ((!existing.grip || existing.grip === 0) && s.grip) existing.grip = s.grip;
        if ((!existing.sleep || existing.sleep === 0) && s.sleep && Number(s.sleep) > 0) existing.sleep = Number(s.sleep);
        if (!existing.sleepStart && s.sleepStart) existing.sleepStart = s.sleepStart;
        if (!existing.sleepEnd && s.sleepEnd) existing.sleepEnd = s.sleepEnd;
        if ((!existing.rpe || existing.rpe === 0) && s.rpe) existing.rpe = s.rpe;
        if ((!existing.duration || existing.duration === 0) && s.duration) existing.duration = s.duration;
      }
    }
  }

  // Generate actual 7 consecutive calendar days ending today (D-6 to Today)
  const recent7CalendarDays: { dateStr: string; label: string; dateObj: Date; event: any }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayObj = new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate() - i, 0, 0, 0, 0);
    const mStr = String(dayObj.getMonth() + 1).padStart(2, '0');
    const dStr = String(dayObj.getDate()).padStart(2, '0');
    const dateStr = `${mStr}/${dStr}`;
    const label = i === 0 ? '오늘' : dateStr;
    recent7CalendarDays.push({
      dateStr,
      label,
      dateObj: dayObj,
      event: dateMap.get(dateStr) || null
    });
  }

  p.gripChartData = {
    labels: recent7CalendarDays.map(day => day.label),
    values: recent7CalendarDays.map(({ event }) =>
      event ? (Number(event.grip) || ((Number(event.gripLeft || 0) + Number(event.gripRight || 0)) / 2) || 0) : 0
    ),
    leftValues: recent7CalendarDays.map(({ event }) =>
      event ? (Number(event.gripLeft) || Number(event.grip) || 0) : 0
    ),
    rightValues: recent7CalendarDays.map(({ event }) =>
      event ? (Number(event.gripRight) || Number(event.grip) || 0) : 0
    )
  };

  p.sleepChartData = recent7CalendarDays.map(({ label, event }) => {
    const sleepVal = event && event.sleep !== null && event.sleep !== undefined ? Number(event.sleep) : 0;
    return {
      date: label,
      sleepDuration: sleepVal > 0 ? sleepVal : null
    };
  });

  const firstDate = getFirstTrainingDate(p.schedules, todayObj);

  p.acwrGraphData = recent7CalendarDays.map(({ dateStr, label, dateObj }) => {
    let diffDays = 0;
    if (firstDate) {
      const diffTime = dateObj.getTime() - firstDate.getTime();
      diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    let calculatedAcwr = 0;

    if (firstDate && diffDays >= 21) {
      calculatedAcwr = calculateACWR(p.schedules, dateStr);
    }

    const schedIndex = p.schedules.findIndex((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
    if (schedIndex !== -1) {
      p.schedules[schedIndex].acwr = calculatedAcwr;
    }

    return {
      date: label,
      acwr: calculatedAcwr
    };
  });

  // Update today's metric
  if (!p.metrics) p.metrics = {};
  p.metrics.acwr = calculateACWR(p.schedules, todayStr);

  const todayCareEvent = dateMap.get(todayStr) || null;
  if (todayCareEvent) {
    p.metrics.rpe = Number(todayCareEvent.rpe) || 0;
    p.metrics.duration = Number(todayCareEvent.duration) || 0;
    const gl = Number(todayCareEvent.gripLeft) || Number(todayCareEvent.grip) || 0;
    const gr = Number(todayCareEvent.gripRight) || Number(todayCareEvent.grip) || 0;
    p.metrics.gripRaw = Number(todayCareEvent.grip) || ((gl + gr) / 2) || 0;
    const avgLeft = calculateGripBaselineAvg(p.schedules, 'left', gl, todayObj);
    const avgRight = calculateGripBaselineAvg(p.schedules, 'right', gr, todayObj);
    const leftChange = avgLeft > 0 && gl > 0 ? ((gl - avgLeft) / avgLeft) * 100 : 0;
    const rightChange = avgRight > 0 && gr > 0 ? ((gr - avgRight) / avgRight) * 100 : 0;
    const minGripChange = Math.min(leftChange, rightChange);
    p.metrics.grip = parseFloat(minGripChange.toFixed(1));
    p.metrics.sleep = Number(todayCareEvent.sleep) || 0;

    const acwrSufficient = isAcwrSufficient(p.schedules, todayStr);
    if ((acwrSufficient && p.metrics.acwr >= 1.5) || minGripChange <= -10 || (p.metrics.sleep > 0 && p.metrics.sleep < 6)) p.status = "danger";
    else if ((acwrSufficient && p.metrics.acwr >= 1.3) || minGripChange < -5 || (p.metrics.sleep >= 6 && p.metrics.sleep < 7)) p.status = "warning";
    else p.status = "optimal";
  } else {
    p.metrics.rpe = 0;
    p.metrics.duration = 0;
    p.metrics.gripRaw = 0;
    p.metrics.grip = 0;
    p.metrics.sleep = 0;
  }

  return p;
};
