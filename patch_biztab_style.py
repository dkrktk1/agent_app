import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<span className="text-[10px] bg-[rgba(255,255,255,0.1)] text-gray-300 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">',
    '<span className="text-[13px] bg-[rgba(255,255,255,0.1)] text-gray-300 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">'
)

content = content.replace(
    '<span className="text-[10px] bg-[rgba(212,175,55,0.1)] text-[var(--primary-color)] border border-[rgba(212,175,55,0.3)] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">',
    '<span className="text-[13px] bg-[rgba(212,175,55,0.1)] text-[var(--primary-color)] border border-[rgba(212,175,55,0.3)] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">'
)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
