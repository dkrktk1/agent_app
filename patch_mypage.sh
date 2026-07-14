#!/bin/bash
cat << 'INNEREOF' > temp.tsx
                  <div className="flex flex-col gap-2 mt-2 shrink-0">
                    <div className="flex gap-2">
                      {isAgent && (
                        <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                      )}
                      <button className="btn-primary flex-1" onClick={handleSaveProfile}>저장하기</button>
                    </div>
                  </div>
INNEREOF
sed -i -e '/<div className="flex flex-col gap-2 mt-2 shrink-0">/,/<\/div>                 <\/div>               <\/div>             <\/div>           <\/div>         <\/div>       )}     <\/div>   ); }/c\
                  <div className="flex flex-col gap-2 mt-2 shrink-0">\
                    <div className="flex gap-2">\
                      {isAgent && (\
                        <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={() => setShowDeleteConfirm(true)}>삭제</button>\
                      )}\
                      <button className="btn-primary flex-1" onClick={handleSaveProfile}>저장하기</button>\
                    </div>\
                  </div>\
                </div>\
              </>\
            )}\
          </div>\
        </div>\
      )}\
\
      {showDeleteConfirm && (\
        <div className="fixed inset-0 z-[1000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">\
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 animate-scale-up">\
            <h3 className="text-lg font-bold text-white mb-2 text-center">프로필 삭제</h3>\
            <p className="text-[#FF3B30] text-sm text-center mb-6">정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>\
            <div className="flex gap-3">\
              <button \
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"\
                onClick={() => setShowDeleteConfirm(false)}\
              >\
                취소\
              </button>\
              <button \
                className="flex-1 py-3 rounded-xl bg-[#FF3B30] text-white font-bold hover:bg-[#FF453A] transition-colors"\
                onClick={handleDeleteProfile}\
              >\
                삭제\
              </button>\
            </div>\
          </div>\
        </div>\
      )}\
    </div>\
  );\
}' src/components/MyPageTab.tsx
