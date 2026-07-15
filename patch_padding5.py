import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific block
# From:
#                ) : (
#                  <div className="flex gap-2 w-full">
# To:
#                ) : (
#                  <div className="flex gap-2 w-full mt-4">

content = re.sub(
    r'\) : \(\s+<div className="flex gap-2 w-full">',
    r') : (\n                  <div className="flex gap-2 w-full mt-[16px]">',
    content
)

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
