import re

def replace_block(filepath, rounded_class):
    with open(filepath, 'r') as f:
        text = f.read()

    idx1 = text.find('<div className="flex gap-3">')
    # Find the end of the <div className="flex-1"> for RPE
    idx_rpe_label = text.find('RPE 강도(1~10)', idx1)
    idx_end = text.find('</div>', text.find('</input>', idx_rpe_label) if '</input>' in text else text.find('/>', idx_rpe_label))
    idx_end = text.find('</div>', idx_end + 1) + 6 # end of <div className="flex-1">
    idx_end = text.find('</div>', idx_end) + 6 # end of <div className="flex gap-3">

    target = text[idx1:idx_end]
    
    replace_template = """<div className="flex flex-col gap-3">
                      <div>
                        <label className="text-[11px] font-normal text-gray-400 mb-[4px] block">소요 시간(분)</label>
                        <input 
                          type="number" 
                          min="0"
                          placeholder="예: 60"
                          value={session.duration}
                          onChange={e => {
                             const newSessions = [...trainingSessions];
                             newSessions[index].duration = e.target.value === '' ? '' : Number(e.target.value);
                             setTrainingSessions(newSessions);
                          }}
                          className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] {ROUNDED} text-white text-[13px] outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-[4px]">
                          <label className="text-[11px] font-normal text-gray-400 block">RPE 강도(1~10)</label>
                          {session.rpe ? <span className="text-[11px] text-[var(--primary-color)] font-bold">{session.rpe}단계</span> : null}
                        </div>
                        <div className="flex w-full h-[30px] rounded-lg overflow-hidden shadow-inner" style={{ background: 'linear-gradient(to right, #3b82f6, #10b981, #eab308, #f97316, #ef4444)' }}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <div 
                              key={num}
                              onClick={() => {
                                 const newSessions = [...trainingSessions];
                                 newSessions[index].rpe = session.rpe === num ? '' : num;
                                 setTrainingSessions(newSessions);
                              }}
                              className={`flex-1 flex items-center justify-center cursor-pointer text-[12px] font-bold transition-all ${session.rpe === num ? 'bg-white text-[#1f2937] shadow-lg scale-100' : 'text-white/80 hover:bg-white/20 scale-95'}`}
                            >
                              {num}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>"""
                    
    replace = replace_template.replace('{ROUNDED}', rounded_class)

    new_text = text[:idx1] + replace + text[idx_end:]
    
    with open(filepath, 'w') as f:
        f.write(new_text)
    
    print(f"Replaced in {filepath}")

replace_block('src/components/CareTab.tsx', 'rounded-lg')
replace_block('src/components/ScheduleTab.tsx', 'rounded-xl')
