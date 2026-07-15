import re
with open('src/components/CareTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"  const \[deleteConfirmModal.*?setDeleteConfirmModal\(\{ isOpen: false, index: null, type: null \}\);\n  };\n"

# Find all matches
matches = re.findall(pattern, content, flags=re.DOTALL)

if matches:
    print(f"Found {len(matches)} matches")
    # Replace all matches with empty string, but keep the first one
    first_match = matches[0]
    # Actually, let's just replace all with a placeholder, then replace the first placeholder with first_match
    content = re.sub(pattern, "@@@MARKER@@@", content, flags=re.DOTALL)
    content = content.replace("@@@MARKER@@@", first_match, 1)
    content = content.replace("@@@MARKER@@@", "")
    
with open('src/components/CareTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
