import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    target = "RPE 강도(1~10)"
    replace = "인지된 훈련 강도(힘듦 정도)"
    content = content.replace(target, replace)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

update_file('src/components/CareTab.tsx')
update_file('src/components/ScheduleTab.tsx')
