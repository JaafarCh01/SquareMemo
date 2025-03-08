import { db } from '../config/firebase';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';

// User Profiles
export async function createUserProfile(userId, data) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    totalTrainingTime: 0,
    totalCorrectAnswers: 0,
    totalAttempts: 0,
    dailyStreak: 0,
    lastTrainingDate: null,
  });
}

export async function getUserProfile(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
}

export async function updateUserProfile(userId, data) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// Training Sessions
export async function createTrainingSession(userId, sessionData) {
  const sessionsRef = collection(db, 'users', userId, 'training_sessions');
  return addDoc(sessionsRef, {
    ...sessionData,
    timestamp: serverTimestamp(),
  });
}

export async function getRecentTrainingSessions(userId, limit = 10) {
  const sessionsRef = collection(db, 'users', userId, 'training_sessions');
  const q = query(
    sessionsRef,
    orderBy('timestamp', 'desc'),
    limit(limit)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// User Settings
export async function updateUserSettings(userId, settings) {
  const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
  await setDoc(settingsRef, {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function getUserSettings(userId) {
  const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
  const settingsSnap = await getDoc(settingsRef);
  return settingsSnap.exists() ? settingsSnap.data() : null;
}

// Progress Tracking
export async function updateUserProgress(userId, progressData) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  // Update daily streak
  const lastTrainingDate = userData.lastTrainingDate?.toDate();
  const today = new Date();
  const isConsecutiveDay = lastTrainingDate &&
    today.getDate() - lastTrainingDate.getDate() === 1;

  await updateDoc(userRef, {
    totalTrainingTime: userData.totalTrainingTime + (progressData.trainingTime || 0),
    totalCorrectAnswers: userData.totalCorrectAnswers + (progressData.correctAnswers || 0),
    totalAttempts: userData.totalAttempts + (progressData.attempts || 0),
    dailyStreak: isConsecutiveDay ? userData.dailyStreak + 1 : 1,
    lastTrainingDate: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Analytics
export async function getProgressStats(userId) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  const recentSessions = await getRecentTrainingSessions(userId, 30);
  
  return {
    totalStats: {
      trainingTime: userData.totalTrainingTime,
      correctAnswers: userData.totalCorrectAnswers,
      attempts: userData.totalAttempts,
      accuracy: userData.totalAttempts > 0 
        ? (userData.totalCorrectAnswers / userData.totalAttempts * 100).toFixed(1)
        : 0,
    },
    dailyStreak: userData.dailyStreak,
    recentSessions,
  };
} 