import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer
} from 'recharts';
import { downloadSampleCSV } from '../utils';
import ComprehensiveStatusDashboard from './ComprehensiveStatusDashboard';

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
          ACWR : {value}
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
        <p className="text-white font-bold text-lg mb-2">수면 시간: {hours}시간 {minutes}분</p>
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
  
  const handleAmPm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmPm = e.target.value;
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
      <label className="text-sm font-medium text-[var(--text-muted)] block mb-2">{label}</label>
      <div className="flex gap-2">
        <select value={ampm} onChange={handleAmPm} className="flex-1 p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm appearance-none outline-none focus:border-[#3b82f6]">
          <option value="AM" className="bg-[#1f2937]">오전</option>
          <option value="PM" className="bg-[#1f2937]">오후</option>
        </select>
        <select value={hour12} onChange={handleHour} className="flex-1 p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm appearance-none outline-none focus:border-[#3b82f6]">
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1} className="bg-[#1f2937]">{i+1}시</option>
          ))}
        </select>
        <select value={m} onChange={handleMinute} className="flex-1 p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm appearance-none outline-none focus:border-[#3b82f6]">
          {[...Array(12)].map((_, i) => {
            const minStr = (i * 5).toString().padStart(2, '0');
            return <option key={minStr} value={minStr} className="bg-[#1f2937]">{minStr}분</option>;
          })}
        </select>
      </div>
    </div>
  );
};

export default function CareTab({ player, isAgent, onUpdatePlayer }: { player: any, isAgent: boolean, onUpdatePlayer: (newData: any) => void, key?: string }) {
  const [isDailyLogOpen, setIsDailyLogOpen] = useState(false);

  const gripChartRef = useRef<HTMLCanvasElement>(null);

  const [logRpe, setLogRpe] = useState(7);
  const [logDuration, setLogDuration] = useState(120);
  const [logGrip, setLogGrip] = useState(player?.metrics?.gripRaw ?? 0);
  const [sleepStart, setSleepStart] = useState('23:00');
  const [sleepEnd, setSleepEnd] = useState('07:00');

  const [gripLeftBaseline, setGripLeftBaseline] = useState(player?.gripChartData?.leftValues?.[0] ?? 0);
  const [gripLeftToday, setGripLeftToday] = useState(player?.gripChartData?.leftValues?.[(player?.gripChartData?.leftValues?.length ?? 0) - 1] ?? 0);
  const [gripRightBaseline, setGripRightBaseline] = useState(player?.gripChartData?.rightValues?.[0] ?? 0);
  const [gripRightToday, setGripRightToday] = useState(player?.gripChartData?.rightValues?.[(player?.gripChartData?.rightValues?.length ?? 0) - 1] ?? 0);

  const [logGripLeft, setLogGripLeft] = useState(player?.gripChartData?.leftValues?.[(player?.gripChartData?.leftValues?.length ?? 0) - 1] ?? 0);
  const [logGripRight, setLogGripRight] = useState(player?.gripChartData?.rightValues?.[(player?.gripChartData?.rightValues?.length ?? 0) - 1] ?? 0);
  const [selectedHand, setSelectedHand] = useState<'left' | 'right'>('left');

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
    setLogGrip(player.metrics.gripRaw);
    setLogGripLeft(gripLeftToday);
    setLogGripRight(gripRightToday);
  }, [player, gripLeftToday, gripRightToday]);

  useEffect(() => {
    const primaryColor = player?.id === "batter" ? "#00FFA3" : "#00E5FF";
    const contrastColor = player?.id === "batter" ? "#00E5FF" : "#FFB300";
    let gripChart: any;

    const chartValues = selectedHand === 'left' 
      ? (player?.gripChartData?.leftValues || player?.gripChartData?.values || []) 
      : (player?.gripChartData?.rightValues || player?.gripChartData?.values || []);

    const labels = player?.gripChartData?.labels || [];

    if (gripChartRef.current) {
      gripChart = new Chart(gripChartRef.current, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{ 
            label: "측정치", 
            data: chartValues, 
            backgroundColor: labels.map((l: string) => l === "오늘" ? contrastColor + "99" : primaryColor + "33"), 
            borderColor: labels.map((l: string) => l === "오늘" ? contrastColor : primaryColor), 
            borderWidth: 1.5, 
            borderRadius: 4 
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, 
          layout: { padding: { top: 20 } },
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: "rgba(255,255,255,0.03)" }, ticks: { color: "#8E9AA8", font: { size: 10 } } },
            y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#8E9AA8", font: { size: 10 } }, min: chartValues.length > 0 ? Math.max(0, Math.floor(Math.min(...chartValues) - 3)) : 0 }
          }
        },
        plugins: [{
          id: 'customDataLabels',
          afterDatasetsDraw(chart: any) {
            const { ctx, data } = chart;
            ctx.save();
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            chart.getDatasetMeta(0).data.forEach((datapoint: any, index: number) => {
              const value = data.datasets[0].data[index];
              const isToday = labels[index] === "오늘";
              ctx.fillStyle = isToday ? contrastColor : "#8E9AA8";
              ctx.fillText(value, datapoint.x, datapoint.y - 4);
            });
            ctx.restore();
          }
        }]
      });
    }
    return () => { if (gripChart) gripChart.destroy(); };
  }, [player, selectedHand]);

  const submitDailyLog = () => {
    setGripLeftToday(logGripLeft);
    setGripRightToday(logGripRight);
    const overallGrip = Number(((logGripLeft + logGripRight) / 2).toFixed(1));

    const base = player.metrics.gripBaseline;
    const dev = (((overallGrip - base) / base) * 100).toFixed(1);
    const newLoad = logRpe * logDuration;
    const curAcute = Math.round((player.acwrChartData.acute[2] * 6 + newLoad) / 7);
    const newAcwr = (curAcute / player.acwrChartData.chronic[3]).toFixed(2);
    
    // Calculate sleep duration
    const [startH, startM] = sleepStart.split(':').map(Number);
    const [endH, endM] = sleepEnd.split(':').map(Number);
    let durationMins = (endH * 60 + endM) - (startH * 60 + startM);
    if (durationMins < 0) durationMins += 24 * 60;
    const sleepDuration = Number((durationMins / 60).toFixed(1));
    
    const p = JSON.parse(JSON.stringify(player));
    if (!p.acwrChartData) p.acwrChartData = { acute: [0,0,0,0], chronic: [1,1,1,1], acwr: [0,0,0,0] };
    if (!p.gripChartData) p.gripChartData = { values: [50,50,50,50], leftValues: [50,50,50,50], rightValues: [50,50,50,50] };
    if (!p.gripChartData.leftValues) p.gripChartData.leftValues = [...(p.gripChartData.values || [50,50,50,50])];
    if (!p.gripChartData.rightValues) p.gripChartData.rightValues = [...(p.gripChartData.values || [50,50,50,50])];

    p.acwrChartData.acute[3] = curAcute;
    p.acwrChartData.acwr[3] = parseFloat(newAcwr);
    
    if (!p.gripChartData.values) p.gripChartData.values = [50,50,50,50];
    p.gripChartData.values.shift();
    p.gripChartData.values.push(overallGrip);
    
    p.gripChartData.leftValues.shift();
    p.gripChartData.leftValues.push(logGripLeft);
    
    p.gripChartData.rightValues.shift();
    p.gripChartData.rightValues.push(logGripRight);
    
    if (!p.metrics) p.metrics = {};
    p.metrics.rpe = logRpe; 
    p.metrics.gripRaw = overallGrip;
    p.metrics.grip = parseFloat(dev);
    p.metrics.acwr = parseFloat(newAcwr);
    p.metrics.sleep = sleepDuration;
    if (p.metrics.acwr >= 1.5 || p.metrics.grip <= -10 || p.metrics.sleep < 6) p.status = "danger";
    else if (p.metrics.acwr >= 1.3 || p.metrics.grip <= -5) p.status = "warning";
    else p.status = "normal";

    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `${month}/${d}`;
    
    // update line charts
    if (!p.acwrGraphData) p.acwrGraphData = [];
    if (!p.sleepChartData) p.sleepChartData = [];
    
    const existingGraphIndex = p.acwrGraphData.findIndex((d: any) => d.date === dateStr);
    if (existingGraphIndex !== -1) {
      p.acwrGraphData[existingGraphIndex].acwr = parseFloat(newAcwr);
      p.sleepChartData[existingGraphIndex].sleepDuration = sleepDuration;
    } else {
      p.acwrGraphData.shift();
      p.acwrGraphData.push({ date: dateStr, acwr: parseFloat(newAcwr) });
      
      p.sleepChartData.shift();
      p.sleepChartData.push({ date: dateStr, sleepDuration: sleepDuration });
    }

    p.schedules = p.schedules || [];
    
    // 중복 추가 방지 (같은 날에 이미 측정 일정이 있다면 무시)
    const existingIndex = p.schedules.findIndex((s: any) => s.date === dateStr && s.title === '[컨디셔닝] 당일 지표 측정');
    if (existingIndex !== -1) {
      p.schedules[existingIndex].acwr = parseFloat(newAcwr);
      p.schedules[existingIndex].grip = overallGrip;
      p.schedules[existingIndex].gripLeft = logGripLeft;
      p.schedules[existingIndex].gripRight = logGripRight;
      p.schedules[existingIndex].sleep = sleepDuration;
    } else {
      p.schedules.push({ date: dateStr, title: '[컨디셔닝] 당일 지표 측정', place: '트레이닝 센터', acwr: parseFloat(newAcwr), grip: overallGrip, gripLeft: logGripLeft, gripRight: logGripRight, sleep: sleepDuration });
    }

    onUpdatePlayer(p); setIsDailyLogOpen(false); alert("오늘의 컨디셔닝 상태가 실시간 반영되었습니다!");
  };

  const latestAcwr = player.metrics?.acwr ?? 0;
  const isAcwrEmpty = latestAcwr === 0;
  const acwrStatusColor = isAcwrEmpty ? 'text-gray-500' : latestAcwr >= 1.5 ? 'text-red-500' : latestAcwr >= 1.3 ? 'text-yellow-500' : 'text-green-500';
  const acwrBorderColor = isAcwrEmpty ? 'border-gray-500/30' : latestAcwr >= 1.5 ? 'border-red-500/30' : latestAcwr >= 1.3 ? 'border-yellow-500/30' : 'border-green-500/30';
  const acwrStatusIcon = isAcwrEmpty ? 'info' : latestAcwr >= 1.5 ? 'warning' : latestAcwr >= 1.3 ? 'warning' : 'check_circle';
  const acwrStatusText = isAcwrEmpty ? '측정값 없음' : latestAcwr >= 1.5 ? '부상 위험' : latestAcwr >= 1.3 ? '주의' : '최적';

  const latestSleep = player.metrics?.sleep ?? 0;
  const isSleepEmpty = latestSleep === 0;
  const avgSleep = player.sleepChartData?.length ? (player.sleepChartData.reduce((acc: any, curr: any) => acc + curr.sleepDuration, 0) / player.sleepChartData.length).toFixed(1) : "0.0";

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
        <button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => setIsDailyLogOpen(true)}>
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
            <div className="text-xs md:text-sm font-medium mt-3 opacity-0 pointer-events-none select-none">
              -
            </div>
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
            <div className="text-xs md:text-sm text-[var(--text-muted)] font-medium mt-5">
              최근 7일 평균: {isSleepEmpty ? '-' : `${avgSleep}h`}
            </div>
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
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap">변화율</span>
                  <span className={`text-xl sm:text-2xl font-black ${leftStatus.colorClass} text-right`}>
                    {isLeftEmpty ? '-' : `${leftChange > 0 ? '+' : ''}${leftChange.toFixed(1)}%`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap">오늘 측정값</span>
                  <div className="flex items-baseline justify-end whitespace-nowrap shrink-0">
                    <input 
                      type="number" 
                      step="0.1"
                      value={gripLeftToday === 0 ? '' : gripLeftToday} 
                      onChange={e => setGripLeftToday(Number(e.target.value))}
                      placeholder="0"
                      className="bg-transparent border-none w-[48px] sm:w-[64px] p-0 text-right text-xl sm:text-2xl text-white font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-600"
                    />
                    <span className="text-xl sm:text-2xl text-white font-black ml-1">kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap">평소 평균값</span>
                  <div className="flex items-center gap-1 justify-end">
                    <input 
                      type="number" 
                      step="0.1"
                      value={gripLeftBaseline === 0 ? '' : gripLeftBaseline} 
                      onChange={e => setGripLeftBaseline(Number(e.target.value))}
                      placeholder="0"
                      className="bg-transparent border-b border-gray-600 w-12 sm:w-16 text-right text-[10px] sm:text-sm text-white focus:outline-none focus:border-[var(--primary-color)] placeholder-gray-600"
                    />
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
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap">변화율</span>
                  <span className={`text-xl sm:text-2xl font-black ${rightStatus.colorClass} text-right`}>
                    {isRightEmpty ? '-' : `${rightChange > 0 ? '+' : ''}${rightChange.toFixed(1)}%`}
                  </span>
                </div>
                
                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap">오늘 측정값</span>
                  <div className="flex items-baseline justify-end whitespace-nowrap shrink-0">
                    <input 
                      type="number" 
                      step="0.1"
                      value={gripRightToday === 0 ? '' : gripRightToday} 
                      onChange={e => setGripRightToday(Number(e.target.value))}
                      placeholder="0"
                      className="bg-transparent border-none w-[48px] sm:w-[64px] p-0 text-right text-xl sm:text-2xl text-white font-black focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder-gray-600"
                    />
                    <span className="text-xl sm:text-2xl text-white font-black ml-1">kg</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/20 p-1.5 sm:p-2 rounded-lg">
                  <span className="text-[10px] sm:text-xs text-[var(--text-muted)] whitespace-nowrap">평소 평균값</span>
                  <div className="flex items-center gap-1 justify-end">
                    <input 
                      type="number" 
                      step="0.1"
                      value={gripRightBaseline === 0 ? '' : gripRightBaseline} 
                      onChange={e => setGripRightBaseline(Number(e.target.value))}
                      placeholder="0"
                      className="bg-transparent border-b border-gray-600 w-12 sm:w-16 text-right text-[10px] sm:text-sm text-white focus:outline-none focus:border-[var(--primary-color)] placeholder-gray-600"
                    />
                    <span className="text-xs text-gray-500">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="card-chart">
        <div className="chart-header"><h4 className="truncate">ACWR (급성/만성 부하 비율) 추이 그래프</h4></div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={player.acwrGraphData || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="date" stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis domain={[0.5, 2.0]} ticks={[0.5, 0.8, 1.3, 1.5, 2.0]} stroke="#8E9AA8" tick={{ fill: '#8E9AA8', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceArea y1={0.5} y2={0.8} {...{fill: "rgba(255,255,255,0.05)", fillOpacity: 1}} />
              <ReferenceArea y1={0.8} y2={1.3} {...{fill: "#4ade80", fillOpacity: 0.15}} />
              <ReferenceArea y1={1.3} y2={1.5} {...{fill: "#facc15", fillOpacity: 0.15}} />
              <ReferenceArea y1={1.5} y2={2.0} {...{fill: "#ef4444", fillOpacity: 0.15}} />
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
        <div className="chart-header">
          <h4 style={{ marginBottom: 0 }}>최근 7일 악력 추이</h4>
        </div>
        <div className="flex justify-center mb-4">
          <div className="tabs-sub" style={{ margin: 0, minWidth: '140px' }}>
            <button 
              className={`tab-sub-btn ${selectedHand === 'left' ? 'active' : ''}`}
              onClick={() => setSelectedHand('left')}
              style={{ backgroundColor: selectedHand === 'left' ? 'var(--primary-color)' : 'transparent', color: selectedHand === 'left' ? 'var(--bg-color)' : 'var(--text-muted)' }}
            >
              왼손
            </button>
            <button 
              className={`tab-sub-btn ${selectedHand === 'right' ? 'active' : ''}`}
              onClick={() => setSelectedHand('right')}
              style={{ backgroundColor: selectedHand === 'right' ? 'var(--primary-color)' : 'transparent', color: selectedHand === 'right' ? 'var(--bg-color)' : 'var(--text-muted)' }}
            >
              오른손
            </button>
          </div>
        </div>
        <div className="chart-container"><canvas ref={gripChartRef}></canvas></div>
      </div>

      <div className="card-chart">
        <div className="chart-header"><h4>최근 7일 수면 패턴 (Sleep Trend)</h4></div>
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



      {isDailyLogOpen && (
        <div className="modal active">
          <div className="modal-content">
            <div className="modal-header"><h4>지표 입력</h4><span className="material-icons-round close-btn" onClick={() => setIsDailyLogOpen(false)}>close</span></div>
            <div className="modal-body flex flex-col gap-6">
              <div>
                <label className="text-sm font-bold text-white mb-3 block">훈련 후 인지된 노력(1~10)</label>
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
                <label className="text-sm font-bold text-white mb-3 block">훈련 시간 (분)</label>
                <input type="number" value={logDuration} onChange={e => setLogDuration(Number(e.target.value))} className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm outline-none focus:border-[#3b82f6]" />
              </div>
              
              <div className="mb-0 flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-bold text-white mb-3 block">왼손 악력 (kg)</label>
                  <input type="number" step="0.1" value={logGripLeft} onChange={e => setLogGripLeft(Number(e.target.value))} className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm outline-none focus:border-[#3b82f6]" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-white mb-3 block">오른손 악력 (kg)</label>
                  <input type="number" step="0.1" value={logGripRight} onChange={e => setLogGripRight(Number(e.target.value))} className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm outline-none focus:border-[#3b82f6]" />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-white mb-3 block">수면 시간</label>
                <div className="flex flex-col gap-4">
                  <TimeSelect value={sleepStart} onChange={setSleepStart} label="취침시간" />
                  <TimeSelect value={sleepEnd} onChange={setSleepEnd} label="기상시간" />
                </div>
              </div>

              <button className="btn-primary w-full py-4 text-base font-bold mt-2" onClick={submitDailyLog}>저장</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
