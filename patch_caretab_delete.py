import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  const handleDeleteHistory = () => {
    let p = { ...player };
    const dateStr = deleteConfirmModal.index;
    if (dateStr) {
      if (deleteConfirmModal.type === 'grip') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.grip = 0; schedule.gripLeft = 0; schedule.gripRight = 0; }
      } else if (deleteConfirmModal.type === 'sleep') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.sleep = 0; schedule.sleepStart = ''; schedule.sleepEnd = ''; }
      } else if (deleteConfirmModal.type === 'acwr') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.rpe = 0; schedule.duration = 0; }
      }
      p = rebuildChartsFromSchedules(p);
      onUpdatePlayer(p);
    }
    setDeleteConfirmModal({ isOpen: false, index: null, type: null });
  };"""

replacement = """  const handleDeleteHistory = () => {
    let p = JSON.parse(JSON.stringify(player));
    const dateStr = deleteConfirmModal.index;
    if (dateStr) {
      if (deleteConfirmModal.type === 'grip') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.grip = 0; schedule.gripLeft = 0; schedule.gripRight = 0; }
      } else if (deleteConfirmModal.type === 'sleep') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.sleep = 0; schedule.sleepStart = ''; schedule.sleepEnd = ''; }
      } else if (deleteConfirmModal.type === 'acwr') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.rpe = 0; schedule.duration = 0; }
      }
      p = rebuildChartsFromSchedules(p);
      onUpdatePlayer(p);
    }
    setDeleteConfirmModal({ isOpen: false, index: null, type: null });
  };"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
