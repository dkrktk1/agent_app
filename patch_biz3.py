import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("const [invPrice, setInvPrice] = useState<number | ''>('');", "const [invPrice, setInvPrice] = useState<string>('');")
content = content.replace("const [sponsPrice, setSponsPrice] = useState<number | ''>('');", "const [sponsPrice, setSponsPrice] = useState<string>('');")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
