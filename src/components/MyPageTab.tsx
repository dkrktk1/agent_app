import React, { useState } from 'react';
import { formatKoreanCurrency } from '../utils';

export default function MyPageTab({ currentUser, playersCount, allPlayers, onUpdatePlayerProfile, onDeletePlayer, onLogout }: { currentUser: any, playersCount: number, allPlayers?: any, onUpdatePlayerProfile?: (id: string, data: any) => void, onDeletePlayer?: (id: string) => void, onLogout: () => void }) {
  const isAgent = currentUser.role === 'agent';
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTeam, setEditTeam] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editNumber, setEditNumber] = useState('');
  const [editHandedness, setEditHandedness] = useState('');
  const [editBirthdate, setEditBirthdate] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editProfileImg, setEditProfileImg] = useState('');

  // Group players by team if isAgent and allPlayers exists
  const teamGroups: Record<string, any[]> = {};
  if (isAgent && allPlayers) {
    Object.values(allPlayers).forEach((p: any) => {
      const team = p.playerTeam || p.team || '기타';
      if (!teamGroups[team]) teamGroups[team] = [];
      teamGroups[team].push(p);
    });
  }

  const activeUser = !isAgent && allPlayers ? (allPlayers[currentUser.userId] || currentUser) : currentUser;

  const handlePlayerClick = (p: any, isEdit: boolean = false) => {
    setSelectedPlayer(p);
    setEditingPlayerId(p.id);
    setIsEditMode(isEdit);
    setShowDeleteConfirm(false);
    
    // Try to get original user data from ag_users
    let originalData: any = null;
    try {
      const users = JSON.parse(localStorage.getItem("ag_users") || "[]");
      originalData = users.find((u: any) => u.userId === p.id || u.linkedPlayer === p.id);
    } catch (e) {}

    if (originalData) {
      setEditName(originalData.playerName || p.playerName || p.name || '');
      setEditTeam(originalData.playerTeam || p.playerTeam || p.team || '');
      setEditPosition(originalData.playerPosition || p.playerPosition || p.position || '');
      setEditNumber(originalData.playerNumber || p.playerNumber || p.backNumber || p.number || '');
      setEditHandedness(originalData.playerHandedness || p.playerHandedness || p.handedness || '');
      setEditBirthdate(originalData.playerBirthdate || p.playerBirthdate || p.age || '');
      setEditSalary(originalData.playerSalary || p.playerSalary || p.salary || '');
      setEditProfileImg(originalData.profileImg || p.profileImg || '');
    } else {
      setEditName(p.playerName || p.name || '');
      setEditTeam(p.playerTeam || p.team || '');
      setEditPosition(p.playerPosition || p.position || '');
      setEditNumber(p.playerNumber || p.backNumber || p.number || '');
      setEditHandedness(p.playerHandedness || p.handedness || '');
      setEditBirthdate(p.playerBirthdate || p.age || '');
      setEditSalary(p.playerSalary || p.salary || '');
      setEditProfileImg(p.profileImg || '');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setEditProfileImg(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (editingPlayerId && onUpdatePlayerProfile) {
      onUpdatePlayerProfile(editingPlayerId, {
        name: editName,
        playerName: editName,
        playerTeam: editTeam,
        team: editTeam,
        position: editPosition,
        playerPosition: editPosition,
        playerNumber: editNumber,
        number: editNumber,
        backNumber: editNumber,
        playerHandedness: editHandedness,
        handedness: editHandedness,
        playerBirthdate: editBirthdate,
        age: editBirthdate,
        playerSalary: editSalary,
        salary: editSalary,
        profileImg: editProfileImg
      });
      setEditingPlayerId(null);
      setSelectedPlayer(null);
    }
  };

  const handleDeleteProfile = () => {
    if (editingPlayerId && onDeletePlayer) {
      if (!showDeleteConfirm) {
        setShowDeleteConfirm(true);
      } else {
        onDeletePlayer(editingPlayerId);
        setEditingPlayerId(null);
        setSelectedPlayer(null);
        setShowDeleteConfirm(false);
      }
    }
  };

  return (
    <div className="tab-pane active pb-20">
      <div className="mypage-card">
        <div className="mypage-avatar">
          {activeUser.profileImg ? (
            <img src={activeUser.profileImg} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="material-icons-round">person</span>
          )}
        </div>
        <h3>{isAgent ? currentUser.userId : (activeUser.playerName || activeUser.name || currentUser.userId)}</h3>
        <p className={`role-badge ${!isAgent ? 'pitcher-color' : ''}`}>
          {isAgent ? '에이전트 권한' : '선수 계정'}
        </p>
        
        <div className="divider"></div>
        
        <div className="mypage-info-list mb-6">
          <div className="info-item">
            <span>소속 에이전시</span>
            <strong>나우아이원매니지먼트그룹</strong>
          </div>
          {isAgent ? (
            <div className="info-item">
              <span>케어 중인 선수 수</span>
              <strong>{playersCount}명</strong>
            </div>
          ) : (
            <>
              <div className="info-item">
                <span>소속 구단</span>
                <strong>{activeUser.playerTeam || activeUser.team || '-'}</strong>
              </div>
              <div className="info-item">
                <span>포지션</span>
                <strong>{activeUser.playerPosition || activeUser.position || '-'}</strong>
              </div>
              <div className="info-item">
                <span>등번호</span>
                <strong>{activeUser.playerNumber || activeUser.backNumber || activeUser.number ? `No.${activeUser.playerNumber || activeUser.backNumber || activeUser.number}` : '-'}</strong>
              </div>
              <div className="info-item">
                <span>투타</span>
                <strong>{activeUser.playerHandedness || activeUser.handedness || '-'}</strong>
              </div>
              <div className="info-item">
                <span>생년월일</span>
                <strong>
                  {activeUser.playerBirthdate || activeUser.age 
                    ? `${activeUser.playerBirthdate || activeUser.age} (${
                        (() => {
                          const today = new Date();
                          const birthDate = new Date(activeUser.playerBirthdate || activeUser.age);
                          let age = today.getFullYear() - birthDate.getFullYear();
                          const m = today.getMonth() - birthDate.getMonth();
                          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                          }
                          return age;
                        })()
                      }세)`
                    : '-'}
                </strong>
              </div>
              <div className="info-item">
                <span>연봉</span>
                <strong>{formatKoreanCurrency(activeUser.playerSalary || activeUser.salary)}</strong>
              </div>
            </>
          )}
          <div className="info-item">
            <span>가입일</span>
            <strong>{new Date().toISOString().split('T')[0]}</strong>
          </div>
        </div>

        {!isAgent && (
          <button className="btn-primary w-full mb-3" onClick={() => handlePlayerClick({ ...activeUser, id: activeUser.id || activeUser.userId }, true)}>
            프로필 수정
          </button>
        )}

        {isAgent && Object.keys(teamGroups).length > 0 && (
          <div className="mb-8">
            <h4 className="text-[var(--text-muted)] font-bold text-sm mb-5 tracking-wide uppercase">구단별 소속 선수</h4>
            <div className="flex flex-col">
              {Object.keys(teamGroups).sort().map(teamName => (
                <div key={teamName} className="card-chart flex flex-col">
                  <div className="text-center pb-3 mb-2 border-b border-[var(--card-border)]">
                    <span className="font-bold text-[var(--primary-color)]">{teamName}</span>
                    <span className="text-[var(--text-muted)] text-sm ml-2">({teamGroups[teamName].length}명)</span>
                  </div>
                  <div className="flex flex-col divide-y divide-[var(--card-border)]">
                    {teamGroups[teamName].map((p: any) => (
                      <div 
                        key={p.id}
                        className="py-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handlePlayerClick(p)}
                      >
                        <div className="flex items-center gap-3">
                          {p.profileImg ? (
                            <img src={p.profileImg} alt={p.name} className="w-10 h-10 rounded-full object-cover border border-[rgba(255,255,255,0.1)]" />
                          ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)]">
                              <span className="material-icons-round text-xl">person</span>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white mb-0.5 flex items-center gap-2">
                              {p.name}
                              {p.playerNumber && <span className="text-xs text-[var(--text-muted)] font-mono">No.{p.playerNumber}</span>}
                            </div>
                            <div className="text-[13px] text-gray-400">{p.position || p.playerPosition || '-'}</div>
                          </div>
                        </div>
                        <div 
                          className="p-1 -mr-1 rounded-full hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlayerClick(p, true);
                          }}
                        >
                          <span className="material-icons-round text-gray-500 text-[20px]">edit</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn-danger w-full" onClick={onLogout}>로그아웃</button>
      </div>

      {editingPlayerId && selectedPlayer && (
        <div className="modal active z-50">
          <div className="modal-content-wide max-w-sm overflow-hidden">
            {!isEditMode ? (
              <>
                <div className="modal-header shrink-0">
                  <h4>선수 프로필</h4>
                  <div className="flex gap-2 items-center">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(true)} title="수정">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>edit</span>
                    </button>
                    <span className="material-icons-round close-btn" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); }}>close</span>
                  </div>
                </div>
                <div className="modal-body flex-1 min-h-0 flex flex-col items-center py-6 overflow-y-auto">
                  {selectedPlayer.profileImg ? (
                    <img src={selectedPlayer.profileImg} alt={selectedPlayer.name} className="w-24 h-24 rounded-full object-cover border-4 border-[rgba(255,255,255,0.1)] shadow-lg mb-4 shrink-0" />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] shadow-lg mb-4 shrink-0">
                      <span className="material-icons-round text-5xl">person</span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2 shrink-0">
                    {editName}
                    {editNumber && <span className="text-[var(--text-muted)] text-base font-normal">No.{editNumber}</span>}
                  </h3>
                  <p className="text-[var(--primary-color)] text-sm font-semibold mb-6 shrink-0">{editTeam || '-'}</p>
                  
                  <div className="card-chart m-0 w-full flex flex-col gap-0 divide-y divide-[var(--card-border)] shrink-0">
                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">포지션</span>
                      <span className="font-semibold text-sm text-white">{editPosition || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">투타</span>
                      <span className="font-semibold text-sm text-white">{editHandedness || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">생년월일</span>
                      <span className="font-semibold text-sm text-white">{editBirthdate || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">연봉</span>
                      <span className="font-semibold text-sm text-white">{formatKoreanCurrency(editSalary)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="modal-header shrink-0">
                  <div className="flex items-center gap-2">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(false)} title="뒤로가기">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_back</span>
                    </button>
                    <h4>선수 프로필 수정</h4>
                  </div>
                  <span className="material-icons-round close-btn" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); setIsEditMode(false); }}>close</span>
                </div>
                <div className="modal-body flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto pb-6 px-1">
                  <div className="flex flex-col items-center gap-2 mb-2 shrink-0">
                    <label className="relative cursor-pointer group">
                      {editProfileImg ? (
                        <img src={editProfileImg} alt="프로필 사진" className="w-20 h-20 rounded-full object-cover border-2 border-[rgba(255,255,255,0.1)] group-hover:opacity-70 transition-opacity" />
                      ) : (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] text-[var(--text-muted)] group-hover:opacity-70 transition-opacity">
                          <span className="material-icons-round text-4xl">person</span>
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-icons-round text-white">photo_camera</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                    <span className="text-xs text-[var(--text-muted)]">프로필 사진 변경</span>
                  </div>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">person</span>
                    <input type="text" placeholder="이름" value={editName} onChange={e => setEditName(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label>소속 구단</label>
                    <select value={editTeam} onChange={e => setEditTeam(e.target.value)} required>
                      <option value="" disabled>소속구단 선택</option>
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
                  <div className="input-group-select !mb-0">
                    <label>포지션</label>
                    <select value={editPosition} onChange={e => setEditPosition(e.target.value)} required>
                      <option value="" disabled>포지션 선택</option>
                      <option value="투수">투수</option>
                      <option value="선발투수">선발투수</option>
                      <option value="구원투수">구원투수</option>
                      <option value="마무리투수">마무리투수</option>
                      <option value="포수">포수</option>
                      <option value="내야수">내야수</option>
                      <option value="1루수">1루수</option>
                      <option value="2루수">2루수</option>
                      <option value="3루수">3루수</option>
                      <option value="유격수">유격수</option>
                      <option value="외야수">외야수</option>
                      <option value="좌익수">좌익수</option>
                      <option value="중견수">중견수</option>
                      <option value="우익수">우익수</option>
                      <option value="지명타자">지명타자</option>
                    </select>
                  </div>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">tag</span>
                    <input type="text" placeholder="등번호 (예: 11)" value={editNumber} onChange={e => setEditNumber(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label>투타</label>
                    <select value={editHandedness} onChange={e => setEditHandedness(e.target.value)} required>
                      <option value="" disabled>투타 선택</option>
                      <option value="우투우타">우투우타</option>
                      <option value="우투좌타">우투좌타</option>
                      <option value="좌투좌타">좌투좌타</option>
                      <option value="좌투우타">좌투우타</option>
                      <option value="우투양타">우투양타</option>
                      <option value="좌투양타">좌투양타</option>
                    </select>
                  </div>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">calendar_today</span>
                    <input type="date" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">payments</span>
                    <input type="number" placeholder="연봉 (단위: 원)" value={editSalary} onChange={e => setEditSalary(e.target.value)} />
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2 shrink-0">
                    {showDeleteConfirm ? (
                      <>
                        <div className="text-[#FF3B30] text-sm text-center mb-2 font-bold">정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</div>
                        <div className="flex gap-2">
                          <button className="btn-action-outline flex-1 text-white border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setShowDeleteConfirm(false)}>취소</button>
                          <button className="btn-primary flex-1 bg-[#FF3B30] hover:bg-[#FF453A]" onClick={handleDeleteProfile}>정말 삭제하기</button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        {isAgent && (
                          <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white" onClick={handleDeleteProfile}>삭제</button>
                        )}
                        <button className="btn-primary flex-1" onClick={handleSaveProfile}>저장하기</button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
