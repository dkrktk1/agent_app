import React from 'react';

interface ComprehensiveStatusDashboardProps {
  acwr: number;
  sleep: number;
  gripLeft: number;
  gripRight: number;
  isEmpty?: boolean;
}

export const getComprehensiveStatus = (acwr: number, sleep: number, gripLeft: number, gripRight: number, isEmpty: boolean) => {
  if (isEmpty) {
    return {
      level: 0,
      badgeColor: 'bg-gray-500/20 text-gray-500',
      badgeText: '데이터 없음',
      borderColor: 'border-gray-500/50',
      icon: 'info'
    };
  }

  let level = 4;
  if (acwr >= 1.5 || sleep < 5 || gripLeft <= -15 || gripRight <= -15) {
    level = 1;
  } else if ((acwr >= 1.3 && sleep < 6) || gripLeft <= -10 || gripRight <= -10) {
    level = 2;
  } else if (acwr >= 1.3 || sleep < 7 || gripLeft <= -5 || gripRight <= -5) {
    level = 3;
  }

  let badgeColor = '';
  let badgeText = '';
  let borderColor = '';
  let icon = '';

  switch (level) {
    case 1:
      badgeColor = 'bg-black text-red-500';
      borderColor = 'border-red-900';
      badgeText = '치명적 위험';
      icon = 'warning';
      break;
    case 2:
      badgeColor = 'bg-red-500/20 text-red-500';
      borderColor = 'border-red-500/50';
      badgeText = '위험';
      icon = 'error';
      break;
    case 3:
      badgeColor = 'bg-yellow-500/20 text-yellow-500';
      borderColor = 'border-yellow-500/50';
      badgeText = '주의';
      icon = 'warning_amber';
      break;
    case 4:
      badgeColor = 'bg-[#4ade80]/20 text-[#4ade80]';
      borderColor = 'border-[#4ade80]/50';
      badgeText = '최상';
      icon = 'check_circle';
      break;
  }

  return { level, badgeColor, badgeText, borderColor, icon };
};

export default function ComprehensiveStatusDashboard({
  acwr,
  sleep,
  gripLeft,
  gripRight,
  isEmpty = false
}: ComprehensiveStatusDashboardProps) {
  const status = getComprehensiveStatus(acwr, sleep, gripLeft, gripRight, isEmpty);
  const { level, badgeColor, badgeText, borderColor, icon } = status;
  
  const asymmetry = !isEmpty && Math.abs(gripLeft - gripRight) >= 15;

  let briefing = '';
  switch (level) {
    case 0:
      briefing = '충분한 데이터가 누적되지 않았습니다. 매일 지표를 입력하여 선수 컨디션을 관리해 주세요.';
      break;
    case 1:
      briefing = '신체 부하, 회복, 중추신경계 중 하나 이상이 붕괴된 상태입니다. 완전한 휴식(Day-off)이 필요한 상황입니다.';
      break;
    case 2:
      briefing = '중추신경계 피로가 뚜렷하며 회복이 부하를 따라가지 못하고 있습니다. 폭발적인 힘(RFD) 발현이 불가능하므로, 경기 출장 시 타구 질 하락이나 구속 저하가 예상됩니다. 훈련량 대폭 축소가 필요합니다.';
      break;
    case 3:
      briefing = '미세한 피로가 누적되기 시작했습니다. 경기 전 고강도 웨이트 트레이닝을 피하고 스트레칭과 수면 등 회복(Recovery)에 집중해야 합니다.';
      break;
    case 4:
      briefing = '모든 지표가 최적의 상태를 가리키고 있습니다. 부상 위험이 가장 낮으며, 폭발적인 퍼포먼스와 고강도 훈련 소화가 모두 가능한 완벽한 컨디션입니다.';
      break;
  }

  const getStatusItem = (type: 'load' | 'recovery' | 'nerve') => {
    if (isEmpty) {
      const labels = { load: '부하 (ACWR)', recovery: '회복 (수면)', nerve: '신경계 (악력)' };
      return { label: labels[type], status: '측정 안됨', color: 'text-gray-500', icon: 'info' };
    }
    if (type === 'load') {
      if (acwr >= 1.5) return { label: '부하 (ACWR)', status: '위험', color: 'text-red-500', icon: 'warning' };
      if (acwr >= 1.3) return { label: '부하 (ACWR)', status: '경고', color: 'text-yellow-500', icon: 'warning_amber' };
      return { label: '부하 (ACWR)', status: '정상', color: 'text-[#4ade80]', icon: 'check_circle' };
    }
    if (type === 'recovery') {
      if (sleep < 5) return { label: '회복 (수면)', status: '위험', color: 'text-red-500', icon: 'warning' };
      if (sleep < 7) return { label: '회복 (수면)', status: '경고', color: 'text-yellow-500', icon: 'warning_amber' };
      return { label: '회복 (수면)', status: '정상', color: 'text-[#4ade80]', icon: 'check_circle' };
    }
    if (type === 'nerve') {
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
          <div>
            <h4 className="text-white font-bold text-sm text-center mb-2">종합 피로도 및 컨디션 분석</h4>
            <p className="text-gray-300 leading-relaxed text-[13px]">
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
    </div>
  );
}
