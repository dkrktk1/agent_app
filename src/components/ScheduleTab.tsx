import React, { useState } from 'react';
import { useModalHistory } from '../hooks/useModalHistory';
import { getPartName, rebuildChartsFromSchedules, isAcwrSufficient } from '../utils';

const getRpeText = (rpe: number | string) => {
  const r = Number(rpe);
  if (r === 10) return '최대 노력';
  if (r === 9) return '매우 힘듦';
  if (r >= 7) return '격렬함';
  if (r >= 4) return '적당함';
  if (r >= 2) return '가벼움';
  if (r === 1) return '매우 가벼움';
  return '';
};

const TimeSelect = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) => {
  const [h, m] = value.split(':');
  const hNum = Number(h);
  const ampm = hNum >= 12 ? 'PM' : 'AM';
  const hour12 = hNum % 12 || 12;
  
  const handleAmPmVal = (newAmPm: 'AM' | 'PM') => {
    const newH24 = newAmPm === 'PM' ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
    onChange(`${newH24.toString().padStart(2, '0')}:${m}`);
  };
  
  const handleHour = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newHour12 = Number(e.target.value);
    const newH24 = ampm === 'PM' ? (newHour12 === 12 ? 12 : newHour12 + 12) : (newHour12 === 12 ? 0 : newHour12);
    onChange(`${newH24.toString().padStart(2, '0')}:${m}`);
  };
  
  const handleMinute = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${h}:${e.target.value}`);
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">{label}</label>
      <div className="flex gap-2">
        <button 
          className={`px-4 h-[30px] flex items-center justify-center text-[13px] font-bold rounded-xl transition-colors border ${ampm === 'AM' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
          onClick={() => handleAmPmVal('AM')}
        >
          오전
        </button>
        <button 
          className={`px-4 h-[30px] flex items-center justify-center text-[13px] font-bold rounded-xl transition-colors border ${ampm === 'PM' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
          onClick={() => handleAmPmVal('PM')}
        >
          오후
        </button>
        <div className="flex-1" style={{ marginBottom: 0 }}>
          <select value={hour12.toString()} onChange={handleHour} className="w-full h-[30px] bg-[#1e293b] border border-[rgba(255,255,255,0.1)] focus:border-[#3b82f6] rounded-xl px-2 text-white text-[13px] outline-none appearance-none text-center">
            {[...Array(12)].map((_, i) => (
              <option key={i+1} value={(i+1).toString()} className="bg-[#1f2937] text-white">{(i+1).toString().padStart(2, '0')}시</option>
            ))}
          </select>
        </div>
        <div className="flex-1" style={{ marginBottom: 0 }}>
          <select value={m} onChange={handleMinute} className="w-full h-[30px] bg-[#1e293b] border border-[rgba(255,255,255,0.1)] focus:border-[#3b82f6] rounded-xl px-2 text-white text-[13px] outline-none appearance-none text-center">
            {[...Array(12)].map((_, i) => {
              const minStr = (i * 5).toString().padStart(2, '0');
              return <option key={minStr} value={minStr} className="bg-[#1f2937] text-white">{minStr}분</option>;
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default function ScheduleTab({ player, isAgent, onUpdatePlayer }: { player: any, isAgent: boolean, onUpdatePlayer?: (newData: any) => void, key?: string }) {
  const [calendarType, setCalendarType] = useState<'match' | 'biz' | 'care' | 'medical'>('match');
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEventOriginalIndex, setEditingEventOriginalIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useModalHistory(isAddModalOpen, () => setIsAddModalOpen(false));
  useModalHistory(showDeleteConfirm, () => setShowDeleteConfirm(false));
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventPlace, setNewEventPlace] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventAmpm, setNewEventAmpm] = useState<'오전' | '오후'>('오전');
  const [newEventHour, setNewEventHour] = useState('12');
  const [newEventMinute, setNewEventMinute] = useState('00');
  const [newEventTeam, setNewEventTeam] = useState('KIA 타이거즈');
  const [newEventLocation, setNewEventLocation] = useState('홈');
  const [newEventDetails, setNewEventDetails] = useState('');
  const [newEventParticipating, setNewEventParticipating] = useState(false);
  const [newEventParticipationType, setNewEventParticipationType] = useState<'선발' | '교체'>('선발');
  const [trainingSessions, setTrainingSessions] = useState<any[]>([
    { id: 'match', name: '경기 시간(분)', duration: '', rpe: '', isFixed: true },
    { id: 'weight', name: '웨이트 트레이닝 시간(분)', duration: '', rpe: '', isFixed: true },
    { id: 'skill', name: '기술 훈련 시간(분)', duration: '', rpe: '', isFixed: true }
  ]);
  
  const [newEventGrip, setNewEventGrip] = useState<number | ''>(50);
  const [newEventGripLeft, setNewEventGripLeft] = useState<number | ''>(50);
  const [newEventGripRight, setNewEventGripRight] = useState<number | ''>(50);
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');
  const [newEventType, setNewEventType] = useState<'match' | 'biz' | 'care'>('match');

  const rpeLabels: Record<number, string> = {
    1: '매우 쉬움',
    2: '쉬움',
    3: '표준',
    4: '약간 어려움',
    5: '어려움',
    6: '어려움',
    7: '매우 어려움',
    8: '매우 어려움',
    9: '극히 어려움',
    10: '극한'
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
  };
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
  };

  const handleAddEvent = () => {
    if (!newEventDate) return;
    
    const [, month, day] = newEventDate.split('-');
    const formattedDate = `${month}/${day}`;
    
    let title = '';
    let place = '';
    let time = '';
    let details = '';
    let acwr = 0;
    let grip = 0;
    let gripLeft = 0;
    let gripRight = 0;
    let logDurationNum = 0;
    let logRpe = 0;

    let p = JSON.parse(JSON.stringify(player));

    if (newEventType === 'biz') {
       if (!newEventTitle) return;
       title = `[비즈니스] ${newEventTitle}`;
       place = newEventPlace;
       time = `${newEventAmpm} ${newEventHour}:${newEventMinute}`;
       details = newEventDetails;
    } else if (newEventType === 'care') {
       title = `[컨디셔닝] 당일 지표 측정`;
       const gl = Number(newEventGripLeft) || 0;
       const gr = Number(newEventGripRight) || 0;
       const overallGrip = (gl + gr) / 2;

       const dev = ((overallGrip - 50) / 50 * 100).toFixed(1);
       
       let totalDuration = 0;
       let totalLoad = 0;
       trainingSessions.forEach(session => {
         const d = Number(session.duration) || 0;
         const r = Number(session.rpe) || 0;
         if (d > 0 && r > 0) {
           totalDuration += d;
           totalLoad += (d * r);
         }
       });
       
       logDurationNum = totalDuration;
       logRpe = totalDuration > 0 ? (totalLoad / totalDuration) : 0;
       const curAcute = logRpe * logDurationNum;

       let sleepDuration = 0;
       if (sleepStart && sleepEnd) {
         const [startH, startM] = sleepStart.split(':').map(Number);
         const [endH, endM] = sleepEnd.split(':').map(Number);
         let durationMins = (endH * 60 + endM) - (startH * 60 + startM);
         if (durationMins < 0) durationMins += 24 * 60;
         sleepDuration = Number((durationMins / 60).toFixed(2));
       }
       
       gripLeft = gl;
       gripRight = gr;
       grip = overallGrip;
    } else {
       title = `[경기] ${newEventTeam}`;
       place = newEventLocation;
    }

    let sleep: number | undefined = undefined;
    if (newEventType === 'care') {
      const [startH, startM] = sleepStart.split(':').map(Number);
      const [endH, endM] = sleepEnd.split(':').map(Number);
      let durationMins = (endH * 60 + endM) - (startH * 60 + startM);
      if (durationMins < 0) durationMins += 24 * 60;
      sleep = Number((durationMins / 60).toFixed(2));
    }

    const newEvent: any = { date: formattedDate, title, place, time, details, acwr, grip, gripLeft, gripRight };
    if (newEventType === "care") {
      newEvent.rpe = logRpe;
      newEvent.duration = logDurationNum;
      newEvent.sessions = trainingSessions;
    }
    if (sleep !== undefined) {
      newEvent.sleep = sleep;
      if (newEventType === 'care') {
        newEvent.sleepStart = sleepStart;
        newEvent.sleepEnd = sleepEnd;
      }
    }
    if (newEventType === 'match') {
      newEvent.isParticipating = newEventParticipating;
      if (newEventParticipating) {
        newEvent.participationType = newEventParticipationType;
      }
    }

    let updatedSchedules = [...(p.schedules || [])];

    if (editingEventOriginalIndex !== null) {
      updatedSchedules[editingEventOriginalIndex] = newEvent;
    } else {
      updatedSchedules.push(newEvent);
    }
    
    updatedSchedules.sort((a, b) => a.date.localeCompare(b.date));
    p.schedules = updatedSchedules;
    p = rebuildChartsFromSchedules(p);

    if (onUpdatePlayer) {
      onUpdatePlayer(p);
    }
    closeModal();
  };

  const handleDeleteEvent = () => {
    if (editingEventOriginalIndex === null) return;
    let p = JSON.parse(JSON.stringify(player));
    let updatedSchedules = [...(p.schedules || [])];
    updatedSchedules.splice(editingEventOriginalIndex, 1);
    p.schedules = updatedSchedules;
    p = rebuildChartsFromSchedules(p);
    
    if (onUpdatePlayer) {
      onUpdatePlayer(p);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setShowDeleteConfirm(false);
    setNewEventDate('');
    setNewEventTitle('');
    setNewEventPlace('');
    setNewEventTime('');
    setNewEventTeam('');
    setNewEventLocation('홈');
    setNewEventDetails('');
    
    
    setNewEventGrip('');
    setNewEventGripLeft('');
    setNewEventGripRight('');
    setSleepStart('23:00');
    setSleepEnd('07:00');
    setEditingEventOriginalIndex(null);
  };

  const handleDayClick = (day: number) => {
    if (calendarType === 'medical') {
      alert("메디컬 일정 추가는 메디컬 탭에서 진행해주세요.");
      return;
    }

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    
    setNewEventDate(`${year}-${month}-${d}`);
    setNewEventTitle('');
    setNewEventPlace('');
    setNewEventTime('');
    setNewEventTeam('');
    setNewEventLocation('홈');
    setNewEventDetails('');
    
    
    setNewEventGrip('');
    setNewEventGripLeft('');
    setNewEventGripRight('');
    setSleepStart('23:00');
    setSleepEnd('07:00');
    setNewEventType(calendarType);
    setEditingEventOriginalIndex(null);
    setIsAddModalOpen(true);
  };

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation();
    
    if (event.isPainInfo) {
      window.dispatchEvent(new CustomEvent('changeTab', { detail: 'medical' }));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openMedicalPain', { detail: { partId: event.partId } }));
      }, 50);
      return;
    }

    if (event.isMedical) {
      alert("메디컬 일정은 메디컬 탭에서 수정해주세요.");
      return;
    }
    
    const year = currentDate.getFullYear();
    const [m, d] = event.date.split('/');
    setNewEventDate(`${year}-${m}-${d}`);
    
    const isBiz = event.title.includes("스폰서십") || event.title.includes("화보") || event.title.includes("검진") || event.title.includes("행사") || event.title.includes("[비즈니스]");
    const isCare = event.title.includes("[컨디셔닝]");
    const titleWithoutPrefix = event.title.replace(/\[.*?\]\s*/, '');

    if (isBiz) {
        setNewEventType('biz');
        setNewEventTitle(titleWithoutPrefix);
        setNewEventPlace(event.place || '');
        setNewEventTime(event.time || '');
        if (event.time) {
          const match = event.time.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
          if (match) {
            setNewEventAmpm(match[1] as '오전' | '오후');
            setNewEventHour(match[2]);
            setNewEventMinute(match[3]);
          } else {
             // Try standard HH:mm parse if no AM/PM
             const stdMatch = event.time.match(/(\d{2}):(\d{2})/);
             if (stdMatch) {
               const h = parseInt(stdMatch[1], 10);
               setNewEventAmpm(h >= 12 ? '오후' : '오전');
               setNewEventHour(h > 12 ? String(h - 12) : h === 0 ? '12' : String(h));
               setNewEventMinute(stdMatch[2]);
             }
          }
        } else {
          setNewEventAmpm('오전');
          setNewEventHour('12');
          setNewEventMinute('00');
        }
        setNewEventDetails(event.details || '');
    } else if (isCare) {
        setNewEventType('care');
        if (event.sessions && Array.isArray(event.sessions)) {
          setTrainingSessions(event.sessions);
        } else {
          const d = event.duration || '';
          const r = event.rpe || '';
          if (d || r) {
             setTrainingSessions([
               { id: 'match', name: '경기 시간(분)', duration: '', rpe: '', isFixed: true },
               { id: 'weight', name: '웨이트 트레이닝 시간(분)', duration: '', rpe: '', isFixed: true },
               { id: 'skill', name: '기술 훈련 시간(분)', duration: '', rpe: '', isFixed: true },
               { id: 'legacy', name: '기존 기록', duration: d, rpe: r, isFixed: false }
             ]);
          } else {
             setTrainingSessions([
               { id: 'match', name: '경기 시간(분)', duration: '', rpe: '', isFixed: true },
               { id: 'weight', name: '웨이트 트레이닝 시간(분)', duration: '', rpe: '', isFixed: true },
               { id: 'skill', name: '기술 훈련 시간(분)', duration: '', rpe: '', isFixed: true }
             ]);
          }
        }
        setNewEventGrip(event.grip || 50);
        setNewEventGripLeft(event.gripLeft || 50);
        setNewEventGripRight(event.gripRight || 50);
        if (event.sleep !== undefined) {
           const sleepDuration = event.sleep;
           if (event.sleepStart && event.sleepEnd) {
             setSleepStart(event.sleepStart);
             setSleepEnd(event.sleepEnd);
           } else {
             setSleepStart('23:00');
             const endH = (23 + Math.floor(sleepDuration)) % 24;
             const endM = Math.round((sleepDuration - Math.floor(sleepDuration)) * 60);
             setSleepEnd(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`);
           }
        } else {
           setSleepStart('23:00');
           setSleepEnd('07:00');
        }
    } else {
        setNewEventType('match');
        setNewEventTeam(titleWithoutPrefix || 'KIA 타이거즈');
        setNewEventLocation(event.place || '홈');
        setNewEventParticipating(!!event.isParticipating);
        setNewEventParticipationType(event.participationType || '선발');
    }

    setEditingEventOriginalIndex(event.originalIndex);
    setIsAddModalOpen(true);
  };

  const getDayEvents = (day: number) => {
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${month}/${d}`;
    const fullDateStr = `${currentDate.getFullYear()}-${month}-${d}`;

    if (calendarType === 'medical') {
      const medicalSchedules: any[] = [];
      
      if (player && player.treatmentTimeline) {
        player.treatmentTimeline
          .filter((item: any) => item.dateLabel === fullDateStr)
          .forEach((item: any, idx: number) => {
            medicalSchedules.push({
              ...item,
              isMedical: true,
              date: dateStr,
              title: `[메디컬] ${item.title}`,
              originalIndex: idx
            });
          });
      }

      if (player && player.painData) {
        Object.entries(player.painData).forEach(([partId, data]: [string, any]) => {
          if (data.initialDate === fullDateStr) {
            medicalSchedules.push({
              isMedical: true,
              isPainInfo: true, partId: partId, date: dateStr,
              title: `[부상] ${getPartName(partId)} 발생`,
            });
          }

        });
      }

      return medicalSchedules;
    }

    if (!player || !player.schedules) return [];
    
    return player.schedules.map((s: any, idx: number) => ({ ...s, originalIndex: idx })).filter((s: any) => {
      if (s.date !== dateStr) return false;
      
      const isBiz = s.title.includes("스폰서십") || s.title.includes("화보") || s.title.includes("검진") || s.title.includes("행사") || s.title.includes("[비즈니스]");
      const isCare = s.title.includes("[컨디셔닝]");
      
      if (calendarType === 'care') return isCare;
      if (calendarType === 'biz') return isBiz && !isCare;
      return !isBiz && !isCare; // match
    });
  };

  const getTodayEvents = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `${month}/${d}`;
    const fullDateStr = `${today.getFullYear()}-${month}-${d}`;

    const normalSchedules = player?.schedules?.map((s: any, idx: number) => ({ ...s, originalIndex: idx })).filter((s: any) => s.date === dateStr) || [];
    const medicalSchedules: any[] = [];
    if (player && player.treatmentTimeline) {
      player.treatmentTimeline
        .filter((item: any) => item.dateLabel === fullDateStr)
        .forEach((item: any, idx: number) => {
          medicalSchedules.push({
            ...item,
            isMedical: true,
            date: dateStr,
            title: `[메디컬] ${item.title}`
          });
        });
    }

    if (player && player.painData) {
      Object.entries(player.painData).forEach(([partId, data]: [string, any]) => {
        if (data.initialDate === fullDateStr) {
          medicalSchedules.push({
            isMedical: true,
            isPainInfo: true, partId: partId, date: dateStr,
            title: `[부상] ${getPartName(partId)} 발생`,
          });
        }

      });
    }

    return [...normalSchedules, ...medicalSchedules];
  };
  const todaysEvents = getTodayEvents();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div>
        <div className="section-title-group">
          <h3>오늘의 일정</h3>
        </div>
        {todaysEvents.length > 0 ? (
          <div className="player-summary-card">
            <div className="summary-avatar-container shrink-0 self-start">
              <div className="player-profile-img flex flex-col items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] text-[var(--primary-color)] font-bold" style={{ borderRadius: '50%' }}>
                <span className="text-[12px] leading-none mb-1">{todaysEvents[0].date.split('/')[0]}월</span>
                <span className="text-[20px] leading-none">{todaysEvents[0].date.split('/')[1]}</span>
              </div>
            </div>
            <div className="flex flex-col flex-1 w-full">
              {todaysEvents.map((s: any, i: number) => {
                const isBiz = s.title.includes("스폰서십") || s.title.includes("화보") || s.title.includes("검진") || s.title.includes("행사") || s.title.includes("[비즈니스]");
                const isCare = s.title.includes("[컨디셔닝]");
                const isMedical = s.isMedical;
                const isPainInfo = s.isPainInfo;
                
                let prefix = '[경기 일정]';
                if (isPainInfo) { prefix = '[부상 관리]'; }
                else if (isMedical) { prefix = '[메디컬 일정]'; }
                else if (isBiz) { prefix = '[비즈니스 일정]'; }
                else if (isCare) { prefix = '[컨디셔닝]'; }
  
                let prefixColor = 'text-[var(--primary-color)]';

                const titleWithoutPrefix = s.title.replace(/\[.*?\]\s*/, '');
  
                return (
                  <div 
                    key={i} 
                    className={`flex flex-col py-3 px-2 first:pt-0 last:pb-0`}
                  >
                    <h5 className="font-bold text-[14px] mb-1">
                      <span className={`${prefixColor}`}>{prefix}</span> <span className="text-white">{titleWithoutPrefix}</span>
                    </h5>
                    <div className="text-gray-400 text-[14px] flex gap-1.5 items-center">
                      {s.time && <span>{s.time}</span>}
                      {s.place && <span>{s.place}</span>}
                      {!isMedical && !isBiz && !isCare && s.isParticipating && (
                        <span className="bg-[var(--primary-color)] text-[#050608] text-xs font-bold px-1.5 py-0.5 rounded ml-1">
                          출전 ({s.participationType})
                        </span>
                      )}
                    </div>
                    {isCare && (s.acwr !== undefined || s.grip !== undefined || s.gripLeft !== undefined || s.gripRight !== undefined || s.sleep !== undefined) && (
                      <div className="text-gray-400 text-sm mt-1.5 font-medium flex gap-2 flex-wrap">
                        {s.acwr !== undefined && (
                          isAcwrSufficient(player?.schedules, s.date) ? (
                            <span>ACWR: {Number(s.acwr).toFixed(2)}</span>
                          ) : (
                            <span className="text-yellow-400 font-semibold">ACWR: 데이터 수집 중 (최소 3주 필요)</span>
                          )
                        )}
                        {s.gripLeft !== undefined && <span>악력(좌): {s.gripLeft}kg</span>}
                        {s.gripRight !== undefined && <span>악력(우): {s.gripRight}kg</span>}
                        {s.grip !== undefined && s.gripLeft === undefined && <span>악력: {s.grip}kg</span>}
                        {s.sleep !== undefined && <span>수면: {s.sleep}h</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-black rounded-[24px] p-4 text-center text-gray-500 border border-[var(--card-border)]">
            오늘 예정된 일정이 없습니다.
          </div>
        )}
      </div>

      <div>
        <div className="section-title-group">
          <h3>일정표</h3>
          <button 
            onClick={() => {
              setEditingEventOriginalIndex(null);
              
              const today = new Date();
              const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
              setNewEventDate(localDate);
              setNewEventTitle('');
              setNewEventPlace('');
              setNewEventTime('');
              setNewEventAmpm('오전');
              setNewEventHour('12');
              setNewEventMinute('00');
              setNewEventTeam('');
              setNewEventLocation('홈');
              setNewEventParticipating(false);
              setNewEventParticipationType('선발');
              setNewEventDetails('');
              
    
    setNewEventGrip('');
    setNewEventGripLeft('');
    setNewEventGripRight('');
    setSleepStart('23:00');
    setSleepEnd('07:00');
              setIsAddModalOpen(true);
            }} 
            className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" 
          >
            <div className="w-5 h-5 rounded-full bg-[var(--primary-color)] text-[#050608] flex items-center justify-center">
              <span className="material-icons-round text-[16px] font-bold">add</span>
            </div>
            추가
          </button>
        </div>

        <div className="tabs-sub mb-4" style={{ display: 'flex', gap: '8px' }}>
        <button 
          className={`tab-sub-btn ${calendarType === 'match' ? 'active' : ''}`} 
          onClick={() => setCalendarType('match')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: calendarType === 'match' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', color: calendarType === 'match' ? 'var(--bg-color)' : 'var(--text-main)', fontWeight: 'bold', fontSize: '12px' }}
        >
          경기
        </button>
        <button 
          className={`tab-sub-btn ${calendarType === 'biz' ? 'active' : ''}`} 
          onClick={() => setCalendarType('biz')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: calendarType === 'biz' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', color: calendarType === 'biz' ? 'var(--bg-color)' : 'var(--text-main)', fontWeight: 'bold', fontSize: '12px' }}
        >
          비즈니스
        </button>
        <button 
          className={`tab-sub-btn ${calendarType === 'care' ? 'active' : ''}`} 
          onClick={() => setCalendarType('care')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: calendarType === 'care' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', color: calendarType === 'care' ? 'var(--bg-color)' : 'var(--text-main)', fontWeight: 'bold', fontSize: '12px' }}
        >
          컨디셔닝
        </button>
        <button 
          className={`tab-sub-btn ${calendarType === 'medical' ? 'active' : ''}`} 
          onClick={() => setCalendarType('medical')}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: calendarType === 'medical' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', color: calendarType === 'medical' ? 'var(--bg-color)' : 'var(--text-main)', fontWeight: 'bold', fontSize: '12px' }}
        >
          메디컬
        </button>
      </div>

      <div className="bg-black rounded-[24px] p-4 border border-[var(--card-border)]">
        <div className="flex justify-between items-center mb-4">
          <button className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white transition-colors flex items-center justify-center" onClick={prevMonth}>
            <span className="material-icons-round">chevron_left</span>
          </button>
          <div className="flex items-center gap-2">
            <select 
              value={currentDate.getFullYear()} 
              onChange={handleYearChange}
              className="bg-transparent text-lg font-semibold border-none outline-none cursor-pointer hover:bg-[rgba(255,255,255,0.05)] rounded px-2 py-1 appearance-none text-center"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i} value={2026 + i} className="bg-black text-white">{2026 + i}년</option>
              ))}
            </select>
            <select 
              value={currentDate.getMonth()} 
              onChange={handleMonthChange}
              className="bg-transparent text-lg font-semibold border-none outline-none cursor-pointer hover:bg-[rgba(255,255,255,0.05)] rounded px-2 py-1 appearance-none text-center"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i} value={i} className="bg-black text-white">{i + 1}월</option>
              ))}
            </select>
          </div>
          <button className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-gray-400 hover:text-white transition-colors flex items-center justify-center" onClick={nextMonth}>
            <span className="material-icons-round">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2 text-gray-400 font-medium">
          <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[70px] p-1 bg-[rgba(255,255,255,0.01)] rounded-lg"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const events = getDayEvents(day);
            return (
              <div 
                key={day} 
                className={`min-h-[70px] p-1 bg-[rgba(255,255,255,0.03)] rounded-lg flex flex-col items-center cursor-pointer hover:bg-[rgba(255,255,255,0.06)]`}
                onClick={() => handleDayClick(day)}
              >
                <span className="text-sm font-medium mb-1">{day}</span>
                {events.map((e: any, idx: number) => {
                  let bgColorClass = 'bg-[var(--primary-color)] text-[var(--bg-color)]';

                  return (
                    <div 
                      key={idx} 
                      className={`w-full text-[9px] leading-tight ${bgColorClass} rounded px-1 py-0.5 mb-1 truncate font-bold text-center cursor-pointer hover:opacity-80`} 
                      title={e.title}
                      onClick={(ev) => handleEventClick(ev, e)}
                    >
                      {e.title.replace(/\[.*?\]\s*/, '')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      </div>
      
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                {editingEventOriginalIndex !== null ? '일정 수정' : '일정 추가'}
              </h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={closeModal}>close</span>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-[16px]">
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">일정 분류</label>
                <select value={newEventType} onChange={e => setNewEventType(e.target.value as any)} className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none">
                  <option value="match">경기 일정</option>
                  <option value="biz">비즈니스 일정</option>
                  <option value="care">컨디셔닝 일정</option>
                </select>
              </div>
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">일정 날짜</label>
                <input type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} max="9999-12-31" required  className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none" />
              </div>
              {newEventType === 'match' && (
                <>
                  <div>
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">상대 구단</label>
                    <select value={newEventTeam} onChange={e => setNewEventTeam(e.target.value)} className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none">
                      <option value="" disabled>구단을 선택 해 주세요</option>
                      <option value="KIA 타이거즈">KIA 타이거즈</option>
                      <option value="삼성 라이온즈">삼성 라이온즈</option>
                      <option value="LG 트윈스">LG 트윈스</option>
                      <option value="두산 베어스">두산 베어스</option>
                      <option value="KT 위즈">KT 위즈</option>
                      <option value="SSG 랜더스">SSG 랜더스</option>
                      <option value="롯데 자이언츠">롯데 자이언츠</option>
                      <option value="한화 이글스">한화 이글스</option>
                      <option value="NC 다이노스">NC 다이노스</option>
                      <option value="키움 히어로즈">키움 히어로즈</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">장소 (홈/어웨이)</label>
                    <div className="flex gap-2">
                      <button 
                        className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventLocation === '홈' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                        onClick={() => setNewEventLocation('홈')}
                      >
                        홈
                      </button>
                      <button 
                        className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventLocation === '어웨이' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                        onClick={() => setNewEventLocation('어웨이')}
                      >
                        어웨이
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">출전 여부</label>
                      <div className="flex gap-2 mt-[10px]">
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${!newEventParticipating ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipating(false)}
                        >
                          결장
                        </button>
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventParticipating ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipating(true)}
                        >
                          출전
                        </button>
                      </div>
                    </div>
                    
                    {newEventParticipating && (
                      <div className="flex gap-2 mt-[10px]">
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventParticipationType === '선발' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipationType('선발')}
                        >
                          선발
                        </button>
                        <button 
                          className={`flex-1 h-[30px] flex items-center justify-center text-sm font-bold rounded-xl transition-colors border ${newEventParticipationType === '교체' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                          onClick={() => setNewEventParticipationType('교체')}
                        >
                          교체
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
              {newEventType === 'biz' && (
                <>
                  <div>
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">일정</label>
                    <div className="relative">
                      <input type="text" placeholder="일정 제목" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} required  className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">장소</label>
                    <div className="relative">
                      <input type="text" placeholder="장소" value={newEventPlace} onChange={e => setNewEventPlace(e.target.value)}  className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">시간</label>
                    <div className="flex gap-2">
                      <button 
                        className={`px-4 h-[30px] flex items-center justify-center text-[13px] font-bold rounded-xl transition-colors border ${newEventAmpm === '오전' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                        onClick={() => setNewEventAmpm('오전')}
                      >
                        오전
                      </button>
                      <button 
                        className={`px-4 h-[30px] flex items-center justify-center text-[13px] font-bold rounded-xl transition-colors border ${newEventAmpm === '오후' ? 'bg-[var(--primary-color)] text-[#050608] border-[var(--primary-color)]' : 'bg-[rgba(0,0,0,0.25)] text-gray-400 border-[var(--card-border)] hover:border-[rgba(255,255,255,0.2)]'}`}
                        onClick={() => setNewEventAmpm('오후')}
                      >
                        오후
                      </button>
                      <div className="input-group-select flex-1" style={{ marginBottom: 0 }}>
                        <select value={newEventHour} onChange={e => setNewEventHour(e.target.value)} className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none">
                          {Array.from({length: 12}, (_, i) => i + 1).map(h => (
                            <option key={h} value={h}>{h}시</option>
                          ))}
                        </select>
                      </div>
                      <div className="input-group-select flex-1" style={{ marginBottom: 0 }}>
                        <select value={newEventMinute} onChange={e => setNewEventMinute(e.target.value)} className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none">
                          {['00', '10', '20', '30', '40', '50'].map(m => (
                            <option key={m} value={m}>{m}분</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col mb-4">
                    <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">세부 내용</label>
                    <textarea 
                      placeholder="세부내용" 
                      value={newEventDetails} 
                      onChange={e => setNewEventDetails(e.target.value)}
                      className="w-full bg-[rgba(0,0,0,0.25)] border border-[var(--card-border)] rounded-2xl p-4 text-white text-[14px] outline-none min-h-[100px] resize-none focus:border-[var(--primary-color)] transition-colors"
                    />
                  </div>
                </>
              )}
              {newEventType === 'care' && (
                <>
                                <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[13px] font-bold text-white">일일 훈련 부하 (ACWR)</label>
                  <span className="text-[11px] text-[var(--primary-color)]">
                    총 부하량: {trainingSessions.reduce((acc, s) => acc + ((Number(s.duration) || 0) * (Number(s.rpe) || 0)), 0)}
                  </span>
                </div>
                
                {trainingSessions.map((session, index) => (
                  <div key={session.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-3 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      {session.isFixed ? (
                         <label className="text-[13px] font-bold text-gray-200">{session.name}</label>
                      ) : (
                         <input 
                           type="text" 
                           placeholder="훈련 이름" 
                           value={session.name} 
                           onChange={e => {
                             const newSessions = [...trainingSessions];
                             newSessions[index].name = e.target.value;
                             setTrainingSessions(newSessions);
                           }} 
                           className="bg-transparent text-[13px] font-bold text-white border-b border-[var(--primary-color)] outline-none w-2/3"
                         />
                      )}
                      {!session.isFixed && (
                         <button onClick={() => {
                           const newSessions = [...trainingSessions];
                           newSessions.splice(index, 1);
                           setTrainingSessions(newSessions);
                         }} className="text-red-400 text-xs flex items-center gap-1 hover:text-red-300">
                           <span className="material-icons-round text-[14px]">delete</span>삭제
                         </button>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-3">
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
                          className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl text-white text-[13px] outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-[4px]">
                          <label className="text-[11px] font-normal text-gray-400 block">인지된 훈련 강도(힘듦 정도)</label>
                          {session.rpe ? <span className="text-[11px] text-[var(--primary-color)] font-bold">{session.rpe}단계 ({getRpeText(session.rpe)})</span> : null}
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
                    </div>
                  </div>
                ))}
                
                <button onClick={() => {
                  const newId = 'session_' + Date.now();
                  setTrainingSessions([...trainingSessions, { id: newId, name: '', duration: '', rpe: '', isFixed: false }]);
                }} className="w-full h-[36px] bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-gray-300 text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors mt-1">
                  <span className="material-icons-round text-[16px]">add</span> 추가 훈련 입력하기
                </button>
              </div>
                  
                  <div className="mb-0 flex gap-3">
                    <div className="flex-1">
                      <label className="text-[13px] font-bold text-white mb-[6px] block">왼손 악력 (kg)</label>
                      <input type="number" step="0.1" value={newEventGripLeft} onChange={e => setNewEventGripLeft(e.target.value === '' ? '' : Number(e.target.value))} className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none transition-colors" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[13px] font-bold text-white mb-[6px] block">오른손 악력 (kg)</label>
                      <input type="number" step="0.1" value={newEventGripRight} onChange={e => setNewEventGripRight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] font-bold text-white mb-[6px] block">수면 시간</label>
                    <div className="flex flex-col gap-[12px] mt-[6px]">
                      <TimeSelect value={sleepStart} onChange={setSleepStart} label="취침시간" />
                      <TimeSelect value={sleepEnd} onChange={setSleepEnd} label="기상시간" />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex flex-col gap-2 mt-[-4px]">
                <div className="flex gap-2 w-full">
                  {editingEventOriginalIndex !== null && (
                    <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-[30px] flex items-center justify-center text-[14px] font-bold" style={{ fontSize: '14px' }} onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                  )}
                  <button className="btn-primary flex-1 h-[30px] flex items-center justify-center text-[14px] font-bold" style={{ fontSize: '14px' }} onClick={handleAddEvent}>{editingEventOriginalIndex !== null ? '저장하기' : '추가하기'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1200] bg-black/70 backdrop-blur-sm flex justify-center items-center p-4 animate-fade-in" onClick={() => setShowDeleteConfirm(false)}>
          <div 
            className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.5)] border border-[var(--card-border)] flex flex-col items-center text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
              <span className="material-icons-round text-red-500 text-2xl">warning</span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">일정 삭제 경고</h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed">
              정말로 이 일정을 삭제하시겠습니까?<br />
              <span className="text-[11px] text-red-400 font-medium">삭제된 일정은 복구할 수 없습니다.</span>
            </p>
            <div className="flex gap-2 w-full">
              <button 
                className="btn-action-outline flex-1 h-[36px] text-gray-300 border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.08)] rounded-xl text-xs font-bold transition-colors"
                onClick={() => setShowDeleteConfirm(false)}
              >
                취소
              </button>
              <button 
                className="btn-primary flex-1 h-[36px] bg-[#FF3B30] hover:bg-[#FF453A] text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 transition-colors"
                onClick={handleDeleteEvent}
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
