import React, { useState } from 'react';
import { savePlayerProfile, getPlayerProfile } from '../lib/api';

export default function AuthScreen({ onLogin }: { onLogin: (user: any) => void }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState('player');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [linkedPlayer, setLinkedPlayer] = useState('batter');
  const [agentCode, setAgentCode] = useState('');

  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerBirthdate, setPlayerBirthdate] = useState('');
  const [playerTeam, setPlayerTeam] = useState('');
  const [playerNumber, setPlayerNumber] = useState('');
  const [playerHandedness, setPlayerHandedness] = useState('');
  const [playerSalary, setPlayerSalary] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    setErrorMsg('');
    if (!userId || !password) {
      setErrorMsg("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    let existingUser = null;
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
      existingUser = await Promise.race([getPlayerProfile(userId), timeoutPromise]);
    } catch (e: any) {
      console.warn("Could not fetch user profile", e);
    }
    
    if (existingUser) {
      setIsLoading(false);
      setErrorMsg("이미 등록된 아이디입니다.");
      return;
    }

    let newUser: any = { userId, password, role };

    if (role === "player") {
      if (!playerName || !playerPosition || !playerBirthdate || !playerTeam || !playerNumber || !playerHandedness || !playerSalary) {
        setIsLoading(false);
        setErrorMsg("모든 선수 정보를 입력해 주세요.");
        return;
      }
      newUser.linkedPlayer = linkedPlayer;
      newUser.playerName = playerName;
      newUser.playerPosition = playerPosition;
      newUser.playerBirthdate = playerBirthdate;
      newUser.playerTeam = playerTeam;
      newUser.playerNumber = playerNumber;
      newUser.playerHandedness = playerHandedness;
      newUser.playerSalary = playerSalary;
    } else {
      if (agentCode !== "AGENT99") {
        setIsLoading(false);
        setErrorMsg("올바른 에이전트 인증 코드를 입력해야 에이전트 가입이 가능합니다.");
        return;
      }
    }

    // Keep localStorage just in case, but rely on Firebase
    let users = JSON.parse(localStorage.getItem("ag_users") || "[]");
    users.push(newUser);
    try {
      localStorage.setItem("ag_users", JSON.stringify(users));
    } catch(e) {}
    
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000));
      await Promise.race([savePlayerProfile(userId, newUser), timeoutPromise]);
    } catch (e) {
      console.error("Firebase save failed", e);
    }
    
    setIsLoading(false);
    setIsLoginMode(true);
    setErrorMsg("회원가입이 완료되었습니다! 로그인 해 주세요.");
  };

  const handleLogin = async () => {
    setErrorMsg('');
    if (!userId || !password) {
      setErrorMsg("아이디와 비밀번호를 입력해 주세요.");
      return;
    }

    if (userId === "nowiwon" && password === "123") {
      const defaultAgent = { userId: "nowiwon", role: "agent" };
      onLogin(defaultAgent);
      return;
    }

    setIsLoading(true);
    try {
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000));
      const user: any = await Promise.race([getPlayerProfile(userId), timeoutPromise]);
      if (user && user.password === password) {
        setIsLoading(false);
        onLogin({ userId, ...user });
        return;
      }
    } catch(e) {
      console.error(e);
    }

    // Fallback to local storage if firebase fails or is syncing
    let users = JSON.parse(localStorage.getItem("ag_users") || "[]");
    let localUser = users.find((u: any) => u.userId === userId && u.password === password);

    setIsLoading(false);
    if (localUser) {
      onLogin({ userId, ...localUser });
    } else {
      setErrorMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div id="auth-screen" className="app-screen active" style={{ overflowY: 'hidden', display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, padding: '40px 20px', overflowY: 'hidden' }}>
        <div className="auth-header">
          <img 
            src="data:image/png;base64,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" 
            alt="나우아이원매니지먼트그룹 로고" 
            className="auth-logo" 
            style={{ borderRadius: '16px' }}
          />
          <h1 style={{ fontFamily: 'system-ui' }}>NOWIWON</h1>
          <p>마이크로 선수 케어 앱</p>
        </div>

        {isLoginMode ? (
          <form 
            id="login-form-container" 
            className="auth-form-card"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <h2>로그인</h2>
            {errorMsg && <p className={`text-sm mb-4 text-center whitespace-nowrap break-keep ${errorMsg.includes('완료') ? 'text-white' : 'text-red-400'}`}>{errorMsg}</p>}
            <div className="input-group">
              <span className="material-icons-round">person</span>
              <input type="text" placeholder="아이디" value={userId} onChange={e => setUserId(e.target.value)} required />
            </div>
            <div className="input-group">
              <span className="material-icons-round">lock</span>
              <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? '연결 중...' : '로그인'}
            </button>
            <p className="auth-toggle-text">계정이 없으신가요? <span onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}>회원가입</span></p>
          </form>
        ) : (
          <div id="signup-form-container" className="auth-form-card">
            <h2>회원가입</h2>
            {errorMsg && <p className={`text-sm mb-4 text-center whitespace-nowrap break-keep ${errorMsg.includes('완료') ? 'text-white' : 'text-red-400'}`}>{errorMsg}</p>}
            <div className="input-group">
              <span className="material-icons-round">person</span>
              <input type="text" placeholder="아이디" value={userId} onChange={e => setUserId(e.target.value)} required />
            </div>
            <div className="input-group">
              <span className="material-icons-round">lock</span>
              <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="role-selector-container">
              <label>가입 역할</label>
              <div className="role-options">
                <label className={`role-option ${role === 'player' ? 'active' : ''}`}>
                  <input type="radio" name="signup-role" value="player" checked={role === 'player'} onChange={() => setRole('player')} />
                  <span>선수</span>
                </label>
                <label className={`role-option ${role === 'agent' ? 'active' : ''}`}>
                  <input type="radio" name="signup-role" value="agent" checked={role === 'agent'} onChange={() => setRole('agent')} />
                  <span>에이전트</span>
                </label>
              </div>
            </div>

            {role === 'player' && (
              <>
                <div className="input-group">
                  <span className="material-icons-round">badge</span>
                  <input type="text" placeholder="이름" value={playerName} onChange={e => setPlayerName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">sports_baseball</span>
                  <select value={playerPosition} onChange={e => setPlayerPosition(e.target.value)} required style={{ width: '100%', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '14px 14px 14px 44px', color: '#fff', fontSize: '14px', outline: 'none', appearance: 'none' }}>
                    <option value="" disabled>포지션 선택</option>
                    <option value="투수" className="text-black">투수</option>
                    <option value="내야수" className="text-black">내야수</option>
                    <option value="외야수" className="text-black">외야수</option>
                    <option value="선발 투수 (SP)" className="text-black">선발 투수 (SP)</option>
                    <option value="구원 투수 (RP)" className="text-black">구원 투수 (RP)</option>
                    <option value="마무리 투수 (CP)" className="text-black">마무리 투수 (CP)</option>
                    <option value="포수 (C)" className="text-black">포수 (C)</option>
                    <option value="1루수 (1B)" className="text-black">1루수 (1B)</option>
                    <option value="2루수 (2B)" className="text-black">2루수 (2B)</option>
                    <option value="3루수 (3B)" className="text-black">3루수 (3B)</option>
                    <option value="유격수 (SS)" className="text-black">유격수 (SS)</option>
                    <option value="좌익수 (LF)" className="text-black">좌익수 (LF)</option>
                    <option value="중견수 (CF)" className="text-black">중견수 (CF)</option>
                    <option value="우익수 (RF)" className="text-black">우익수 (RF)</option>
                    <option value="지명타자 (DH)" className="text-black">지명타자 (DH)</option>
                  </select>
                </div>
                <div className="input-group">
                  <span className="material-icons-round">numbers</span>
                  <input type="number" placeholder="등번호" value={playerNumber} onChange={e => setPlayerNumber(e.target.value)} required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">front_hand</span>
                  <select value={playerHandedness} onChange={e => setPlayerHandedness(e.target.value)} required style={{ width: '100%', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '14px 14px 14px 44px', color: '#fff', fontSize: '14px', outline: 'none', appearance: 'none' }}>
                    <option value="" disabled>투타 선택</option>
                    <option value="우투우타" className="text-black">우투우타</option>
                    <option value="우투좌타" className="text-black">우투좌타</option>
                    <option value="우투양타" className="text-black">우투양타 (스위치)</option>
                    <option value="좌투좌타" className="text-black">좌투좌타</option>
                    <option value="좌투우타" className="text-black">좌투우타</option>
                    <option value="좌투양타" className="text-black">좌투양타 (스위치)</option>
                  </select>
                </div>
                <div className="input-group">
                  <span className="material-icons-round">calendar_today</span>
                  <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">payments</span>
                  <input type="number" placeholder="연봉 (단위: 원)" value={playerSalary} onChange={e => setPlayerSalary(e.target.value)} required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">shield</span>
                  <select value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} required style={{ width: '100%', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--card-border)', borderRadius: '16px', padding: '14px 14px 14px 44px', color: '#fff', fontSize: '14px', outline: 'none', appearance: 'none' }}>
                    <option value="" disabled>소속구단 선택</option>
                    <option value="KIA 타이거즈" className="text-black">KIA 타이거즈</option>
                    <option value="삼성 라이온즈" className="text-black">삼성 라이온즈</option>
                    <option value="LG 트윈스" className="text-black">LG 트윈스</option>
                    <option value="두산 베어스" className="text-black">두산 베어스</option>
                    <option value="KT 위즈" className="text-black">KT 위즈</option>
                    <option value="SSG 랜더스" className="text-black">SSG 랜더스</option>
                    <option value="롯데 자이언츠" className="text-black">롯데 자이언츠</option>
                    <option value="한화 이글스" className="text-black">한화 이글스</option>
                    <option value="NC 다이노스" className="text-black">NC 다이노스</option>
                    <option value="키움 히어로즈" className="text-black">키움 히어로즈</option>
                  </select>
                </div>
              </>
            )}

            {role === 'agent' && (
              <div id="agent-code-section" className="input-group">
                <span className="material-icons-round">vpn_key</span>
                <input type="password" placeholder="에이전트 인증 코드 (AGENT99)" value={agentCode} onChange={e => setAgentCode(e.target.value)} />
              </div>
            )}

            <button onClick={handleRegister} className="btn-primary" disabled={isLoading}>
              {isLoading ? '처리 중...' : '회원가입 및 시작'}
            </button>
            <p className="auth-toggle-text">이미 계정이 있으신가요? <span onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}>로그인</span></p>
          </div>
        )}
      </div>
    </div>
  );
}
