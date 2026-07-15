import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker1 = """                <input type="number" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={invPrice} onChange={e => setInvPrice(e.target.value === '' ? '' : Number(e.target.value))} />"""
replacement1 = """                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={invPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setInvPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />"""

marker2 = """                <input type="number" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={sponsPrice} onChange={e => setSponsPrice(e.target.value === '' ? '' : Number(e.target.value))} />"""
replacement2 = """                <input type="text" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors" placeholder="금액" value={sponsPrice} onChange={e => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setSponsPrice(val === '' ? '' : Number(val).toLocaleString());
                }} />"""

if marker1 in content:
    content = content.replace(marker1, replacement1)
else:
    print("BizTab marker1 not found")

if marker2 in content:
    content = content.replace(marker2, replacement2)
else:
    print("BizTab marker2 not found")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
