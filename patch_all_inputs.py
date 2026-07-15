import re
import glob

def replace_classes(content):
    # 1. Replace borders in input, select, textarea
    # We want to replace border-[var(--primary-color)] with border-[var(--card-border)] 
    # ONLY inside <input, <select, <textarea tags.
    
    def repl_tag(m):
        tag_content = m.group(0)
        # Replace border-[var(--primary-color)] with border-[var(--card-border)]
        tag_content = tag_content.replace('border-[var(--primary-color)]', 'border-[var(--card-border)] focus:border-[var(--primary-color)]')
        return tag_content

    content = re.sub(r'<(input|select|textarea)\b[^>]*>', repl_tag, content)

    # 2. Replace label font weights
    # text-[13px] font-bold text-white mb-[6px] block
    content = content.replace('font-bold text-white mb-[6px] block', 'font-normal text-gray-300 mb-[6px] block')
    content = content.replace('font-bold text-[var(--text-muted)] mb-[6px] block', 'font-normal text-[var(--text-muted)] mb-[6px] block')
    content = content.replace('font-medium text-[var(--text-muted)] block mb-[6px]', 'font-normal text-[var(--text-muted)] block mb-[6px]')
    
    # Check if there are other labels
    content = content.replace('text-[13px] font-bold', 'text-[13px] font-normal')

    # Wait, the user said "항목별 제목의 폰트는 얇은 폰트로 수정해줘." 
    # Let's ensure labels use font-light or font-normal. I'll use font-normal. 
    # Also in CareTab, TimeSelect label:
    
    return content

files = glob.glob('src/components/*Tab.tsx')

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = replace_classes(content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Patch applied to all tabs")
