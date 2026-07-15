import re

with open('src/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """export function formatKoreanCurrency(amount: string | number | undefined | null): string {
  if (!amount && amount !== 0 && amount !== '0') return '-';
  const num = typeof amount === 'string' ? parseInt(amount.replace(/,/g, ''), 10) : amount;
  if (isNaN(num)) return '-';
  if (num === 0) return '0원';
  
  if (num >= 100000000) {
    const uk = Math.floor(num / 100000000);
    const manwon = Math.floor((num % 100000000) / 10000);
    if (manwon === 0) {
      return `${uk}억원`;
    } else if (manwon % 1000 === 0) {
      return `${uk}억 ${manwon / 1000}천만원`;
    } else {
      return `${uk}억 ${manwon.toLocaleString()}만원`;
    }
  } else {
    return `${num.toLocaleString()}원`;
  }
}"""

replacement = """export function formatKoreanCurrency(amount: string | number | undefined | null): string {
  if (!amount && amount !== 0 && amount !== '0') return '-';
  const num = typeof amount === 'string' ? parseInt(amount.replace(/,/g, ''), 10) : amount;
  if (isNaN(num)) return '-';
  if (num === 0) return '0원';
  return `${num.toLocaleString()}원`;
}"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("utils.ts marker not found")

with open('src/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
