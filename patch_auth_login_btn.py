import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '''<button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? '연결 중...' : '로그인'}
            </button>''',
    '''<button type="submit" className="btn-primary !h-[30px] !py-0 text-[13px]" disabled={isLoading}>
              {isLoading ? '연결 중...' : '로그인'}
            </button>'''
)

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
