import re
with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """                  <div className="flex gap-2 w-full">
                    {editingEventOriginalIndex !== null && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1" onClick={handleAddEvent}>{editingEventOriginalIndex !== null ? '저장하기' : '추가하기'}</button>
                  </div>"""

new_code = """                  <div className="flex gap-2 w-full mt-[10px]">
                    {editingEventOriginalIndex !== null && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-[40px]" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1 h-[40px] flex items-center justify-center" onClick={handleAddEvent}>{editingEventOriginalIndex !== null ? '저장하기' : '추가하기'}</button>
                  </div>"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched footer buttons successfully")
else:
    print("Could not find old_code")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
