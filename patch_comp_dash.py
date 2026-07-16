import re

with open('src/components/ComprehensiveStatusDashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '<p className="text-gray-300 leading-relaxed text-sm">',
    '<p className="text-gray-300 leading-relaxed text-[13px]">'
)

content = content.replace(
    '<div className="flex flex-col gap-4">',
    '<div className="flex flex-col gap-[5px]">'
)

with open('src/components/ComprehensiveStatusDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

