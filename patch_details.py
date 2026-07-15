import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """  const formatPlayerDetails = (p: any) => {
    const teamNum = p.number ? `${p.team} No.${p.number}` : p.team;
    const parts = [
      teamNum,
      p.position,
      p.handedness
    ].filter(Boolean);
    return parts.join(' • ');
  };"""

replacement = """  const renderPlayerDetails = (p: any) => {
    const teamNum = p.number ? `${p.team} No.${p.number}` : p.team;
    const parts = [
      teamNum,
      p.position,
      p.handedness
    ].filter(Boolean);
    return (
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[var(--text-muted)] mt-0.5">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            <span className="whitespace-nowrap">{part}</span>
            {i < parts.length - 1 && <span className="text-[var(--card-border)]">•</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("MainApp marker 1 not found")

content = content.replace('<p className="text-xs text-[var(--text-muted)]">{formatPlayerDetails(p)}</p>', '{renderPlayerDetails(p)}')
content = content.replace('<p className="text-xs text-[var(--text-muted)]">{formatPlayerDetails(activePlayer)}</p>', '{renderPlayerDetails(activePlayer)}')

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
