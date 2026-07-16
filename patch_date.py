import re

with open('src/components/ScheduleTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """          <button 
            onClick={() => {
              setEditingEventOriginalIndex(null);
              setNewEventDate('');"""

replacement = """          <button 
            onClick={() => {
              setEditingEventOriginalIndex(null);
              
              const today = new Date();
              const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
              setNewEventDate(localDate);"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("ScheduleTab marker not found")

with open('src/components/ScheduleTab.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
