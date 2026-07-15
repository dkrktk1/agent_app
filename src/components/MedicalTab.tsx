import React, { useState, useEffect } from 'react';
import { useModalHistory } from '../hooks/useModalHistory';
import { Body } from 'react-body-selector';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface PainHistoryItem {
  date: string;
  level: number;
  reason: string;
  diagnosis?: string;
  treatmentPeriod?: string;
}

interface PainItem {
  level: number; // 1-5
  reason: string;
  diagnosis?: string;
  treatmentPeriod?: string;
  initialDate?: string;
  initialLevel?: number;
      history?: PainHistoryItem[];
  isPast?: boolean;
}

interface PainData {
  [key: string]: PainItem; // key: area id
}

interface TimelineItem {
  id: string;
  type: 'upcoming' | 'followup' | 'past';
  hospital?: string;
  title: string;
  dateLabel: string;
  time?: string;
  notes?: string;
  isDone?: boolean;
}

// Left side is user's right side in front view
export default function MedicalTab({ player, isAgent, onUpdatePlayer }: { player?: any, isAgent?: boolean, onUpdatePlayer?: (newData: any) => void, key?: string }) {
  const isSamplePlayer = !player || 
    player.id?.startsWith('sample_') || 
    player.userId?.startsWith('sample_') || 
    player.id === 'sample' || 
    player.userId === 'sample' || 
    player.id === 'batter' || 
    player.id === 'pitcher';

  const defaultPainData: PainData = {
    'shoulders_right_front': { level: 3, initialLevel: 3, reason: '훈련 중 부딪혀서 부상 재발(과거 수술 부위)', initialDate: '2026-07-01', history: [{date: '2026-07-01', level: 3, reason: '훈련 중 부딪혀서 부상 재발(과거 수술 부위)'}] },
    'head_center_back': { level: 4, initialLevel: 4, reason: '경기 중 헤딩 상황에서 찢어짐', initialDate: '2026-07-02', history: [{date: '2026-07-02', level: 4, reason: '경기 중 헤딩 상황에서 찢어짐'}] },
    'lower-back_center_back': { level: 2, initialLevel: 2, reason: '스트레칭 하다가 삐끗함', initialDate: '2026-07-03', history: [{date: '2026-07-03', level: 2, reason: '스트레칭 하다가 삐끗함'}] },
    'calves_right_back': { level: 5, initialLevel: 5, reason: '부상 내용 미입력', initialDate: '2026-07-04', history: [{date: '2026-07-04', level: 5, reason: '부상 내용 미입력'}] },
  };

  const [painData, setPainData] = useState<PainData>(
    player?.painData || (isSamplePlayer ? defaultPainData : {})
  );
  
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [painLevel, setPainLevel] = useState<number>(3);
  const [painReason, setPainReason] = useState<string>('');
  const [painDiagnosis, setPainDiagnosis] = useState<string>('');
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [treatmentPeriod, setTreatmentPeriod] = useState<string>('');
  const [painDate, setPainDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [initialPainDate, setInitialPainDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const formatKoreanDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatTimeStr = (timeStr: string) => {
    if (!timeStr) return '';
    if (timeStr.includes('오전') || timeStr.includes('오후')) return timeStr;
    const [hours, minutes] = timeStr.split(':');
    if (!hours || !minutes) return timeStr;
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? '오후' : '오전';
    const formattedH = h % 12 || 12;
    return `${ampm} ${formattedH}:${minutes}`;
  };

  const getDDayBadge = (dateString: string) => {
    if (!dateString) return null;
    
    if (dateString.match(/^D[+-]\d+$/) || dateString === 'D-Day') {
      return (
        <span className="bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] text-[12px] font-bold px-2 py-0.5 rounded leading-none">
          {dateString}
        </span>
      );
    }

    const targetDate = new Date(dateString);
    if (isNaN(targetDate.getTime())) {
      return null;
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let dDayStr = '';
    let badgeColor = '';
    
    if (diffDays === 0) {
      dDayStr = 'D-Day';
      badgeColor = 'bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.3)] text-[#ef4444]';
    } else if (diffDays > 0) {
      dDayStr = `D-${diffDays}`;
      badgeColor = 'bg-[rgba(212,175,55,0.2)] text-[var(--primary-color)] border border-[rgba(212,175,55,0.3)]';
    } else {
      dDayStr = `D+${Math.abs(diffDays)}`;
      badgeColor = 'bg-[rgba(255,255,255,0.1)] text-gray-400 border border-[rgba(255,255,255,0.15)]';
    }
    
    return <span className={`text-[12px] font-bold px-2 py-0.5 rounded leading-none ${badgeColor}`}>{dDayStr}</span>;
  };

  const [timelineNotes, setTimelineNotes] = useState(
    player?.timelineNotes || (isSamplePlayer ? '💡 3일 전 무릎 염증 주사 진료 완료. 선수에게 차도가 있는지 안부 연락 요망.' : '')
  );
  const [isFollowupDone, setIsFollowupDone] = useState(
    player?.isFollowupDone !== undefined ? player.isFollowupDone : false
  );

  const [showPainModal, setShowPainModal] = useState(false);
  const [isEditingModalMode, setIsEditingModalMode] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});
  const [deleteConfirmModal, setDeleteConfirmModal] = useState<{isOpen: boolean, id: string | null, type: 'current' | 'past' | 'timeline' | null}>({isOpen: false, id: null, type: null});
  useModalHistory(deleteConfirmModal.isOpen, () => setDeleteConfirmModal({ isOpen: false, id: null, type: null }));

  const [historyModalPart, setHistoryModalPart] = useState<string | null>(null);
  const [historyModalTab, setHistoryModalTab] = useState<'graph' | 'card'>('graph');
  
  useModalHistory(showPainModal, () => setShowPainModal(false));
  useModalHistory(showHistoryModal, () => { setShowHistoryModal(false); setHistoryModalTab('graph'); });
  useModalHistory(confirmModal.isOpen, () => setConfirmModal({ isOpen: false, id: null }));
  const [hoveredGraphPart, setHoveredGraphPart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleOpenPain = (e: any) => {
      if (e.detail && e.detail.partId) {
        setHistoryModalPart(e.detail.partId);
        setShowHistoryModal(true);
      }
    };
    window.addEventListener('openMedicalPain', handleOpenPain);
    return () => window.removeEventListener('openMedicalPain', handleOpenPain);
  }, []);

  useEffect(() => {
    (window as any).__hoveredBodyPart = (part: any, side: string | undefined, e: any) => {
      if (window.innerWidth < 768) return;
      
      let viewSide: 'front' | 'back' | null = part.viewSide || null;
      if (!viewSide && e?.target) {
        const container = e.target.closest('[id^="body-selector-"]');
        if (container) {
          if (container.id.includes('front')) viewSide = 'front';
          else if (container.id.includes('back')) viewSide = 'back';
        }
      }
      
      if (!viewSide) return;

      const region = REGION_MAP[viewSide][part.slug];
      if (!region) return;
      const id = `${region}_${side || 'center'}_${viewSide}`;
      const item = painData[id];
      
      if (item && !item.isPast) {
        setHoveredGraphPart(id);
      }
    };

    (window as any).__unhoveredBodyPart = () => {
      if (window.innerWidth < 768) return;
      setHoveredGraphPart(null);
    };

    return () => {
      delete (window as any).__hoveredBodyPart;
      delete (window as any).__unhoveredBodyPart;
    };
  }, [painData]);

  const defaultTimelineItems: TimelineItem[] = [
    {
      id: 'upcoming-1',
      type: 'upcoming',
      hospital: 'JS정형외과',
      title: '우측 어깨 MRI 재촬영',
      dateLabel: 'D-2',
      time: '10:00',
      notes: ''
    }
  ];

  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(() => {
    if (player?.treatmentTimeline) {
      return player.treatmentTimeline;
    }
    return isSamplePlayer ? defaultTimelineItems : [];
  });

  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineConfirmModal, setTimelineConfirmModal] = useState<{isOpen: boolean, id: string | null}>({isOpen: false, id: null});
  const [editingTimelineItem, setEditingTimelineItem] = useState<TimelineItem | null>(null);
  const [timelineFormType, setTimelineFormType] = useState<'upcoming' | 'followup' | 'past'>('upcoming');
  const [timelineFormHospital, setTimelineFormHospital] = useState('');
  const [timelineFormTitle, setTimelineFormTitle] = useState('');
  const [timelineFormDateLabel, setTimelineFormDateLabel] = useState('');
  const [timelineFormTime, setTimelineFormTime] = useState('');
  const [showCustomTimeModal, setShowCustomTimeModal] = useState(false);
  const [tempHour, setTempHour] = useState('09');
  const [tempMinute, setTempMinute] = useState('00');
  const [tempAmPm, setTempAmPm] = useState('AM');
  const [timelineFormNotes, setTimelineFormNotes] = useState('');
  const [timelineFormIsDone, setTimelineFormIsDone] = useState(false);
  const [timelineFormError, setTimelineFormError] = useState('');

  const [showPastTimelineModal, setShowPastTimelineModal] = useState(false);
  const [pastTimelineYear, setPastTimelineYear] = useState<string>(new Date().getFullYear().toString());
  const [pastTimelineMonth, setPastTimelineMonth] = useState<string>('all');
  const [expandedPastItemId, setExpandedPastItemId] = useState<string | null>(null);

  const [showPastPainModal, setShowPastPainModal] = useState(false);
  
  useModalHistory(showTimelineModal, () => setShowTimelineModal(false));
  useModalHistory(timelineConfirmModal.isOpen, () => setTimelineConfirmModal({ isOpen: false, id: null }));
  useModalHistory(showCustomTimeModal, () => setShowCustomTimeModal(false));
  useModalHistory(showPastTimelineModal, () => setShowPastTimelineModal(false));
  useModalHistory(showPastPainModal, () => setShowPastPainModal(false));
  const [pastPainYear, setPastPainYear] = useState<string>(new Date().getFullYear().toString());
  const [pastPainMonth, setPastPainMonth] = useState<string>('all');
  const [expandedPastPainId, setExpandedPastPainId] = useState<string | null>(null);

  const updateTimelineItems = (newItems: TimelineItem[]) => {
    setTimelineItems(newItems);
    
    // Also extract notes and done state for backward compatibility if followup-1 changes
    const followupItem = newItems.find(item => item.id === 'followup-1');
    if (followupItem) {
      setTimelineNotes(followupItem.notes || '');
      setIsFollowupDone(followupItem.isDone || false);
    }
    
    if (onUpdatePlayer && player) {
      onUpdatePlayer({
        ...player,
        treatmentTimeline: newItems,
        ...(followupItem ? {
          timelineNotes: followupItem.notes || '',
          isFollowupDone: followupItem.isDone || false
        } : {})
      });
    }
  };

  const handleAddTimelineClick = () => {
    setEditingTimelineItem(null);
    setTimelineFormType('upcoming');
    setTimelineFormHospital('');
    setTimelineFormTitle('');
    setTimelineFormDateLabel(new Date().toISOString().split('T')[0]);
    setTimelineFormTime('');
    setTimelineFormNotes('');
    setTimelineFormIsDone(false);
    setTimelineFormError('');
    setShowTimelineModal(true);
  };

  const handleEditTimelineClick = (item: TimelineItem) => {
    setEditingTimelineItem(item);
    setTimelineFormType(item.type);
    setTimelineFormHospital(item.hospital || '');
    setTimelineFormTitle(item.title);
    setTimelineFormDateLabel(item.dateLabel);
    setTimelineFormTime(item.time || '');
    setTimelineFormNotes(item.notes || '');
    setTimelineFormIsDone(item.isDone || false);
    setTimelineFormError('');
    setShowTimelineModal(true);
  };

  const handleSaveTimelineItem = () => {
    if (!timelineFormTitle.trim()) {
      setTimelineFormError('일정 및 진료 기록 내용을 입력해주세요.');
      return;
    }

    let updatedList: TimelineItem[];
    if (editingTimelineItem) {
      // Edit
      updatedList = timelineItems.map(item => 
        item.id === editingTimelineItem.id 
          ? {
              ...item,
              type: timelineFormType,
              hospital: timelineFormHospital,
              title: timelineFormTitle,
              dateLabel: timelineFormDateLabel,
              time: timelineFormType === 'upcoming' ? timelineFormTime : undefined,
              notes: timelineFormNotes,
              isDone: timelineFormType !== 'upcoming' ? timelineFormIsDone : undefined
            }
          : item
      );
    } else {
      // Add
      const newItem: TimelineItem = {
        id: `timeline-${Date.now()}`,
        type: timelineFormType,
        hospital: timelineFormHospital,
        title: timelineFormTitle,
        dateLabel: timelineFormDateLabel,
        time: timelineFormType === 'upcoming' ? timelineFormTime : undefined,
        notes: timelineFormNotes,
        isDone: timelineFormType !== 'upcoming' ? timelineFormIsDone : undefined
      };
      updatedList = [...timelineItems, newItem];
    }

    updateTimelineItems(updatedList);
    setShowTimelineModal(false);
  };

  const handleDeleteTimelineItem = () => {
    if (editingTimelineItem) {
      setDeleteConfirmModal({ isOpen: true, id: editingTimelineItem.id, type: 'timeline' });
    }
  };

  const getPainColor = (intensity: number) => {
    if (!intensity) return '#4b5563'; // dark gray for base body (gray-600)
    if (intensity === 1) return '#fca5a5'; // red-300
    if (intensity === 2) return '#f87171'; // red-400
    if (intensity === 3) return '#ef4444'; // red-500
    if (intensity === 4) return '#dc2626'; // red-600
    return '#b91c1c'; // red-700
  };

  const handleShowHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistoryModalPart(id);
    setShowHistoryModal(true);
  };

  const handleCompleteTreatment = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmModal({ isOpen: true, id });
  };

  const confirmCompleteTreatment = () => {
    if (confirmModal.id) {
      setPainData(prev => ({
        ...prev,
        [confirmModal.id as string]: {
          ...prev[confirmModal.id as string],
          isPast: true
        }
      }));
    }
    setConfirmModal({ isOpen: false, id: null });
  };

  const confirmCompleteTimelineTreatment = () => {
    if (timelineConfirmModal.id) {
      const updatedList = timelineItems.map(item =>
        item.id === timelineConfirmModal.id
          ? { ...item, type: 'past', isDone: true }
          : item
      );
      updateTimelineItems(updatedList);
    }
    setTimelineConfirmModal({ isOpen: false, id: null });
  };

  const handlePainInputClick = () => {
    setIsEditingModalMode(false);
    setSelectedPart(null);
    setPainLevel(3);
    setPainReason('');
    setPainDiagnosis('');
    setTreatmentPeriod('');
    setPainDate(new Date().toISOString().split('T')[0]);
    setInitialPainDate(new Date().toISOString().split('T')[0]);
    setShowPainModal(true);
  };

  const handlePartClick = (id: string, currentData?: PainItem) => {
    setIsEditingModalMode(!!currentData);
    setSelectedPart(id);
    setPainLevel(currentData?.level || 3);
    setPainReason(currentData?.reason || '');
    setPainDiagnosis(currentData?.diagnosis || '');
    setTreatmentPeriod(currentData?.treatmentPeriod || '');
    setPainDate(new Date().toISOString().split('T')[0]);
    setInitialPainDate(currentData?.initialDate || new Date().toISOString().split('T')[0]);
    setShowPainModal(true);
  };

  const savePainData = () => {
    if (!selectedPart) {
      alert('통증 부위를 먼저 선택해주세요.');
      return;
    }
    
    const currentItem = isEditingModalMode ? painData[selectedPart] : undefined;
    const history = currentItem?.history || [];
    
    // Check if updating an existing history entry for the same date
    const existingHistoryIndex = history.findIndex(h => h.date === painDate);
    const newHistory = [...history];
    if (existingHistoryIndex >= 0) {
      newHistory[existingHistoryIndex] = { date: painDate, level: painLevel, reason: painReason, diagnosis: painDiagnosis,
        treatmentPeriod: treatmentPeriod };
    } else {
      newHistory.push({ date: painDate, level: painLevel, reason: painReason, diagnosis: painDiagnosis,
        treatmentPeriod: treatmentPeriod });
      // Sort history by date
      newHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    let nextPainData = { ...painData };
    
    // If not editing, but an injury already exists for this part, create a duplicate instead of archiving
    let newPartId = selectedPart;
    if (!isEditingModalMode && painData[selectedPart] && !painData[selectedPart].isPast) {
      newPartId = `${selectedPart}_dup_${Date.now()}`;
    }

    let updatedInitialLevel = currentItem?.initialLevel ?? currentItem?.level ?? painLevel;
    if (painDate === initialPainDate) {
      updatedInitialLevel = painLevel;
    }

    nextPainData[newPartId] = { 
      level: painLevel, 
      reason: painReason,
      diagnosis: painDiagnosis,
      treatmentPeriod: treatmentPeriod,
      initialDate: initialPainDate,
      initialLevel: updatedInitialLevel,
      history: newHistory,
      isPast: false
    };

    setPainData(nextPainData);
    setSelectedPart(null);
    setShowPainModal(false);
    if (onUpdatePlayer && player) {
      onUpdatePlayer({
        ...player,
        painData: nextPainData
      });
    }
  };

  
  const confirmDelete = () => {
    if (!deleteConfirmModal.id || !deleteConfirmModal.type) return;
    
    if (deleteConfirmModal.type === 'current') {
      const nextPainData = { ...painData };
      delete nextPainData[deleteConfirmModal.id];
      setPainData(nextPainData);
      setSelectedPart(null);
      setShowPainModal(false);
      if (onUpdatePlayer && player) {
        onUpdatePlayer({ ...player, painData: nextPainData });
      }
    } else if (deleteConfirmModal.type === 'past') {
      const nextPainData = { ...painData };
      delete nextPainData[deleteConfirmModal.id];
      setPainData(nextPainData);
      if (onUpdatePlayer && player) {
        onUpdatePlayer({ ...player, painData: nextPainData });
      }
    } else if (deleteConfirmModal.type === 'timeline') {
      const updatedItems = timelineItems.filter(i => i.id !== deleteConfirmModal.id);
      updateTimelineItems(updatedItems);
      setEditingTimelineItem(null);
      setShowTimelineModal(false);
    }
    
    setDeleteConfirmModal({ isOpen: false, id: null, type: null });
  };

  const deletePainData = () => {
    if (selectedPart) {
      const nextPainData = { ...painData };
      nextPainData[selectedPart] = { ...nextPainData[selectedPart], isPast: true };
      setPainData(nextPainData);
      setSelectedPart(null);
      setShowPainModal(false);
      if (onUpdatePlayer && player) {
        onUpdatePlayer({
          ...player,
          painData: nextPainData
        });
      }
    }
  };

  const permanentlyDeletePainData = () => {
    if (selectedPart) {
      setDeleteConfirmModal({ isOpen: true, id: selectedPart, type: 'current' });
    }
  };

  const deletePastInjury = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmModal({ isOpen: true, id, type: 'past' });
  };

  const REGION_MAP: Record<'front' | 'back', Record<string, string>> = {
    front: {
      head: 'face',
      neck: 'neck',
      deltoids: 'shoulders',
      chest: 'chest',
      biceps: 'biceps',
      forearm: 'forearms',
      hands: 'palm',
      abs: 'abs',
      obliques: 'obliques',
      quadriceps: 'thighs',
      adductors: 'thighs',
      knees: 'knees',
      tibialis: 'tibialis',
      feet: 'feet',
      ankles: 'ankles'
    },
    back: {
      head: 'head',
      hair: 'head',
      neck: 'neck',
      deltoids: 'shoulders',
      'upper-back': 'upper-back',
      'lower-back': 'lower-back',
      trapezius: 'trapezius',
      triceps: 'triceps',
      forearm: 'forearms',
      hands: 'back_of_hand',
      gluteal: 'glutes',
      hamstring: 'hamstrings',
      calves: 'calves',
      feet: 'achilles',
      ankles: 'achilles'
    }
  };

  const REGION_TO_SLUGS: Record<'front' | 'back', Record<string, string[]>> = {
    front: {
      face: ['head'],
      neck: ['neck'],
      shoulders: ['deltoids'],
      chest: ['chest'],
      biceps: ['biceps'],
      forearms: ['forearm'],
      palm: ['hands'],
      abs: ['abs'],
      obliques: ['obliques'],
      thighs: ['quadriceps', 'adductors'],
      knees: ['knees'],
      tibialis: ['tibialis'],
      feet: ['feet'],
      ankles: ['ankles']
    },
    back: {
      head: ['head', 'hair'],
      neck: ['neck'],
      shoulders: ['deltoids'],
      'upper-back': ['upper-back'],
      'lower-back': ['lower-back'],
      trapezius: ['trapezius'],
      triceps: ['triceps'],
      forearms: ['forearm'],
      back_of_hand: ['hands'],
      glutes: ['gluteal'],
      hamstrings: ['hamstring'],
      calves: ['calves'],
      achilles: ['ankles', 'feet']
    }
  };

  const PART_NAMES: Record<string, string> = {
    'head': '머리',
    'face': '얼굴',
    'neck': '목',
    'chest': '가슴',
    'upper-back': '등',
    'lower-back': '허리',
    'trapezius': '승모근',
    'shoulders': '어깨',
    'biceps': '이두근',
    'triceps': '삼두근',
    'forearms': '전완근',
    'palm': '손바닥',
    'back_of_hand': '손등',
    'abs': '복부',
    'obliques': '옆구리',
    'glutes': '둔근',
    'thighs': '허벅지',
    'hamstrings': '햄스트링',
    'knees': '무릎',
    'tibialis': '전경골근',
    'calves': '종아리',
    'feet': '발',
    'ankles': '발목',
    'achilles': '아킬레스건'
  };

  const PAIN_COLORS = ['#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c'];

  const handleBodyPartPress = (bodyPart: any, side: "left" | "right" | undefined, viewSide: 'front' | 'back', isModal: boolean = false) => {
    const region = REGION_MAP[viewSide][bodyPart.slug];
    if (!region) return;
    
    const centralRegions = ['head', 'neck', 'abs', 'lower-back'];
    const effectiveSide = centralRegions.includes(region) ? 'center' : (side || 'center');
  
    const id = `${region}_${effectiveSide}_${viewSide}`;
    
    if (isModal) {
      if (isEditingModalMode) return;
      setSelectedPart(id);
      return;
    }

    // Find an active injury for this base ID
    const activeEntry = (Object.entries(painData) as [string, any][]).find(([key, val]) => {
      const cleanKey = key.includes('_dup_') ? key.split('_dup_')[0] : key;
      return cleanKey === id && !val.isPast;
    });

    if (activeEntry) {
      setHistoryModalPart(activeEntry[0]);
      setHistoryModalTab('graph');
      setShowHistoryModal(true);
    }
  };

  
  const getGraphData = (id: string) => {

    const item = painData[id];
    if (!item) return [];
    return [
      ...(item.initialDate ? [{
        date: item.initialDate,
        level: item.initialLevel ?? item.level
      }] : []),
      ...(item.history || [])
    ].reduce((acc: any[], current: any) => {
      const existingIdx = acc.findIndex(x => x.date === current.date);
      if (existingIdx === -1) {
        return acc.concat([{ ...current }]);
      } else {
        const newAcc = [...acc];
        newAcc[existingIdx] = { ...newAcc[existingIdx], level: current.level };
        return newAcc;
      }
    }, []).map((dataItem: any) => ({
      name: dataItem.date ? dataItem.date.substring(5).replace('-', '/') : '',
      level: dataItem.level
    }));
  };

  const getSinglePartData = (id: string, level: number) => {
    const result: any[] = [];
    let cleanId = id;
    if (id.includes('_archived_')) {
      cleanId = id.split('_archived_')[0];
    }
    if (cleanId.includes('_dup_')) {
      cleanId = cleanId.split('_dup_')[0];
    }
    
    
    
    const parts = cleanId.split('_');
    const view = parts.pop();
    const side = parts.pop();
    const region = parts.join('_');
    const viewSide = view as 'front' | 'back';
    const slugs = REGION_TO_SLUGS[viewSide]?.[region] || [];
    slugs.forEach(slug => {
      result.push({
        slug: slug as any,
        side: (side !== 'center' ? side : undefined) as any,
        intensity: level,
      });
    });
    return result;
  };


  const getPartTransform = (id: string) => {
    const region = id.split('_')[0];
    switch (region) {
      case 'head': case 'neck': return 'scale(1.2) translateY(35%)';
      case 'shoulders': case 'chest': case 'upper-back': case 'trapezius': return 'scale(1.1) translateY(20%)';
      case 'biceps': case 'triceps': case 'forearm': case 'hands': return 'scale(1.1) translateY(5%)';
      case 'stomach': case 'lower-back': case 'obliques': return 'scale(1.1) translateY(-5%)';
      case 'thigh': case 'hamstring': case 'quadriceps': case 'gluteal': return 'scale(1.1) translateY(-20%)';
      case 'knees': return 'scale(1.2) translateY(-35%)';
      case 'calves': return 'scale(1.2) translateY(-45%)';
      case 'ankles': case 'feet': return 'scale(1.5) translateY(-55%)';
      default: return 'scale(1) translateY(0%)';
    }
  };

    const getMappedData = (viewSide: 'front' | 'back', isModal = false) => {
    const result: any[] = [];
    
    if (isModal) {
      if (selectedPart) {
        let cleanId = selectedPart;
        if (cleanId.includes('_dup_')) cleanId = cleanId.split('_dup_')[0];
        if (cleanId.endsWith(`_${viewSide}`)) {
          const parts = cleanId.split('_');
          const view = parts.pop();
          const side = parts.pop();
          const region = parts.join('_');
          
          const slugs = REGION_TO_SLUGS[viewSide as 'front' | 'back'][region] || [];
          slugs.forEach(slug => {
            result.push({
              slug: slug as any,
              side: (side !== 'center' ? side : undefined) as any,
              intensity: painLevel,
            });
          });
        }
      }
      return result;
    }

    (Object.entries(painData) as [string, any][])
      .filter(([id, item]) => {
        let cleanId = id;
        if (cleanId.includes('_dup_')) cleanId = cleanId.split('_dup_')[0];
        return cleanId.endsWith(`_${viewSide}`) && !item.isPast;
      })
      .forEach(([id, item]) => {
        let cleanId = id;
        if (cleanId.includes('_dup_')) cleanId = cleanId.split('_dup_')[0];
        const parts = cleanId.split('_');
        const view = parts.pop();
        const side = parts.pop();
        const region = parts.join('_');
        
        const slugs = REGION_TO_SLUGS[viewSide as 'front' | 'back'][region] || [];
        slugs.forEach(slug => {
          result.push({
            slug: slug as any,
            side: (side !== 'center' ? side : undefined) as any,
            intensity: item.level,
            viewSide: viewSide
          });
        });
      });
    return result;
  };

  const renderBodySelector = (viewSide: 'front' | 'back', isModal = false) => {
    return (
      <div 
        id={`body-selector-${viewSide}${isModal ? '-modal' : ''}`}
        className="w-[120px] sm:w-[200px] flex justify-center relative [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[400px]"
      >
        <Body
          data={getMappedData(viewSide, isModal)}
          side={viewSide}
          gender="male"
          scale={1.0}
          colors={PAIN_COLORS}
          border="rgba(255,255,255,0.2)"
          onBodyPartPress={(bodyPart, side) => handleBodyPartPress(bodyPart, side, viewSide, isModal)}
        />
      </div>
    );
  };

  const getPartName = (id: string) => {
    let cleanId = id;
    if (id.includes('_archived_')) {
      cleanId = id.split('_archived_')[0];
    }
    if (cleanId.includes('_dup_')) {
      cleanId = cleanId.split('_dup_')[0];
    }
    
    const parts = cleanId.split('_');
    const viewSide = parts.pop();
    const side = parts.pop();
    const region = parts.join('_');

    let name = PART_NAMES[region] || region;

    if (side === 'left') return `왼쪽 ${name}`;
    if (side === 'right') return `오른쪽 ${name}`;
    return name;
  };

  const getPainLevelText = (level: number) => {
    switch (level) {
      case 1: return '불편감';
      case 2: return '약한 통증';
      case 3: return '중등도 통증';
      case 4: return '심한 통증';
      case 5: return '극심한 통증';
      default: return '';
    }
  };

  return (
    <div className="tab-pane active pb-24 text-white">
      
      <div className="section-title-group flex justify-between items-end mb-6">
        <div>
          <h3>부상 관리</h3>
        </div>
        <div className="flex flex-col items-end gap-3 sm:flex-row-reverse sm:items-center sm:gap-4">
          {isAgent && (
            <button 
              onClick={handlePainInputClick}
              className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity"
            >
              <div className="w-5 h-5 rounded-full bg-[var(--primary-color)] text-[#050608] flex items-center justify-center">
                <span className="material-icons-round text-[16px] font-bold">add</span>
              </div>
              부상 입력
            </button>
          )}
          <button 
            onClick={() => setShowPastPainModal(true)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors"
          >
            <span className="material-icons-round text-[18px]">history</span>
            과거 부상 내역 보기
          </button>
        </div>
      </div>

      {/* TOP CARD: Body Map & Current Pain List */}
      <div className="card-chart mb-6">
        <div className="flex flex-col gap-10">
          
          {/* Top: Interactive Body Map */}
          <div className="flex flex-col">
            <TransformWrapper disabled={!isMobile} centerZoomedOut centerOnInit initialScale={1} minScale={0.5} maxScale={4} wheel={{ step: 0.1 }} panning={{ disabled: true }}>
              <TransformComponent wrapperStyle={{ width: '100%' }} contentStyle={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div className="flex justify-center gap-16 md:gap-24 items-start relative mb-8 w-full max-w-lg mx-auto" style={{ touchAction: 'none' }}>
                  {/* Front Silhouette */}
                  <div className="flex flex-col items-center">
                    <span className="text-white text-sm font-semibold mb-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-1 text-center">앞</span>
                    {renderBodySelector('front')}
                  </div>
                  
                  {/* Back Silhouette */}
                  <div className="flex flex-col items-center">
                    <span className="text-white text-sm font-semibold mb-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-4 py-1 text-center">뒤</span>
                    {renderBodySelector('back')}
                  </div>
                </div>
              </TransformComponent>
            </TransformWrapper>

              {/* Pain Input Modal */}
              {showPainModal && (
                <div className="fixed inset-0 z-[1100] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
                  <div className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
                    <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
                      <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                        {selectedPart ? getPartName(selectedPart) : '부상 입력'}
                      </h4>
                      <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowPainModal(false)}>close</span>
                    </div>
                    
                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto flex flex-col gap-[12px]">
                      
                      {/* Dates */}
                      <div className="flex flex-col gap-4">
                        <div className={`flex flex-col gap-[6px] ${isEditingModalMode ? 'opacity-50 pointer-events-none' : ''}`}>
                          <label className="text-[13px] font-normal text-gray-300 block">부상 발생일</label>
                          <input 
                            type="date" 
                            value={initialPainDate}
                            onChange={(e) => setInitialPainDate(e.target.value)}
                            disabled={isEditingModalMode}
                            max="9999-12-31"
                            className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 outline-none transition-colors"
                          />
                        </div>

                        {selectedPart && isEditingModalMode && painData[selectedPart] && (
                          <div className="flex flex-col gap-[6px]">
                            <label className="text-[13px] font-normal text-gray-300 block">현재 부상 상태</label>
                            <input 
                              type="date" 
                              value={painDate}
                              onChange={(e) => setPainDate(e.target.value)}
                              max="9999-12-31"
                              className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 outline-none transition-colors"
                            />
                          </div>
                        )}
                      </div>

                      {/* Part Selection */}
                      <div>
                        <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">통증 부위</label>
                        <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 sm:p-8 flex flex-col gap-6 overflow-x-auto">
                          {selectedPart && (
                            <div className="w-full flex justify-start">
                              <span className="text-xs font-bold text-[var(--primary-color)] bg-[rgba(212,175,55,0.1)] px-3 py-1.5 rounded-lg border border-[rgba(212,175,55,0.2)]">
                                선택됨: {selectedPart ? getPartName(selectedPart) : ''}
                              </span>
                            </div>
                          )}
                          <TransformWrapper disabled={!isMobile} centerZoomedOut centerOnInit initialScale={1} minScale={0.5} maxScale={4} wheel={{ step: 0.1 }} panning={{ disabled: true }}>
                            <TransformComponent wrapperStyle={{ width: '100%' }} contentStyle={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                              <div className="flex justify-center gap-4 sm:gap-12 w-full max-w-lg mx-auto" style={{ touchAction: 'none' }}>
                                <div className="flex flex-col items-center">
                                  <span className="text-white text-xs sm:text-sm font-semibold mb-3 sm:mb-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-3 py-1 sm:px-4 text-center">앞</span>
                                  {renderBodySelector('front', true)}
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-white text-xs sm:text-sm font-semibold mb-3 sm:mb-4 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-full px-3 py-1 sm:px-4 text-center">뒤</span>
                                  {renderBodySelector('back', true)}
                                </div>
                              </div>
                            </TransformComponent>
                          </TransformWrapper>
                        </div>
                      </div>

                      {/* Pain Level Selection */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-end">
                          <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">통증 단계 (1-5)</label>
                          <span className="text-[#fbfbfb] font-bold text-sm leading-none flex items-center gap-1">
                            {painLevel}<span className="text-sm font-semibold text-[#fbfbfb]/80">단계</span>
                            <span className="text-sm font-medium text-[#fbfbfb]/90 ml-0.5">({getPainLevelText(painLevel)})</span>
                          </span>
                        </div>
                        <input 
                          type="range" min="1" max="5" step="1"
                          value={painLevel} 
                          onChange={(e) => setPainLevel(parseInt(e.target.value))}
                          className="w-full accent-red-500 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between px-1 mt-1">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <button 
                              key={num}
                              onClick={() => setPainLevel(num)}
                              className={`text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                                painLevel === num 
                                  ? 'text-white bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                                  : 'text-gray-400 hover:text-gray-200 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>


                      {selectedPart && isEditingModalMode && painData[selectedPart] && getGraphData(selectedPart).length > 0 && (
                        <div>
                          <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">통증 경과 그래프</label>
                          <div className="mb-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
                            <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart
                                data={getGraphData(selectedPart)}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 5]} ticks={[1,2,3,4,5]} />
                                <RechartsTooltip 
                                  content={(props) => {
                                    const { active, payload, label } = props;
                                    if (active && payload && payload.length) {
                                      const data = payload[0].payload;
                                      const level = data.level;
                                      return (
                                        <div className="bg-[rgba(10,10,15,0.9)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white shadow-xl backdrop-blur-md">
                                          <div className="text-[10px] font-bold text-gray-400 mb-1">{data.dateLabel}</div>
                                          <div className="text-[13px] font-normal flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level === 1 ? '#fca5a5' : level === 2 ? '#f87171' : level === 3 ? '#ef4444' : level === 4 ? '#dc2626' : '#b91c1c' }}></div>
                                            통증 {level}단계
                                          </div>
                                          {data.reason && (
                                            <div className="text-[12px] text-gray-300 mt-2 max-w-[200px] whitespace-pre-wrap">{data.reason}</div>
                                          )}
                                        </div>
                                      );
                                    }
                                    return null;
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="level" 
                                  stroke="#ef4444" 
                                  strokeWidth={3}
                                  dot={(props: any) => {
                                    const { cx, cy, payload } = props;
                                    const level = payload.level;
                                    const colors = {
                                      1: '#fca5a5', // red-300
                                      2: '#f87171', // red-400
                                      3: '#ef4444', // red-500
                                      4: '#dc2626', // red-600
                                      5: '#b91c1c', // red-700
                                    };
                                    const fill = (colors as any)[level] || '#ef4444';
                                    return (
                                      <circle cx={cx} cy={cy} r={4} fill={fill} strokeWidth={0} />
                                    );
                                  }}
                                  activeDot={(props: any) => {
                                    const { cx, cy, payload } = props;
                                    const level = payload.level;
                                    const colors = {
                                      1: '#fca5a5', // red-300
                                      2: '#f87171', // red-400
                                      3: '#ef4444', // red-500
                                      4: '#dc2626', // red-600
                                      5: '#b91c1c', // red-700
                                    };
                                    const fill = (colors as any)[level] || '#ef4444';
                                    return (
                                      <circle cx={cx} cy={cy} r={6} fill={fill} stroke="#fff" strokeWidth={2} />
                                    );
                                  }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          
                          {/* Legend */}
                          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-gray-500 mt-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-300"></span>1단계(불편감)</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>2단계(약한 통증)</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>3단계(중등도 통증)</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>4단계(심한 통증)</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-700"></span>5단계(극심한 통증)</div>
                          </div>

                        </div>
                      </div>
                    )}
                      {/* Reason */}
                      <div className="flex flex-col gap-[12px]">
                        
                      <div>
                        <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">진단명</label>
                        <input
                          type="text"
                          value={painDiagnosis}
                          onChange={(e) => setPainDiagnosis(e.target.value)}
                          placeholder="진단명을 입력해주세요..."
                          className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">치료기간</label>
                        <input
                          type="text"
                          value={treatmentPeriod}
                          onChange={(e) => setTreatmentPeriod(e.target.value)}
                          placeholder="치료기간을 입력해주세요..."
                          className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 focus:outline-none transition-colors"
                        />
                      </div>

                      <div className="mb-[12px]">
                        <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">부상 내용</label>
                        <textarea 
                          value={painReason}
                          onChange={(e) => setPainReason(e.target.value)}
                          placeholder="부상 내용을 자세히 입력해주세요..."
                          rows={3}
                          className="w-full bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl py-3 px-3 focus:outline-none transition-colors resize-none leading-relaxed"
                        />
                      </div>
                      </div>
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="px-6 pb-6 mt-[12px] flex gap-3 shrink-0">
                      {selectedPart && isEditingModalMode && painData[selectedPart] && (
                        <>
                          <button onClick={permanentlyDeletePainData} className="flex-1 border border-red-500/20 bg-red-500/5 rounded-xl text-red-500 hover:bg-red-500/10 font-bold transition-colors h-[30px] flex items-center justify-center text-[14px]">
                            삭제
                          </button>
                          <button onClick={deletePainData} className="flex-1 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white font-bold transition-colors h-[30px] flex items-center justify-center text-[14px]">
                            종료
                          </button>
                        </>
                      )}
                      <button 
                        onClick={savePainData} 
                        className="flex-1 border border-[var(--primary-color)] bg-[var(--primary-color)] text-[#050608] hover:opacity-90 rounded-xl font-bold transition-all h-[30px] flex items-center justify-center text-[14px]"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                </div>
              )}
            
              {hoveredGraphPart && window.innerWidth >= 768 && painData[hoveredGraphPart] && (
                <div 
                  className="fixed z-[1100] pointer-events-none bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 transition-opacity duration-200"
                  style={{ 
                    left: Math.min(mousePos.x + 20, window.innerWidth - 320) + 'px', 
                    top: Math.min(mousePos.y + 20, window.innerHeight - 270) + 'px',
                    width: '300px',
                    height: '250px'
                  }}
                >
                  <div className="text-xs font-bold text-gray-400 mb-2">최근 통증 변화</div>
                  <h3 className="text-sm font-bold text-white mb-2">{getPartName(hoveredGraphPart)}</h3>
                  <div className="w-full h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getGraphData(hoveredGraphPart)}>
                        <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} domain={[0, 5]} ticks={[1,2,3,4,5]} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="level" 
                          name="통증 단계"
                          stroke="var(--primary-color)" 
                          strokeWidth={3}
                          dot={{ fill: 'var(--card-bg)', stroke: 'var(--primary-color)', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: 'var(--primary-color)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {showHistoryModal && historyModalPart && (
                <div className="fixed inset-0 z-[1050] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
                  <div className="card-chart bg-[var(--card-bg)] w-full max-w-2xl rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6">
                    <div className="flex flex-col mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-bold text-gray-400 mb-2 block">부상 기록</span>
                          <div className="flex flex-col gap-1.5">
                            <h2 className="text-lg font-bold text-white mb-0">{getPartName(historyModalPart)}</h2>
                            {painData[historyModalPart]?.diagnosis && (
                              <p className="text-[12px] text-gray-300"><span className="text-gray-500 mr-1">진단명:</span> {painData[historyModalPart].diagnosis}</p>
                            )}
                            {painData[historyModalPart]?.reason && (
                              <p className="text-[12px] text-gray-300"><span className="text-gray-500 mr-1">부상 내용:</span> {painData[historyModalPart].reason}</p>
                            )}
                          </div>
                        </div>
                        <button onClick={() => { setShowHistoryModal(false); setHistoryModalTab('graph'); }} className="text-gray-400 hover:text-white transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>

                      {painData[historyModalPart] && !painData[historyModalPart].isPast && (
                        <div className="flex p-1 bg-[rgba(255,255,255,0.05)] rounded-xl mt-2 w-full">
                          <button
                            onClick={() => setHistoryModalTab('graph')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${historyModalTab === 'graph' ? 'bg-[var(--primary-color)] text-[#1a1a1a]' : 'text-gray-400 hover:text-white'}`}
                          >
                            그래프
                          </button>
                          <button
                            onClick={() => setHistoryModalTab('card')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${historyModalTab === 'card' ? 'bg-[var(--primary-color)] text-[#1a1a1a]' : 'text-gray-400 hover:text-white'}`}
                          >
                            부상 내역 카드
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {historyModalTab === 'graph' && (
                    <>
                    <div className="h-[300px] w-full mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={getGraphData(historyModalPart)}
                          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
                          <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 5]} ticks={[1,2,3,4,5]} />
                          <RechartsTooltip 
                            content={(props) => {
                              const { active, payload, label } = props;
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                const level = data.level;
                                return (
                                  <div className="bg-[rgba(10,10,15,0.9)] border border-[rgba(255,255,255,0.1)] rounded-xl p-3 text-white shadow-xl backdrop-blur-md">
                                    <p className="text-gray-400 text-[10px] mb-1 font-medium">{label}</p>
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getPainColor(level) }}></span>
                                      <span className="text-sm font-bold">{level}단계</span>
                                      <span className="text-xs text-gray-300 font-medium">({getPainLevelText(level)})</span>
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="level" 
                            stroke="rgba(255,255,255,0.2)" 
                            strokeWidth={2} 
                            dot={(props: any) => {
                              const { cx, cy, payload, key } = props;
                              return <circle key={key} cx={cx} cy={cy} r={5} fill={getPainColor(payload.level)} stroke="rgba(0,0,0,0.5)" strokeWidth={1} />;
                            }} 
                            activeDot={(props: any) => {
                              const { cx, cy, payload, key } = props;
                              return <circle key={key} cx={cx} cy={cy} r={7} fill="#fff" stroke={getPainColor(payload.level)} strokeWidth={2} />;
                            }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-gray-500 mt-6 pt-6 border-t border-[rgba(255,255,255,0.05)]">
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-300"></span>1단계(불편감)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>2단계(약한 통증)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>3단계(중등도 통증)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>4단계(심한 통증)</div>
                      <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-700"></span>5단계(극심한 통증)</div>
                    </div>
                    </>
                  )}

                  {historyModalTab === 'card' && historyModalPart && (
                      <div className="mt-2 text-left flex flex-col gap-4">
                        {(Object.entries(painData) as [string, any][]).filter(([id, data]) => {
                          const cleanBaseId = historyModalPart.includes('_dup_') ? historyModalPart.split('_dup_')[0] : historyModalPart;
                          return !data.isPast && (id === cleanBaseId || id.startsWith(cleanBaseId + '_dup_'));
                        }).map(([cardId, cardData]) => (
                          <div 
                            key={cardId}
                            onClick={() => {
                              setHistoryModalPart(cardId);
                              setHistoryModalTab('graph');
                            }}
                            className="card-chart cursor-pointer hover:bg-[rgba(255,255,255,0.04)] transition-colors !mb-0 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] bg-[rgba(255,255,255,0.02)] rounded-[24px] p-5 relative overflow-hidden"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex flex-col">
                                <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 mb-1 truncate max-w-[200px] sm:max-w-none">
                                  { `부상 발생일: ${cardData.initialDate ? formatKoreanDate(cardData.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0])}` }
                                </span>
                                <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 truncate max-w-[200px] sm:max-w-none">
                                  {`현재 부상 상태: ${cardData.history && cardData.history.length > 0 ? formatKoreanDate(cardData.history[cardData.history.length - 1].date) : (cardData.initialDate ? formatKoreanDate(cardData.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0]))}`}
                                </span>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex flex-col items-end gap-1 text-[13px] sm:text-[14px] font-semibold text-gray-400 mt-1 sm:mt-0">
                                  <div className="flex items-center gap-1.5">
                                    <span 
                                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                                      style={{ backgroundColor: getPainColor(cardData.level) }}
                                    />
                                    <span>{cardData.level}단계</span>
                                  </div>
                                  <span className="whitespace-nowrap text-[12px] sm:text-[13px] text-gray-500">
                                    ({getPainLevelText(cardData.level)})
                                  </span>
                                </div>
                              </div>
                            </div>
                              
                            <div className="flex items-center gap-3.5 mb-5">
                              <div className="w-12 h-12 bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shrink-0 relative group-hover:scale-105 transition-transform">
                                <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none" style={{ transform: getPartTransform(cardId) }}>
                                   <Body
                                     data={getSinglePartData(cardId, cardData.level)}
                                     side={cardId.match(/_(front|back)(_|$)/)?.[1] === 'back' ? 'back' : 'front'}
                                     gender="male"
                                     scale={1.0}
                                     colors={PAIN_COLORS}
                                     border="rgba(255,255,255,0.2)"
                                   />
                                </div>
                              </div>
                              <div className="flex flex-col justify-center overflow-hidden">
                                <span className="text-sm font-bold text-white mb-1 truncate">{getPartName(cardId)}</span>
                                {cardData.diagnosis ? (
                                  <span className="text-xs text-[var(--primary-color)] font-semibold truncate bg-[rgba(212,175,55,0.1)] px-2 py-0.5 rounded inline-block w-fit">
                                    {cardData.diagnosis}
                                  </span>
                                ) : (
                                  <span className="text-xs text-gray-500 font-medium truncate">진단명 미입력</span>
                                )}
                              </div>
                            </div>
                              
                            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
                              <span className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-wider">부상 내용</span>
                              <p className="text-[12px] text-gray-300 font-medium leading-relaxed">
                                {cardData.reason || '입력된 부상 내용이 없습니다.'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            
              {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[1100] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
                  <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">진료 완료 확인</h3>
                    <p className="text-sm text-gray-300 mb-6">치료가 완료 되었습니까?</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setConfirmModal({ isOpen: false, id: null })} 
                        className="flex-1 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        취소
                      </button>
                      <button 
                        onClick={confirmCompleteTreatment} 
                        className="flex-1 py-3 bg-[var(--primary-color)] text-white text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(212,175,55,0.25)] hover:brightness-115 transition-all"
                      >
                        확인
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {timelineConfirmModal.isOpen && (
                <div className="fixed inset-0 z-[1100] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
                  <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 text-center">
                    <h3 className="text-lg font-bold text-white mb-2">진료 완료 확인</h3>
                    <p className="text-sm text-gray-300 mb-6">진료가 완료 되었습니까?</p>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setTimelineConfirmModal({ isOpen: false, id: null })} 
                        className="flex-1 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-bold rounded-xl transition-colors"
                      >
                        취소
                      </button>
                      <button 
                        onClick={confirmCompleteTimelineTreatment} 
                        className="flex-1 py-3 bg-[var(--primary-color)] text-white text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(212,175,55,0.25)] hover:brightness-115 transition-all"
                      >
                        확인
                      </button>
                    </div>
                  </div>
                </div>
              )}
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-gray-500 mt-8">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full border border-[rgba(255,255,255,0.2)] border-dashed bg-transparent"></span>최근 통증 사라짐</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-300"></span>1단계(불편감)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>2단계(약한 통증)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>3단계(중등도 통증)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>4단계(심한 통증)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-700"></span>5단계(극심한 통증)</div>
            </div>
          </div>

          {/* Bottom: Current Pain List */}
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-gray-300 mb-3">현재 부상 내역</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(Object.values(painData) as any[]).filter(item => !item.isPast).length === 0 ? (
                <div className="col-span-full py-10 text-center text-[12px] text-gray-400 font-medium bg-[rgba(255,255,255,0.02)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                  현재 등록된 부상이 없습니다.
                </div>
              ) : (
                (((Object.entries(painData) as [string, any][]) as [string, PainItem][]).filter(([id, item]) => !item.isPast)).map(([id, item]) => {
                  const partName = getPartName(id);
                  
                  return (
                    <div 
                      key={id} 
                      onClick={() => handlePartClick(id, item)}
                      className="card-chart !mb-0 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.25)] border border-[var(--card-border)] bg-[var(--card-bg)] rounded-[24px] p-5 cursor-pointer hover:border-[var(--primary-color)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.1)] transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 mb-1 truncate max-w-[200px] sm:max-w-none">
                            { `부상 발생일: ${item.initialDate ? formatKoreanDate(item.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0])}` }
                          </span>
                          <span className="text-[13px] sm:text-[14px] font-bold text-gray-400 truncate max-w-[200px] sm:max-w-none">
                            {`현재 부상 상태: ${item.history && item.history.length > 0 ? formatKoreanDate(item.history[item.history.length - 1].date) : (item.initialDate ? formatKoreanDate(item.initialDate) : formatKoreanDate(new Date().toISOString().split("T")[0]))}`}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <button 
                            onClick={(e) => handleShowHistory(e, id)}
                            className="text-[12px] font-bold text-gray-300 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] px-2 py-1 rounded transition-colors"
                          >
                            부상 기록 관리
                          </button>
                          <div className="flex flex-col items-end gap-1 text-[13px] sm:text-[14px] font-semibold text-gray-400 mt-1 sm:mt-0">
                            <div className="flex items-center gap-1.5">
                              <span 
                                className="w-2.5 h-2.5 rounded-full shrink-0" 
                                style={{ backgroundColor: getPainColor(item.level) }}
                              />
                              <span>{item.level}단계</span>
                            </div>
                            <span className="whitespace-nowrap text-[12px] sm:text-[13px] text-gray-500">
                              ({getPainLevelText(item.level)})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3.5 mb-5">
                        <div className="w-12 h-12 bg-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shrink-0 relative group-hover:scale-105 transition-transform">
                          <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none" style={{ transform: getPartTransform(id) }}>
                             <Body
                               data={getSinglePartData(id, item.level)}
                               side={id.match(/_(front|back)(_|$)/)?.[1] === 'back' ? 'back' : 'front'}
                               gender="male"
                               scale={1.0}
                               colors={PAIN_COLORS}
                               border="rgba(255,255,255,0.2)"
                             />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-[var(--primary-color)] transition-colors">{partName}</h4>
                          <span className="text-[14px] font-medium text-gray-500 mt-0.5 block">부상 부위</span>
                        </div>
                      </div>
                      
                      <div className="mb-5">
                        <span className="text-[14px] font-bold text-gray-500 block mb-1.5">진단명</span>
                        <p className="text-[14px] font-medium text-gray-200 truncate">
                          {item.diagnosis || '입력된 진단명 없음'}
                        </p>
                      </div>
                      
                      <div className="mb-5">
                        <span className="text-[14px] font-bold text-gray-500 block mb-1.5">부상 내용</span>
                        <p className="text-[14px] font-medium text-gray-200 truncate">
                          {item.reason || '입력된 정보 없음'}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-[14px] font-bold text-gray-500 block mb-2">치료기간</span>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-[14px] font-medium text-gray-300 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5 rounded-md leading-none truncate max-w-[150px]">
                              {item.treatmentPeriod || <span className="text-[12px]">입력된 치료기간 없음</span>}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => handleCompleteTreatment(e, id)}
                          className="flex items-center gap-1 text-[12px] font-bold text-gray-300 bg-[rgba(255,255,255,0.05)] hover:bg-[var(--primary-color)] hover:text-white border border-[rgba(255,255,255,0.1)] hover:border-[var(--primary-color)] px-2.5 py-1.5 rounded-md transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)]"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          치료완료
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
      </div>
      </div>
      {/* BOTTOM CARD: Care CRM Timeline */}
      <div className="section-title-group flex justify-between items-end mb-6">
        <div>
          <h3 className="flex items-center gap-3">진료 일정</h3>
        </div>
        <div className="flex flex-col items-end gap-3 sm:flex-row-reverse sm:items-center sm:gap-4">
          {isAgent && (
            <button 
              onClick={handleAddTimelineClick}
              className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity"
            >
              <div className="w-5 h-5 rounded-full bg-[var(--primary-color)] text-[#050608] flex items-center justify-center">
                <span className="material-icons-round text-[16px] font-bold">add</span>
              </div>
              진료 기록 추가
            </button>
          )}
          <button 
            onClick={() => setShowPastTimelineModal(true)}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white font-bold text-sm transition-colors"
          >
            <span className="material-icons-round text-[18px]">history</span>
            지난 진료 기록 보기
          </button>
        </div>
      </div>

      <div className="card-chart mb-8">
        {timelineItems.filter(item => item.type === 'upcoming').length === 0 ? (
          <div className="py-12 text-center text-[12px] text-gray-400 font-medium">
            <span className="material-icons-round text-gray-600 text-4xl block mb-3">timeline</span>
            등록된 진료 기록 타임라인이 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {timelineItems.filter(item => item.type === 'upcoming').map((item) => {
              // Determine card bg & border styles
              let cardStyle = 'bg-[rgba(212,175,55,0.03)] border-[rgba(212,175,55,0.2)]';
              
              // Determine category label
              let typeLabel = '진료 일정';
              let badgeStyle = 'bg-[rgba(212,175,55,0.1)] text-[var(--primary-color)]';

              return (
                <div key={item.id} className="relative">
                  {/* Card Container */}
                  <div 
                    onClick={() => isAgent && handleEditTimelineClick(item)}
                    className={`card-chart rounded-[24px] p-5 shadow-lg border transition-all duration-300 ${cardStyle} ${isAgent ? 'cursor-pointer hover:border-[var(--primary-color)]' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[14px] font-bold px-2.5 py-1 rounded-md leading-none ${badgeStyle}`}>
                          {typeLabel}
                        </span>
                      </div>
                      {isAgent && (
                        <span className="material-icons-round text-gray-500 hover:text-[var(--primary-color)] text-[18px] transition-colors">
                          edit
                        </span>
                      )}
                    </div>
                    
                    <h4 className={`text-[14px] font-bold ${!item.hospital ? 'mb-1' : 'mb-1'} leading-tight ${item.isDone ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {item.title}
                    </h4>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[14px] font-bold text-gray-400">{formatKoreanDate(item.dateLabel)}</span>
                      {getDDayBadge(item.dateLabel)}
                    </div>
                    
                    {item.hospital && (
                      <p className={`text-[14px] font-medium mb-3 ${item.isDone ? 'text-gray-600' : 'text-[var(--primary-color)]'}`}>
                        {item.hospital}
                      </p>
                    )}

                    {item.time && (
                      <div>
                        <p className="text-[14px] font-medium text-gray-300 flex items-center gap-1.5 leading-tight">
                          <span className="material-icons-round text-[16px] text-gray-400">schedule</span> {formatTimeStr(item.time)}
                        </p>
                      </div>
                    )}
                    
                    {item.notes && (
                      <div className="mt-4 bg-[rgba(255,255,255,0.05)] p-4 rounded-xl border border-[rgba(255,255,255,0.05)] shadow-sm">
                        <p className="text-[14px] font-bold text-gray-500 leading-none block mb-1.5 uppercase tracking-wide">
                          상세 내용
                        </p>
                        <p className="text-[14px] font-medium text-gray-300 leading-tight whitespace-pre-wrap">{item.notes}</p>
                      </div>
                    )}

                    {/* Quick checkoff actions for agent if it is not done yet */}
                    {isAgent && (
                      <div className="flex justify-end mt-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setTimelineConfirmModal({ isOpen: true, id: item.id });
                          }}
                          className="flex items-center gap-1 text-[12px] font-bold text-gray-300 bg-[rgba(255,255,255,0.05)] hover:bg-[var(--primary-color)] hover:text-white border border-[rgba(255,255,255,0.1)] hover:border-[var(--primary-color)] px-2.5 py-1.5 rounded-md transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_12px_rgba(212,175,55,0.25)]"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          진료 완료
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CUSTOM TIME PICKER MODAL */}
      {showCustomTimeModal && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-6">시간 선택</h3>
            <div className="flex gap-2 mb-6 items-center">
              <select 
                value={tempAmPm}
                onChange={(e) => setTempAmPm(e.target.value)}
                className="flex-1 bg-[rgba(255,255,255,0.05)] text-white p-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-center text-[16px] font-bold focus:border-[var(--primary-color)] outline-none"
              >
                <option value="AM" className="bg-[#1e1e1e]">오전</option>
                <option value="PM" className="bg-[#1e1e1e]">오후</option>
              </select>
              <select 
                value={tempHour}
                onChange={(e) => setTempHour(e.target.value)}
                className="flex-1 bg-[rgba(255,255,255,0.05)] text-white p-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-center text-[16px] font-bold focus:border-[var(--primary-color)] outline-none"
              >
                {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                  <option key={h} value={h} className="bg-[#1e1e1e]">{h}시</option>
                ))}
              </select>
              <span className="text-white text-xl font-bold">:</span>
              <select 
                value={tempMinute}
                onChange={(e) => setTempMinute(e.target.value)}
                className="flex-1 bg-[rgba(255,255,255,0.05)] text-white p-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-center text-[16px] font-bold focus:border-[var(--primary-color)] outline-none"
              >
                {['00', '10', '20', '30', '40', '50'].map(m => (
                  <option key={m} value={m} className="bg-[#1e1e1e]">{m}분</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCustomTimeModal(false);
                }}
                className="flex-1 py-3 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white text-sm font-bold rounded-xl transition-colors"
              >
                취소
              </button>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  let finalHour = parseInt(tempHour, 10);
                  if (tempAmPm === 'PM' && finalHour !== 12) finalHour += 12;
                  if (tempAmPm === 'AM' && finalHour === 12) finalHour = 0;
                  setTimelineFormTime(`${finalHour.toString().padStart(2, '0')}:${tempMinute}`);
                  setShowCustomTimeModal(false);
                }}
                className="flex-1 py-3 bg-[var(--primary-color)] text-[#050608] text-sm font-bold rounded-xl shadow-[0_4px_12px_rgba(212,175,55,0.25)] hover:brightness-115 transition-all"
              >
                완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TIMELINE MODAL */}
      
      {/* PAST PAIN MODAL */}
      {showPastPainModal && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-2xl rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                <span className="material-icons-round text-gray-400">history</span>
                과거 부상 내역
              </h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowPastPainModal(false)}>close</span>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {(() => {
                const pastItems = (Object.entries(painData) as [string, PainItem][]).filter(([id, data]) => data.isPast).map(([id, data]) => ({ id, ...data }));
                
                if (pastItems.length === 0) {
                  return (
                    <div className="py-12 text-center text-[12px] text-gray-400 font-medium bg-[rgba(255,255,255,0.02)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                      <span className="material-icons-round text-gray-600 text-4xl block mb-3">history</span>
                      완료된 부상 내역이 없습니다.
                    </div>
                  );
                }

                // Get available years
                const currentYear = new Date().getFullYear();
                const yearsSet = new Set<string>();
                for (let y = currentYear; y >= 2026; y--) {
                  yearsSet.add(y.toString());
                }

                pastItems.forEach(item => {
                  const itemDate = item.history && item.history.length > 0 ? item.history[item.history.length - 1].date : item.initialDate;
                  if (itemDate) {
                    const y = itemDate.substring(0, 4);
                    if (/^\d{4}$/.test(y)) {
                      yearsSet.add(y);
                    }
                  }
                });

                const years = Array.from(yearsSet).sort().reverse();
                
                // Filter by selected year and month
                const filteredItems = pastItems.filter(item => {
                  const itemDate = item.history && item.history.length > 0 ? item.history[item.history.length - 1].date : (item.initialDate || new Date().toISOString().split('T')[0]);
                  const isStandard = /^\d{4}-\d{2}/.test(itemDate);
                  const itemYear = isStandard ? itemDate.substring(0, 4) : currentYear.toString();

                  if (pastPainYear && itemYear !== pastPainYear) return false;
                  
                  if (pastPainMonth !== 'all') {
                    const itemMonth = isStandard 
                      ? itemDate.substring(5, 7) 
                      : String(new Date().getMonth() + 1).padStart(2, '0');
                    if (itemMonth !== pastPainMonth) return false;
                  }

                  return true;
                }).sort((a, b) => {
                  const getLatestDate = (item: any) => {
                    if (item.history && item.history.length > 0) return item.history[item.history.length - 1].date;
                    if (item.initialDate) return item.initialDate;
                    return new Date().toISOString().split('T')[0];
                  };
                  return new Date(getLatestDate(b)).getTime() - new Date(getLatestDate(a)).getTime();
                });

                return (
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-3">
                      <select
                        value={pastPainYear}
                        onChange={(e) => setPastPainYear(e.target.value)}
                        className="bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[var(--primary-color)] outline-none"
                      >
                        {years.map(year => (
                          <option key={year} value={year} className="bg-[#1e1e1e]">{year}년</option>
                        ))}
                      </select>
                      <select
                        value={pastPainMonth}
                        onChange={(e) => setPastPainMonth(e.target.value)}
                        className="bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[var(--primary-color)] outline-none"
                      >
                        <option value="all" className="bg-[#1e1e1e]">전체 월</option>
                        {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                          <option key={m} value={m} className="bg-[#1e1e1e]">{parseInt(m)}월</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      {filteredItems.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 font-medium">해당 기간에 완료된 부상 기록이 없습니다.</div>
                      ) : (
                        filteredItems.map(item => {
                          const isExpanded = expandedPastPainId === item.id;
                          const endDate = item.history && item.history.length > 0 ? item.history[item.history.length - 1].date : item.initialDate;
                          
                          return (
                            <div key={item.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden transition-all duration-300">
                              <div 
                                onClick={() => setExpandedPastPainId(isExpanded ? null : item.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.04)]"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">
                                    <span className="material-icons-round text-gray-400 text-[20px]">healing</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-gray-200 mb-1">{getPartName(item.id)}</span>
                                    <span className="text-[12px] font-medium text-gray-400 flex items-center gap-1.5">
                                      <span className="material-icons-round text-[14px]">calendar_today</span>
                                      {item.initialDate ? formatKoreanDate(item.initialDate) : ''} ~ {endDate ? formatKoreanDate(endDate) : ''}
                                      {item.diagnosis && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-gray-500 mx-1"></span>
                                          {item.diagnosis}
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => deletePastInjury(e, item.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center"
                                  >
                                    <span className="material-icons-round text-[18px]">delete</span>
                                  </button>
                                  <span className={`material-icons-round text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    expand_more
                                  </span>
                                </div>
                              </div>
                              
                              {isExpanded && (
                                <div className="p-4 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
                                  {item.treatmentPeriod && (
                                    <div>
                                      <span className="text-[12px] font-bold text-gray-500 block mb-1">예상 치료 기간</span>
                                      <p className="text-[14px] font-medium text-gray-300">{item.treatmentPeriod}</p>
                                    </div>
                                  )}
                                  {item.reason && (
                                    <div>
                                      <span className="text-[12px] font-bold text-gray-500 block mb-1">발생 원인 및 증상</span>
                                      <p className="text-[14px] font-medium text-gray-300 whitespace-pre-wrap leading-relaxed">{item.reason}</p>
                                    </div>
                                  )}
                                  
                                  {item.history && item.history.length > 0 && (
                                    <div>
                                      <span className="text-[12px] font-bold text-gray-500 block mb-3">경과 기록</span>
                                      <div className="flex flex-col gap-3">
                                        {item.history.map((h, i) => (
                                          <div key={i} className="flex gap-3 relative">
                                            {i !== item.history!.length - 1 && (
                                              <div className="absolute left-[3px] top-4 bottom-[-16px] w-[2px] bg-[rgba(255,255,255,0.1)]"></div>
                                            )}
                                            <div className="w-2 h-2 rounded-full bg-gray-500 mt-1.5 shrink-0 relative z-10"></div>
                                            <div className="flex flex-col flex-1 pb-1">
                                              <span className="text-[12px] font-bold text-gray-400 mb-1">{formatKoreanDate(h.date)} (통증 {h.level}단계)</span>
                                              <span className="text-[13px] text-gray-300">{h.reason}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* PAST TIMELINE MODAL */}
      {showPastTimelineModal && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-2xl rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                <span className="material-icons-round text-gray-400">history</span>
                지난 진료 기록
              </h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowPastTimelineModal(false)}>close</span>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {(() => {
                const pastItems = timelineItems.filter(item => item.type === 'past' || item.isDone);
                
                if (pastItems.length === 0) {
                  return (
                    <div className="py-12 text-center text-[12px] text-gray-400 font-medium bg-[rgba(255,255,255,0.02)] rounded-2xl border border-[rgba(255,255,255,0.05)]">
                      <span className="material-icons-round text-gray-600 text-4xl block mb-3">history</span>
                      완료된 진료 기록이 없습니다.
                    </div>
                  );
                }

                // Get available years
                const currentYear = new Date().getFullYear();
                const yearsSet = new Set<string>();
                for (let y = currentYear; y >= 2026; y--) {
                  yearsSet.add(y.toString());
                }
                pastItems.forEach(item => {
                  const y = item.dateLabel.substring(0, 4);
                  if (/^\d{4}$/.test(y)) {
                    yearsSet.add(y);
                  }
                });
                const years = Array.from(yearsSet).sort().reverse();
                
                // Filter by selected year and month
                const filteredItems = pastItems.filter(item => {
                  const isStandard = /^\d{4}-\d{2}/.test(item.dateLabel);
                  const itemYear = isStandard ? item.dateLabel.substring(0, 4) : currentYear.toString();
                  if (pastTimelineYear && itemYear !== pastTimelineYear) return false;
                  
                  if (pastTimelineMonth !== 'all') {
                    const itemMonth = isStandard 
                      ? item.dateLabel.substring(5, 7) 
                      : String(new Date().getMonth() + 1).padStart(2, '0');
                    if (itemMonth !== pastTimelineMonth) return false;
                  }
                  return true;
                }).sort((a, b) => {
                  const getTime = (label: string) => {
                    const t = new Date(label).getTime();
                    return isNaN(t) ? new Date().getTime() : t;
                  };
                  return getTime(b.dateLabel) - getTime(a.dateLabel);
                });

                return (
                  <div className="flex flex-col gap-6">
                    <div className="flex gap-3">
                      <select
                        value={pastTimelineYear}
                        onChange={(e) => setPastTimelineYear(e.target.value)}
                        className="bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[var(--primary-color)] outline-none"
                      >
                        {years.map(year => (
                          <option key={year} value={year} className="bg-[#1e1e1e]">{year}년</option>
                        ))}
                      </select>
                      <select
                        value={pastTimelineMonth}
                        onChange={(e) => setPastTimelineMonth(e.target.value)}
                        className="bg-[rgba(255,255,255,0.05)] text-white px-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.1)] text-sm font-bold focus:border-[var(--primary-color)] outline-none"
                      >
                        <option value="all" className="bg-[#1e1e1e]">전체 월</option>
                        {Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                          <option key={m} value={m} className="bg-[#1e1e1e]">{parseInt(m)}월</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-3">
                      {filteredItems.length === 0 ? (
                        <div className="py-8 text-center text-gray-500 font-medium">해당 기간에 완료된 기록이 없습니다.</div>
                      ) : (
                        filteredItems.map(item => {
                          const isExpanded = expandedPastItemId === item.id;
                          return (
                            <div key={item.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl overflow-hidden transition-all duration-300">
                              <div 
                                onClick={() => setExpandedPastItemId(isExpanded ? null : item.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-[rgba(255,255,255,0.04)]"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">
                                    <span className="material-icons-round text-gray-400 text-[20px]">event_available</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[14px] font-bold text-gray-200 mb-1">{item.title}</span>
                                    <span className="text-[12px] font-medium text-gray-400 flex items-center gap-1.5">
                                      <span className="material-icons-round text-[14px]">calendar_today</span>
                                      {formatKoreanDate(item.dateLabel)}
                                      {item.hospital && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-gray-500 mx-1"></span>
                                          {item.hospital}
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmModal({ isOpen: true, id: item.id, type: 'timeline' });
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center"
                                  >
                                    <span className="material-icons-round text-[18px]">delete</span>
                                  </button>
                                  <span className={`material-icons-round text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    expand_more
                                  </span>
                                </div>
                              </div>
                              
                              {isExpanded && (
                                <div className="p-4 border-t border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
                                  {item.time && (
                                    <div>
                                      <span className="text-[12px] font-bold text-gray-500 block mb-1">진료 시간</span>
                                      <p className="text-[14px] font-medium text-gray-300">{formatTimeStr(item.time)}</p>
                                    </div>
                                  )}
                                  {item.notes ? (
                                    <div>
                                      <span className="text-[12px] font-bold text-gray-500 block mb-1">상세 기록</span>
                                      <p className="text-[14px] font-medium text-gray-300 whitespace-pre-wrap leading-relaxed">{item.notes}</p>
                                    </div>
                                  ) : (
                                    <p className="text-[13px] text-gray-500 italic">상세 기록이 없습니다.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      {showTimelineModal && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-lg rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
              <h4 className="text-[14px] font-bold text-white flex items-center gap-2">
                <span className="material-icons-round text-gray-400">event_note</span>
                {editingTimelineItem ? '진료 기록 수정' : '진료 기록 추가'}
              </h4>
              <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => setShowTimelineModal(false)}>close</span>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-[12px]">
              {timelineFormError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold rounded-xl p-3">
                  {timelineFormError}
                </div>
              )}

              {/* Hospital */}
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">병원명</label>
                <input
                  type="text"
                  value={timelineFormHospital}
                  onChange={(e) => setTimelineFormHospital(e.target.value)}
                  placeholder="예: JS정형외과"
                  className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none"
                />
              </div>

              {/* Title */}
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">일정명 / 진료 기록 내용</label>
                <input
                  type="text"
                  value={timelineFormTitle}
                  onChange={(e) => setTimelineFormTitle(e.target.value)}
                  placeholder="예: 우측 어깨 MRI 재촬영"
                  className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none"
                />
              </div>

              {/* Date Label */}
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">진료 일자</label>
                <input
                  type="date"
                  value={timelineFormDateLabel}
                  onChange={(e) => setTimelineFormDateLabel(e.target.value)}
                  max="9999-12-31"
                />
              </div>

              {/* Time */}
              {timelineFormType === 'upcoming' && (
                <div>
                  <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">시간</label>
                  <div 
                    onClick={() => {
                      if (timelineFormTime) {
                        const [h, m] = timelineFormTime.split(':');
                        let hourInt = parseInt(h || '09', 10);
                        let isPM = hourInt >= 12;
                        if (hourInt > 12) hourInt -= 12;
                        if (hourInt === 0) hourInt = 12;
                        setTempHour(hourInt.toString().padStart(2, '0'));
                        setTempMinute(m || '00');
                        setTempAmPm(isPM ? 'PM' : 'AM');
                      } else {
                        setTempHour('09');
                        setTempMinute('00');
                        setTempAmPm('AM');
                      }
                      setShowCustomTimeModal(true);
                    }}
                    className="relative flex items-center gap-3 w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-2 px-2 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer transition-colors min-h-[46px]"
                  >
                    <div className="bg-[rgba(255,255,255,0.1)] text-white text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-none">
                      {timelineFormTime ? '수정' : '시간 입력'}
                    </div>
                    {timelineFormTime && (
                      <span className="text-white text-sm pointer-events-none">
                        {formatTimeStr(timelineFormTime)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">상세 메모 / 후속 대처</label>
                <textarea
                  value={timelineFormNotes}
                  onChange={(e) => setTimelineFormNotes(e.target.value)}
                  placeholder="메모를 남겨주세요..."
                  className="w-full text-[13px] border border-[var(--primary-color)] rounded-xl p-3 bg-[rgba(255,255,255,0.05)] text-white focus:outline-none resize-none h-24 placeholder-gray-600 transition-all"
                />
              </div>

              {/* Is Done Toggle */}
              {timelineFormType !== 'upcoming' && (
                <div>
                  <label className="flex items-center gap-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-3.5 cursor-pointer hover:border-[rgba(255,255,255,0.1)] transition-colors">
                    <input
                      type="checkbox"
                      checked={timelineFormIsDone}
                      onChange={(e) => setTimelineFormIsDone(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-black text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                    />
                    <span className="text-sm text-gray-300">확인 완료 / 조치 완료</span>
                  </label>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 pb-6 mt-[12px] flex gap-3 shrink-0">
              {editingTimelineItem ? (
                <>
                  <button 
                    onClick={handleDeleteTimelineItem}
                    className="flex-1 border border-[rgba(255,255,255,0.08)] rounded-xl text-gray-400 hover:bg-[rgba(255,255,255,0.05)] hover:text-white font-bold transition-colors h-[30px] flex items-center justify-center text-[14px]"
                  >
                    삭제
                  </button>
                  <button 
                    onClick={handleSaveTimelineItem}
                    className="flex-1 btn-primary rounded-xl font-bold transition-all h-[30px] flex items-center justify-center text-[14px]"
                  >
                    저장
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleSaveTimelineItem}
                  className="w-full btn-primary rounded-xl font-bold transition-all h-[30px] flex items-center justify-center text-[14px]"
                >
                  저장
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto overflow-x-hidden bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-2 text-center">항목 삭제</h3>
            <p className="text-gray-400 text-sm text-center mb-6">정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmModal({ isOpen: false, id: null, type: null })} 
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                취소
              </button>
              <button 
                onClick={confirmDelete} 
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

