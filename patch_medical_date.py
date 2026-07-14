import re
with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("""                        <div>
                          <label className="text-sm font-bold text-white mb-3 block">부상 발생일</label>
                          <div className={`input-group !mb-0 ${isEditingModalMode ? 'opacity-50 pointer-events-none' : ''}`}>
                            <span className="material-icons-round">calendar_today</span>
                            <input 
                              type="date" 
                              value={initialPainDate}
                              onChange={(e) => setInitialPainDate(e.target.value)}
                              disabled={isEditingModalMode}
                              max="9999-12-31"
                            />
                          </div>
                        </div>""", """                        <div className={`input-group-select !mb-0 ${isEditingModalMode ? 'opacity-50 pointer-events-none' : ''}`}>
                          <label>부상 발생일</label>
                          <input 
                            type="date" 
                            value={initialPainDate}
                            onChange={(e) => setInitialPainDate(e.target.value)}
                            disabled={isEditingModalMode}
                            max="9999-12-31"
                          />
                        </div>""")

content = content.replace("""                          <div>
                            <label className="text-sm font-bold text-white mb-3 block">현재 부상 상태</label>
                            <div className="input-group !mb-0">
                              <span className="material-icons-round">calendar_today</span>
                              <input 
                                type="date" 
                                value={painDate}
                                onChange={(e) => setPainDate(e.target.value)}
                                max="9999-12-31"
                              />
                            </div>
                          </div>""", """                          <div className="input-group-select !mb-0">
                            <label>현재 부상 상태</label>
                            <input 
                              type="date" 
                              value={painDate}
                              onChange={(e) => setPainDate(e.target.value)}
                              max="9999-12-31"
                            />
                          </div>""")

content = content.replace("""              <div>
                <label className="text-sm font-bold text-white mb-3 block">진료 일자</label>
                <div className="input-group !mb-0">
                  <span className="material-icons-round">calendar_today</span>
                  <input
                    type="date"
                    value={timelineFormDateLabel}
                    onChange={(e) => setTimelineFormDateLabel(e.target.value)}
                    max="9999-12-31"
                  />
                </div>
              </div>""", """              <div className="input-group-select">
                <label>진료 일자</label>
                <input
                  type="date"
                  value={timelineFormDateLabel}
                  onChange={(e) => setTimelineFormDateLabel(e.target.value)}
                  max="9999-12-31"
                />
              </div>""")

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patched MedicalTab")
