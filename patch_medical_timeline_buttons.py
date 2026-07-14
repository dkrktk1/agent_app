import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                  <button 
                    onClick={handleDeleteTimelineItem}
                    className="flex-1 py-4 border border-[rgba(255,255,255,0.08)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white text-base font-bold transition-colors"
                  >
                    삭제
                  </button>
                  <button 
                    onClick={handleSaveTimelineItem}
                    className="flex-[2] btn-primary py-4 rounded-xl text-base font-bold transition-all"
                  >
                    저장
                  </button>"""

new_code = """                  <button 
                    onClick={handleDeleteTimelineItem}
                    className="flex-1 py-4 border border-[rgba(255,255,255,0.08)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white text-base font-bold transition-colors"
                  >
                    삭제
                  </button>
                  <button 
                    onClick={handleSaveTimelineItem}
                    className="flex-1 btn-primary py-4 rounded-xl text-base font-bold transition-all"
                  >
                    저장
                  </button>"""

content = content.replace(old_code, new_code)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
