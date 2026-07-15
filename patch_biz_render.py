import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("{inv.price ? inv.price.toLocaleString() + '원' : '-'}", "{inv.price ? Number(String(inv.price).replace(/[^0-9]/g, '')).toLocaleString() + '원' : '-'}")
content = content.replace("{spons.price ? spons.price.toLocaleString() + '원' : '-'}", "{spons.price ? Number(String(spons.price).replace(/[^0-9]/g, '')).toLocaleString() + '원' : '-'}")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
