import React from 'react';
import { isAcwrSufficient } from '../utils';

interface ComprehensiveStatusDashboardProps {
  acwr: number;
  sleep: number;
  gripLeft: number;
  gripRight: number;
  isEmpty?: boolean;
  isAcwrSufficient?: boolean;
}

export const generateConditionAnalysis = ({
  acwr,
  sleep,
  gripLeft,
  gripRight,
  isEmpty = false,
  isAcwrSufficient: isAcwrSufficientProp = true
}: {
  acwr: number;
  sleep: number;
  gripLeft: number;
  gripRight: number;
  isEmpty?: boolean;
  isAcwrSufficient?: boolean;
}) => {
  if (isEmpty) {
    return '충분한 데이터가 누적되지 않았습니다. 매일 지표를 입력하여 선수 컨디션을 관리해 주세요.';
  }

  const isAcwrAnalyzing = !isAcwrSufficientProp || acwr === 0;
  const acwrStatus = isAcwrAnalyzing ? 'analyzing' : acwr >= 1.5 ? 'danger' : acwr >= 1.3 ? 'warning' : 'normal';

  const minGripChange = Math.min(gripLeft, gripRight);
  const isGripEmpty = gripLeft === 0 && gripRight === 0;
  const gripStatus = isGripEmpty ? 'normal' : minGripChange <= -15 ? 'danger' : minGripChange <= -5 ? 'warning' : 'normal';

  const isSleepEmpty = sleep === 0;
  const sleepStatus = isSleepEmpty ? 'normal' : sleep < 5.0 ? 'danger' : sleep < 7.0 ? 'warning' : 'normal';

  const hasIssue = acwrStatus === 'danger' || acwrStatus === 'warning' ||
                   gripStatus === 'danger' || gripStatus === 'warning' ||
                   sleepStatus === 'danger' || sleepStatus === 'warning';

  // 1. 모든 지표가 정상이고 ACWR 분석도 완료된 경우 (🟢 최적)
  if (!hasIssue && !isAcwrAnalyzing) {
    const sleepStr = sleep > 0 ? `${sleep.toFixed(1)}h` : '정상';
    return `수면(${sleepStr})을 통한 육체 회복, 중추신경계, 훈련 부하(ACWR) 지표가 모두 최적의 상태입니다. 부상 위험이 극히 낮으며, 고강도 훈련 소화가 가능한 완벽한 컨디션입니다.`;
  }

  // 2. 다른 지표는 정상이지만 ACWR만 분석 중인 경우 (⚪ 분석 중)
  if (!hasIssue && isAcwrAnalyzing) {
    const sleepStr = sleep > 0 ? `수면(${sleep.toFixed(1)}h) 및 ` : '';
    return `ACWR 기준 부하량 산출을 위한 데이터 수집이 진행 중(21일 미만)입니다. 현재 ${sleepStr}악력 지표는 정상 범위 내에서 양호하게 유지되고 있습니다.`;
  }

  // 3. 지표 중 위험 또는 주의가 포함된 경우 (🔴 / 🟠 / 🟡)
  let sleepText = '';
  const isOtherIssue = gripStatus === 'danger' || gripStatus === 'warning' || acwrStatus === 'danger' || acwrStatus === 'warning';

  if (sleepStatus === 'normal' && sleep > 0) {
    // 정상일 때: 다른 지표가 위험/경고/주의일 때만 문장 앞에 추가
    if (isOtherIssue) {
      sleepText = `수면(${sleep.toFixed(1)}h)을 통한 기본적인 육체 회복은 정상 범위이나, `;
    }
  } else if (sleepStatus === 'danger' || sleepStatus === 'warning') {
    // 수면이 위험/주의일 때
    if (isOtherIssue) {
      sleepText = `최근 수면 시간이 ${sleep.toFixed(1)}h로 부족하여 신체 회복이 심각하게 지연되고 있으며, `;
    } else {
      sleepText = `최근 수면 시간이 ${sleep.toFixed(1)}h로 부족하여 신체 회복이 심각하게 지연되고 있어 충전 및 수면 관리가 필요합니다.`;
    }
  }

  let gripText = '';
  if (gripStatus === 'danger' || gripStatus === 'warning') {
    const changeFormatted = `${minGripChange.toFixed(1)}%`;
    gripText = `중추신경계 피로도를 나타내는 악력이 평균 대비 ${changeFormatted} 하락하여 위험 수준입니다. 배트 스피드 저하 및 투구/타격 밸런스 붕괴가 우려되므로 고강도 기술 훈련의 즉각적인 조절이 필요합니다. `;
  }

  let acwrText = '';
  if (acwrStatus === 'danger' || acwrStatus === 'warning') {
    const acwrVal = acwr.toFixed(2);
    acwrText = `최근 급격한 훈련량 증가로 ACWR 지표가 ${acwrVal}를 기록하며 근골격계 부상 위험이 극대화된 상태입니다.`;
  }

  const fullText = `${sleepText}${gripText}${acwrText}`.trim();

  return fullText || '선수 컨디션 지표를 정밀 분석 중입니다.';
};

export const getComprehensiveStatus = (
  acwr: number,
  sleep: number,
  gripLeft: number,
  gripRight: number,
  isEmpty: boolean,
  isAcwrSufficient: boolean = true
) => {
  // 1. Evaluate individual indicator statuses
  const isAcwrAnalyzing = !isAcwrSufficient || acwr === 0;
  const acwrStatus = isAcwrAnalyzing ? 'analyzing' : acwr >= 1.5 ? 'danger' : acwr >= 1.3 ? 'warning' : 'normal';

  const minGripChange = Math.min(gripLeft, gripRight);
  const isGripEmpty = gripLeft === 0 && gripRight === 0;
  const gripStatus = isGripEmpty ? 'empty' : minGripChange <= -15 ? 'danger' : minGripChange <= -5 ? 'warning' : 'normal';

  const isSleepEmpty = sleep === 0;
  const sleepStatus = isSleepEmpty ? 'empty' : sleep < 5.0 ? 'danger' : sleep < 7.0 ? 'warning' : 'normal';

  // 2. Determine overall level & badge based on priority rules
  let level = 4;
  let badgeColor = '';
  let badgeText = '';
  let borderColor = '';
  let icon = '';

  const isAcwrDanger = acwrStatus === 'danger';
  const isGripDanger = gripStatus === 'danger';
  const isSleepDanger = sleepStatus === 'danger';

  const isAcwrWarning = acwrStatus === 'warning';
  const isGripWarning = gripStatus === 'warning';
  const isSleepWarning = sleepStatus === 'warning';

  if (isEmpty) {
    level = 0;
    badgeText = '측정값 없음';
    badgeColor = 'bg-gray-500/20 text-gray-500';
    borderColor = 'border-gray-500/50';
    icon = 'info';
  } else if (isAcwrDanger && isGripDanger) {
    // 🔴 치명적 위험 (Red): ACWR과 악력이 모두 '위험' 상태일 때. (또는 3개 지표 모두 위험)
    level = 1;
    badgeText = '치명적 위험';
    badgeColor = 'bg-black text-red-500';
    borderColor = 'border-red-900';
    icon = 'warning';
  } else if (isAcwrDanger || isGripDanger) {
    // 🟠 경고 (Orange): 수면 상태와 무관하게, ACWR 또는 악력 중 단 하나만 '위험' 상태일 때.
    level = 2;
    badgeText = '경고';
    badgeColor = 'bg-orange-500/20 text-orange-500';
    borderColor = 'border-orange-500/50';
    icon = 'error';
  } else if (isAcwrWarning || isGripWarning || isSleepWarning || isSleepDanger) {
    // 🟡 주의 (Yellow): ACWR/악력에 '위험'은 없지만 1개 이상 지표가 '주의'이거나, 오직 '수면'만 '위험'일 때.
    level = 3;
    badgeText = '주의';
    badgeColor = 'bg-yellow-500/20 text-yellow-500';
    borderColor = 'border-yellow-500/50';
    icon = 'warning_amber';
  } else if (acwrStatus === 'analyzing') {
    // ⚪ 분석 중 (Gray): ACWR이 데이터 수집 중(21일 미만)이고 나머지 지표가 정상일 때.
    level = 5;
    badgeText = '기준 부하량 분석 중';
    badgeColor = 'bg-gray-500/20 text-gray-400';
    borderColor = 'border-gray-500/30';
    icon = 'analytics';
  } else {
    // 🟢 최적 (Green): 모든 지표가 '정상' 범위일 때.
    level = 4;
    badgeText = '최적';
    badgeColor = 'bg-[#4ade80]/20 text-[#4ade80]';
    borderColor = 'border-[#4ade80]/50';
    icon = 'check_circle';
  }

  // 3. Dynamic text briefing
  const briefing = generateConditionAnalysis({
    acwr,
    sleep,
    gripLeft,
    gripRight,
    isEmpty,
    isAcwrSufficient
  });

  return { level, badgeColor, badgeText, borderColor, icon, briefing };
};

export const getPlayerComprehensiveStatus = (player: any) => {
  if (!player) {
    return getComprehensiveStatus(0, 0, 0, 0, true, false);
  }

  const isAcwrSufficientData = isAcwrSufficient(player.schedules);
  const latestAcwr = isAcwrSufficientData ? (player.metrics?.acwr ?? 0) : 0;
  const isAcwrEmpty = latestAcwr === 0 || !isAcwrSufficientData;

  const latestSleep = player.sleepChartData?.length 
    ? player.sleepChartData[player.sleepChartData.length - 1].sleepDuration 
    : 0;
  const isSleepEmpty = latestSleep === 0;

  const getGrip4WeekAvg = (side: 'left' | 'right') => {
    const prop = side === 'left' ? 'gripLeft' : 'gripRight';
    const leftVals = player?.gripChartData?.leftValues || [];
    const rightVals = player?.gripChartData?.rightValues || [];
    const todayVal = side === 'left' ? leftVals[leftVals.length - 1] || 0 : rightVals[rightVals.length - 1] || 0;
    const now = new Date();
    const twentyEightDaysAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const values: number[] = [];
    if (todayVal > 0) values.push(todayVal);

    if (player?.schedules && Array.isArray(player.schedules)) {
      player.schedules.forEach((s: any) => {
        const val = s[prop];
        if (typeof val === 'number' && val > 0) {
          if (s.date) {
            let schedDate: Date | null = null;
            if (s.date.includes('-')) {
              schedDate = new Date(s.date);
            } else if (s.date.includes('/')) {
              const parts = s.date.split('/');
              if (parts.length === 2) {
                const m = parseInt(parts[0], 10) - 1;
                const d = parseInt(parts[1], 10);
                schedDate = new Date(now.getFullYear(), m, d);
                if (schedDate > now) schedDate.setFullYear(now.getFullYear() - 1);
              }
            }
            if (!schedDate || (schedDate >= twentyEightDaysAgo && schedDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000))) {
              values.push(val);
            }
          } else {
            values.push(val);
          }
        }
      });
    }

    if (values.length === 0) {
      const chartValues = side === 'left' ? player?.gripChartData?.leftValues : player?.gripChartData?.rightValues;
      if (Array.isArray(chartValues)) {
        chartValues.forEach((v: number) => {
          if (v > 0) values.push(v);
        });
      }
    }

    if (values.length === 0) return 0;
    const top3 = [...values].sort((a, b) => b - a).slice(0, 3);
    const sum = top3.reduce((acc, curr) => acc + curr, 0);
    return Number((sum / top3.length).toFixed(1));
  };

  const avgLeft = getGrip4WeekAvg('left');
  const avgRight = getGrip4WeekAvg('right');

  const leftValues = player.gripChartData?.leftValues || [];
  const gripLeftToday = leftValues[leftValues.length - 1] || 0;
  const rightValues = player.gripChartData?.rightValues || [];
  const gripRightToday = rightValues[rightValues.length - 1] || 0;

  const getGripChange = (base: number, today: number) => {
    if (base === 0 || today === 0) return 0;
    return ((today - base) / base) * 100;
  };

  const isLeftEmpty = avgLeft === 0 || gripLeftToday === 0;
  const isRightEmpty = avgRight === 0 || gripRightToday === 0;

  const leftChange = (avgLeft > 0 && gripLeftToday > 0) ? getGripChange(avgLeft, gripLeftToday) : 0;
  const rightChange = (avgRight > 0 && gripRightToday > 0) ? getGripChange(avgRight, gripRightToday) : 0;

  const isEmpty = isAcwrEmpty && isSleepEmpty && isLeftEmpty && isRightEmpty;

  return getComprehensiveStatus(latestAcwr, latestSleep, leftChange, rightChange, isEmpty, isAcwrSufficientData);
};

export default function ComprehensiveStatusDashboard({
  acwr,
  sleep,
  gripLeft,
  gripRight,
  isEmpty = false,
  isAcwrSufficient = true
}: ComprehensiveStatusDashboardProps) {
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const status = getComprehensiveStatus(acwr, sleep, gripLeft, gripRight, isEmpty, isAcwrSufficient);
  const { badgeColor, badgeText, borderColor, icon, briefing } = status;
  
  const asymmetry = !isEmpty && Math.abs(gripLeft - gripRight) >= 15;

  const getStatusItem = (type: 'load' | 'recovery' | 'nerve') => {
    if (isEmpty) {
      const labels = { load: '부하 (ACWR)', recovery: '회복 (수면)', nerve: '신경계 (악력)' };
      return { label: labels[type], status: '측정 안됨', color: 'text-gray-500', icon: 'info' };
    }
    if (type === 'load') {
      if (!isAcwrSufficient || acwr === 0) return { label: '부하 (ACWR)', status: '기준 부하량 분석 중', color: 'text-gray-400', icon: 'analytics' };
      if (acwr >= 1.5) return { label: '부하 (ACWR)', status: '위험', color: 'text-red-500', icon: 'warning' };
      if (acwr >= 1.3) return { label: '부하 (ACWR)', status: '경고', color: 'text-yellow-500', icon: 'warning_amber' };
      return { label: '부하 (ACWR)', status: '정상', color: 'text-[#4ade80]', icon: 'check_circle' };
    }
    if (type === 'recovery') {
      if (sleep === 0) return { label: '회복 (수면)', status: '측정 안됨', color: 'text-gray-500', icon: 'info' };
      if (sleep < 5.0) return { label: '회복 (수면)', status: '위험', color: 'text-red-500', icon: 'warning' };
      if (sleep < 7.0) return { label: '회복 (수면)', status: '경고', color: 'text-yellow-500', icon: 'warning_amber' };
      return { label: '회복 (수면)', status: '정상', color: 'text-[#4ade80]', icon: 'check_circle' };
    }
    if (type === 'nerve') {
      const isGripEmpty = gripLeft === 0 && gripRight === 0;
      if (isGripEmpty) return { label: '신경계 (악력)', status: '측정 안됨', color: 'text-gray-500', icon: 'info' };
      const minGrip = Math.min(gripLeft, gripRight);
      if (minGrip <= -15) return { label: '신경계 (악력)', status: '위험', color: 'text-red-500', icon: 'warning' };
      if (minGrip <= -5) return { label: '신경계 (악력)', status: '경고', color: 'text-yellow-500', icon: 'warning_amber' };
      return { label: '신경계 (악력)', status: '정상', color: 'text-[#4ade80]', icon: 'check_circle' };
    }
    return { label: '', status: '', color: '', icon: '' };
  };

  const loadStatus = getStatusItem('load');
  const recoveryStatus = getStatusItem('recovery');
  const nerveStatus = getStatusItem('nerve');

  return (
    <div className={`card-chart shadow-lg relative overflow-hidden ${borderColor}`} style={{ marginBottom: '12px' }}>
      {/* Asymmetry Banner */}
      {asymmetry && (
        <div className="bg-red-600 text-white text-sm font-bold p-3 flex items-center justify-center gap-2 mx-[-16px] mt-[-16px] mb-5">
          <span className="material-icons-round">notification_important</span>
          <span>🚨 좌우 악력 불균형(15%p이상) 심화! 국소 부위(어깨/옆구리) 구조적 손상 의심 - 메디컬 크로스체크 요망</span>
        </div>
      )}

      <div className="flex flex-col gap-5">
        {/* Top: Square Badge & Briefing */}
        <div className="flex flex-col gap-[5px]">
          <div className={`flex flex-col items-center justify-center w-full py-6 rounded-lg border-2 ${borderColor} ${badgeColor} shadow-lg`}>
            <span className="material-icons-round text-4xl mb-2">{icon}</span>
            <span className="text-xl font-black">{badgeText}</span>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <h4 className="text-white font-bold text-sm text-center">종합 피로도 및 컨디션 분석</h4>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="w-4 h-4 rounded-full bg-yellow-500/20 hover:bg-yellow-500/35 text-yellow-400 hover:text-yellow-300 border border-yellow-500/40 flex items-center justify-center transition-all text-[11px] font-extrabold shrink-0 cursor-pointer shadow-sm"
                title="종합 피로도 및 컨디션 분석 설명"
              >
                !
              </button>
            </div>
            <p className="text-gray-300 leading-relaxed text-[13px] bg-black/20 p-3.5 rounded-lg border border-white/5">
              {briefing}
            </p>
          </div>
        </div>

        {/* Middle: 3-Split Card */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-black/30 border border-white/5 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center gap-1 sm:gap-2">
            <span className="text-[13px] text-gray-400 font-medium text-center">{loadStatus.label}</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className={`material-icons-round text-[14px] sm:text-[18px] ${loadStatus.color}`}>{loadStatus.icon}</span>
              <span className={`text-[13px] font-bold ${loadStatus.color}`}>{loadStatus.status}</span>
            </div>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center gap-1 sm:gap-2">
            <span className="text-[13px] text-gray-400 font-medium text-center">{recoveryStatus.label}</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className={`material-icons-round text-[14px] sm:text-[18px] ${recoveryStatus.color}`}>{recoveryStatus.icon}</span>
              <span className={`text-[13px] font-bold ${recoveryStatus.color}`}>{recoveryStatus.status}</span>
            </div>
          </div>
          <div className="bg-black/30 border border-white/5 rounded-lg p-2 sm:p-4 flex flex-col items-center justify-center gap-1 sm:gap-2">
            <span className="text-[13px] text-gray-400 font-medium text-center">{nerveStatus.label}</span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className={`material-icons-round text-[14px] sm:text-[18px] ${nerveStatus.color}`}>{nerveStatus.icon}</span>
              <span className={`text-[13px] font-bold ${nerveStatus.color}`}>{nerveStatus.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Modal */}
      {showHelpModal && (
        <div 
          className="fixed inset-0 z-[1200] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center"
          onClick={() => setShowHelpModal(false)}
        >
          <div 
            className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[15px] font-bold text-white flex items-center gap-2">
                <span className="material-icons-round text-[var(--primary-color)] text-lg">info</span>
                최종 컨디션 상태 판별 기준
              </h4>
              <span
                onClick={() => setShowHelpModal(false)}
                className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                close
              </span>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm text-gray-200 leading-relaxed text-left">
              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">컨디션 상태별 판별 조건</h4>

                <div className="space-y-1">
                  <div className="font-bold text-red-400 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🔴</span> 치명적 위험 (Red)
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pl-5">
                    - ACWR 부하 및 악력(신경계) 지표가 모두 &apos;위험&apos; 상태일 때
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-orange-400 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🟠</span> 경고 (Orange)
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pl-5">
                    - 수면 상태와 무관하게 ACWR 또는 악력 중 단 하나만 &apos;위험&apos; 상태일 때 (예: 수면이 정상이어도 악력만 위험이면 &apos;경고&apos;)
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-yellow-400 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🟡</span> 주의 (Yellow)
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pl-5">
                    - 핵심 지표(ACWR/악력)에 위험은 없으나 1개 이상 지표가 &apos;주의&apos;이거나, <strong className="text-yellow-300 font-semibold">오직 수면만 &apos;위험&apos;</strong>일 때
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-gray-400 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>⚪</span> 기준 부하량 분석 중 (Gray)
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pl-5">
                    - ACWR 누적 기간이 21일 미만이고 수면 및 악력이 정상일 때 (단, 수면/악력에 위험·주의가 발생하면 해당 상태를 우선 반영)
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="font-bold text-green-400 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>🟢</span> 최적 (Green)
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed pl-5">
                    - 모든 지표가 &apos;정상&apos; 범위에 도달했을 때
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

