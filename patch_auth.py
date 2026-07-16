import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update .role-option
content = content.replace(
    '''
.role-option {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid var(--card-border);
  background: rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: var(--transition-smooth);
}''',
    '''
.role-option {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid var(--card-border);
  background: rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: var(--transition-smooth);
}'''
)

# Fix .input-group input/select padding to make sure it aligns with date
# Date inputs have extra internal padding sometimes. Let's increase the padding-left to 36px or 40px for selects to match date text.
# Let's check what it currently is: padding: 0 12px 0 32px;
content = content.replace(
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
}''',
    '''
.input-group input,
.input-group select {
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 0 12px 0 36px;
  color: #fff;
  font-size: 13px;
  outline: none;
  transition: var(--transition-smooth);
}'''
)

with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(content)

