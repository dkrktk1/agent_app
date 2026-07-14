with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix initialPainDate
old_code_1 = """                          <div 
                            className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm relative overflow-hidden flex items-center ${isEditingModalMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={(e) => {
                              if (isEditingModalMode) return;
                              const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                              if (input && 'showPicker' in HTMLInputElement.prototype) {
                                try { input.showPicker(); } catch (err) {}
                              }
                            }}
                          >
                            {initialPainDate ? formatKoreanDate(initialPainDate) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                            <input 
                              type="date" 
                              value={initialPainDate}
                              onChange={(e) => setInitialPainDate(e.target.value)}
                              disabled={isEditingModalMode}
                              className={`absolute inset-0 w-full h-full opacity-0 ${isEditingModalMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            />
                          </div>"""

new_code_1 = """                          <div 
                            className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm relative overflow-hidden flex items-center ${isEditingModalMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={(e) => {
                              if (isEditingModalMode) return;
                              const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                              if (input && 'showPicker' in HTMLInputElement.prototype) {
                                try { input.showPicker(); } catch (err) {}
                              }
                            }}
                          >
                            <span className="relative z-0 pointer-events-none whitespace-nowrap block w-full truncate">
                              {initialPainDate ? formatKoreanDate(initialPainDate) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                            </span>
                            <input 
                              type="date" 
                              value={initialPainDate}
                              onChange={(e) => setInitialPainDate(e.target.value)}
                              disabled={isEditingModalMode}
                              className={`absolute inset-0 w-full h-full opacity-0 z-10 ${isEditingModalMode ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            />
                          </div>"""
content = content.replace(old_code_1, new_code_1)

# Fix painDate
old_code_2 = """                          <div>
                            <label className="text-sm font-bold text-white mb-3 block">현재 부상 상태</label>
                            <div 
                              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm cursor-pointer relative overflow-hidden flex items-center"
                              onClick={(e) => {
                                const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                                if (input && 'showPicker' in HTMLInputElement.prototype) {
                                  try { input.showPicker(); } catch (err) {}
                                }
                              }}
                            >
                              {painDate ? formatKoreanDate(painDate) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                              <input 
                                type="date" 
                                value={painDate}
                                onChange={(e) => setPainDate(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>"""

new_code_2 = """                          <div>
                            <label className="text-sm font-bold text-white mb-3 block">현재 부상 상태</label>
                            <div 
                              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm cursor-pointer relative overflow-hidden flex items-center"
                              onClick={(e) => {
                                const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                                if (input && 'showPicker' in HTMLInputElement.prototype) {
                                  try { input.showPicker(); } catch (err) {}
                                }
                              }}
                            >
                              <span className="relative z-0 pointer-events-none whitespace-nowrap block w-full truncate">
                                {painDate ? formatKoreanDate(painDate) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                              </span>
                              <input 
                                type="date" 
                                value={painDate}
                                onChange={(e) => setPainDate(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                              />
                            </div>
                          </div>"""
content = content.replace(old_code_2, new_code_2)

# Fix timelineFormDateLabel
old_code_3 = """              <div>
                <label className="text-sm font-bold text-white mb-3 block">진료 일자</label>
                <div 
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm cursor-pointer relative overflow-hidden flex items-center"
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                    if (input && 'showPicker' in HTMLInputElement.prototype) {
                      try { input.showPicker(); } catch (err) {}
                    }
                  }}
                >
                  {timelineFormDateLabel ? formatKoreanDate(timelineFormDateLabel) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                  <input
                    type="date"
                    value={timelineFormDateLabel}
                    onChange={(e) => setTimelineFormDateLabel(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>"""

new_code_3 = """              <div>
                <label className="text-sm font-bold text-white mb-3 block">진료 일자</label>
                <div 
                  className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm cursor-pointer relative overflow-hidden flex items-center"
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector('input[type="date"]') as HTMLInputElement;
                    if (input && 'showPicker' in HTMLInputElement.prototype) {
                      try { input.showPicker(); } catch (err) {}
                    }
                  }}
                >
                  <span className="relative z-0 pointer-events-none whitespace-nowrap block w-full truncate">
                    {timelineFormDateLabel ? formatKoreanDate(timelineFormDateLabel) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                  </span>
                  <input
                    type="date"
                    value={timelineFormDateLabel}
                    onChange={(e) => setTimelineFormDateLabel(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>"""
content = content.replace(old_code_3, new_code_3)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
