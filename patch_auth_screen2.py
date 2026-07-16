import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Make playerJoinYear a date input
content = content.replace(
    '<input type="number" placeholder="입단 연도 (예: 2024)" value={playerJoinYear} onChange={e => setPlayerJoinYear(e.target.value)} required />',
    '<input type="date" placeholder="입단 연도 (예: 2024)" value={playerJoinYear} onChange={e => setPlayerJoinYear(e.target.value)} max="9999-12-31" required style={{ appearance: \'none\', colorScheme: \'dark\' }} />'
)

# Remove inline styles from select to rely on CSS
content = content.replace(
    'required style={{ width: \'100%\', height: \'30px\', background: \'rgba(0, 0, 0, 0.25)\', border: \'1px solid var(--card-border)\', borderRadius: \'12px\', padding: \'0 12px 0 32px\', color: \'#fff\', fontSize: \'13px\', outline: \'none\', appearance: \'none\' }}',
    'required className="pl-[32px]" style={{ appearance: \'none\' }}'
)

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
