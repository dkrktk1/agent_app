import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """          <div className="flex flex-col items-center justify-center">
            <div className={`text-3xl md:text-4xl font-black leading-none text-center mb-2 ${acwrStatusColor}`}>
              {isAcwrEmpty ? '-' : latestAcwr.toFixed(2)}
            </div>
            <div className="text-xs md:text-sm font-medium mt-3 opacity-0 pointer-events-none select-none">
              -
            </div>
          </div>"""

replacement = """          <div className="flex flex-col items-center justify-center">
            <div className={`text-3xl md:text-4xl font-black leading-none text-center mb-2 ${acwrStatusColor}`}>
              {isAcwrEmpty ? '-' : latestAcwr.toFixed(2)}
            </div>
            {todayLoad !== null && (
              <div className="text-xs md:text-sm text-[var(--text-muted)] font-medium mt-5">
                일일 훈련 부하: {todayLoad}
              </div>
            )}
            {todayLoad === null && (
              <div className="text-xs md:text-sm font-medium mt-5 opacity-0 pointer-events-none select-none">
                -
              </div>
            )}
          </div>"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in CareTab 583!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
