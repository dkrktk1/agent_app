import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '''
.input-group input {
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 0 12px 0 32px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: var(--transition-smooth);
}''',
    '''
.input-group input,
.input-group select {
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 0 12px 0 32px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: var(--transition-smooth);
}'''
)

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(content)
