import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For the timeline form (showTimelineModal)
content = content.replace('<div className="p-6 overflow-y-auto flex flex-col gap-6">', '<div className="p-6 overflow-y-auto flex flex-col gap-[12px]">')

# For the pain editing form
content = content.replace('<div className="flex flex-col gap-2">', '<div className="flex flex-col gap-[12px]">')
# replace mb-4 inside the pain editing form
content = content.replace('<div className="mb-4">', '<div>')

content = content.replace('<div className="input-group-select">', '<div>')
content = content.replace('<div className="input-group-select !mb-0">', '<div>')

# Labels
content = content.replace('<label className="text-sm font-bold text-white mb-3 block">', '<label className="text-[13px] font-bold text-white mb-[6px] block">')
content = content.replace('<label>', '<label className="text-[13px] font-bold text-white mb-[6px] block">')

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
