import re

with open('src/lib/api.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { collection, doc, setDoc, getDocs, query, where, orderBy, getDoc } from 'firebase/firestore';", "import { collection, doc, setDoc, getDocs, query, where, orderBy, getDoc, deleteDoc } from 'firebase/firestore';")

new_func = """

export async function deletePlayerProfile(userId: string) {
  const docRef = doc(db, 'users', userId);
  await deleteDoc(docRef);
}"""

content += new_func

with open('src/lib/api.ts', 'w', encoding='utf-8') as f:
    f.write(content)
