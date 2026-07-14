import React, { useState, useMemo } from 'react';
import { useModalHistory } from '../hooks/useModalHistory';
import { downloadSampleCSV } from '../utils';

export default function BizTab({ player, isAgent, onUpdatePlayer }: { player: any, isAgent: boolean, onUpdatePlayer: (data: any) => void, key?: string }) {
  const [subTab, setSubTab] = useState('inventory');

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingInventoryIndex, setEditingInventoryIndex] = useState<number | null>(null);
  const [invDate, setInvDate] = useState('');
  const [invName, setInvName] = useState('');
  const [invQty, setInvQty] = useState('');
  const [invPrice, setInvPrice] = useState<number | ''>('');

  const [isSponsorshipModalOpen, setIsSponsorshipModalOpen] = useState(false);
  const [editingSponsorshipIndex, setEditingSponsorshipIndex] = useState<number | null>(null);
  
  useModalHistory(isInventoryModalOpen, () => setIsInventoryModalOpen(false));
  useModalHistory(isSponsorshipModalOpen, () => setIsSponsorshipModalOpen(false));
  const [sponsDate, setSponsDate] = useState('');
  const [sponsCompany, setSponsCompany] = useState('');
  const [sponsName, setSponsName] = useState('');
  const [sponsQty, setSponsQty] = useState('');
  const [sponsPrice, setSponsPrice] = useState<number | ''>('');

  const [isBudgetEditing, setIsBudgetEditing] = useState(false);
  const [budgetVal, setBudgetVal] = useState<number | ''>(player.budget || 0);

  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [uploadState, setUploadState] = useState<'idle' | 'loading' | 'done'>('idle');
  const [reportHtml, setReportHtml] = useState('');
  
  const [sponsorBrand, setSponsorBrand] = useState('nike');
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);
  const [crisisType, setCrisisType] = useState('school_violence');

  // Simulator State
  const [contractType, setContractType] = useState<'normal' | 'fa'>('normal');
  const [simWar, setSimWar] = useState(player.contracts?.war || 2.5);
  const [simAge, setSimAge] = useState(28);
  const [simFaValue, setSimFaValue] = useState(300000000);

  const { calculatedSalary, reportText } = useMemo(() => {
    let salary = 0;
    let report = "";

    if (contractType === 'normal') {
      const baseSalary = 30000000;
      const warValue = simWar * 50000000;
      salary = baseSalary + warValue;
      report = `[일반 연봉 협상] 로직이 적용되었습니다. KBO 최저 연봉인 3,000만 원을 기본급으로 설정하고, 예상 기여도(WAR) 1당 5,000만 원의 가치를 부여하여 합산한 결과입니다. (비FA 선수는 당해 연도 성적이 중요하여 나이 페널티는 적용되지 않았습니다.)`;
    } else {
      const pureValue = simWar * simFaValue;
      let agingMultiplier = 1.0;
      let agingText = "";
      
      if (simAge <= 29) {
        agingMultiplier = 1.2;
        agingText = "29세 이하 장기 계약 프리미엄 (20% 할증)";
      } else if (simAge <= 32) {
        agingMultiplier = 1.0;
        agingText = "30~32세 프라임 타임 (기본 가치 적용)";
      } else if (simAge <= 35) {
        agingMultiplier = 0.8;
        agingText = "33~35세 에이징 커브 우려 (20% 감가)";
      } else {
        agingMultiplier = 0.5;
        agingText = "36세 이상 베테랑 팩터 (50% 감가)";
      }
      
      salary = pureValue * agingMultiplier;
      report = `[FA (자유계약)] 로직이 적용되었습니다. 1 WAR당 시장 가치 ${simFaValue.toLocaleString()}원을 기준으로 예상 기여도(${simWar.toFixed(1)})를 곱한 순수 가치에, 선수 나이(${simAge}세)에 따른 에이징 커브 변수[${agingText}]를 적용하여 최종 산출되었습니다.`;
    }

    return { calculatedSalary: salary, reportText: report };
  }, [contractType, simWar, simAge, simFaValue]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.name.split(".").pop()?.toLowerCase() !== "csv") { alert("CSV 형식의 파일만 연동이 가능합니다."); return; }
    setUploadState('loading');
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setTimeout(() => { analyzeCSV(text); setUploadState('done'); }, 1500);
    };
    reader.readAsText(file);
  };

  const analyzeCSV = (csvText: string) => {
    const lines = csvText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return;
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map(l => l.split(","));
    if (player.id === "batter") {
      const bIdx = headers.findIndex((h: string) => h.toLowerCase().includes("batspeed"));
      const sIdx = headers.findIndex((h: string) => h.toLowerCase() === "so");
      let sp: number[] = [], so = 0;
      rows.forEach((r: string[]) => { if (bIdx !== -1) sp.push(parseFloat(r[bIdx])); if (sIdx !== -1) so += parseInt(r[sIdx]); });
      const avgSp = (sp.reduce((a, b) => a + b, 0) / sp.length).toFixed(1);
      setReportHtml(`<p><strong>[강하준 선수 최근 타격 트렌드 정밀 진단]</strong></p><p><span class="stat-alert-tag badge-danger">경고</span> 배트 스피드 하락: <strong>${avgSp} mph</strong></p><p><span class="stat-alert-tag badge-danger">경고</span> 삼진 급증: <strong>${so}개</strong></p><div class="divider"></div><p><strong>💡 AI 피지컬-상관관계 결론:</strong></p><p>중추신경계(CNS) 피로 누적으로 인한 반응 속도 저하입니다.</p>`);
    } else {
      const vIdx = headers.findIndex((h: string) => h.toLowerCase().includes("velo"));
      const rIdx = headers.findIndex((h: string) => h.toLowerCase().includes("release"));
      const eIdx = headers.findIndex((h: string) => h.toLowerCase() === "er");
      let v: number[] = [], h: number[] = [], er = 0;
      rows.forEach((r: string[]) => { if (vIdx !== -1) v.push(parseFloat(r[vIdx])); if (rIdx !== -1) h.push(parseFloat(r[rIdx])); if (eIdx !== -1) er += parseInt(r[eIdx]); });
      const avgV = (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1);
      const avgH = (h.reduce((a, b) => a + b, 0) / h.length).toFixed(2);
      setReportHtml(`<p><strong>[윤도현 선수 최근 피칭 메커니즘 분석]</strong></p><p><span class="stat-alert-tag badge-warning">경고</span> 구속 유지: <strong>${avgV} mph</strong>, 릴리스 높이 하락: <strong>${avgH} m</strong></p><p><span class="stat-alert-tag badge-warning">주의</span> 자책점 상승: <strong>${er}점</strong></p><div class="divider"></div><p><strong>💡 AI 결론:</strong></p><p>어깨 회전근개 부상 위험이 있습니다.</p>`);
    }
  };

  const formatKoreanCurrency = (amount: number) => {
    if (amount >= 100000000) {
      const eok = Math.floor(amount / 100000000);
      const man = Math.floor((amount % 100000000) / 10000);
      if (man > 0) {
        return `${eok}억 ${man.toLocaleString()}만 원`;
      }
      return `${eok}억 원`;
    }
    return `${(amount / 10000).toLocaleString()}만 원`;
  };

  const generateColdMail = () => {
    let brandName = "";
    let proposalPoint = "";
    
    if (sponsorBrand === "nike") {
      brandName = "나이키 코리아 마케팅팀";
      proposalPoint = "KBO 최고의 라이징 스타로 발돋움하고 있는 타격 메커니즘과 트렌디한 스타일로 러닝/트레이닝 기어의 완벽한 엠버서더가 가능합니다.";
    } else if (sponsorBrand === "underarmour") {
      brandName = "언더아머 코리아 스폰서십 담당자";
      proposalPoint = "선수의 뛰어난 신체 조건과 파워풀한 경기 스타일은 '수행 능력 향상'을 지향하는 브랜드 슬로건에 완벽히 부합합니다.";
    } else {
      brandName = "레드불 코리아 브랜드 마케팅 담당자";
      proposalPoint = "강한 에너지를 발산하는 역동적인 수비 및 허슬 플레이 이미지로 한정판 스포츠 패키지 콜라보를 통한 MZ 스포츠 타겟 소구가 유효합니다.";
    }

    const mailText = 
`[스폰서십 제안서 메일 초안]

수신: ${brandName} 귀하
발신: 나우아이원매니지먼트그룹 파트너십 담당

제목: 나우아이원매니지먼트그룹 소속 프로야구 선수 ${player.name} (${player.team}) 브랜드 엠버서더 제안

안녕하세요, 귀사의 브랜드 파워와 마케팅 전략에 깊은 경의를 표합니다.
저희 나우아이원매니지먼트그룹은 현재 KBO 리그에서 최고의 주가를 달리고 있는 ${player.name} 선수의 에이전시로서, 귀사와의 시너지를 창출할 스폰서십 매칭을 제안하고자 연락드렸습니다.

■ 선수 개요
- 이름/포지션: ${player.name} (${player.position})
- 소속: ${player.team}
- 주요 지표: 시즌 WAR ${player.contracts.war.toFixed(1)}, 연일 포털 및 스포츠 뉴스 노출 상승세

■ 제안 배경 및 브랜드 시너지
${proposalPoint}

나우아이원매니지먼트그룹은 선수의 단순 유니폼 로고 노출을 넘어, 디지털 콘텐츠 마케팅을 함께 서포트합니다.

면밀한 검토를 부탁드리오며, 상세한 제안 발표 자료(Deck) 배송 및 미팅 일정에 대해 회신 주시면 감사하겠습니다.`;

    navigator.clipboard.writeText(mailText).then(() => {
      alert(`[제안서 메일 생성 완료]\n${brandName}을 수신처로 한 맞춤형 제안서 초안이 생성되어 클립보드에 복사되었습니다!`);
    });
  };

  const loadCrisisTemplate = (type: string) => {
    let text = "";
    if (type === "injury") {
      text = `[나우아이원매니지먼트그룹 공식 입장 표명서]\n\n안녕하십니까, ${player.name} 선수의 공식 에이전시 나우아이원매니지먼트그룹입니다.\n\n최근 일부 언론 및 커뮤니티를 통해 유포되고 있는 ${player.name} 선수의 부상 부위 및 장기 재활 관련 루머는 전혀 사실이 아님을 밝힙니다.\n\n선수는 현재 당사 과학 케어 센터의 ACWR 분석에 기반한 정밀 예방 관리 하에 체계적인 트레이닝을 성실히 수행하고 있습니다. 금일 조치는 부상 예방을 위한 감독진과의 합의 하의 일시적인 로테이션 휴식 조치입니다.\n\n감사합니다.`;
    } else if (type === "slump") {
      text = `[팬 여러분께 드리는 에이전시 공지]\n\n안녕하세요, ${player.name} 선수를 응원해 주시는 팬 여러분.\n\n최근 선수의 일시적인 성적 변동으로 인해 우려 섞인 시선이 있음을 인지하고 있습니다.\n\n저희 에이전시는 KBO 공인 데이터 분석을 활용해 선수의 신체 밸런스와 피칭 메커니즘을 매일 정량 모니터링하고 있습니다. 피로 회복 리커버리가 진행됨에 따라 곧 최적의 퍼포먼스를 회복할 것입니다.\n\n선수가 마인드 컨트롤 및 훈련에 전념할 수 있도록 격려를 부탁드립니다.`;
    } else {
      text = `[구단 불화설 및 트레이드 루머 해명문]\n\n나우아이원매니지먼트그룹에서 ${player.name} 선수와 관련한 공식 입장을 전달드립니다.\n\n일부 보도된 구단과의 갈등 및 트레이드 공식 요청설은 명백한 오보입니다.\n\n선수는 ${player.team}에 깊은 애정을 가지고 있으며, 팀의 우승을 위해 헌신하겠다는 의지가 확고합니다. 당사는 합리적인 시장 지표를 논의하고 있을 뿐, 팀 케미스트리를 훼손하는 마찰도 없음을 엄숙히 확약드립니다.\n\n추측성 허위 사실 보도를 지양해 주실 것을 간곡히 당부드립니다.`;
    }
    return text;
  };

  const copyCrisisText = () => {
    const content = loadCrisisTemplate(crisisType);
    navigator.clipboard.writeText(content).then(() => {
      alert("입장문 템플릿이 성공적으로 복사되었으며, PR 로그에 백업되었습니다.");
      setIsCrisisOpen(false);
    });
  };

  const handleBudgetSave = () => {
    const p = JSON.parse(JSON.stringify(player));
    p.budget = budgetVal;
    onUpdatePlayer(p);
    setIsBudgetEditing(false);
  };

  const handleOpenInventoryModal = (index: number | null) => {
    if (!isAgent) return;
    setEditingInventoryIndex(index);
    if (index !== null && player.inventory[index]) {
      setInvDate(player.inventory[index].date || '');
      setInvName(player.inventory[index].name);
      setInvQty(player.inventory[index].qty);
      setInvPrice(player.inventory[index].price || '');
    } else {
      setInvDate(new Date().toISOString().split('T')[0]);
      setInvName('');
      setInvQty('');
      setInvPrice('');
    }
    setIsInventoryModalOpen(true);
  };

  const saveInventoryItem = () => {
    const p = JSON.parse(JSON.stringify(player));
    if (!p.inventory) p.inventory = [];
    const newItem = { date: invDate, name: invName, qty: invQty, price: invPrice };
    if (editingInventoryIndex !== null) {
      p.inventory[editingInventoryIndex] = newItem;
    } else {
      p.inventory.push(newItem);
    }
    onUpdatePlayer(p);
    setIsInventoryModalOpen(false);
  };

  const deleteInventoryItem = () => {
    if (editingInventoryIndex === null) return;
    const p = JSON.parse(JSON.stringify(player));
    p.inventory.splice(editingInventoryIndex, 1);
    onUpdatePlayer(p);
    setIsInventoryModalOpen(false);
  };

  const handleOpenSponsorshipModal = (index: number | null) => {
    if (!isAgent) return;
    setEditingSponsorshipIndex(index);
    if (index !== null && player.sponsorshipItems && player.sponsorshipItems[index]) {
      setSponsDate(player.sponsorshipItems[index].date || '');
      setSponsCompany(player.sponsorshipItems[index].company || '');
      setSponsName(player.sponsorshipItems[index].name);
      setSponsQty(player.sponsorshipItems[index].qty);
      setSponsPrice(player.sponsorshipItems[index].price || '');
    } else {
      setSponsDate(new Date().toISOString().split('T')[0]);
      setSponsCompany('');
      setSponsName('');
      setSponsQty('');
      setSponsPrice('');
    }
    setIsSponsorshipModalOpen(true);
  };

  const saveSponsorshipItem = () => {
    const p = JSON.parse(JSON.stringify(player));
    if (!p.sponsorshipItems) p.sponsorshipItems = [];
    const newItem = { date: sponsDate, company: sponsCompany, name: sponsName, qty: sponsQty, price: sponsPrice };
    if (editingSponsorshipIndex !== null) {
      p.sponsorshipItems[editingSponsorshipIndex] = newItem;
    } else {
      p.sponsorshipItems.push(newItem);
    }
    onUpdatePlayer(p);
    setIsSponsorshipModalOpen(false);
  };

  const deleteSponsorshipItem = () => {
    if (editingSponsorshipIndex === null) return;
    const p = JSON.parse(JSON.stringify(player));
    p.sponsorshipItems.splice(editingSponsorshipIndex, 1);
    onUpdatePlayer(p);
    setIsSponsorshipModalOpen(false);
  };

  const usedAmount = player.inventory?.reduce((acc: number, cur: any) => acc + (cur.price || 0), 0) || 0;
  const remainingAmount = (player.budget || 0) - usedAmount;

  return (
    <div className="tab-pane active pb-20">
      <div className="section-title-group"><h3>용품지원 & 스폰서쉽</h3></div>
      <div className="lifestyle-card mb-6">
        <div className="tabs-sub" style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`tab-sub-btn ${subTab === 'inventory' ? 'active' : ''}`} 
            onClick={() => setSubTab('inventory')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: subTab === 'inventory' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', color: subTab === 'inventory' ? 'var(--bg-color)' : 'var(--text-main)', fontWeight: 'bold', fontSize: '13px' }}
          >
            용품
          </button>
          <button 
            className={`tab-sub-btn ${subTab === 'sponsorship' ? 'active' : ''}`} 
            onClick={() => setSubTab('sponsorship')}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: subTab === 'sponsorship' ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)', color: subTab === 'sponsorship' ? 'var(--bg-color)' : 'var(--text-main)', fontWeight: 'bold', fontSize: '13px' }}
          >
            스폰서쉽
          </button>
        </div>
        <div className="sub-tab-content">
          {subTab === 'inventory' && (
            <div className="inventory-section">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-white font-bold whitespace-nowrap flex-shrink-0 mr-2">지원 용품 목록</h4>
                {isAgent && (
                  <button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => handleOpenInventoryModal(null)}>
                    <div className="w-5 h-5 rounded-full bg-[var(--primary-color)] text-[#050608] flex items-center justify-center">
                      <span className="material-icons-round text-[16px] font-bold">add</span>
                    </div>
                    추가
                  </button>
                )}
              </div>
              <div className="inventory-status mb-4 flex flex-col gap-2">
                {player.inventory?.map((inv: any, i: number) => (
                  <div 
                    className={`inv-item flex flex-col p-3 bg-[rgba(255,255,255,0.03)] rounded-lg border border-[rgba(255,255,255,0.05)] ${isAgent ? 'cursor-pointer hover:border-[var(--primary-color)] transition-colors' : ''}`} 
                    key={i} 
                    onClick={() => handleOpenInventoryModal(i)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {inv.date && <span className="text-[10px] bg-[rgba(255,255,255,0.1)] text-gray-300 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">{inv.date}</span>}
                      <span className="text-white font-medium break-keep">{inv.name}</span>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[var(--text-muted)] text-sm whitespace-nowrap">수량: {inv.qty}</span>
                      <strong className="text-[var(--primary-color)] font-bold text-lg whitespace-nowrap">
                        {inv.price ? inv.price.toLocaleString() + '원' : '-'}
                      </strong>
                    </div>
                  </div>
                ))}
                {(!player.inventory || player.inventory.length === 0) && (
                  <div className="text-center text-gray-500 py-4">등록된 용품이 없습니다.</div>
                )}
              </div>

              <div className="budget-summary bg-[rgba(255,255,255,0.02)] rounded-xl p-4 border border-[rgba(255,255,255,0.05)]">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-[rgba(255,255,255,0.05)]">
                  <span className="text-gray-400 text-sm">지원 금액 (회사)</span>
                  {isAgent ? (
                    isBudgetEditing ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number" 
                          value={budgetVal} 
                          onChange={(e) => setBudgetVal(e.target.value === '' ? '' : Number(e.target.value))}
                          className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded px-2 py-1 text-white text-right w-24 text-sm outline-none focus:border-[var(--primary-color)] transition-colors"
                        />
                        <button className="text-xs bg-[var(--primary-color)] text-[var(--bg-color)] px-2 py-1 rounded font-medium" onClick={handleBudgetSave}>저장</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => { setBudgetVal(''); setIsBudgetEditing(true); }}>
                        <span className="text-white text-sm font-medium">{(player.budget || 0).toLocaleString()}원</span>
                        <span className="material-icons-round text-[14px] text-gray-500">edit</span>
                      </div>
                    )
                  ) : (
                    <span className="text-white text-sm font-medium">{(player.budget || 0).toLocaleString()}원</span>
                  )}
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">사용 금액</span>
                  <span className="text-gray-300 text-sm">{usedAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">잔금</span>
                  <span className="text-[var(--primary-color)] text-sm font-semibold">{remainingAmount.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          )}
          {subTab === 'sponsorship' && (
            <div className="sponsorship-section">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-white font-bold whitespace-nowrap flex-shrink-0 mr-2">스폰서쉽 내역</h4>
                {isAgent && (
                  <button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => handleOpenSponsorshipModal(null)}>
                    <div className="w-5 h-5 rounded-full bg-[var(--primary-color)] text-[#050608] flex items-center justify-center">
                      <span className="material-icons-round text-[16px] font-bold">add</span>
                    </div>
                    추가
                  </button>
                )}
              </div>
              <div className="sponsorship-status mb-4 flex flex-col gap-2">
                {player.sponsorshipItems?.map((spons: any, i: number) => (
                  <div 
                    className={`inv-item flex flex-col p-3 bg-[rgba(255,255,255,0.03)] rounded-lg border border-[rgba(255,255,255,0.05)] ${isAgent ? 'cursor-pointer hover:border-[var(--primary-color)] transition-colors' : ''}`} 
                    key={i} 
                    onClick={() => handleOpenSponsorshipModal(i)}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {spons.date && <span className="text-[10px] bg-[rgba(255,255,255,0.1)] text-gray-300 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">{spons.date}</span>}
                      <span className="text-white font-medium break-keep">
                        {spons.company ? `[${spons.company}] ` : ''}{spons.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[var(--text-muted)] text-sm whitespace-nowrap">상세/기간: {spons.qty}</span>
                      <strong className="text-[var(--primary-color)] font-bold text-lg whitespace-nowrap">
                        {spons.price ? spons.price.toLocaleString() + '원' : '-'}
                      </strong>
                    </div>
                  </div>
                ))}
                {(!player.sponsorshipItems || player.sponsorshipItems.length === 0) && (
                  <div className="text-center text-gray-500 py-4">등록된 스폰서쉽이 없습니다.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isAgent && (
        <>
          <div className="section-title-group">
            <h3>KBO 선수 연봉 산출 시뮬레이터</h3>
          </div>
      <div className="biz-card">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-300">계약 신분</span>
            <select 
              className="bg-[#1C2331] border border-[rgba(255,255,255,0.1)] rounded p-2 text-white outline-none focus:border-[var(--primary-color)]"
              value={contractType}
              onChange={(e) => setContractType(e.target.value as 'normal' | 'fa')}
            >
              <option value="normal">일반 연봉 협상</option>
              <option value="fa">FA (자유계약)</option>
            </select>
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>예상 WAR (기여도)</span>
              <strong>{simWar.toFixed(1)}</strong>
            </div>
            <input 
              type="range" 
              min="0.0" max="8.0" step="0.1" 
              value={simWar} 
              onChange={(e) => setSimWar(parseFloat(e.target.value))} 
            />
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>나이</span>
              <strong>{simAge}세</strong>
            </div>
            <input 
              type="range" 
              min="19" max="40" step="1" 
              value={simAge} 
              onChange={(e) => setSimAge(parseInt(e.target.value))} 
            />
          </div>

          {contractType === 'fa' && (
            <div className="slider-group">
              <div className="slider-label-row">
                <span>FA 1 WAR당 시장 가치</span>
                <strong>{formatKoreanCurrency(simFaValue)}</strong>
              </div>
              <input 
                type="range" 
                min="150000000" max="500000000" step="10000000" 
                value={simFaValue} 
                onChange={(e) => setSimFaValue(parseInt(e.target.value))} 
              />
            </div>
          )}
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-6 mb-4 flex flex-col items-center justify-center">
          <span className="text-gray-400 mb-2">최종 산출 적정 연봉</span>
          <h2 className="text-3xl font-bold text-[var(--primary-color)]">{formatKoreanCurrency(calculatedSalary)}</h2>
        </div>

        <div className="bg-[#1C2331] rounded-lg p-4 border-l-4 border-l-[var(--primary-color)]">
          <h5 className="text-white font-medium mb-2 flex items-center gap-2">
            <span className="material-icons-round text-[18px]">auto_awesome</span>산출 근거 리포트
          </h5>
          <p className="text-sm text-gray-300 leading-relaxed break-keep">
            {reportText}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn-primary" onClick={() => setIsPitchDeckOpen(true)}>
            <span className="material-icons-round">description</span>구단 제출용 Pitch Deck 생성 (PDF)
          </button>
        </div>
      </div>

      <div className="section-title-group"><h3>AI 스탯 업로드 및 해석</h3></div>
      <div className="file-upload-card">
        <label className="dropzone">
          <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          <span className="material-icons-round dropzone-icon">cloud_upload</span>
          <p className="dropzone-text">CSV 파일 선택</p>
        </label>
        <div className="sample-download-bar">
          <button className="btn-text" onClick={() => downloadSampleCSV('batter')}>타자 샘플</button>
          <button className="btn-text" onClick={() => downloadSampleCSV('pitcher')}>투수 샘플</button>
        </div>
        {uploadState === 'loading' && <div className="analysis-loading"><div className="spinner"></div><p>분석 중...</p></div>}
        {uploadState === 'done' && <div className="analysis-result-box"><div className="result-body" dangerouslySetInnerHTML={{ __html: reportHtml }}></div></div>}
      </div>
      </>
      )}

      {/* Pitch Deck Modal */}
      <div className={`modal ${isPitchDeckOpen ? 'active' : ''}`}>
        <div className="modal-content-wide">
          <div className="flex justify-between items-center mb-6">
            <h4>가치 증명 Pitch Deck (PDF 시뮬레이션)</h4>
            <span className="material-icons-round close-btn" onClick={() => setIsPitchDeckOpen(false)}>close</span>
          </div>
          <div className="modal-body pitch-deck-body">
            <div className="pitch-deck-carousel">
              <div className={`deck-slide ${currentSlide === 1 ? 'active' : ''}`}>
                <div className="slide-header">NOWIWON MANAGEMENT GROUP</div>
                <div className="slide-title">선수 가치 입증 분석 보고서</div>
                <div className="slide-player-profile">
                  <h3>{player.name} ({player.position})</h3>
                  <p>시즌 성적: WAR {player.contracts.war.toFixed(1)} • 예상 시장 가치: ₩{player.contracts.marketVal.toLocaleString()}</p>
                </div>
                <div className="slide-footer">본 리포트는 구단 제출용 가치 산정 자료입니다.</div>
              </div>
              <div className={`deck-slide ${currentSlide === 2 ? 'active' : ''}`}>
                <div className="slide-header">선수 퍼포먼스 세부 지표</div>
                <div className="slide-content">
                  <table className="pdf-table">
                    <thead>
                      <tr><th>구분</th><th>시즌 성적</th><th>리그 평균</th><th>대비 백분위</th></tr>
                    </thead>
                    <tbody>
                      {player.contracts.pdfData.map((row: any, idx: number) => (
                        <tr key={idx}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="slide-footer">Statcast 추적 기반 데이터 매칭</div>
              </div>
              <div className={`deck-slide ${currentSlide === 3 ? 'active' : ''}`}>
                <div className="slide-header">적정 연봉 가치 제안</div>
                <div className="slide-content">
                  <div className="pdf-callout-box">
                    <p>유사 계약 Comps 계약 건당 평균 대비 조정 시장가치:</p>
                    <h2>₩{player.contracts.proposalVal.toLocaleString()}</h2>
                  </div>
                  <p className="pdf-desc">최근 3년 내 계약한 동일 포지션, 유사 연령, 동일 WAR 범위 선수 분석을 바탕으로 제안한 최종 연봉 안안입니다.</p>
                </div>
                <div className="slide-footer">NOWIWON AI Salary Engine</div>
              </div>
            </div>
            <div className="deck-controls">
              <button className="btn-secondary" onClick={() => setCurrentSlide(c => Math.max(1, c - 1))}>이전</button>
              <span className="slide-counter"><span>{currentSlide}</span> / 3</span>
              <button className="btn-secondary" onClick={() => setCurrentSlide(c => Math.min(3, c + 1))}>다음</button>
            </div>
            <button className="btn-primary" onClick={() => {
              alert(`[PDF 생성기 가동]\n${player.name} 선수의 '가치 입증 피칭 덱'이 고해상도 PDF 리포트로 다운로드되었습니다!`);
              setIsPitchDeckOpen(false);
            }}>
              <span className="material-icons-round">download</span>PDF 파일로 다운로드
            </button>
          </div>
        </div>
      </div>

      {isInventoryModalOpen && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center" onClick={() => setIsInventoryModalOpen(false)}>
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-md rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white mb-0">{editingInventoryIndex !== null ? '지원 용품 수정' : '지원 용품 추가'}</h3>
              <button className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsInventoryModalOpen(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              <div className="input-group-select">
                <label>날짜</label>
                <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} max="9999-12-31" />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-3 block">품명</label>
                <input type="text" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors" placeholder="예: 스파이크, 글러브" value={invName} onChange={e => setInvName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-3 block">수량</label>
                <input type="text" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors" placeholder="예: 2켤레, 1개" value={invQty} onChange={e => setInvQty(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-3 block">지원 금액 환산</label>
                <input type="number" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors" placeholder="금액" value={invPrice} onChange={e => setInvPrice(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
            <div className="flex gap-3">
              {editingInventoryIndex !== null && (
                <button className="flex-1 bg-red-500/20 text-red-400 text-sm font-bold py-3 rounded-xl hover:bg-red-500/30 transition-colors" onClick={deleteInventoryItem}>삭제</button>
              )}
              <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] text-sm font-bold py-3 rounded-xl hover:opacity-90 transition-opacity" onClick={saveInventoryItem}>저장</button>
            </div>
          </div>
        </div>
      )}

      {isSponsorshipModalOpen && (
        <div className="fixed inset-0 z-[2000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center" onClick={() => setIsSponsorshipModalOpen(false)}>
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-md rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white mb-0">{editingSponsorshipIndex !== null ? '스폰서쉽 수정' : '스폰서쉽 추가'}</h3>
              <button className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsSponsorshipModalOpen(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              <div className="input-group-select">
                <label>날짜</label>
                <input type="date" value={sponsDate} onChange={e => setSponsDate(e.target.value)} max="9999-12-31" />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-3 block">후원사</label>
                <input type="text" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors" placeholder="예: 나이키, 언더아머" value={sponsCompany} onChange={e => setSponsCompany(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-3 block">후원 내용</label>
                <input type="text" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors" placeholder="예: 연간 용품 지원" value={sponsName} onChange={e => setSponsName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-3 block">상세 / 기간</label>
                <input type="text" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors" placeholder="예: 2026.01 - 2026.12" value={sponsQty} onChange={e => setSponsQty(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-white mb-3 block">후원 금액</label>
                <input type="number" className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)] transition-colors" placeholder="금액" value={sponsPrice} onChange={e => setSponsPrice(e.target.value === '' ? '' : Number(e.target.value))} />
              </div>
            </div>
            <div className="flex gap-3">
              {editingSponsorshipIndex !== null && (
                <button className="flex-1 bg-red-500/20 text-red-400 text-sm font-bold py-3 rounded-xl hover:bg-red-500/30 transition-colors" onClick={deleteSponsorshipItem}>삭제</button>
              )}
              <button className="flex-1 bg-[var(--primary-color)] text-[var(--bg-color)] text-sm font-bold py-3 rounded-xl hover:opacity-90 transition-opacity" onClick={saveSponsorshipItem}>저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
