import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('{isSleepEmpty ? \'-\' : `${latestSleep}h`}', '{isSleepEmpty ? \'-\' : `${Number(latestSleep).toFixed(1)}h`}')

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
