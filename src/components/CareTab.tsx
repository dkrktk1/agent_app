import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart,
  BarChart,
  Bar,
  Cell,
  LabelList,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer
} from 'recharts';
import { downloadSampleCSV, rebuildChartsFromSchedules } from '../utils';
import ComprehensiveStatusDashboard from './ComprehensiveStatusDashboard';
import { useModalHistory } from '../hooks/useModalHistory';

const getAcwrColor = (value: number) => {
  if (value >= 1.5) return '#ef4444';
  if (value >= 1.3) return '#facc15';
  if (value >= 0.8) return '#4ade80';
  return '#8E9AA8';
};

const CustomDot = (props: any) => {
  const { cx, cy, value } = props;
  const color = getAcwrColor(value);
  return <circle cx={cx} cy={cy} r={4} fill="#1C2331" stroke={color} strokeWidth={2} />;
};

const CustomActiveDot = (props: any) => {
  const { cx, cy, value } = props;
  const color = getAcwrColor(value);
  return <circle cx={cx} cy={cy} r={6} fill={color} stroke="#fff" strokeWidth={2} />;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const color = getAcwrColor(value);
    return (
      <div className="bg-[#2D3748] border border-[rgba(255,255,255,0.1)] rounded-lg p-2.5 text-white shadow-lg">
        <p className="text-[#8E9AA8] mb-1 text-xs">{label}</p>
        <p style={{ color }} className="font-bold m-0">
          ACWR : {Number(value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const getSleepColor = (duration: number) => {
  if (duration >= 8.0) return '#4ade80'; // Optimal
  if (duration >= 6.0) return '#9ca3af'; // Adequate
  return '#ef4444'; // Deprivation
};

const SleepCustomDot = (props: any) => {
  const { cx, cy, value } = props;
  const color = getSleepColor(value);
  return <circle cx={cx} cy={cy} r={4} fill="#1C2331" stroke={color} strokeWidth={2} />;
};

const SleepCustomActiveDot = (props: any) => {
  const { cx, cy, value } = props;
  const color = getSleepColor(value);
  return <circle cx={cx} cy={cy} r={6} fill={color} stroke="#fff" strokeWidth={2} />;
};

const SleepCustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const duration = payload[0].value;
    const hours = Math.floor(duration);
    const minutes = Math.round((duration - hours) * 60);
    
    let comment = "";
    if (duration >= 8) {
      comment = "최상의 컨디션을 유지하기 좋은 수면량입니다.";
    } else if (duration >= 6) {
      comment = "일반적인 훈련을 소화할 수 있는 적정 수면입니다.";
    } else {
      comment = "중추신경계(CNS) 회복 필요! 부상 위험이 증가합니다.";
    }

    return (
      <div className="bg-[#2D3748] border border-[rgba(255,255,255,0.1)] p-3 rounded-lg shadow-xl">
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <p className="text-white font-bold text-lg mb-2">{hours}시간 {minutes}분</p>
        <p className={`text-xs font-medium ${duration >= 8 ? 'text-green-400' : duration >= 6 ? 'text-gray-300' : 'text-red-400'}`}>
          {comment}
        </p>
      </div>
    );
  }
  return null;
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

export default function CareTab({ player: rawPlayer, isAgent, onUpdatePlayer }: { player: any, isAgent: boolean, onUpdatePlayer: (newData: any) => void, key?: string }) {
  const player = React.useMemo(() => rebuildChartsFromSchedules(rawPlayer), [rawPlayer]);
  const [isDailyLogOpen, setIsDailyLogOpen] = useState(false);
  
  const [showPastGripModal, setShowPastGripModal] = useState(false);
  const [pastGripYear, setPastGripYear] = useState<string>(new Date().getFullYear().toString());
  const [pastGripMonth, setPastGripMonth] = useState<string>('all');
  const [pastGripWeek, setPastGripWeek] = useState<string>('all');
  
  const [showPastSleepModal, setShowPastSleepModal] = useState(false);
  const [pastSleepYear, setPastSleepYear] = useState<string>(new Date().getFullYear().toString());
  const [pastSleepMonth, setPastSleepMonth] = useState<string>('all');
  const [pastSleepWeek, setPastSleepWeek] = useState<string>('all');

  const [showPastAcwrModal, setShowPastAcwrModal] = useState(false);
  const [pastAcwrYear, setPastAcwrYear] = useState<string>(new Date().getFullYear().toString());
  const [pastAcwrMonth, setPastAcwrMonth] = useState<string>('all');
  const [pastAcwrWeek, setPastAcwrWeek] = useState<string>('all');

  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{isOpen: boolean, index: string | null, type: 'grip' | 'sleep' | 'acwr' | null}>({isOpen: false, index: null, type: null});
  useModalHistory(deleteConfirmModal.isOpen, () => setDeleteConfirmModal({ isOpen: false, index: null, type: null }));

  const currentYear = new Date().getFullYear();
  const realCareSchedules = (player.schedules?.filter((s: any) => s.title?.includes('[컨디셔닝]')) || []).slice().reverse();

  const gripHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    left: s.gripLeft || 0,
    right: s.gripRight || 0,
    grip: s.grip || 0
  }));

  const acwrHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    rpe: s.rpe || 0,
    duration: s.duration || 0,
    acwr: s.acwr || 0
  }));

  const sleepHistoryData = realCareSchedules.map((s: any) => ({
    id: s.date,
    date: `${currentYear}-${s.date.replace('/', '-')}`,
    duration: s.sleep || 0,
    sleepStart: s.sleepStart || '00:00',
    sleepEnd: s.sleepEnd || '00:00'
  }));

  const handleDeleteHistory = () => {
    let p = JSON.parse(JSON.stringify(player));
    const dateStr = deleteConfirmModal.index;
    if (dateStr) {
      if (deleteConfirmModal.type === 'grip') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.grip = 0; schedule.gripLeft = 0; schedule.gripRight = 0; }
      } else if (deleteConfirmModal.type === 'sleep') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.sleep = 0; schedule.sleepStart = ''; schedule.sleepEnd = ''; }
      } else if (deleteConfirmModal.type === 'acwr') {
        const schedule = p.schedules.find((s: any) => s.date === dateStr && s.title?.includes('[컨디셔닝]'));
        if (schedule) { schedule.rpe = 0; schedule.duration = 0; }
      }
      p = rebuildChartsFromSchedules(p);
      onUpdatePlayer(p);
    }
    setDeleteConfirmModal({ isOpen: false, index: null, type: null });
  };



  useModalHistory(showPastGripModal, () => setShowPastGripModal(false));
  useModalHistory(showPastSleepModal, () => setShowPastSleepModal(false));
  useModalHistory(showPastAcwrModal, () => setShowPastAcwrModal(false));

  
  const [logRpe, setLogRpe] = useState(7);
  const [logDuration, setLogDuration] = useState<number | string>('');
  const [logGrip, setLogGrip] = useState<number | string>(player?.metrics?.gripRaw ?? 0);
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');

    const [gripLeftToday, setGripLeftToday] = useState(player?.gripChartData?.leftValues?.[(player?.gripChartData?.leftValues?.length ?? 0) - 1] ?? 0);
    const [gripRightToday, setGripRightToday] = useState(player?.gripChartData?.rightValues?.[(player?.gripChartData?.rightValues?.length ?? 0) - 1] ?? 0);

  const [logGripLeft, setLogGripLeft] = useState<number | string>('');
  const [logGripRight, setLogGripRight] = useState<number | string>('');

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

  useEffect(() => {
    setLogGrip(player?.metrics?.gripRaw || 0);
    setGripLeftToday(player?.gripChartData?.leftValues?.[(player?.gripChartData?.leftValues?.length ?? 0) - 1] ?? 0);
    setGripRightToday(player?.gripChartData?.rightValues?.[(player?.gripChartData?.rightValues?.length ?? 0) - 1] ?? 0);
    setLogGripLeft(player?.gripChartData?.leftValues?.[(player?.gripChartData?.leftValues?.length ?? 0) - 1] ?? 0);
    setLogGripRight(player?.gripChartData?.rightValues?.[(player?.gripChartData?.rightValues?.length ?? 0) - 1] ?? 0);
  }, [player]);

  
  const renderPastHistoryModal = (type: 'grip' | 'sleep' | 'acwr') => {
    const isGrip = type === 'grip';
    const isAcwr = type === 'acwr';
    const showModal = isGrip ? showPastGripModal : isAcwr ? showPastAcwrModal : showPastSleepModal;
    const setShowModal = isGrip ? setShowPastGripModal : isAcwr ? setShowPastAcwrModal : setShowPastSleepModal;
    if (!showModal) return null;

    const year = isGrip ? pastGripYear : isAcwr ? pastAcwrYear : pastSleepYear;
    const setYear = isGrip ? setPastGripYear : isAcwr ? setPastAcwrYear : setPastSleepYear;
    const month = isGrip ? pastGripMonth : isAcwr ? pastAcwrMonth : pastSleepMonth;
    const setMonth = isGrip ? setPastGripMonth : isAcwr ? setPastAcwrMonth : setPastSleepMonth;
    const week = isGrip ? pastGripWeek : isAcwr ? pastAcwrWeek : pastSleepWeek;
    const setWeek = isGrip ? setPastGripWeek : isAcwr ? setPastAcwrWeek : setPastSleepWeek;

    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 3}, (_, i) => (currentYear - i).toString());
    const historyData = isGrip ? gripHistoryData : isAcwr ? acwrHistoryData : sleepHistoryData;

    const getWeekOfMonth = (dateStr: string) => {
      const d = new Date(dateStr);
      const date = d.getDate();
      const firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
      return Math.ceil((date + firstDay) / 7);
    };

    const filteredData = historyData.filter(item => {
      const itemYear = item.date.substring(0, 4);
      if (year !== itemYear) return false;
      if (month !== 'all') {
        const itemMonth = item.date.substring(5, 7);
        if (itemMonth !== month) return false;
      }
      if (week !== 'all') {
        const itemWeek = getWeekOfMonth(item.date).toString();
        if (itemWeek !== week) return false;
      }
      return true;
    });

    return (
      <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
        <div className="card-chart bg-[var(--card-bg)] w-full max-w-2xl rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="material-icons-round text-gray-400">history</span>
              과거 {isGrip ? '악력' : isAcwr ? 'ACWR' : '수면 패턴'} 기록
            </h4>
            <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowModal(false)}>close</span>
          </div>
          <div className="p-6 overflow-y-auto">
            <div className="flex flex-col gap-6">
              <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                <select value={year} onChange={(e) => setYear(e.target.value)} className="flex-1 bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[#3b82f6] outline-none">
                  {years.map(y => (
                    <option key={y} value={y} className="bg-[#1e1e1e]">{y}년</option>
                  ))}
                </select>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="flex-1 bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[#3b82f6] outline-none">
                  <option value="all" className="bg-[#1e1e1e]">전체 월</option>
                  {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                    <option key={m} value={m} className="bg-[#1e1e1e]">{parseInt(m)}월</option>
                  ))}
                </select>
                <select value={week} onChange={(e) => setWeek(e.target.value)} className="flex-1 bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[#3b82f6] outline-none">
                  <option value="all" className="bg-[#1e1e1e]">전체 주</option>
                  {[1, 2, 3, 4, 5].map(w => (
                    <option key={w} value={w.toString()} className="bg-[#1e1e1e]">{w}주차</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-3">
                {filteredData.length === 0 ? (
                  <div className="py-8 text-center text-gray-500 font-medium">해당 기간의 기록이 없습니다.</div>
                ) : (
                  filteredData.map((item: any, idx: number) => (
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const submitDailyLog = () => {
    const gl = Number(logGripLeft) || 0;
    const gr = Number(logGripRight) || 0;
    const overallGrip = (gl + gr) / 2;

    const dev = ((overallGrip - 50) / 50 * 100).toFixed(1);
    const logDurationNum = Number(logDuration) || 0;
    const curAcute = logRpe * logDurationNum;
    
    const [h1, m1] = sleepStart.split(':').map(Number);
    const [h2, m2] = sleepEnd.split(':').map(Number);
    let sleepDuration = 0;
    if (h1 !== undefined && m1 !== undefined && h2 !== undefined && m2 !== undefined) {
      let startMin = h1 * 60 + m1;
      let endMin = h2 * 60 + m2;
      if (endMin < startMin) endMin += 24 * 60;
      sleepDuration = Number(((endMin - startMin) / 60).toFixed(1));
    }

    let p = JSON.parse(JSON.stringify(player));

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `${month}/${d}`;

    p.schedules = p.schedules || [];
    
    const existingIndex = p.schedules.findIndex((s: any) => s.date === dateStr && s.title === '[컨디셔닝] 당일 지표 측정');
    if (existingIndex !== -1) {
      p.schedules[existingIndex].grip = overallGrip;
      p.schedules[existingIndex].gripLeft = gl;
      p.schedules[existingIndex].gripRight = gr;
      p.schedules[existingIndex].sleep = sleepDuration;
      p.schedules[existingIndex].sleepStart = sleepStart;
      p.schedules[existingIndex].sleepEnd = sleepEnd;
      p.schedules[existingIndex].rpe = Number(logRpe) || 0;
      p.schedules[existingIndex].duration = logDurationNum;
    } else {
      p.schedules.push({ date: dateStr, title: '[컨디셔닝] 당일 지표 측정', place: '트레이닝 센터', grip: overallGrip, gripLeft: gl, gripRight: gr, sleep: sleepDuration, sleepStart: sleepStart, sleepEnd: sleepEnd, rpe: Number(logRpe) || 0, duration: logDurationNum });
    }

    p = rebuildChartsFromSchedules(p);
    onUpdatePlayer(p); setIsDailyLogOpen(false); alert("오늘의 컨디셔닝 상태가 실시간 반영되었습니다!");
  };

  const todayObj = new Date();
  const monthStr = String(todayObj.getMonth() + 1).padStart(2, '0');
  const dStr = String(todayObj.getDate()).padStart(2, '0');
  const todayDateStr = `${monthStr}/${dStr}`;
  const todayCare = player.schedules?.find((s: any) => s.date === todayDateStr && s.title?.includes('[컨디셔닝]'));
  const todayLoad = todayCare ? (todayCare.rpe || 0) * (todayCare.duration || 0) : null;

  const latestAcwr = player.metrics?.acwr ?? 0;
  const isAcwrEmpty = latestAcwr === 0;
  const acwrStatusColor = isAcwrEmpty ? 'text-gray-500' : latestAcwr >= 1.5 ? 'text-red-500' : latestAcwr >= 1.3 ? 'text-yellow-500' : 'text-green-500';
  const acwrBorderColor = isAcwrEmpty ? 'border-gray-500/30' : latestAcwr >= 1.5 ? 'border-red-500/30' : latestAcwr >= 1.3 ? 'border-yellow-500/30' : 'border-green-500/30';
  const acwrStatusIcon = isAcwrEmpty ? 'info' : latestAcwr >= 1.5 ? 'warning' : latestAcwr >= 1.3 ? 'warning' : 'check_circle';
  const acwrStatusText = isAcwrEmpty ? '측정값 없음' : latestAcwr >= 1.5 ? '부상 위험' : latestAcwr >= 1.3 ? '주의' : '최적';

  const maxAcwrVal = Math.max(2.0, ...(player.acwrGraphData || []).map((d: any) => d.acwr || 0));
  const acwrYAxisMax = maxAcwrVal > 2.0 ? Math.ceil(maxAcwrVal * 2) / 2 : 2.0;
  const acwrYAxisTicks = [0.5, 0.8, 1.3, 1.5];
  for (let i = 2.0; i <= acwrYAxisMax; i += 0.5) {
    acwrYAxisTicks.push(i);
  }

    const latestSleep = player.sleepChartData?.length ? player.sleepChartData[player.sleepChartData.length - 1].sleepDuration : 0;
  const isSleepEmpty = latestSleep === 0;
  const avgSleepCalc = () => {
    if (!player.sleepChartData || player.sleepChartData.length === 0) return null;
    const valid = player.sleepChartData.filter((d: any) => d.sleepDuration > 0);
    if (valid.length === 0) return null;
    return (valid.reduce((acc: any, curr: any) => acc + curr.sleepDuration, 0) / valid.length).toFixed(1);
  };
  const avgSleep = avgSleepCalc();

  const sleepStatusColor = isSleepEmpty ? 'text-gray-500' : latestSleep < 6 ? 'text-red-500' : latestSleep >= 8 ? 'text-green-500' : 'text-gray-400';
  const sleepBorderColor = isSleepEmpty ? 'border-gray-500/30' : latestSleep < 6 ? 'border-red-500/30' : latestSleep >= 8 ? 'border-green-500/30' : 'border-white/10';
  const sleepStatusIcon = isSleepEmpty ? 'info' : latestSleep < 6 ? 'warning' : latestSleep >= 8 ? 'check_circle' : 'info';
  const sleepStatusText = isSleepEmpty ? '측정값 없음' : latestSleep < 6 ? '부족' : latestSleep >= 8 ? '완벽' : '적정';

  const getGripChange = (baseline: number, today: number) => {
    if (baseline === 0) return 0;
    return ((today - baseline) / baseline) * 100;
  };

  const getGripStatus = (change: number, isEmpty: boolean) => {
    if (isEmpty) return { status: '측정값 없음', colorClass: 'text-gray-500', borderClass: 'border-gray-500/30', bgClass: 'bg-gray-500/10' };
    if (change >= -4.9) return { status: '최적', colorClass: 'text-green-500', borderClass: 'border-green-500/30', bgClass: 'bg-green-500/10' };
    if (change >= -9.9) return { status: '주의', colorClass: 'text-yellow-500', borderClass: 'border-yellow-500/30', bgClass: 'bg-yellow-500/10' };
    if (change >= -14.9) return { status: '위험', colorClass: 'text-red-500', borderClass: 'border-red-500/30', bgClass: 'bg-red-500/10' };
    return { status: '치명적', colorClass: 'text-gray-500', borderClass: 'border-gray-500/30', bgClass: 'bg-gray-500/10' };
  };

  const calcTop3Avg = (prop: string) => {
    if (!player?.schedules || player.schedules.length === 0) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
    
    const validValues = player.schedules
      .filter((s: any) => s.date >= thirtyDaysAgoStr && s[prop] !== undefined && s[prop] > 0)
      .map((s: any) => s[prop])
      .sort((a: number, b: number) => b - a)
      .slice(0, 3);
      
    if (validValues.length === 0) return 0;
    return Number((validValues.reduce((a: number, b: number) => a + b, 0) / validValues.length).toFixed(1));
  };

  const gripLeftBaseline = calcTop3Avg('gripLeft');
  const gripRightBaseline = calcTop3Avg('gripRight');

  const isLeftEmpty = gripLeftBaseline === 0 && gripLeftToday === 0;
  const isRightEmpty = gripRightBaseline === 0 && gripRightToday === 0;

  const leftChange = getGripChange(gripLeftBaseline, gripLeftToday);
  const rightChange = getGripChange(gripRightBaseline, gripRightToday);
  const leftStatus = getGripStatus(leftChange, isLeftEmpty);
  const rightStatus = getGripStatus(rightChange, isRightEmpty);

  return (
    <div className="tab-pane active pb-20">
      <div className="section-title-group">
        <h3>피로도 및 컨디셔닝 지표</h3>
        <button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => {
          const today = new Date();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          const d = String(today.getDate()).padStart(2, '0');
          const dateStr = `${month}/${d}`;
          const existing = player?.schedules?.find((s: any) => s.date === dateStr && s.title === '[컨디셔닝] 당일 지표 측정');
          if (existing) {
             setLogRpe(existing.rpe || 7);
             setLogDuration(existing.duration || '');
             setLogGripLeft(existing.gripLeft || '');
             setLogGripRight(existing.gripRight || '');
             if (existing.sleepStart) setSleepStart(existing.sleepStart);
             if (existing.sleepEnd) setSleepEnd(existing.sleepEnd);
          } else {
             setLogRpe(7);
             setLogDuration('');
             setLogGripLeft('');
             setLogGripRight('');
             setSleepStart('23:00');
             setSleepEnd('07:00');
          }
          setIsDailyLogOpen(true);
        }}>
          <div className="w-5 h-5 rounded-full bg-[var(--primary-color)] text-[#050608] flex items-center justify-center">
            <span className="material-icons-round text-[16px] font-bold">add</span>
          </div>
          당일 지표 입력
        </button>
      </div>

      <ComprehensiveStatusDashboard
        acwr={latestAcwr}
        sleep={latestSleep}
        gripLeft={leftChange}
        gripRight={rightChange}
        isEmpty={isAcwrEmpty && isSleepEmpty && isLeftEmpty && isRightEmpty}
      />

      <div className="grid grid-cols-2 gap-3" style={{ marginBottom: '12px' }}>
        {/* ACWR Card */}
        <div className={`card-chart m-0 flex flex-col justify-between shadow-lg relative ${acwrBorderColor}`} style={{ marginBottom: 0 }}>
          <div className="chart-header" style={{ marginBottom: '16px' }}>
            <h4>ACWR</h4>
            <div className={`flex items-center gap-1 font-semibold text-[11px] px-2 py-1 rounded-full bg-black/20 ${acwrStatusColor}`}>
              <span className="material-icons-round" style={{ fontSize: '11px' }}>{acwrStatusIcon}</span>
              {acwrStatusText}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className={`text-3xl md:text-4xl font-black leading-none text-center mb-2 ${acwrStatusColor}`}>
              {isAcwrEmpty ? '-' : latestAcwr.toFixed(2)}
            </div>
            {todayLoad !== null && (
              <div className="text-xs md:text-sm text-[var(--text-muted)] font-medium mt-5">
                일일 훈련 부하: {todayLoad}
              </div>
            )}
            {todayLoad === null && (
              <div className="text-xs md:text-sm font-medium mt-5 opacity-0 pointer-events-none select-none">
                -
              </div>
            )}
          </div>
        </div>

        {/* Sleep Card */}
        <div className={`card-chart m-0 flex flex-col justify-between shadow-lg relative ${sleepBorderColor}`} style={{ marginBottom: 0 }}>
          <div className="chart-header" style={{ marginBottom: '16px' }}>
            <h4>수면 시간</h4>
            <div className={`flex items-center gap-1 font-semibold text-[11px] px-2 py-1 rounded-full bg-black/20 ${sleepStatusColor}`}>
              <span className="material-icons-round" style={{ fontSize: '11px' }}>{sleepStatusIcon}</span>
              {sleepStatusText}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className={`text-3xl md:text-4xl font-black leading-none text-center mb-2 ${sleepStatusColor}`}>
              {isSleepEmpty ? '-' : `${latestSleep}h`}
            </div>
            {avgSleep !== null && (
              <div className="text-xs md:text-sm text-[var(--text-muted)] font-medium mt-5">
                최근 7일 평균: {avgSleep}h
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grip Card */}
      <div className="card-chart m-0 shadow-lg flex flex-col gap-3" style={{ marginBottom: '12px' }}>
          <div className="chart-header" style={{ marginBottom: '0px' }}>
            <h4>악력</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Left Hand */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[var(--text-muted)] text-[12px] font-bold">왼손</span>
                <span className={`font-bold text-[11px] ${leftStatus.colorClass}`}>{leftStatus.status}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--text-muted)] whitespace-nowrap">변화율</span>
                  <span className={`text-xl sm:text-2xl font-black ${leftStatus.colorClass} text-right`}>
                    {isLeftEmpty ? '-' : `${leftChange > 0 ? '+' : ''}${leftChange.toFixed(1)}%`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[13px] text-[var(--text-muted)] whitespace-nowrap">오늘 측정값</span>
                  <div className="flex items-baseline justify-end whitespace-nowrap shrink-0">
                    <input 
                      type="number" 
                      step="0.1"
                      value={gripLeftToday === 0 ? '' : gripLeftToday} 
                      onChange={e => setGripLeftToday(Number(e.target.value))}
                      onBlur={e => {
                        const val = Number(e.target.value);
                        let p = JSON.parse(JSON.stringify(player));
                        if (p.gripChartData && p.gripChartData.leftValues && p.gripChartData.leftValues.length > 0) {
                          p.gripChartData.leftValues[p.gripChartData.leftValues.length - 1] = val;
                          if (!p.metrics) p.metrics = {};
                          p.metrics.gripRaw = (val + gripRightToday) / 2;
                          onUpdatePlayer(p);
                        }
                      }}
                      placeholder="0"
                      className="bg-transparent border-none w-[48px] sm:w-[64px] p-0 text-right text-xl sm:text-2xl text-white font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-600"
                    />
                    <span className="text-xl sm:text-2xl text-white font-black ml-1">kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[13px] text-[var(--text-muted)] whitespace-nowrap">평소 평균값</span>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-right text-[13px] text-white font-bold">{gripLeftBaseline === 0 ? '-' : gripLeftBaseline}</span>
                    <span className="text-xs text-gray-500">kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hand */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[var(--text-muted)] text-[12px] font-bold">오른손</span>
                <span className={`font-bold text-[11px] ${rightStatus.colorClass}`}>{rightStatus.status}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-[var(--text-muted)] whitespace-nowrap">변화율</span>
                  <span className={`text-xl sm:text-2xl font-black ${rightStatus.colorClass} text-right`}>
                    {isRightEmpty ? '-' : `${rightChange > 0 ? '+' : ''}${rightChange.toFixed(1)}%`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[13px] text-[var(--text-muted)] whitespace-nowrap">오늘 측정값</span>
                  <div className="flex items-baseline justify-end whitespace-nowrap shrink-0">
                    <input 
                      type="number" 
                      step="0.1"
                      value={gripRightToday === 0 ? '' : gripRightToday} 
                      onChange={e => setGripRightToday(Number(e.target.value))}
                      onBlur={e => {
                        const val = Number(e.target.value);
                        let p = JSON.parse(JSON.stringify(player));
                        if (p.gripChartData && p.gripChartData.rightValues && p.gripChartData.rightValues.length > 0) {
                          p.gripChartData.rightValues[p.gripChartData.rightValues.length - 1] = val;
                          if (!p.metrics) p.metrics = {};
                          p.metrics.gripRaw = (gripLeftToday + val) / 2;
                          onUpdatePlayer(p);
                        }
                      }}
                      placeholder="0"
                      className="bg-transparent border-none w-[48px] sm:w-[64px] p-0 text-right text-xl sm:text-2xl text-white font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-600"
                    />
                    <span className="text-xl sm:text-2xl text-white font-black ml-1">kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[13px] text-[var(--text-muted)] whitespace-nowrap">평소 평균값</span>
                  <div className="flex items-center gap-1 justify-end">
                    <span className="text-right text-[13px] text-white font-bold">{gripRightBaseline === 0 ? '-' : gripRightBaseline}</span>
                    <span className="text-xs text-gray-500">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="card-chart">
        <div className="flex flex-col gap-2 mb-4">
          <h4 className="text-left m-0 text-[13px]">ACWR (급성/만성 부하 비율) 추이 그래프</h4>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowPastAcwrModal(true)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-[13px] transition-colors shrink-0"
            >
              <span className="material-icons-round text-[18px]">history</span>
              지난 기록 보기
            </button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={player.acwrGraphData || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="date" stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[0.5, acwrYAxisMax]} ticks={acwrYAxisTicks} stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceArea y1={0.5} y2={0.8} {...{fill: "rgba(255,255,255,0.05)", fillOpacity: 1}} />
              <ReferenceArea y1={0.8} y2={1.3} {...{fill: "#4ade80", fillOpacity: 0.15}} />
              <ReferenceArea y1={1.3} y2={1.5} {...{fill: "#facc15", fillOpacity: 0.15}} />
              <ReferenceArea y1={1.5} y2={acwrYAxisMax} {...{fill: "#ef4444", fillOpacity: 0.15}} />
              <Line type="monotone" dataKey="acwr" stroke="#8E9AA8" strokeWidth={3} dot={<CustomDot />} activeDot={<CustomActiveDot />} name="ACWR" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-2 mt-3 justify-center">
          <div className="flex items-start gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#4ade80] opacity-50 shrink-0 mt-[4px]"></span><div className="text-[11px] sm:text-xs text-gray-400 flex flex-col leading-tight"><span className="whitespace-nowrap font-medium text-gray-300">최적 훈련 구간</span><span className="whitespace-nowrap">(0.8 ~ 1.3)</span></div></div>
          <div className="flex items-start gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#facc15] opacity-50 shrink-0 mt-[4px]"></span><div className="text-[11px] sm:text-xs text-gray-400 flex flex-col leading-tight"><span className="whitespace-nowrap font-medium text-gray-300">주의 요망</span><span className="whitespace-nowrap">(1.3 ~ 1.5)</span></div></div>
          <div className="flex items-start gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] opacity-50 shrink-0 mt-[4px]"></span><div className="text-[11px] sm:text-xs text-gray-400 flex flex-col leading-tight"><span className="whitespace-nowrap font-medium text-gray-300">부상 위험 극대화</span><span className="whitespace-nowrap">(1.5 이상)</span></div></div>
        </div>
      </div>
      <div className="card-chart">
        <div className="chart-header flex justify-between items-center mb-4">
          <h4 className="text-[13px]" style={{ marginBottom: 0 }}>최근 7일 악력 추이</h4>
          <button 
            onClick={() => setShowPastGripModal(true)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-[13px] transition-colors"
          >
            <span className="material-icons-round text-[18px]">history</span>
            지난 기록 보기
          </button>
        </div>
        <div className="h-[280px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={player?.gripChartData?.labels?.map((label: string, idx: number) => ({
                name: label,
                left: player?.gripChartData?.leftValues?.[idx] || player?.gripChartData?.values?.[idx] || 0,
                right: player?.gripChartData?.rightValues?.[idx] || player?.gripChartData?.values?.[idx] || 0
              })) || []}
              margin={{ top: 30, right: 10, left: -25, bottom: 0 }}
              barGap={2}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis 
                domain={['dataMin - 5', 'dataMax + 5']} 
                stroke="#8E9AA8" 
                tick={{ fill: '#8E9AA8', fontSize: 12 }} 
                axisLine={false} 
                tickLine={false} 
                dx={-10} 
                width={30}
              />
              <Bar dataKey="left" radius={[4, 4, 4, 4]} maxBarSize={16}>
                {
                  (player?.gripChartData?.labels || []).map((label: string, index: number) => {
                    const isToday = label === "오늘";
                    const fillColor = isToday ? "#FFFFFF" : "rgba(156, 163, 175, 0.4)";
                    const strokeColor = isToday ? "#FFFFFF" : "#9CA3AF";
                    return (
                      <Cell key={`cell-left-${index}`} fill={fillColor} stroke={strokeColor} strokeWidth={1.5} />
                    );
                  })
                }
                <LabelList 
                  dataKey="left" 
                  position="top" 
                  content={(props: any) => {
                    const { x, y, width, value, index } = props;
                    const isToday = player?.gripChartData?.labels?.[index] === "오늘";
                    return (
                      <g>
                        <text x={x + width / 2 - 2} y={y - 18} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={10} fontWeight="bold" textAnchor="middle">
                          좌
                        </text>
                        <text x={x + width / 2 - 2} y={y - 6} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={11} fontWeight="bold" textAnchor="middle">
                          {value}
                        </text>
                      </g>
                    );
                  }}
                />
              </Bar>
              <Bar dataKey="right" radius={[4, 4, 4, 4]} maxBarSize={16}>
                {
                  (player?.gripChartData?.labels || []).map((label: string, index: number) => {
                    const isToday = label === "오늘";
                    const fillColor = isToday ? "#FFFFFF" : "rgba(156, 163, 175, 0.4)";
                    const strokeColor = isToday ? "#FFFFFF" : "#9CA3AF";
                    return (
                      <Cell key={`cell-right-${index}`} fill={fillColor} stroke={strokeColor} strokeWidth={1.5} />
                    );
                  })
                }
                <LabelList 
                  dataKey="right" 
                  position="top" 
                  content={(props: any) => {
                    const { x, y, width, value, index } = props;
                    const isToday = player?.gripChartData?.labels?.[index] === "오늘";
                    return (
                      <g>
                        <text x={x + width / 2 + 2} y={y - 18} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={10} fontWeight="bold" textAnchor="middle">
                          우
                        </text>
                        <text x={x + width / 2 + 2} y={y - 6} fill={isToday ? "#FFFFFF" : "#9CA3AF"} fontSize={11} fontWeight="bold" textAnchor="middle">
                          {value}
                        </text>
                      </g>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-chart">
        <div className="flex flex-col gap-2 mb-4">
          <h4 className="text-left m-0 text-[13px]">최근 7일 수면 패턴 (Sleep Trend)</h4>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowPastSleepModal(true)}
              className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-[13px] transition-colors"
            >
              <span className="material-icons-round text-[18px]">history</span>
              지난 기록 보기
            </button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={player.sleepChartData || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="date" stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[3.0, 12.0]} ticks={[3, 6, 8, 10, 12]} stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} unit="시간" />
              <Tooltip content={<SleepCustomTooltip />} />
              <ReferenceArea y1={3.0} y2={6.0} {...{fill: "#ef4444", fillOpacity: 0.15}} />
              <ReferenceArea y1={6.0} y2={8.0} {...{fill: "rgba(255,255,255,0.05)", fillOpacity: 1}} />
              <ReferenceArea y1={8.0} y2={12.0} {...{fill: "#4ade80", fillOpacity: 0.15}} />
              <Line type="monotone" dataKey="sleepDuration" stroke="#8E9AA8" strokeWidth={3} dot={<SleepCustomDot />} activeDot={<SleepCustomActiveDot />} name="수면 시간" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-2 mt-2 justify-center">
          <div className="flex items-start gap-1.5"><span className="w-3 h-3 rounded-full bg-[#ef4444] opacity-50 mt-[3px]"></span><span className="text-xs text-gray-400">수면 부족<br />(6시간 미만)</span></div>
          <div className="flex items-start gap-1.5"><span className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.2)] mt-[3px]"></span><span className="text-xs text-gray-400">적정 수면<br />(6~8시간)</span></div>
          <div className="flex items-start gap-1.5"><span className="w-3 h-3 rounded-full bg-[#4ade80] opacity-50 mt-[3px]"></span><span className="text-xs text-gray-400">완벽 회복<br />(8시간 이상)</span></div>
        </div>
      </div>



      {showPastGripModal && renderPastHistoryModal("grip")}
      {showPastSleepModal && renderPastHistoryModal("sleep")}
      {showPastAcwrModal && renderPastHistoryModal("acwr")}
      {isDailyLogOpen && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">지표 입력</h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setIsDailyLogOpen(false)}>close</span>
            </div>
            <div className="p-6 overflow-y-auto flex flex-col gap-[12px]">
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">인지된 훈련 강도(힘듦)</label>
                <div className="text-center mb-4 text-xs font-bold transition-colors duration-150" style={{ color: logRpe <= 2 ? '#3b82f6' : logRpe <= 4 ? '#10b981' : logRpe <= 6 ? '#eab308' : logRpe <= 8 ? '#f97316' : '#ef4444' }}>
                  {logRpe} - {rpeLabels[logRpe]}
                </div>
                <div className="flex w-full h-8 rounded-full overflow-hidden mb-2 shadow-inner" style={{ background: 'linear-gradient(to right, #3b82f6, #10b981, #eab308, #f97316, #ef4444)' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <div 
                      key={num}
                      onClick={() => setLogRpe(num)}
                      className={`flex-1 flex items-center justify-center cursor-pointer text-sm font-bold transition-all ${logRpe === num ? 'bg-white text-[#1f2937] scale-100 shadow-lg' : 'text-white/80 hover:bg-white/20'}`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs font-medium text-[var(--text-muted)]">
                  <span>없음</span>
                  <span>극한</span>
                </div>
              </div>

              <div className="mb-0">
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">훈련 시간 (분)</label>
                <input type="number" value={logDuration} onChange={e => setLogDuration(e.target.value === '' ? '' : Number(e.target.value))} className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-lg text-white text-[13px] outline-none transition-colors" />
              </div>
              
              <div className="mb-0 flex gap-3">
                <div className="flex-1">
                  <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">왼손 악력 (kg)</label>
                  <input type="number" step="0.1" value={logGripLeft} onChange={e => setLogGripLeft(e.target.value === '' ? '' : Number(e.target.value))} className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-lg text-white text-[13px] outline-none transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">오른손 악력 (kg)</label>
                  <input type="number" step="0.1" value={logGripRight} onChange={e => setLogGripRight(e.target.value === '' ? '' : Number(e.target.value))} className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-lg text-white text-[13px] outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">수면 시간</label>
                <div className="flex flex-col gap-[12px] mt-[6px]">
                  <TimeSelect value={sleepStart} onChange={setSleepStart} label="취침시간" />
                  <TimeSelect value={sleepEnd} onChange={setSleepEnd} label="기상시간" />
                </div>
              </div>

              <button className="btn-primary w-full h-[30px] flex items-center justify-center text-[14px] font-bold mt-[12px]" onClick={submitDailyLog}>저장</button>
            </div>
          </div>
        </div>
      )}


      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-2 text-center">기록 삭제</h3>
            <p className="text-gray-400 text-sm text-center mb-6">정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: false, index: null, type: null })} 
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleDeleteHistory} 
                className="flex-1 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold transition-colors border border-red-500/20"
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
