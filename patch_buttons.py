import re

files = [
    'src/components/BizTab.tsx',
    'src/components/MedicalTab.tsx',
    'src/components/MyPageTab.tsx',
    'src/components/ScheduleTab.tsx',
    'src/components/CareTab.tsx'
]

for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Just in case, replace mb-6 before the button to mb-0
    content = content.replace('<div className="flex flex-col gap-4 mb-6">', '<div className="flex flex-col gap-[12px]">')
    content = content.replace('<div className="flex flex-col gap-[12px] mb-6">', '<div className="flex flex-col gap-[12px]">')
    
    # We can rely on the mt-[12px] we put on the button wrapper.
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
