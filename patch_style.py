import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace mb-[6px] with mb-0 in labels
# Only within the edit form (to avoid changing things unintentionally, but doing it generally for label className="... mb-[6px] block" is probably fine)

content = content.replace('label className="text-[13px] font-normal text-gray-300 mb-[6px] block"', 'label className="text-[13px] font-normal text-gray-300 mb-0 block"')

# Replace !text-[14px] with !text-[13px] in the inputs/selects within the same form
content = content.replace('className="!h-[30px] !py-0 !px-3 !text-[14px]"', 'className="!h-[30px] !py-0 !px-3 !text-[13px]"')

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
