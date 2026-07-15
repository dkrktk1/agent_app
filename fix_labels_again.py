import re
import glob

def fix_labels(content):
    # 1. `<label>Text</label>` -> `<label className="text-[13px] font-normal text-gray-300 mb-[6px] block">Text</label>`
    content = re.sub(r'<label>\s*([^<]+)\s*</label>', r'<label className="text-[13px] font-normal text-gray-300 mb-[6px] block">\1</label>', content)
    
    # 2. `text-sm font-medium text-[var(--text-muted)] block mb-2`
    content = content.replace('text-sm font-medium text-[var(--text-muted)] block mb-2', 'text-[13px] font-normal text-gray-300 mb-[6px] block')
    
    # 3. Anything that is text-[13px] font-bold -> text-[13px] font-normal
    content = content.replace('text-[13px] font-bold text-gray-300 mb-[6px] block', 'text-[13px] font-normal text-gray-300 mb-[6px] block')
    content = content.replace('text-[13px] font-bold text-[var(--text-muted)] mb-[6px] block', 'text-[13px] font-normal text-gray-300 mb-[6px] block')
    content = content.replace('text-[13px] font-normal text-[var(--text-muted)] block mb-[6px]', 'text-[13px] font-normal text-[var(--text-muted)] mb-[6px] block')
    
    return content

files = glob.glob('src/components/*Tab.tsx')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = fix_labels(content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Labels fixed")
