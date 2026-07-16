import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

acwr_marker = """        <div className="chart-header flex justify-between items-center mb-4">
          <h4 className="truncate" style={{ marginBottom: 0 }}>ACWR (급성/만성 부하 비율) 추이 그래프</h4>
          <button 
            onClick={() => setShowPastAcwrModal(true)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors shrink-0"
          >
            <span className="material-icons-round text-[18px]">history</span>
            지난 기록 보기
          </button>
        </div>"""

acwr_replacement = """        <div className="flex flex-col gap-2 mb-4">
          <h4 className="text-left m-0">ACWR (급성/만성 부하 비율) 추이 그래프</h4>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowPastAcwrModal(true)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors shrink-0"
            >
              <span className="material-icons-round text-[18px]">history</span>
              지난 기록 보기
            </button>
          </div>
        </div>"""

sleep_marker = """        <div className="chart-header flex flex-col items-start gap-2 mb-4">
          <h4 style={{ marginBottom: 0 }}>최근 7일 수면 패턴 (Sleep Trend)</h4>
          <button 
            onClick={() => setShowPastSleepModal(true)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors"
          >
            <span className="material-icons-round text-[18px]">history</span>
            지난 기록 보기
          </button>
        </div>"""

sleep_replacement = """        <div className="flex flex-col gap-2 mb-4">
          <h4 className="text-left m-0">최근 7일 수면 패턴 (Sleep Trend)</h4>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowPastSleepModal(true)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors"
            >
              <span className="material-icons-round text-[18px]">history</span>
              지난 기록 보기
            </button>
          </div>
        </div>"""

if acwr_marker in content:
    content = content.replace(acwr_marker, acwr_replacement)
else:
    print("ACWR marker not found")

if sleep_marker in content:
    content = content.replace(sleep_marker, sleep_replacement)
else:
    print("Sleep marker not found")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
