import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '''
.summary-info p {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 6px;
}''',
    '''
.summary-info p {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 6px;
}'''
)

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(content)
