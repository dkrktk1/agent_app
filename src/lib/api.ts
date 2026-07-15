import { db } from './firebase';
import { collection, doc, setDoc, getDocs, query, where, orderBy, getDoc, deleteDoc } from 'firebase/firestore';

export async function saveDailyLog(userId: string, date: string, data: any) {
  const docRef = doc(db, 'daily_logs', `${userId}_${date}`);
  const cleanData = JSON.parse(JSON.stringify({
    userId,
    date,
    ...data,
    createdAt: new Date().toISOString()
  }));
  await setDoc(docRef, cleanData, { merge: true });
}

export async function getDailyLogs(userId: string) {
  const q = query(collection(db, 'daily_logs'), where('userId', '==', userId), orderBy('date', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

export async function savePlayerProfile(userId: string, data: any) {
  const docRef = doc(db, 'users', userId);
  const cleanData = JSON.parse(JSON.stringify({
    ...data,
    updatedAt: new Date().toISOString()
  }));
  await setDoc(docRef, cleanData, { merge: true });
}

export async function getPlayerProfile(userId: string) {
  const docRef = doc(db, 'users', userId);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? snapshot.data() : null;
}


export async function deletePlayerProfile(userId: string) {
  const docRef = doc(db, 'users', userId);
  await deleteDoc(docRef);
}