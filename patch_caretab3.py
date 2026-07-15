import re

with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """        <p style={{ color }} className="font-bold m-0">
          ACWR : {value}
        </p>"""

replacement = """        <p style={{ color }} className="font-bold m-0">
          ACWR : {Number(value).toFixed(2)}
        </p>"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("Warning: marker not found in CareTab tooltip!")

with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
