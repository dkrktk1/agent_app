import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update age font size
content = content.replace(
    '<p className="text-xs text-[var(--text-muted)] mb-1">{formatPlayerAge(p)}</p>',
    '<p className="text-[13px] text-[var(--text-muted)] mb-1">{formatPlayerAge(p)}</p>'
)

content = content.replace(
    '<p className="text-xs text-[var(--text-muted)] mb-1">{formatPlayerAge(activePlayer)}</p>',
    '<p className="text-[13px] text-[var(--text-muted)] mb-1">{formatPlayerAge(activePlayer)}</p>'
)

# Update renderPlayerDetails spacing
old_render = """      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] text-[var(--text-muted)] mt-0.5 mb-[14px]">"""
new_render = """      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] text-[var(--text-muted)] mt-0.5 mb-1">"""
content = content.replace(old_render, new_render)

# Add top margin to badges to simulate 1 line gap (approx 20px - 24px)
content = content.replace(
    '<div className="player-badges">',
    '<div className="player-badges mt-[24px]">'
)

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
