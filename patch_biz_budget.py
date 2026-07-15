import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("{(player.budget || 0).toLocaleString()}원", "{Number(String(player.budget || 0).replace(/[^0-9]/g, '')).toLocaleString()}원")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
