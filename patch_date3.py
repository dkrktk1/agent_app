import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = r"""              <div>
                <label className="text-sm font-bold text-white mb-3 block">진료 일자</label>
                <div 
                  className="relative cursor-pointer block"
                  onClick=\{\(e\) => \{
                    e.preventDefault\(\);
                    const input = e.currentTarget.querySelector\('input\[type="date"\]'\) as HTMLInputElement;
                    if \(input && input.showPicker\) \{
                      try \{ input.showPicker\(\); \} catch \(err\) \{ console.error\(err\); \}
                    \}
                  \}\}
                >
                  <input
                    type="text"
                    value=\{formatKoreanDate\(timelineFormDateLabel\)\}
                    readOnly
                    placeholder="날짜를 선택해주세요"
                    className="w-full bg-\[rgba\(255,255,255,0\.05\)\] border border-\[rgba\(255,255,255,0\.1\)\] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-\[var\(--primary-color\)\] pointer-events-none cursor-pointer"
                  />
                  <input
                    type="date"
                    value=\{timelineFormDateLabel\}
                    onChange=\{\(e\) => setTimelineFormDateLabel\(e.target.value\)\}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                    style=\{\{ position: 'absolute', zIndex: -1 \}\}
                  />
                </div>
              </div>"""

new_code = """              <div>
                <label className="text-sm font-bold text-white mb-3 block">진료 일자</label>
                <label className="relative block cursor-pointer">
                  <div className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm">
                    {timelineFormDateLabel ? formatKoreanDate(timelineFormDateLabel) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                  </div>
                  <input
                    type="date"
                    value={timelineFormDateLabel}
                    onChange={(e) => setTimelineFormDateLabel(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onClick={(e) => {
                      if ('showPicker' in HTMLInputElement.prototype) {
                        try { (e.target as HTMLInputElement).showPicker(); } catch (err) {}
                      }
                    }}
                  />
                </label>
              </div>"""

content = re.sub(old_code, new_code, content)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
