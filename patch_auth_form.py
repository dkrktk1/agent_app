import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the player role section
old_section = """            {role === 'player' && (
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
                <div className="input-group-select">
                  <label>생년월일</label>
                  <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">payments</span>
                  <input type="text" placeholder="연봉 (단위: 원)" value={playerSalary} onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPlayerSalary(val === '' ? '' : Number(val).toLocaleString());
                  }} required />
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
            )}"""

new_section = """            {role === 'player' && (
              <>
                <div className="input-group">
                  <span className="material-icons-round">badge</span>
                  <input type="text" placeholder="이름" value={playerName} onChange={e => setPlayerName(e.target.value)} required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">event</span>
                  <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required style={{ appearance: 'none', colorScheme: 'dark' }} />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">calendar_today</span>
                  <input type="number" placeholder="입단 연도 (예: 2024)" value={playerJoinYear} onChange={e => setPlayerJoinYear(e.target.value)} required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">shield</span>
                  <select value={playerTeam} onChange={e => setPlayerTeam(e.target.value)} required style={{ width: '100%', height: '30px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '0 12px 0 32px', color: '#fff', fontSize: '13px', outline: 'none', appearance: 'none' }}>
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
                <div className="input-group">
                  <span className="material-icons-round">sports_baseball</span>
                  <select value={playerPosition} onChange={e => setPlayerPosition(e.target.value)} required style={{ width: '100%', height: '30px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '0 12px 0 32px', color: '#fff', fontSize: '13px', outline: 'none', appearance: 'none' }}>
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
                  <span className="material-icons-round">payments</span>
                  <input type="text" placeholder="연봉 (단위: 원)" value={playerSalary} onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPlayerSalary(val === '' ? '' : Number(val).toLocaleString());
                  }} required />
                </div>
                <div className="input-group">
                  <span className="material-icons-round">front_hand</span>
                  <select value={playerHandedness} onChange={e => setPlayerHandedness(e.target.value)} required style={{ width: '100%', height: '30px', background: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '0 12px 0 32px', color: '#fff', fontSize: '13px', outline: 'none', appearance: 'none' }}>
                    <option value="" disabled>투타 선택</option>
                    <option value="우투우타" className="text-black">우투우타</option>
                    <option value="우투좌타" className="text-black">우투좌타</option>
                    <option value="우투양타" className="text-black">우투양타 (스위치)</option>
                    <option value="좌투좌타" className="text-black">좌투좌타</option>
                    <option value="좌투우타" className="text-black">좌투우타</option>
                    <option value="좌투양타" className="text-black">좌투양타 (스위치)</option>
                  </select>
                </div>
              </>
            )}"""

if old_section in content:
    content = content.replace(old_section, new_section)
    with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Replaced section successfully")
else:
    print("Error: Could not find old section")

