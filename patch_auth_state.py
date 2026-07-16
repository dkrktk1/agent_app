import re

with open('src/components/AuthScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const [playerSalary, setPlayerSalary] = useState('');",
    "const [playerSalary, setPlayerSalary] = useState('');\n  const [playerJoinYear, setPlayerJoinYear] = useState('');"
)

# Also update handleSignup to include joinYear in the profile
content = content.replace(
    '''            salary: playerSalary,
            role: 'player',
            status: 'warning',''',
    '''            salary: playerSalary,
            joinYear: playerJoinYear,
            role: 'player',
            status: 'warning','''
)

with open('src/components/AuthScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
