import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                      <button 
                        onClick={savePainData} 
                        className="flex-1 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-bold transition-all btn-primary"
                      >
                        저장
                      </button>"""

new_code = """                      <button 
                        onClick={savePainData} 
                        className="flex-1 py-3 sm:py-4 border border-[var(--primary-color)] bg-[var(--primary-color)] text-[#050608] hover:opacity-90 rounded-xl text-sm sm:text-base font-bold transition-all"
                      >
                        저장
                      </button>"""

content = content.replace(old_code, new_code)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
