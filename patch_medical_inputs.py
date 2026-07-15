with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Textareas
content = content.replace(
    'className="w-full bg-[rgba(255,255,255,0.05)] text-white text-sm border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--primary-color)] transition-colors resize-none leading-relaxed"',
    'className="w-full bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--primary-color)] rounded-xl py-3 px-3 focus:outline-none transition-colors resize-none leading-relaxed"'
)

content = content.replace(
    'className="w-full text-sm border border-[rgba(255,255,255,0.1)] rounded-xl p-4 bg-[rgba(255,255,255,0.05)] text-white focus:outline-none focus:border-[var(--primary-color)] resize-none h-24 placeholder-gray-600 transition-all"',
    'className="w-full text-[13px] border border-[var(--primary-color)] rounded-xl p-3 bg-[rgba(255,255,255,0.05)] text-white focus:outline-none resize-none h-24 placeholder-gray-600 transition-all"'
)

# Inputs
old_input = 'className="w-full bg-[rgba(255,255,255,0.05)] text-white text-sm border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 focus:outline-none focus:border-[var(--primary-color)] transition-colors"'
new_input = 'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] text-white text-[13px] border border-[var(--primary-color)] rounded-xl px-3 focus:outline-none transition-colors"'
content = content.replace(old_input, new_input)

old_input2 = 'className="w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-[var(--primary-color)]"'
new_input2 = 'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] focus:outline-none"'
content = content.replace(old_input2, new_input2)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
