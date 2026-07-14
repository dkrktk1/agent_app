#!/bin/bash
sed -i -e '/const submitDailyLog = () => {/i \
  const renderPastHistoryModal = (type: '\''grip'\'' | '\''sleep'\'') => {\
    const isGrip = type === '\''grip'\'';\
    const showModal = isGrip ? showPastGripModal : showPastSleepModal;\
    const setShowModal = isGrip ? setShowPastGripModal : setShowPastSleepModal;\
    if (!showModal) return null;\
\
    const year = isGrip ? pastGripYear : pastSleepYear;\
    const setYear = isGrip ? setPastGripYear : setPastSleepYear;\
    const month = isGrip ? pastGripMonth : pastSleepMonth;\
    const setMonth = isGrip ? setPastGripMonth : setPastSleepMonth;\
    const week = isGrip ? pastGripWeek : pastSleepWeek;\
    const setWeek = isGrip ? setPastGripWeek : setPastSleepWeek;\
\
    const currentYear = new Date().getFullYear();\
    const years = Array.from({length: 3}, (_, i) => (currentYear - i).toString());\
\
    const historyData = Array.from({length: 60}, (_, i) => {\
      const d = new Date();\
      d.setDate(d.getDate() - i - 7);\
      const dStr = d.toISOString().split('\''T'\'')[0];\
      if (isGrip) {\
        return { date: dStr, left: Math.floor(Math.random() * 10 + 45), right: Math.floor(Math.random() * 10 + 46) };\
      } else {\
        return { date: dStr, duration: Number((Math.random() * 4 + 5).toFixed(1)) };\
      }\
    });\
\
    const getWeekOfMonth = (dateStr: string) => {\
      const d = new Date(dateStr);\
      const date = d.getDate();\
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();\
      return Math.ceil((date + firstDay) / 7);\
    };\
\
    const filteredData = historyData.filter(item => {\
      const itemYear = item.date.substring(0, 4);\
      if (year !== itemYear) return false;\
      if (month !== '\''all'\'') {\
        const itemMonth = item.date.substring(5, 7);\
        if (itemMonth !== month) return false;\
      }\
      if (week !== '\''all'\'') {\
        const itemWeek = getWeekOfMonth(item.date).toString();\
        if (itemWeek !== week) return false;\
      }\
      return true;\
    });\
\
    return (\
      <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">\
        <div className="card-chart bg-[var(--card-bg)] w-full max-w-2xl rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">\
          <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">\
            <h4 className="text-lg font-bold text-white flex items-center gap-2">\
              <span className="material-icons-round text-gray-400">history</span>\
              과거 {isGrip ? '\''악력'\'' : '\''수면 패턴'\''} 기록\
            </h4>\
            <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowModal(false)}>close</span>\
          </div>\
          <div className="p-6 overflow-y-auto">\
            <div className="flex flex-col gap-6">\
              <div className="flex gap-3 flex-wrap sm:flex-nowrap">\
                <select value={year} onChange={(e) => setYear(e.target.value)} className="flex-1 bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[#3b82f6] outline-none">\
                  {years.map(y => (\
                    <option key={y} value={y} className="bg-[#1e1e1e]">{y}년</option>\
                  ))}\
                </select>\
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="flex-1 bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[#3b82f6] outline-none">\
                  <option value="all" className="bg-[#1e1e1e]">전체 월</option>\
                  {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '\''0'\'')).map(m => (\
                    <option key={m} value={m} className="bg-[#1e1e1e]">{parseInt(m)}월</option>\
                  ))}\
                </select>\
                <select value={week} onChange={(e) => setWeek(e.target.value)} className="flex-1 bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[#3b82f6] outline-none">\
                  <option value="all" className="bg-[#1e1e1e]">전체 주</option>\
                  {[1, 2, 3, 4, 5].map(w => (\
                    <option key={w} value={w.toString()} className="bg-[#1e1e1e]">{w}주차</option>\
                  ))}\
                </select>\
              </div>\
              <div className="flex flex-col gap-3">\
                {filteredData.length === 0 ? (\
                  <div className="py-8 text-center text-gray-500 font-medium">해당 기간의 기록이 없습니다.</div>\
                ) : (\
                  filteredData.map((item: any, idx: number) => (\
                    <div key={idx} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden p-4 flex items-center justify-between">\
                      <div className="flex items-center gap-4">\
                        <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">\
                          <span className="material-icons-round text-gray-400 text-[20px]">{isGrip ? '\''fitness_center'\'' : '\''bedtime'\''}</span>\
                        </div>\
                        <div className="flex flex-col">\
                          <span className="text-white font-bold text-[15px]">{item.date}</span>\
                          <span className="text-gray-400 text-[13px]">{getWeekOfMonth(item.date)}주차 기록</span>\
                        </div>\
                      </div>\
                      <div className="flex items-center gap-4 text-right">\
                        {isGrip ? (\
                          <>\
                            <div className="flex flex-col">\
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">왼손</span>\
                              <span className="text-[15px] font-bold text-white">{item.left} kg</span>\
                            </div>\
                            <div className="flex flex-col">\
                              <span className="text-[12px] text-gray-500 font-bold mb-0.5">오른손</span>\
                              <span className="text-[15px] font-bold text-white">{item.right} kg</span>\
                            </div>\
                          </>\
                        ) : (\
                          <div className="flex flex-col">\
                            <span className="text-[12px] text-gray-500 font-bold mb-0.5">수면 시간</span>\
                            <span className="text-[15px] font-bold text-white">{item.duration} 시간</span>\
                          </div>\
                        )}\
                      </div>\
                    </div>\
                  ))\
                )}\
              </div>\
            </div>\
          </div>\
        </div>\
      </div>\
    );\
  };' src/components/CareTab.tsx
