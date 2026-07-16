import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = """              <div className="info-item">
                <span>연봉</span>
                <strong>{formatKoreanCurrency(activeUser.playerSalary || activeUser.salary)}</strong>
              </div>"""

replacement = """              <div className="info-item">
                <span>입단 연도</span>
                <strong>{activeUser.playerJoinYear || activeUser.joinYear || '-'}</strong>
              </div>
              <div className="info-item">
                <span>연봉</span>
                <strong>{formatKoreanCurrency(activeUser.playerSalary || activeUser.salary)}</strong>
              </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced target")
else:
    print("Could not find target")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
