import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace gap-6
content = content.replace('<div className="p-6 overflow-y-auto flex flex-col gap-6">', '<div className="p-6 overflow-y-auto flex flex-col gap-[12px]">')

# Replace label
content = content.replace('<label className="text-sm font-bold text-white mb-3 block">', '<label className="text-[13px] font-bold text-white mb-[6px] block">')

# Replace input
old_input = 'className="w-full p-3 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white text-sm outline-none focus:border-[#3b82f6]"'
new_input = 'className="w-full h-[30px] px-3 bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-lg text-white text-[13px] outline-none"'
content = content.replace(old_input, new_input)

# Wait, CareTab uses gap-4 in TimeSelect
# <div className="flex flex-col gap-4 mt-2"> -> <div className="flex flex-col gap-[12px] mt-2">
content = content.replace('<div className="flex flex-col gap-4 mt-2">', '<div className="flex flex-col gap-[12px] mt-[6px]">')

# TimeSelect component might also need change. Let's look at TimeSelect.
with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("CareTab patched")
