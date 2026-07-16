import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """        {todaysEvents.length > 0 ? (
          <div className="flex bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.05)] overflow-hidden">
            <div className="flex flex-col items-center justify-center bg-[rgba(0,0,0,0.25)] font-bold px-4 py-4 min-w-[70px] border-r border-[rgba(255,255,255,0.05)] text-[var(--primary-color)]">
              <span className="text-sm">{todaysEvents[0].date.split('/')[0]}월</span>
              <span className="text-2xl">{todaysEvents[0].date.split('/')[1]}</span>
            </div>
            <div className="flex flex-col flex-1 divide-y divide-[rgba(255,255,255,0.05)]">"""

replacement = """        {todaysEvents.length > 0 ? (
          <div className="player-summary-card">
            <div className="summary-avatar-container shrink-0 self-start">
              <div className="player-profile-img flex flex-col items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-[var(--primary-color)] font-bold" style={{ borderRadius: '50%' }}>
                <span className="text-[12px] leading-none mb-1">{todaysEvents[0].date.split('/')[0]}월</span>
                <span className="text-[20px] leading-none">{todaysEvents[0].date.split('/')[1]}</span>
              </div>
            </div>
            <div className="flex flex-col flex-1 divide-y divide-[var(--card-border)] w-full">"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Marker not found")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
