export const rebuildChartsFromSchedules = (player: any) => {
  const p = { ...player };
  if (!p.schedules) p.schedules = [];
  
  // Sort schedules by date
  const sortedSchedules = [...p.schedules].sort((a, b) => a.date.localeCompare(b.date));
  
  // Filter for care events
  const careEvents = sortedSchedules.filter(s => s.title === '[컨디셔닝] 당일 지표 측정');
  
  // Take the last 7
  const recentCare = careEvents.slice(-7);
  
  const d = new Date();
  const todayStr = String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0');

  p.gripChartData = {
      labels: recentCare.map(e => e.date === todayStr ? "오늘" : e.date),
      values: recentCare.map(e => e.grip || 0),
      leftValues: recentCare.map(e => e.gripLeft || 0),
      rightValues: recentCare.map(e => e.gripRight || 0)
  };
  
  p.sleepChartData = recentCare.map(e => ({
      date: e.date === todayStr ? "오늘" : e.date,
      sleepDuration: e.sleep || 0
  }));
  
  p.acwrGraphData = recentCare.map(e => ({
      date: e.date === todayStr ? "오늘" : e.date,
      acwr: e.acwr || 0
  }));
  
  return p;
};
