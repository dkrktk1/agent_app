import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker1 = "  const usedAmount = player.inventory?.reduce((acc: number, cur: any) => acc + (cur.price || 0), 0) || 0;"
replacement1 = "  const usedAmount = player.inventory?.reduce((acc: number, cur: any) => acc + (Number(String(cur.price || 0).replace(/[^0-9]/g, '')) || 0), 0) || 0;"

marker2 = "  const remainingAmount = (player.budget || 0) - usedAmount;"
replacement2 = "  const remainingAmount = (Number(String(player.budget || 0).replace(/[^0-9]/g, '')) || 0) - usedAmount;"

content = content.replace(marker1, replacement1)
content = content.replace(marker2, replacement2)

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
