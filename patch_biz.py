import re

with open('src/components/BizTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  const formatKoreanCurrency = (amount: number) => {
    if (amount >= 100000000) {
      const eok = Math.floor(amount / 100000000);
      const man = Math.floor((amount % 100000000) / 10000);
      if (man > 0) {
        return `${eok}억 ${man.toLocaleString()}만 원`;
      }
      return `${eok}억 원`;
    }
    return `${(amount / 10000).toLocaleString()}만 원`;
  };"""

replacement = """  const formatKoreanCurrency = (amount: number) => {
    return `${amount.toLocaleString()}원`;
  };"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("BizTab marker not found")

with open('src/components/BizTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
