import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's add top margin to the buttons wrapper.
content = content.replace(
    '<div className="flex gap-2 w-full">',
    '<div className="flex gap-2 w-full mt-4">'
)

content = content.replace(
    '<div className="flex gap-2 w-full mt-4">\n                    {editingEventOriginalIndex !== null && (',
    '<div className="flex gap-2 w-full">\n                    {editingEventOriginalIndex !== null && ('
)
# wait, if I replace all `<div className="flex gap-2 w-full">` with `mt-4`, it might affect other things. Let's be specific.

# Restore the spacer at the end of the form area
content = content.replace(
    '              )}\n                \n            </div>',
    '              )}\n              <div className="w-full h-[32px] shrink-0"></div>\n            </div>'
)

# Also ensure footer has proper padding
content = content.replace(
    '<div className="p-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">',
    '<div className="p-6 pt-6 border-t border-[rgba(255,255,255,0.05)] shrink-0">'
)


with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
