import re

with open('src/components/MyPageTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_code = """      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1000] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">"""

new_code = """      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[1300] overflow-y-auto bg-black/60 backdrop-blur-sm p-4 flex justify-center items-center">"""

content = content.replace(old_code, new_code)

with open('src/components/MyPageTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
