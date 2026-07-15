import re
with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern2 = r"      \{deleteConfirmModal\.isOpen && \(\n        <div className=\"fixed inset-0 z-\[1200\].*?</div>\n      \)\}\n"

# Find all matches
matches2 = re.findall(pattern2, content, flags=re.DOTALL)

if matches2:
    print(f"Found {len(matches2)} matches of modal")
    first_match2 = matches2[0]
    content = re.sub(pattern2, "@@@MARKER2@@@", content, flags=re.DOTALL)
    content = content.replace("@@@MARKER2@@@", first_match2, 1)
    content = content.replace("@@@MARKER2@@@", "")
    
with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
