import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<div className="player-badges mt-2">', '<div className="player-badges mt-5">')

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
