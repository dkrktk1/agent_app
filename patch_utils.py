import re

with open('src/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

new_functions = """
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

"""

if "calculateACWR" not in content:
    content = content.replace("export const rebuildChartsFromSchedules = (player: any) => {", new_functions + "export const rebuildChartsFromSchedules = (player: any) => {")

with open('src/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
