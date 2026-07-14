with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                        <div>
                          <label className="text-sm font-bold text-white mb-3 block">부상 발생일</label>
                          <input 
                            type="date" 
                            value={initialPainDate}
                            onChange={(e) => setInitialPainDate(e.target.value)}
                            disabled={isEditingModalMode}
                            className={`w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] ${isEditingModalMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={(e) => { if (!isEditingModalMode && (e.target as HTMLInputElement).showPicker) { try { (e.target as HTMLInputElement).showPicker(); } catch (err) {} } }}
                          />
                        </div>"""

new_code = """                        <div>
                          <label className="text-sm font-bold text-white mb-3 block">부상 발생일</label>
                          <div 
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
                          </div>
                        </div>"""

content = content.replace(old_code, new_code)

old_code_2 = """                          <div>
                            <label className="text-sm font-bold text-white mb-3 block">현재 부상 상태</label>
                            <input 
                              type="date" 
                              value={painDate}
                              onChange={(e) => setPainDate(e.target.value)}
                              className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] cursor-pointer"
                              onClick={(e) => { if ((e.target as HTMLInputElement).showPicker) { try { (e.target as HTMLInputElement).showPicker(); } catch (err) {} } }}
                            />
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
                              {painDate ? formatKoreanDate(painDate) : <span className="text-gray-400">날짜를 선택해주세요</span>}
                              <input 
                                type="date" 
                                value={painDate}
                                onChange={(e) => setPainDate(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                          </div>"""

content = content.replace(old_code_2, new_code_2)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
