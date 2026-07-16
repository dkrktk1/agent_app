import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target1 = """              <div className="info-item">
                <span>입단 연도</span>
                <strong>{activeUser.playerJoinYear || activeUser.joinYear || '-'}</strong>
              </div>"""

replacement1 = """              <div className="info-item">
                <span>입단 연도</span>
                <strong>
                  {activeUser.playerJoinYear || activeUser.joinYear 
                    ? `${activeUser.playerJoinYear || activeUser.joinYear} (${
                        (() => {
                          const joinDate = activeUser.playerJoinYear || activeUser.joinYear;
                          if (joinDate && joinDate.includes('-')) {
                            const joinYearNum = new Date(joinDate).getFullYear();
                            const currentYear = new Date().getFullYear();
                            return currentYear - joinYearNum + 1;
                          }
                          return '-';
                        })()
                      }년차)`
                    : '-'}
                </strong>
              </div>"""

target2 = """                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">입단 연도</span>
                      <span className="font-semibold text-sm text-white">{editJoinYear || '-'}</span>
                    </div>"""

replacement2 = """                    <div className="flex justify-between items-center py-2 first:pt-0 last:pb-0">
                      <span className="text-[var(--text-muted)] text-sm">입단 연도</span>
                      <span className="font-semibold text-sm text-white">
                        {editJoinYear 
                          ? `${editJoinYear} (${
                              (() => {
                                if (editJoinYear && editJoinYear.includes('-')) {
                                  const joinYearNum = new Date(editJoinYear).getFullYear();
                                  const currentYear = new Date().getFullYear();
                                  return currentYear - joinYearNum + 1;
                                }
                                return '-';
                              })()
                            }년차)`
                          : '-'}
                      </span>
                    </div>"""


if target1 in content:
    content = content.replace(target1, replacement1)
    print("Replaced target1")
else:
    print("Could not find target1")

if target2 in content:
    content = content.replace(target2, replacement2)
    print("Replaced target2")
else:
    print("Could not find target2")

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
