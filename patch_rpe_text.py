import re

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    helper = """const getRpeText = (rpe: number | string) => {
  const r = Number(rpe);
  if (r === 10) return '최대 노력';
  if (r === 9) return '매우 힘듦';
  if (r >= 7) return '격렬함';
  if (r >= 4) return '적당함';
  if (r >= 2) return '가벼움';
  if (r === 1) return '매우 가벼움';
  return '';
};
"""

    # Add helper function at the top of the file, after imports
    if 'const getRpeText' not in content:
        import_end = content.rfind("import ")
        if import_end != -1:
            line_end = content.find("\n", import_end)
            content = content[:line_end+1] + "\n" + helper + content[line_end+1:]
        else:
            content = helper + "\n" + content

    target = "{session.rpe ? <span className=\"text-[11px] text-[var(--primary-color)] font-bold\">{session.rpe}단계</span> : null}"
    replace = "{session.rpe ? <span className=\"text-[11px] text-[var(--primary-color)] font-bold\">{session.rpe}단계 ({getRpeText(session.rpe)})</span> : null}"
    
    content = content.replace(target, replace)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Updated {filepath}")

update_file('src/components/CareTab.tsx')
update_file('src/components/ScheduleTab.tsx')
