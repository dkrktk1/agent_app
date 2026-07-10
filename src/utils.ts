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
  const num = typeof amount === 'string' ? parseInt(amount.replace(/,/g, ''), 10) : amount;
  if (isNaN(num)) return '-';
  if (num === 0) return '0원';
  
  if (num >= 100000000) {
    const uk = Math.floor(num / 100000000);
    const manwon = Math.floor((num % 100000000) / 10000);
    if (manwon === 0) {
      return `${uk}억원`;
    } else if (manwon % 1000 === 0) {
      return `${uk}억 ${manwon / 1000}천만원`;
    } else {
      return `${uk}억 ${manwon.toLocaleString()}만원`;
    }
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
