import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """    setEditBirthdate(p.playerBirthdate || p.age || "");
    setEditSalary(p.playerSalary || p.salary || "");
    setEditProfileImg(p.profileImg || "");"""

replacement = """    setEditBirthdate(p.playerBirthdate || p.age || "");
    let salaryStr = String(p.playerSalary || p.salary || "");
    salaryStr = salaryStr.replace(/[^0-9]/g, '');
    setEditSalary(salaryStr === '' ? '' : Number(salaryStr).toLocaleString());
    setEditProfileImg(p.profileImg || "");"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("marker not found")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
