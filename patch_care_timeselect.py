import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace TimeSelect label
content = content.replace('<label className="text-sm font-medium text-[var(--text-muted)] block mb-2">', '<label className="text-[13px] font-medium text-[var(--text-muted)] block mb-[6px]">')

# Replace TimeSelect select
old_select = 'className="flex-1 p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm appearance-none outline-none focus:border-[#3b82f6]"'
new_select = 'className="flex-1 h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-lg text-white text-[13px] appearance-none outline-none"'
content = content.replace(old_select, new_select)

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("CareTab TimeSelect patched")
