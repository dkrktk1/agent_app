import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1 & 2: 부상 발생일 and 현재 부상 상태
# Remove .input-group-select !mb-0
content = content.replace(
    'className={`input-group-select !mb-0 ${isEditingModalMode ? \'opacity-50 pointer-events-none\' : \'\'}`}',
    'className={`flex flex-col gap-[6px] ${isEditingModalMode ? \'opacity-50 pointer-events-none\' : \'\'}`}'
)

# Replace the input for 부상 발생일
old_initial_date = """                          <input 
                            type="date" 
                            value={initialPainDate}
                            onChange={(e) => setInitialPainDate(e.target.value)}
                            disabled={isEditingModalMode}
                            max="9999-12-31"
                          />"""
new_initial_date = """                          <input 
                            type="date" 
                            value={initialPainDate}
                            onChange={(e) => setInitialPainDate(e.target.value)}
                            disabled={isEditingModalMode}
                            max="9999-12-31"
                            className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 outline-none transition-colors"
                          />"""
content = content.replace(old_initial_date, new_initial_date)

# Replace the input for 현재 부상 상태
old_pain_date = """                            <input 
                              type="date" 
                              value={painDate}
                              onChange={(e) => setPainDate(e.target.value)}
                              max="9999-12-31"
                            />"""
new_pain_date = """                            <input 
                              type="date" 
                              value={painDate}
                              onChange={(e) => setPainDate(e.target.value)}
                              max="9999-12-31"
                              className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 outline-none transition-colors"
                            />"""
content = content.replace(old_pain_date, new_pain_date)
# Also change the wrapper of 현재 부상 상태 from <div> to <div className="flex flex-col gap-[6px]"> to match the title gap
content = content.replace(
    """                          <div>
                            <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">현재 부상 상태</label>""",
    """                          <div className="flex flex-col gap-[6px]">
                            <label className="text-[13px] font-normal text-gray-300 block">현재 부상 상태</label>"""
)

# And remove mb-[6px] from 부상 발생일 label since we use gap-[6px]
content = content.replace(
    '<label className="text-[13px] font-normal text-gray-300 mb-[6px] block">부상 발생일</label>',
    '<label className="text-[13px] font-normal text-gray-300 block">부상 발생일</label>'
)

# 3: 진단명, 치료기간, 부상 내용 테두리 변경
content = content.replace(
    'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--primary-color)] rounded-xl px-3 focus:outline-none transition-colors"',
    'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 focus:outline-none transition-colors"'
)
content = content.replace(
    'className="w-full bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--primary-color)] rounded-xl py-3 px-3 focus:outline-none transition-colors resize-none leading-relaxed"',
    'className="w-full bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl py-3 px-3 focus:outline-none transition-colors resize-none leading-relaxed"'
)

# 4 & 5: 부상 내용 제목과 입력칸 간격 수정, 저장 버튼 사이 줄간격 12px 추가
old_reason = """                      <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">부상 내용</label>
                        <textarea 
                          value={painReason}
                          onChange={(e) => setPainReason(e.target.value)}
                          placeholder="부상 내용을 자세히 입력해주세요..."
                          rows={3}
                          className="w-full bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl py-3 px-3 focus:outline-none transition-colors resize-none leading-relaxed"
                        />
                      </div>"""
new_reason = """                      <div className="mb-[12px]">
                        <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">부상 내용</label>
                        <textarea 
                          value={painReason}
                          onChange={(e) => setPainReason(e.target.value)}
                          placeholder="부상 내용을 자세히 입력해주세요..."
                          rows={3}
                          className="w-full bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl py-3 px-3 focus:outline-none transition-colors resize-none leading-relaxed"
                        />
                      </div>
                      </div>"""
content = content.replace(old_reason, new_reason)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
