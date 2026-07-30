import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Sleep
    target1 = 'className="text-[13px] font-normal text-gray-300 mb-[6px] block">수면 시간</label>'
    replace1 = 'className="text-[13px] font-bold text-white mb-[6px] block">수면 시간</label>'
    content = content.replace(target1, replace1)

    # Grip left
    target2 = 'className="text-[13px] font-normal text-gray-300 mb-[6px] block">왼손 악력 (kg)</label>'
    replace2 = 'className="text-[13px] font-bold text-white mb-[6px] block">왼손 악력 (kg)</label>'
    content = content.replace(target2, replace2)

    # Grip right
    target3 = 'className="text-[13px] font-normal text-gray-300 mb-[6px] block">오른손 악력 (kg)</label>'
    replace3 = 'className="text-[13px] font-bold text-white mb-[6px] block">오른손 악력 (kg)</label>'
    content = content.replace(target3, replace3)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('src/components/CareTab.tsx')
update_file('src/components/ScheduleTab.tsx')
