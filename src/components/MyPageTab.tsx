import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
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
  const [editJoinYear, setEditJoinYear] = useState('');
  const [editSalary, setEditSalary] = useState('');
  const [editProfileImg, setEditProfileImg] = useState('');
  const [cropImgUrl, setCropImgUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

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
    
    setEditName(p.playerName || p.name || "");
    setEditTeam(p.playerTeam || p.team || "");
    setEditPosition(p.playerPosition || p.position || "");
    setEditNumber(p.playerNumber || p.backNumber || p.number || "");
    setEditHandedness(p.playerHandedness || p.handedness || "");
    setEditBirthdate(p.playerBirthdate || p.age || "");
    setEditJoinYear(p.playerJoinYear || p.joinYear || "");
    let salaryStr = String(p.playerSalary || p.salary || "");
    salaryStr = salaryStr.replace(/[^0-9]/g, '');
    setEditSalary(salaryStr === '' ? '' : Number(salaryStr).toLocaleString());
    setEditProfileImg(p.profileImg || "");
  };

  const getCroppedImg = async (imageSrc: string, pixelCrop: any) => {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = imageSrc;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (cropImgUrl && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(cropImgUrl, croppedAreaPixels);
      if (croppedImage) {
        setEditProfileImg(croppedImage);
      }
    }
    setCropImgUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCropImgUrl(reader.result as string);
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
        playerJoinYear: editJoinYear,
        joinYear: editJoinYear,
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
                <span>입단 연도</span>
                <strong>
                  {activeUser.playerJoinYear || activeUser.joinYear 
                    ? `${activeUser.playerJoinYear || activeUser.joinYear} (${
                        (() => {
                          const joinDate = activeUser.playerJoinYear || activeUser.joinYear;
                          if (joinDate && joinDate.includes('-')) {
                            const joinYearNum = new Date(joinDate).getFullYear();
                            const currentYear = new Date().getFullYear();
                            return currentYear - joinYearNum + 1;
                          }
                          return '-';
                        })()
                      }년차)`
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
            <strong>{activeUser.createdAt ? activeUser.createdAt.split('T')[0] : '-'}</strong>
          </div>
        </div>

        {!isAgent ? (
          <div className="flex gap-2">
            <button className="flex-1 py-3.5 px-4 rounded-xl font-bold text-[14px] bg-[#2A2D35] text-white hover:bg-[#343842] transition-colors" onClick={() => handlePlayerClick({ ...activeUser, id: activeUser.id || activeUser.userId }, true)}>
              프로필 수정
            </button>
            <button className="flex-1 py-3.5 px-4 rounded-xl font-bold text-[14px] bg-[var(--primary-color)] text-black hover:opacity-90 transition-opacity" onClick={onLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <>
            {Object.keys(teamGroups).length > 0 && (
              <div className="mb-8">
                <h4 className="text-[var(--text-muted)] font-bold text-sm mb-5 tracking-wide uppercase">구단별 소속 선수</h4>
                <div className="flex flex-col">
                  {Object.keys(teamGroups).sort().map(teamName => (
                    <div key={teamName} className="card-chart flex flex-col">
                      <div className="text-center pb-3 mb-2 border-b border-[var(--card-border)]">
                        <span className="font-bold text-[var(--primary-color)]">{teamName}</span>
                        <span className="text-[var(--text-muted)] text-sm ml-2">({teamGroups[teamName].length}명)</span>
                      </div>
                      <div className="flex flex-col">
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
            <button className="w-full py-3.5 px-4 rounded-xl font-bold bg-[var(--primary-color)] text-black hover:opacity-90 transition-opacity" onClick={onLogout}>로그아웃</button>
          </>
        )}
      </div>

      {editingPlayerId && selectedPlayer && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col max-h-[90vh]">
            {!isEditMode ? (
              <>
                <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
                  <h4 className="text-[14px] font-bold text-white flex items-center gap-2">선수 프로필</h4>
                  <div className="flex gap-2 items-center">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(true)} title="수정">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>edit</span>
                    </button>
                    <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); }}>close</span>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto flex flex-col items-center">
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
                      <span className="text-[var(--text-muted)] text-sm">입단 연도</span>
                      <span className="font-semibold text-sm text-white">
                        {editJoinYear 
                          ? `${editJoinYear} (${
                              (() => {
                                if (editJoinYear && editJoinYear.includes('-')) {
                                  const joinYearNum = new Date(editJoinYear).getFullYear();
                                  const currentYear = new Date().getFullYear();
                                  return currentYear - joinYearNum + 1;
                                }
                                return '-';
                              })()
                            }년차)`
                          : '-'}
                      </span>
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
                <div className="p-6 border-b border-[rgba(255,255,255,0.05)] flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <button className="text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-[rgba(255,255,255,0.1)]" onClick={() => setIsEditMode(false)} title="뒤로가기">
                      <span className="material-icons-round" style={{ fontSize: '20px' }}>arrow_back</span>
                    </button>
                    <h4 className="text-[14px] font-bold text-white flex items-center gap-2">선수 프로필 수정</h4>
                  </div>
                  <span className="material-icons-round text-gray-400 hover:text-white cursor-pointer transition-colors" onClick={() => { setEditingPlayerId(null); setSelectedPlayer(null); setIsEditMode(false); }}>close</span>
                </div>
                <div className="p-6 overflow-y-auto flex flex-col gap-3">
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
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">이름</label>
                    <input type="text" placeholder="이름" className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editName} onChange={e => setEditName(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">생년월일</label>
                    <input type="date" className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">입단 연도</label>
                    <input type="date" placeholder="입단 연도 (예: 2024)" className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editJoinYear} onChange={e => setEditJoinYear(e.target.value)} max="9999-12-31" required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">소속 구단</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editTeam} onChange={e => setEditTeam(e.target.value)} required>
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
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">포지션</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editPosition} onChange={e => setEditPosition(e.target.value)} required>
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
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">등번호</label>
                    <input type="text" placeholder="등번호 (예: 11)" className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editNumber} onChange={e => setEditNumber(e.target.value)} required />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">연봉</label>
                    <input type="text" placeholder="연봉 (단위: 원)" className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editSalary} onChange={e => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setEditSalary(val === '' ? '' : Number(val).toLocaleString());
                    }} />
                  </div>
                  <div className="input-group-select !mb-0">
                    <label className="text-[13px] font-normal text-gray-300 mb-0 block">투타</label>
                    <select className="!h-[30px] !py-0 !px-3 !text-[13px]" value={editHandedness} onChange={e => setEditHandedness(e.target.value)} required>
                      <option value="" disabled>투타 선택</option>
                      <option value="우투우타">우투우타</option>
                      <option value="우투좌타">우투좌타</option>
                      <option value="좌투좌타">좌투좌타</option>
                      <option value="좌투우타">좌투우타</option>
                      <option value="우투양타">우투양타</option>
                      <option value="좌투양타">좌투양타</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2 w-full mt-[12px] shrink-0">
                    {isAgent && (
                      <button className="btn-action-outline flex-1 text-[#FF3B30] border-[#FF3B30] hover:bg-[#FF3B30] hover:text-white h-[30px] flex items-center justify-center text-[14px]" onClick={() => setShowDeleteConfirm(true)}>삭제</button>
                    )}
                    <button className="btn-primary flex-1 h-[30px] flex items-center justify-center text-[14px]" onClick={handleSaveProfile}>저장하기</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {cropImgUrl && (
        <div className="fixed inset-0 z-[1200] overflow-y-auto bg-black/80 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-4 text-center">사진 자르기</h3>
            
            <div className="relative w-full h-64 mb-4 bg-black/50 rounded-xl overflow-hidden">
              <Cropper
                image={cropImgUrl}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            
            <div className="flex items-center gap-3 mb-6 px-2">
              <span className="material-icons-round text-gray-400 text-sm">zoom_out</span>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[var(--primary-color)]"
              />
              <span className="material-icons-round text-gray-400 text-sm">zoom_in</span>
            </div>
            
            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                onClick={() => {
                  setCropImgUrl(null);
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
              >
                취소
              </button>
              <button 
                className="flex-1 py-3 rounded-xl bg-[var(--primary-color)] text-black font-bold hover:opacity-90 transition-opacity"
                onClick={handleCropSave}
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1300] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">
          <div className="card-chart bg-[var(--card-bg)] w-full max-w-sm rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.25)] overflow-hidden border border-[var(--card-border)] flex flex-col p-6 animate-scale-up">
            <h3 className="text-lg font-bold text-white mb-2 text-center">프로필 삭제</h3>
            <p className="text-[#FF3B30] text-sm text-center mb-6">정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
            <div className="flex gap-3">
              <button 
                className="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.1)] text-gray-400 font-bold hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                onClick={() => setShowDeleteConfirm(false)}
              >
                취소
              </button>
              <button 
                className="flex-1 py-3 rounded-xl bg-[#FF3B30] text-white font-bold hover:bg-[#FF453A] transition-colors"
                onClick={handleDeleteProfile}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
