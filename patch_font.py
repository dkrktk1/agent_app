import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """.summary-info h2 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 600;
  font-style: italic;
}"""

replacement = """.summary-info h2 {
  font-size: 20px;
  font-weight: 600;
}"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("index.css marker not found")

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(content)
