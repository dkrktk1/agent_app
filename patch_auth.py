import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """                  <input type="number" placeholder="연봉 (단위: 원)" value={playerSalary} onChange={e => setPlayerSalary(e.target.value)} required />"""

replacement = """                  <input type="text" placeholder="연봉 (단위: 원)" value={playerSalary} onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setPlayerSalary(val === '' ? '' : Number(val).toLocaleString());
                  }} required />"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("AuthScreen marker not found")

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
