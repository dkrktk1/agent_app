import React, { useState, useEffect } from 'react';
import CareTab from './CareTab';
import MedicalTab from './MedicalTab';
import BizTab from './BizTab';
import ScheduleTab from './ScheduleTab';
import MyPageTab from './MyPageTab';
import { getComprehensiveStatus } from './ComprehensiveStatusDashboard';
import { BASE_PLAYER_TEMPLATE } from '../data';
import { savePlayerProfile, getPlayerProfile } from '../lib/api';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function MainApp({ currentUser, onLogout }: { currentUser: any, onLogout: () => void }) {
  const isAgent = currentUser.role === 'agent';
  const [allPlayers, setAllPlayers] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const [activePlayerId, setActivePlayerId] = useState<string | null>(
    isAgent ? null : currentUser.userId
  );
  
  const [activeTab, setActiveTab] = useState('care');

  const handleTabChangeClick = (tab: string) => {
    if (activeTab === tab) return;
    window.scrollTo(0, 0);
    window.history.pushState({ tab, playerId: activePlayerId }, '');
    setActiveTab(tab);
  };

  const handlePlayerChangeClick = (playerId: string | null) => {
    if (activePlayerId === playerId) return;
    window.scrollTo(0, 0);
    window.history.pushState({ tab: activeTab, playerId }, '');
    setActivePlayerId(playerId);
  };

  useEffect(() => {
    const handleEventTabChange = (e: any) => {
      const newTab = e.detail;
      if (activeTab !== newTab) {
        window.scrollTo(0, 0);
        window.history.pushState({ tab: newTab, playerId: activePlayerId }, '');
        setActiveTab(newTab);
      }
    };
    window.addEventListener('changeTab', handleEventTabChange);
    return () => window.removeEventListener('changeTab', handleEventTabChange);
  }, [activeTab, activePlayerId]);

  useEffect(() => {
    window.history.replaceState({ tab: activeTab, playerId: activePlayerId }, '');

    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        if (e.state.tab) setActiveTab(e.state.tab);
        if (e.state.playerId !== undefined) setActivePlayerId(e.state.playerId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  useEffect(() => {
    const fetchPlayers = async () => {
      const playersData: any = {};
      try {
        // If current user is a player, pre-populate with their data
        if (!isAgent && currentUser?.userId) {
          playersData[currentUser.userId] = {
            ...BASE_PLAYER_TEMPLATE,
            ...currentUser,
            id: currentUser.userId,
            name: currentUser.playerName || currentUser.name,
            team: currentUser.playerTeam || currentUser.team,
            age: currentUser.playerBirthdate || currentUser.age,
            position: currentUser.playerPosition || currentUser.position,
            number: currentUser.playerNumber || currentUser.number,
            handedness: currentUser.playerHandedness || currentUser.handedness,
            salary: currentUser.playerSalary || currentUser.salary,
          };
        }

        // Merge from localStorage as a baseline (fallback)
        const localUsers = JSON.parse(localStorage.getItem("ag_users") || "[]");
        localUsers.forEach((data: any) => {
          if (data.role === 'player') {
            const pId = data.userId || data.id;
            if (pId) {
              playersData[pId] = {
                ...BASE_PLAYER_TEMPLATE,
                ...data,
                id: pId,
                name: data.playerName || data.name,
                team: data.playerTeam || data.team,
                age: data.playerBirthdate || data.age,
                position: data.playerPosition || data.position,
                number: data.playerNumber || data.number,
                handedness: data.playerHandedness || data.handedness,
                salary: data.playerSalary || data.salary,
              };
            }
          }
        });

        const q = query(collection(db, 'users'), where('role', '==', 'player'));
        const snapshot = await getDocs(q);
        snapshot.forEach(doc => {
          const data = doc.data();
          const pId = data.userId || doc.id;
          if (pId) {
            playersData[pId] = {
              ...BASE_PLAYER_TEMPLATE,
              ...playersData[pId], // Keep any locally generated structure if exists
              ...data,
              id: pId,
              name: data.playerName || data.name,
              team: data.playerTeam || data.team,
              age: data.playerBirthdate || data.age,
              position: data.playerPosition || data.position,
              number: data.playerNumber || data.number,
              handedness: data.playerHandedness || data.handedness,
              salary: data.playerSalary || data.salary,
            };
          }
        });
        setAllPlayers(playersData);
      } catch (e) {
        console.error("Error fetching players", e);
        // Fallback: If query fails (e.g., offline or permission denied), ensure the player can still see themselves
        if (!isAgent && currentUser?.userId) {
          const fallbackData = {
            ...playersData,
            [currentUser.userId]: {
              ...BASE_PLAYER_TEMPLATE,
              ...currentUser,
              id: currentUser.userId,
              name: currentUser.playerName || currentUser.name,
              team: currentUser.playerTeam || currentUser.team,
              age: currentUser.playerBirthdate || currentUser.age,
              position: currentUser.playerPosition || currentUser.position,
              number: currentUser.playerNumber || currentUser.number,
              handedness: currentUser.playerHandedness || currentUser.handedness,
              salary: currentUser.playerSalary || currentUser.salary,
            }
          };
          setAllPlayers(fallbackData);
        } else {
          setAllPlayers(playersData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlayers();
  }, []);

  const activePlayer = activePlayerId ? (allPlayers[activePlayerId] || (!isAgent && activePlayerId === currentUser.userId ? {
    ...BASE_PLAYER_TEMPLATE,
    ...currentUser,
    id: currentUser.userId,
    name: currentUser.playerName || currentUser.name,
    team: currentUser.playerTeam || currentUser.team,
    age: currentUser.playerBirthdate || currentUser.age,
    position: currentUser.playerPosition || currentUser.position,
    number: currentUser.playerNumber || currentUser.number,
    handedness: currentUser.playerHandedness || currentUser.handedness,
    salary: currentUser.playerSalary || currentUser.salary,
  } : null)) : null;

  useEffect(() => {
    if (activePlayerId && !allPlayers[activePlayerId] && !isLoading) {
      setActivePlayerId(isAgent ? null : currentUser.userId);
    }
  }, [activePlayerId, allPlayers, isAgent, currentUser, isLoading]);

  const updatePlayer = (id: string, newPlayerData: any) => {
    const updated = { ...allPlayers, [id]: newPlayerData };
    setAllPlayers(updated);
    
    // Save to Firebase
    savePlayerProfile(id, newPlayerData).catch(e => {
      console.error("Error saving player", e);
    });
  };

  const formatPlayerAge = (p: any) => {
    let ageStr = p.age || '';
    if (ageStr && ageStr.includes('-')) {
      const today = new Date();
      const birthDate = new Date(ageStr);
      let calcAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calcAge--;
      }
      return `${ageStr} (${calcAge}세)`;
    }
    return ageStr;
  };


  const createSamplePlayer = () => {
    const today = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${month}/${day}`);
    }

    const sampleId = `sample_${Date.now()}`;
    const samplePlayer = {
      ...BASE_PLAYER_TEMPLATE,
      id: sampleId,
      name: "김샘플",
      team: "서울 스나이퍼스",
      age: "1995-05-15",
      position: "투수",
      number: "42",
      handedness: "우투우타",
      salary: "150,000,000원",
      role: "player",
      status: "warning",
      profileImg: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=150",
      metrics: {
        acwr: 1.4,
        grip: -5,
        hrv: 55,
        rpe: 7,
        weight: 85,
        weightTarget: 83,
        gripRaw: 45,
        gripBaseline: 50,
        sleep: 5.5
      },
      acwrGraphData: [
        { date: dates[0], acwr: 0.9 },
        { date: dates[1], acwr: 1.0 },
        { date: dates[2], acwr: 1.1 },
        { date: dates[3], acwr: 1.2 },
        { date: dates[4], acwr: 1.1 },
        { date: dates[5], acwr: 1.3 },
        { date: dates[6], acwr: 1.4 }
      ],
      sleepChartData: [
        { date: dates[0], sleepDuration: 8.0 },
        { date: dates[1], sleepDuration: 7.5 },
        { date: dates[2], sleepDuration: 7.0 },
        { date: dates[3], sleepDuration: 6.5 },
        { date: dates[4], sleepDuration: 8.0 },
        { date: dates[5], sleepDuration: 6.0 },
        { date: dates[6], sleepDuration: 5.5 }
      ],
      gripChartData: {
        labels: dates.slice(-4),
        values: [48, 49, 46, 45],
        leftValues: [47, 48, 45, 44],
        rightValues: [49, 50, 47, 46]
      }
    };
    updatePlayer(sampleId, samplePlayer);
  };

  const formatPlayerDetails = (p: any) => {
    const teamNum = p.number ? `${p.team} No.${p.number}` : p.team;
    const parts = [
      teamNum,
      p.position,
      p.handedness
    ].filter(Boolean);
    return parts.join(' • ');
  };

  const renderPlayerList = () => (
    <div className="animate-fade-in">
      <div className="section-title-group flex justify-between items-end">
        <h3>가입된 선수 목록</h3>
        <button 
          onClick={createSamplePlayer}
          className="text-xs bg-[rgba(0,229,255,0.1)] text-[#00E5FF] px-3 py-1.5 rounded-lg border border-[rgba(0,229,255,0.2)] hover:bg-[rgba(0,229,255,0.2)] transition-colors font-bold"
        >
          + 샘플 선수 추가
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(allPlayers).map((p: any, index: number) => (
          <div 
            key={p.id || `player-${index}`} 
            className="player-summary-card cursor-pointer hover:border-[#00E5FF] transition-colors h-full mb-0" 
            onClick={() => handlePlayerChangeClick(p.id)}
          >
            <div className="summary-avatar-container">
              {p.profileImg ? (
                <img src={p.profileImg} alt={p.name} className="player-profile-img" />
              ) : (
                <div className="player-profile-img flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
                  <span className="material-icons-round text-[64px] text-[var(--text-muted)]">person</span>
                </div>
              )}
              <div className={`player-status-dot ${p.status}`}></div>
            </div>
            <div className="summary-info">
              <h2>{p.name}</h2>
              <p className="text-xs text-[var(--text-muted)] mb-1">{formatPlayerAge(p)}</p>
              <p className="text-xs text-[var(--text-muted)]">{formatPlayerDetails(p)}</p>
              <div className="player-badges mt-2">
                {(() => {
                  const acwr = p.metrics?.acwr || 1.0;
                  const sleep = p.metrics?.sleep || 6.0;
                  
                  const leftValues = p.gripChartData?.leftValues || [];
                  const gripLeftToday = leftValues[leftValues.length - 1] || 50;
                  const gripLeftBaseline = leftValues[0] || 50;
                  const leftChange = gripLeftBaseline !== 0 ? ((gripLeftToday - gripLeftBaseline) / gripLeftBaseline) * 100 : 0;
                  
                  const rightValues = p.gripChartData?.rightValues || [];
                  const gripRightToday = rightValues[rightValues.length - 1] || 50;
                  const gripRightBaseline = rightValues[0] || 50;
                  const rightChange = gripRightBaseline !== 0 ? ((gripRightToday - gripRightBaseline) / gripRightBaseline) * 100 : 0;
                  
                  const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, false);
                  
                  return (
                    <span className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-bold leading-none border ${statusInfo.badgeColor} ${statusInfo.borderColor}`}>
                      <span className="material-icons-round !text-[14px]">{statusInfo.icon}</span>
                      {statusInfo.badgeText}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div id="main-app-screen" className="app-screen active">
      <header className="app-header flex items-center justify-between" style={{ height: 'auto', minHeight: 'auto', padding: 'max(16px, env(safe-area-inset-top)) 16px 12px 16px' }}>
        <div className="flex items-center">
          <img 
            src="data:image/png;base64,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" 
            alt="Logo" 
            className="object-contain h-[32px] w-auto rounded-xl" 
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--primary-color)]/10 text-[var(--primary-color)] border border-[var(--primary-color)]/20">
            {isAgent ? '에이전트 권한' : '선수 연동 포탈'}
          </span>
          <button id="btn-logout" className="btn-icon-only p-1" onClick={onLogout}>
            <span className="material-icons-round text-white hover:text-red-400 transition-colors">logout</span>
          </button>
        </div>
      </header>

      <main className="app-content">
        {(activeTab === 'care' || activeTab === 'medical' || activeTab === 'biz' || activeTab === 'schedule') && activePlayerId && activePlayer && (
          <div className="animate-fade-in flex flex-col gap-4">
            {isAgent && (
              <button className="flex items-center text-[var(--text-muted)] hover:text-white transition-colors" onClick={() => handlePlayerChangeClick(null)}>
                <span className="material-icons-round mr-1">arrow_back</span>
                <span>선수 목록으로 돌아가기</span>
              </button>
            )}
            <div className="player-summary-card">
              <div className="summary-avatar-container">
                {activePlayer.profileImg ? (
                  <img src={activePlayer.profileImg} alt="선수" className="player-profile-img" />
                ) : (
                  <div className="player-profile-img flex items-center justify-center bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)]">
                    <span className="material-icons-round text-[64px] text-[var(--text-muted)]">person</span>
                  </div>
                )}
                <div className={`player-status-dot ${activePlayer.status}`}></div>
              </div>
              <div className="summary-info">
                <h2>{activePlayer.name}</h2>
                <p className="text-xs text-[var(--text-muted)] mb-1">{formatPlayerAge(activePlayer)}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatPlayerDetails(activePlayer)}</p>
                <div className="player-badges mt-2">
                  {(() => {
                    const acwr = activePlayer.metrics?.acwr || 1.0;
                    const sleep = activePlayer.metrics?.sleep || 6.0;
                    
                    const leftValues = activePlayer.gripChartData?.leftValues || [];
                    const gripLeftToday = leftValues[leftValues.length - 1] || 50;
                    const gripLeftBaseline = leftValues[0] || 50;
                    const leftChange = gripLeftBaseline !== 0 ? ((gripLeftToday - gripLeftBaseline) / gripLeftBaseline) * 100 : 0;
                    
                    const rightValues = activePlayer.gripChartData?.rightValues || [];
                    const gripRightToday = rightValues[rightValues.length - 1] || 50;
                    const gripRightBaseline = rightValues[0] || 50;
                    const rightChange = gripRightBaseline !== 0 ? ((gripRightToday - gripRightBaseline) / gripRightBaseline) * 100 : 0;
                    
                    const statusInfo = getComprehensiveStatus(acwr, sleep, leftChange, rightChange, false);
                    
                    return (
                      <span className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-bold leading-none border ${statusInfo.badgeColor} ${statusInfo.borderColor}`}>
                        <span className="material-icons-round !text-[14px]">{statusInfo.icon}</span>
                        {statusInfo.badgeText}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'care' && (
          isAgent && (!activePlayerId || !activePlayer) ? renderPlayerList() : activePlayer ? (
            <CareTab 
              key={`care-${activePlayer.id}`}
              player={activePlayer} 
              isAgent={isAgent}
              onUpdatePlayer={(newData) => updatePlayer(activePlayerId!, newData)} 
            />
          ) : null
        )}

        {activeTab === 'medical' && (
          isAgent && (!activePlayerId || !activePlayer) ? renderPlayerList() : activePlayer ? (
            <MedicalTab 
              key={`medical-${activePlayer.id}`}
              player={activePlayer} 
              isAgent={isAgent}
              onUpdatePlayer={(newData) => updatePlayer(activePlayerId!, newData)}
            />
          ) : null
        )}
        
        {activeTab === 'biz' && (
          isAgent && (!activePlayerId || !activePlayer) ? renderPlayerList() : activePlayer ? (
            <BizTab 
              key={`biz-${activePlayer.id}`}
              player={activePlayer} 
              isAgent={isAgent}
              onUpdatePlayer={(newData) => updatePlayer(activePlayerId!, newData)} 
            />
          ) : null
        )}

        {activeTab === 'schedule' && (
          isAgent && (!activePlayerId || !activePlayer) ? renderPlayerList() : activePlayer ? (
            <ScheduleTab 
              key={`schedule-${activePlayer.id}`}
              player={activePlayer} 
              isAgent={isAgent}
              onUpdatePlayer={(newData) => updatePlayer(activePlayerId!, newData)}
            />
          ) : null
        )}

        {activeTab === 'mypage' && (
          <MyPageTab 
            currentUser={currentUser} 
            playersCount={Object.keys(allPlayers).length} 
            allPlayers={allPlayers}
            onUpdatePlayerProfile={async (id, newData) => {
              const updated = { ...allPlayers, [id]: { ...allPlayers[id], ...newData } };
              setAllPlayers(updated);
              
              let users = JSON.parse(localStorage.getItem("ag_users") || "[]");
              const userIdx = users.findIndex((u: any) => u.userId === id || u.linkedPlayer === id);
              if (userIdx !== -1) {
                users[userIdx] = { ...users[userIdx], ...newData };
                try {
                  localStorage.setItem("ag_users", JSON.stringify(users));
                } catch(e) {}
              }
              try {
                await savePlayerProfile(id, { ...allPlayers[id], ...newData });
              } catch(e) {}
            }}
            onDeletePlayer={async (id) => {
              const updated = { ...allPlayers };
              delete updated[id];
              setAllPlayers(updated);
              
              // Delete from ag_users
              let users = JSON.parse(localStorage.getItem("ag_users") || "[]");
              users = users.filter((u: any) => u.userId !== id && u.linkedPlayer !== id);
              try {
                localStorage.setItem("ag_users", JSON.stringify(users));
              } catch(e) {}
              
              try {
                // Should delete from firebase too but keep simple
              } catch(e) {}
            }}
            onLogout={onLogout} 
          />
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'care' ? 'active' : ''}`} onClick={() => handleTabChangeClick('care')}>
          <span className="material-icons-round">monitor_heart</span>
          <div className="text-[10px] leading-tight mt-1 font-medium">컨디션</div>
        </button>
        <button className={`nav-item ${activeTab === 'medical' ? 'active' : ''}`} onClick={() => handleTabChangeClick('medical')}>
          <span className="material-icons-round">medical_services</span>
          <div className="text-[10px] leading-tight mt-1 font-medium">메디컬</div>
        </button>
        <button className={`nav-item ${activeTab === 'biz' ? 'active' : ''}`} onClick={() => handleTabChangeClick('biz')}>
          <span className="material-icons-round">handshake</span>
          <div className="text-[10px] leading-tight mt-1 font-medium">비즈니스</div>
        </button>
        <button className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => handleTabChangeClick('schedule')}>
          <span className="material-icons-round">calendar_month</span>
          <div className="text-[10px] leading-tight mt-1 font-medium">일정</div>
        </button>
        <button className={`nav-item ${activeTab === 'mypage' ? 'active' : ''}`} onClick={() => handleTabChangeClick('mypage')}>
          <span className="material-icons-round">person</span>
          <div className="text-[10px] leading-tight mt-1 font-medium">마이페이지</div>
        </button>
      </nav>
    </div>
  );
}
