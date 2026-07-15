import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. replace deleteConfirmModal type
old_modal_type = "const [deleteConfirmModal, setDeleteConfirmModal] = useState<{isOpen: boolean, index: number | null, type: 'grip' | 'sleep' | 'acwr' | null}>({isOpen: false, index: null, type: null});"
new_modal_type = "const [deleteConfirmModal, setDeleteConfirmModal] = useState<{isOpen: boolean, index: string | null, type: 'grip' | 'sleep' | 'acwr' | null}>({isOpen: false, index: null, type: null});"
content = content.replace(old_modal_type, new_modal_type)

# 2. replace useState block for histories and handleDeleteHistory
marker = """  const [gripHistoryData, setGripHistoryData] = useState<any[]>(() => {
    return Array.from({length: 60}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i - 7);
      return { id: i, date: d.toISOString().split('T')[0], left: Math.floor(Math.random() * 10 + 45), right: Math.floor(Math.random() * 10 + 46) };
    });
  });

  const [acwrHistoryData, setAcwrHistoryData] = useState<any[]>(() => {
    return Array.from({length: 60}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i - 7);
      return { 
        id: i, 
        date: d.toISOString().split('T')[0], 
        rpe: Math.floor(Math.random() * 8 + 2), 
        duration: Math.floor(Math.random() * 90 + 30)
      };
    });
  });

  const [sleepHistoryData, setSleepHistoryData] = useState<any[]>(() => {
    return Array.from({length: 60}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i - 7);
      const duration = Number((Math.random() * 4 + 5).toFixed(1));
      const startHour = 22 + Math.floor(Math.random() * 4);
      const startMin = Math.floor(Math.random() * 12) * 5;
      const startH = startHour >= 24 ? startHour - 24 : startHour;
      const endTotalMin = (startHour * 60 + startMin) + Math.floor(duration * 60);
      const endH = Math.floor(endTotalMin / 60) % 24;
      const endM = endTotalMin % 60;
      const pad = (n: number) => n.toString().padStart(2, '0');
      return { 
        id: i,
        date: d.toISOString().split('T')[0], 
        duration,
        sleepStart: `${pad(startH)}:${pad(startMin)}`,
        sleepEnd: `${pad(endH)}:${pad(endM)}`
      };
    });
  });

  const handleDeleteHistory = () => {
    if (deleteConfirmModal.type === 'grip') {
      setGripHistoryData(prev => prev.filter(item => item.id !== deleteConfirmModal.index));
    } else if (deleteConfirmModal.type === 'sleep') {
      setSleepHistoryData(prev => prev.filter(item => item.id !== deleteConfirmModal.index));
    } else if (deleteConfirmModal.type === 'acwr') {
      setAcwrHistoryData(prev => prev.filter(item => item.id !== deleteConfirmModal.index));
    }
    setDeleteConfirmModal({ isOpen: false, index: null, type: null });
  };"""

replacement = """  const currentYear = new Date().getFullYear();
  const realCareSchedules = (player.schedules?.filter((s: any) => s.title?.includes('[컨디셔닝]')) || []).slice().reverse();

  const gripHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    left: s.gripLeft || 0,
    right: s.gripRight || 0,
    grip: s.grip || 0
  }));

  const acwrHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    rpe: s.rpe || 0,
    duration: s.duration || 0,
    acwr: s.acwr || 0
  }));

  const sleepHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    duration: s.sleep || 0,
    sleepStart: s.sleepStart || '00:00',
    sleepEnd: s.sleepEnd || '00:00'
  }));

  const handleDeleteHistory = () => {
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

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker for histories not found!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
