import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """<button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => setIsDailyLogOpen(true)}>"""

new_code = """<button className="flex items-center gap-1.5 text-[var(--primary-color)] font-bold text-sm hover:opacity-80 transition-opacity" onClick={() => {
          setLogDuration('');
          setLogGripLeft('');
          setLogGripRight('');
          setIsDailyLogOpen(true);
        }}>"""

content = content.replace(old_code, new_code)

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
