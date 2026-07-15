import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { downloadSampleCSV } from '../utils';", "import { downloadSampleCSV, formatKoreanCurrency } from '../utils';")

marker = """  const formatKoreanCurrency = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };"""
content = content.replace(marker, "")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
