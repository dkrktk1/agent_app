import re
with open('src/index.css', 'r', encoding='utf-8') as f:
    content = f.read()

old_css = """
.input-group-select select {
  width: 100%;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 12px;
  color: #fff;
  font-size: 14px;
  outline: none;
}
"""

new_css = """
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
}
"""

content = content.replace(old_css, new_css)
with open('src/index.css', 'w', encoding='utf-8') as f:
    f.write(content)
