import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 지원 용품 날짜 입력칸 테두리
old_inv_date = 'value={invDate} onChange={e => setInvDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors"'
new_inv_date = 'value={invDate} onChange={e => setInvDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors"'
content = content.replace(old_inv_date, new_inv_date)

# 2. 스폰서쉽 날짜 입력칸 테두리
old_spons_date = 'value={sponsDate} onChange={e => setSponsDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors"'
new_spons_date = 'value={sponsDate} onChange={e => setSponsDate(e.target.value)} max="9999-12-31" className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--card-border)] focus:border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none transition-colors"'
content = content.replace(old_spons_date, new_spons_date)

# We have:
#             <div className="flex flex-col gap-[12px]">
#               ... (inputs)
#             </div>
#             <div className="flex gap-3 mt-[12px]">

# I need to change `mt-[12px]` to `mt-[24px]` for both save buttons.
# Wait, let's find the exact blocks so we don't accidentally replace other instances of mt-[12px].
# Looking at the earlier `grep` outputs, the first one has:
#               <div>
#                 <label className="text-[13px] font-normal text-gray-300 mb-[6px] block">지원 금액 환산</label>
#                 <input type="number" ... />
#               </div>
#             </div>
#             <div className="flex gap-3 mt-[12px]">
#               {editingInventoryIndex !== null && (

# Let's replace the `</div>\n            <div className="flex gap-3 mt-[12px]">` precisely.

content = re.sub(
    r'(value=\{invPrice\}.*?/>\n\s*</div>\n\s*</div>)\n\s*<div className="flex gap-3 mt-\[12px\]">',
    r'\1\n            <div className="flex gap-3 mt-[24px]">',
    content
)

content = re.sub(
    r'(value=\{sponsPrice\}.*?/>\n\s*</div>\n\s*</div>)\n\s*<div className="flex gap-3 mt-\[12px\]">',
    r'\1\n            <div className="flex gap-3 mt-[24px]">',
    content
)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
