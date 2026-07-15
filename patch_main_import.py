import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { savePlayerProfile, getPlayerProfile } from '../lib/api';", "import { savePlayerProfile, getPlayerProfile, deletePlayerProfile } from '../lib/api';")

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
