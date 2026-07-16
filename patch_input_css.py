import re

with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Update .input-group span
content = content.replace(
    '''
.input-group span.material-icons-round {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 20px;
}''',
    '''
.input-group span.material-icons-round {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  font-size: 16px;
}'''
)

# Update .input-group input
content = content.replace(
    '''
.input-group input {
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 14px 14px 14px 44px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: var(--transition-smooth);
}''',
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
}'''
)

# Update .input-group-select select/input
content = content.replace(
    '''
.input-group-select select,
.input-group-select input[type="date"],
.input-group-select input[type="text"],
.input-group-select input[type="number"] {
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
}''',
    '''
.input-group-select select,
.input-group-select input[type="date"],
.input-group-select input[type="text"],
.input-group-select input[type="number"] {
  width: 100%;
  height: 30px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 0 12px;
  color: #fff;
  font-size: 13px;
  outline: none;
}'''
)

# Also adjust marginBottom on the groups to be a bit tighter
content = content.replace(
    '''
.input-group {
  position: relative;
  margin-bottom: 16px;
  width: 100%;
}''',
    '''
.input-group {
  position: relative;
  margin-bottom: 12px;
  width: 100%;
}'''
)

content = content.replace(
    '''
.input-group-select {
  margin-bottom: 16px;
  width: 100%;
}''',
    '''
.input-group-select {
  margin-bottom: 12px;
  width: 100%;
}'''
)


with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(content)

