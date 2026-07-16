import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
'''
.role-selector-container {
  margin-bottom: 16px;
}
.role-selector-container label {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 8px;
}''',
'''
.role-selector-container {
  margin-bottom: 12px;
}
.role-selector-container > label {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-bottom: 8px;
}'''
)

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(content)
