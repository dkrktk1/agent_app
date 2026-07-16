import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """                  filteredData.map((item: any, idx: number) => (
                    <div key={item.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">
                          <span className="material-icons-round text-gray-400 text-[20px]">{isGrip ? 'fitness_center' : isAcwr ? 'trending_up' : 'bedtime'}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-[15px]">{item.date}</span>
                          <span className="text-gray-400 text-[13px]">{getWeekOfMonth(item.date)}주차 기록</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        {isGrip ? (
                          <>
                            <div className="flex flex-col">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">왼손</span>
                              <span className="text-[15px] font-bold text-white">{item.left} kg</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">오른손</span>
                              <span className="text-[15px] font-bold text-white">{item.right} kg</span>
                            </div>
                          </>
                        ) : isAcwr ? (
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center border-r border-[rgba(255,255,255,0.1)] pr-4">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">인지된 훈련 강도</span>
                              <span className="text-[14px] font-medium text-gray-300">{item.rpe}</span>
                            </div>
                            <div className="flex flex-col items-center border-r border-[rgba(255,255,255,0.1)] pr-4">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">훈련 시간</span>
                              <span className="text-[14px] font-medium text-gray-300">{item.duration} 분</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">일일 훈련 부하</span>
                              <span className="text-[15px] font-bold text-white">{item.rpe * item.duration}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-4">
                            <div className="flex flex-col text-left border-r border-[rgba(255,255,255,0.1)] pr-4 shrink-0">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">취침 - 기상</span>
                              <span className="text-[14px] font-medium text-gray-300 whitespace-nowrap">{item.sleepStart} ~ {item.sleepEnd}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">총 수면</span>
                              <span className="text-[15px] font-bold text-white whitespace-nowrap">{item.duration} 시간</span>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => setDeleteConfirmModal({ isOpen: true, index: item.id, type: isGrip ? 'grip' : isAcwr ? 'acwr' : 'sleep' })}
                          className="ml-2 p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center shrink-0"
                        >
                          <span className="material-icons-round text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))"""

replacement = """                  filteredData.map((item: any, idx: number) => (
                    <div key={item.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden p-4 flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">
                          <span className="material-icons-round text-gray-400 text-[18px]">{isGrip ? 'fitness_center' : isAcwr ? 'trending_up' : 'bedtime'}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-white font-bold text-[15px]">{item.date}</span>
                          <span className="text-gray-400 text-[12px] bg-black/30 px-2 py-0.5 rounded-md font-medium">{getWeekOfMonth(item.date)}주차 기록</span>
                        </div>
                        <button
                          onClick={() => setDeleteConfirmModal({ isOpen: true, index: item.id, type: isGrip ? 'grip' : isAcwr ? 'acwr' : 'sleep' })}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center shrink-0"
                        >
                          <span className="material-icons-round text-[18px]">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2 w-full justify-between bg-black/20 rounded-lg p-3">
                        {isGrip ? (
                          <>
                            <div className="flex flex-col items-center flex-1 border-r border-[rgba(255,255,255,0.1)]">
                              <span className="text-[11px] text-gray-500 font-bold mb-0.5">왼손</span>
                              <span className="text-[14px] font-bold text-white">{item.left} kg</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                              <span className="text-[11px] text-gray-500 font-bold mb-0.5">오른손</span>
                              <span className="text-[14px] font-bold text-white">{item.right} kg</span>
                            </div>
                          </>
                        ) : isAcwr ? (
                          <>
                            <div className="flex flex-col items-center flex-1 border-r border-[rgba(255,255,255,0.1)]">
                              <span className="text-[11px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">인지된 강도</span>
                              <span className="text-[14px] font-medium text-gray-300">{item.rpe}</span>
                            </div>
                            <div className="flex flex-col items-center flex-1 border-r border-[rgba(255,255,255,0.1)]">
                              <span className="text-[11px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">훈련 시간</span>
                              <span className="text-[14px] font-medium text-gray-300">{item.duration} 분</span>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                              <span className="text-[11px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">일일 부하</span>
                              <span className="text-[14px] font-bold text-white">{item.rpe * item.duration}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col flex-1 items-center border-r border-[rgba(255,255,255,0.1)]">
                              <span className="text-[11px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">취침 - 기상</span>
                              <span className="text-[13px] font-medium text-gray-300 whitespace-nowrap">{item.sleepStart} ~ {item.sleepEnd}</span>
                            </div>
                            <div className="flex flex-col flex-1 items-center">
                              <span className="text-[11px] text-gray-500 font-bold mb-0.5 whitespace-nowrap">총 수면</span>
                              <span className="text-[14px] font-bold text-white whitespace-nowrap">{item.duration} 시간</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced successfully")
else:
    print("Target not found")
