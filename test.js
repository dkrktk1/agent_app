const calcTop3Avg = (schedules, prop) => {
  if (!schedules || schedules.length === 0) return 0;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
  
  const validValues = schedules
    .filter(s => s.date >= thirtyDaysAgoStr && s[prop] !== undefined && s[prop] > 0)
    .map(s => s[prop])
    .sort((a, b) => b - a)
    .slice(0, 3);
    
  if (validValues.length === 0) return 0;
  return Number((validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(1));
};
