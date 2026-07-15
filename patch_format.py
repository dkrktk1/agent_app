import re

with open('src/utils.ts', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """export function formatKoreanCurrency(amount: string | number | undefined | null): string {
  if (!amount && amount !== 0 && amount !== '0') return '-';
  const num = typeof amount === 'string' ? parseInt(amount.replace(/,/g, ''), 10) : amount;
  if (isNaN(num)) return '-';
  if (num === 0) return '0원';
  return `${num.toLocaleString()}원`;
}"""

replacement = """export function formatKoreanCurrency(amount: string | number | undefined | null): string {
  if (!amount && amount !== 0 && amount !== '0') return '-';
  const num = typeof amount === 'string' ? parseInt(amount.replace(/[^0-9]/g, ''), 10) : amount;
  if (isNaN(num)) return '-';
  if (num === 0) return '0원';
  
  if (num >= 100000000) {
    const eok = Math.floor(num / 100000000);
    const rest = num % 100000000;
    if (rest === 0) return `${eok.toLocaleString()}억원`;
    
    const cheon = Math.floor(rest / 10000000);
    const man = Math.floor((rest % 10000000) / 10000);
    
    let restStr = '';
    if (cheon > 0) restStr += `${cheon}천`;
    if (man > 0) restStr += (cheon > 0 ? ` ${man}` : `${man}`);
    if (restStr.trim().length > 0) restStr += '만원';
    
    return `${eok.toLocaleString()}억 ${restStr.trim()}`;
  } else if (num >= 10000) {
    const cheon = Math.floor(num / 10000000);
    const man = Math.floor((num % 10000000) / 10000);
    const rest = num % 10000;
    
    let str = '';
    if (cheon > 0) str += `${cheon}천`;
    if (man > 0) str += (cheon > 0 ? ` ${man}` : `${man}`);
    if (str.length > 0) str += '만원';
    
    if (rest > 0) {
      str += (str.length > 0 ? ` ${rest.toLocaleString()}원` : `${rest.toLocaleString()}원`);
    }
    return str.trim();
  } else {
    return `${num.toLocaleString()}원`;
  }
}"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("utils.ts marker not found")

with open('src/utils.ts', 'w', encoding='utf-8') as f:
    f.write(content)
