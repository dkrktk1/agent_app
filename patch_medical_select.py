import re

with open('src/components/MedicalTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_select_class = 'className="w-full h-[30px] bg-[rgba(255,255,255,0.05)] border border-[var(--primary-color)] rounded-xl px-3 text-white text-[13px] outline-none"'

content = re.sub(
    r'<select value=\{timelineFormType\} onChange=\{[^\}]+\}>',
    f'<select value={{timelineFormType}} onChange={{e => setTimelineFormType(e.target.value as any)}} {new_select_class}>',
    content
)

content = re.sub(
    r'<select value=\{timelineFormIsDone\?\'true\':\'false\'\} onChange=\{[^\}]+\}>',
    f'<select value={{timelineFormIsDone?\'true\':\'false\'}} onChange={{e => setTimelineFormIsDone(e.target.value === \'true\')}} {new_select_class}>',
    content
)

with open('src/components/MedicalTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
