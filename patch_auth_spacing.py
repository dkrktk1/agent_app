import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '''<div className="mb-3">
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px]">생년월일</label>''',
    '''<div className="mb-[12px]">
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px]">생년월일</label>'''
)

content = content.replace(
    '''<div className="mb-3">
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px]">입단 연도</label>''',
    '''<div className="mb-[12px]">
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px] mt-[8px]">입단 연도</label>'''
)

# And for the input margin-bottom: 12px on the second date input (which they requested)
# Wait, if we keep !mb-0 on the input-group, the mb-[12px] on the wrapper provides the 12px bottom margin.
# If they specifically clicked the input and said margin-bottom: 12px, maybe we should just remove !mb-0 and remove mb-[12px] from wrapper?
# Actually, let's remove !mb-0 and make the wrapper just a div.

content = content.replace(
    '''<div className="mb-[12px]">
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px]">생년월일</label>
                  <div className="input-group !mb-0">''',
    '''<div>
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px]">생년월일</label>
                  <div className="input-group mb-[12px]">'''
)

content = content.replace(
    '''<div className="mb-[12px]">
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px] mt-[8px]">입단 연도</label>
                  <div className="input-group !mb-0">''',
    '''<div>
                  <label className="text-[13px] text-[var(--text-muted)] block mb-[6px] mt-[8px]">입단 연도</label>
                  <div className="input-group mb-[12px]">'''
)

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
