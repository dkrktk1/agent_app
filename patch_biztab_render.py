import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """                    <div className="flex items-start gap-2 mb-2">
                      {inv.date && <span className="text-[10px] bg-[rgba(255,255,255,0.1)] text-gray-300 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">{inv.date}</span>}
                      <span className="text-white font-medium break-keep">{inv.name}</span>
                    </div>
                    <div className="flex justify-between items-center w-full">"""

replacement = """                    <div className="flex items-start gap-2 mb-2 flex-wrap">
                      {inv.date && <span className="text-[10px] bg-[rgba(255,255,255,0.1)] text-gray-300 px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">{inv.date}</span>}
                      {inv.company && <span className="text-[10px] bg-[rgba(212,175,55,0.1)] text-[var(--primary-color)] border border-[rgba(212,175,55,0.3)] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">{inv.company}</span>}
                      <span className="text-white font-medium break-keep">{inv.name}</span>
                    </div>
                    {inv.note && <div className="text-xs text-gray-400 mb-2">{inv.note}</div>}
                    <div className="flex justify-between items-center w-full">"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Marker not found")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
