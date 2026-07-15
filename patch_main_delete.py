import re

with open('src/components/MainApp.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

marker = """            onDeletePlayer={async (id) => {
              const updated = { ...allPlayers };
              delete updated[id];
              setAllPlayers(updated);
              
              try {
                // Should delete from firebase too but keep simple
              } catch(e) {}
            }}"""

replacement = """            onDeletePlayer={async (id) => {
              const updated = { ...allPlayers };
              delete updated[id];
              setAllPlayers(updated);
              
              try {
                await deletePlayerProfile(id);
              } catch(e) {
                console.error("Error deleting profile:", e);
              }
            }}"""

if marker in content:
    content = content.replace(marker, replacement)
else:
    print("MainApp marker not found")

with open('src/components/MainApp.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
