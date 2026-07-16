import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Issue 1: Grip Strength chart bars and labels
content = content.replace('barGap={4}', 'barGap={2}')
content = content.replace('barCategoryGap="40%"', 'barCategoryGap="20%"')
content = content.replace('maxBarSize={10}', 'maxBarSize={16}')

content = content.replace('fontSize={12} fontWeight="bold" textAnchor="middle">\n                          좌', 'fontSize={10} fontWeight="bold" textAnchor="middle">\n                          좌')
content = content.replace('fontSize={12} fontWeight="bold" textAnchor="middle">\n                          {value}', 'fontSize={11} fontWeight="bold" textAnchor="middle">\n                          {value}')
content = content.replace('fontSize={12} fontWeight="bold" textAnchor="middle">\n                          우', 'fontSize={10} fontWeight="bold" textAnchor="middle">\n                          우')

# Issue 2: Sleep Pattern title and button layout
sleep_header_marker = """        <div className="chart-header flex justify-between items-center mb-4">
          <h4 style={{ marginBottom: 0 }}>최근 7일 수면 패턴 (Sleep Trend)</h4>
          <button 
            onClick={() => setShowPastSleepModal(true)}"""

sleep_header_replacement = """        <div className="chart-header flex flex-col items-start gap-2 mb-4">
          <h4 style={{ marginBottom: 0 }}>최근 7일 수면 패턴 (Sleep Trend)</h4>
          <button 
            onClick={() => setShowPastSleepModal(true)}"""

content = content.replace(sleep_header_marker, sleep_header_replacement)

# Issue 3: Past sleep pattern modal whitespace
sleep_modal_marker = """                            <div className="flex flex-col text-right">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">총 수면</span>
                              <span className="text-[15px] font-bold text-white">{item.duration} 시간</span>
                            </div>"""

sleep_modal_replacement = """                            <div className="flex flex-col text-right">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">총 수면</span>
                              <span className="text-[15px] font-bold text-white whitespace-nowrap">{item.duration} 시간</span>
                            </div>"""

content = content.replace(sleep_modal_marker, sleep_modal_replacement)

sleep_modal_marker2 = """                            <div className="flex flex-col text-left border-r border-[rgba(255,255,255,0.1)] pr-4">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">취침 - 기상</span>
                              <span className="text-[14px] font-medium text-gray-300">{item.sleepStart} ~ {item.sleepEnd}</span>
                            </div>"""

sleep_modal_replacement2 = """                            <div className="flex flex-col text-left border-r border-[rgba(255,255,255,0.1)] pr-4 shrink-0">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">취침 - 기상</span>
                              <span className="text-[14px] font-medium text-gray-300 whitespace-nowrap">{item.sleepStart} ~ {item.sleepEnd}</span>
                            </div>"""

content = content.replace(sleep_modal_marker2, sleep_modal_replacement2)


with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
