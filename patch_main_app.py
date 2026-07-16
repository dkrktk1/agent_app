import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target_age_func = """  const formatPlayerAge = (p: any) => {
    let ageStr = p.age || '';
    if (ageStr && ageStr.includes('-')) {
      const today = new Date();
      const birthDate = new Date(ageStr);
      let calcAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calcAge--;
      }
      return `${ageStr} (${calcAge}세)`;
    }
    return ageStr;
  };"""

replacement_age_func = """  const formatPlayerAge = (p: any) => {
    let ageStr = p.age || '';
    if (ageStr && ageStr.includes('-')) {
      const today = new Date();
      const birthDate = new Date(ageStr);
      let calcAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calcAge--;
      }
      return `${ageStr} (${calcAge}세)`;
    }
    return ageStr;
  };

  const formatPlayerServiceAndSalary = (p: any) => {
    const parts = [];
    if (p.playerJoinYear || p.joinYear) {
      const joinDateStr = p.playerJoinYear || p.joinYear;
      if (joinDateStr.includes('-')) {
        const joinYear = new Date(joinDateStr).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsOfService = currentYear - joinYear + 1;
        parts.push(`${yearsOfService}년차`);
      }
    }
    if (p.playerSalary || p.salary) {
      parts.push(formatKoreanCurrency(p.playerSalary || p.salary));
    }
    return parts.join(' · ');
  };"""

if target_age_func in content:
    content = content.replace(target_age_func, replacement_age_func)
else:
    print("target_age_func not found!")

target_render_1 = """<p className="text-[13px] text-[var(--text-muted)] mb-1">{formatPlayerAge(p)}</p>
              {renderPlayerDetails(p)}"""

replacement_render_1 = """<p className="text-[13px] text-[var(--text-muted)] mb-1">
                {formatPlayerAge(p)}
                <span className="block mt-0.5">{formatPlayerServiceAndSalary(p)}</span>
              </p>
              {renderPlayerDetails(p)}"""

if target_render_1 in content:
    content = content.replace(target_render_1, replacement_render_1)
else:
    print("target_render_1 not found!")

target_render_2 = """<p className="text-[13px] text-[var(--text-muted)] mb-1">{formatPlayerAge(activePlayer)}</p>
                  {renderPlayerDetails(activePlayer)}"""

replacement_render_2 = """<p className="text-[13px] text-[var(--text-muted)] mb-1">
                    {formatPlayerAge(activePlayer)}
                    <span className="block mt-0.5">{formatPlayerServiceAndSalary(activePlayer)}</span>
                  </p>
                  {renderPlayerDetails(activePlayer)}"""

if target_render_2 in content:
    content = content.replace(target_render_2, replacement_render_2)
else:
    print("target_render_2 not found!")

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
