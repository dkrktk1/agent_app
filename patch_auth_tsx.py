import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add labels
content = content.replace(
    '''
                <div className="input-group">
                  <span className="material-icons-round">event</span>
                  <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required style={{ appearance: 'none', colorScheme: 'dark' }} />
                </div>''',
    '''
                <div className="mb-3">
                  <label className="text-[12px] text-[var(--text-muted)] block mb-[6px]">생년월일</label>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">event</span>
                    <input type="date" placeholder="생년월일" value={playerBirthdate} onChange={e => setPlayerBirthdate(e.target.value)} max="9999-12-31" required style={{ appearance: 'none', colorScheme: 'dark' }} />
                  </div>
                </div>'''
)

content = content.replace(
    '''
                <div className="input-group">
                  <span className="material-icons-round">calendar_today</span>
                  <input type="date" placeholder="입단 연도 (예: 2024)" value={playerJoinYear} onChange={e => setPlayerJoinYear(e.target.value)} max="9999-12-31" required style={{ appearance: 'none', colorScheme: 'dark' }} />
                </div>''',
    '''
                <div className="mb-3">
                  <label className="text-[12px] text-[var(--text-muted)] block mb-[6px]">입단 연도</label>
                  <div className="input-group !mb-0">
                    <span className="material-icons-round">calendar_today</span>
                    <input type="date" placeholder="입단 연도 (예: 2024)" value={playerJoinYear} onChange={e => setPlayerJoinYear(e.target.value)} max="9999-12-31" required style={{ appearance: 'none', colorScheme: 'dark' }} />
                  </div>
                </div>'''
)

# Button height to 30px
content = content.replace(
    '''<button onClick={handleRegister} className="btn-primary" disabled={isLoading}>''',
    '''<button onClick={handleRegister} className="btn-primary !h-[30px] !py-0 text-[13px]" disabled={isLoading}>'''
)

# Replace the previous pl-[32px] classes with standard classes, because we updated .input-group select padding
content = content.replace(
    '''className="pl-[32px]" style={{ appearance: 'none' }}''',
    '''style={{ appearance: 'none' }}'''
)

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
