import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """              <div className="flex flex-col gap-2 mt-2">
                {showDeleteConfirm ? (
                  <>
                    <div className="text-[#FF3B30] text-sm text-center mb-2 font-bold">정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</div>
                    <div className="flex gap-2">
                      <button className="btn-action-outline flex-1 text-white border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setShowDeleteConfirm(false)}>취소</button>
                      <button className="btn-primary flex-1 bg-[#FF3B30] hover:bg-[#FF453A]" onClick={handleDeleteEvent}>정말 삭제하기</button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    {editingEventOriginalIndex !== null && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={handleDeleteEvent}>삭제</button>
                    )}
                    <button className="btn-primary flex-1" onClick={handleAddEvent}>{editingEventOriginalIndex !== null ? '저장하기' : '추가하기'}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}"""

new_code = """            </div>
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">
              <div className="flex flex-col gap-2">
                {showDeleteConfirm ? (
                  <>
                    <div className="text-[#FF3B30] text-sm text-center mb-2 font-bold">정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</div>
                    <div className="flex gap-2 w-full">
                      <button className="btn-action-outline flex-1 text-white border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setShowDeleteConfirm(false)}>취소</button>
                      <button className="btn-primary flex-1 bg-[#FF3B30] hover:bg-[#FF453A]" onClick={handleDeleteEvent}>정말 삭제하기</button>
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2 w-full">
                    {editingEventOriginalIndex !== null && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1" onClick={handleAddEvent}>{editingEventOriginalIndex !== null ? '저장하기' : '추가하기'}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}"""

content = content.replace(old_code, new_code)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
