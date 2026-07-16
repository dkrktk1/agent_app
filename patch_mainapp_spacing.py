import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update renderPlayerDetails
old_render = """      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[var(--text-muted)] mt-0.5">"""
new_render = """      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[13px] text-[var(--text-muted)] mt-0.5 mb-[14px]">"""
content = content.replace(old_render, new_render)

# Remove mt-5 from player-badges
content = content.replace('<div className="player-badges mt-5">', '<div className="player-badges">')
content = content.replace('<div className="player-badges mt-2">', '<div className="player-badges">')

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
