import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix CareTab open daily log behavior to load today's existing data if it exists.
# <button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => {
#           setLogDuration('');
#           setLogGripLeft('');
#           setLogGripRight('');
#           setIsDailyLogOpen(true);
#         }}>

old_open = """        <button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => {
          setLogDuration('');
          setLogGripLeft('');
          setLogGripRight('');
          setIsDailyLogOpen(true);
        }}>"""

new_open = """        <button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => {
          const today = new Date();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const d = String(today.getDate()).padStart(2, '0');
          const dateStr = `${month}/${d}`;
          const existing = player?.schedules?.find((s: any) => s.date === dateStr && s.title === '[컨디셔닝] 당일 지표 측정');
          if (existing) {
             setLogRpe(existing.rpe || 7);
             setLogDuration(existing.duration || 120);
             setLogGripLeft(existing.gripLeft || '');
             setLogGripRight(existing.gripRight || '');
             if (existing.sleepStart) setSleepStart(existing.sleepStart);
             if (existing.sleepEnd) setSleepEnd(existing.sleepEnd);
          } else {
             setLogRpe(7);
             setLogDuration(120);
             setLogGripLeft('');
             setLogGripRight('');
             setSleepStart('23:00');
             setSleepEnd('07:00');
          }
          setIsDailyLogOpen(true);
        }}>"""

content = content.replace(old_open, new_open)

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

