#!/bin/bash
cat << 'INNEREOF' > temp2.tsx
        {!isAgent ? (
          <div className="flex gap-2">
            <button className="flex-1 py-3.5 px-4 rounded-xl font-bold bg-[#2A2D35] text-white hover:bg-[#343842] transition-colors" onClick={() => handlePlayerClick({ ...activeUser, id: activeUser.id || activeUser.userId }, true)}>
              프로필 수정
            </button>
            <button className="flex-1 py-3.5 px-4 rounded-xl font-bold bg-[var(--primary-color)] text-black hover:opacity-90 transition-opacity" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <>
            {Object.keys(teamGroups).length > 0 && (
              <div className="mb-8">
                <h4 className="text-[var(--text-muted)] font-bold text-sm mb-5 tracking-wide uppercase">구단별 소속 선수</h4>
                <div className="flex flex-col">
                  {Object.keys(teamGroups).sort().map(teamName => (
                    <div key={teamName} className="card-chart flex flex-col">
                      <div className="text-center pb-3 mb-2 border-b border-[var(--card-border)]">
                        <span className="font-bold text-[var(--primary-color)]">{teamName}</span>
                        <span className="text-[var(--text-muted)] text-sm ml-2">({teamGroups[teamName].length}명)</span>
                      </div>
                      <div className="flex flex-col divide-y divide-[var(--card-border)]">
                        {teamGroups[teamName].map((p: any) => (
                          <div 
                            key={p.id}
                            className="py-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handlePlayerClick(p)}
                          >
                            <div className="flex items-center gap-3">
                              {p.profileImg ? (
                                <img src={p.profileImg} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" />
                              ) : (
                                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)]">
                                  <span className="material-icons-round text-xl">person</span>
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white mb-0.5 flex items-center gap-2">
                                  {p.name}
                                  {p.playerNumber && <span className="text-xs text-[var(--text-muted)] font-mono">No.{p.playerNumber}</span>}
                                </div>
                                <div className="text-[13px] text-gray-400">{p.position || p.playerPosition || '-'}</div>
                              </div>
                            </div>
                            <div 
                              className="p-1 -mr-1 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center justify-center cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayerClick(p, true);
                              }}
                            >
                              <span className="material-icons-round text-gray-500 text-[20px]">edit</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="w-full py-3.5 px-4 rounded-xl font-bold bg-[var(--primary-color)] text-black hover:opacity-90 transition-opacity" onClick={onLogout}>로그아웃</button>
          </>
        )}
      </div>
INNEREOF

sed -i -e '/{!isAgent && (/,/<\/button>         <\/div>       <\/div>/!b' src/components/MyPageTab.tsx
