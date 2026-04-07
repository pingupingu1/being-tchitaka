// ═══════════════════════════════════════════════════════════════════
//  BEING TCHITAKA — Firebase Auth + Firestore Integration
//  Drop this file into your project and import what you need.
//  Works with: Firebase v9+ (modular SDK)
// ═══════════════════════════════════════════════════════════════════

// ─── STEP 1: Install Firebase ────────────────────────────────────
//   npm install firebase
//   or
//   yarn add firebase

// ─── STEP 2: Create a Firebase project ───────────────────────────
//   1. Go to https://console.firebase.google.com
//   2. Create a new project called "being-tchitaka"
//   3. Enable Authentication (Email/Password + Google)
//   4. Enable Firestore Database (start in production mode)
//   5. Copy your config below

// ─── STEP 3: Replace this config with your own ───────────────────
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";

// ✅ FIXED — now reads from .env file instead of hardcoded strings
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ════════════════════════════════════════════════════════════════════
//  AUTHENTICATION
// ════════════════════════════════════════════════════════════════════

/**
 * Register a new user with email + password.
 * Also creates a user profile document in Firestore.
 *
 * Usage:
 *   const { user, error } = await registerUser("alex@email.com", "password123", "Alex");
 */
export async function registerUser(email, password, displayName) {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    // Set display name on Firebase Auth profile
    await updateProfile(user, { displayName });

    // Create user profile document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid:         user.uid,
      displayName,
      email:       user.email,
      plan:        "free",           // "free" | "premium"
      growthScore: 0,
      streak:      0,
      lastCheckIn: null,
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    });

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with email + password.
 *
 * Usage:
 *   const { user, error } = await loginUser("alex@email.com", "password123");
 */
export async function loginUser(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: credential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Sign in with Google popup.
 *
 * Usage:
 *   const { user, error } = await loginWithGoogle();
 */
export async function loginWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;

    // Create profile doc only if first sign-in
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid:         user.uid,
        displayName: user.displayName,
        email:       user.email,
        plan:        "free",
        growthScore: 0,
        streak:      0,
        lastCheckIn: null,
        createdAt:   serverTimestamp(),
        updatedAt:   serverTimestamp(),
      });
    }

    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
}

/**
 * Send password reset email.
 *
 * Usage:
 *   await resetPassword("alex@email.com");
 */
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Sign out the current user.
 *
 * Usage:
 *   await logoutUser();
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Listen to auth state changes — use this in your App root.
 * Returns the unsubscribe function.
 *
 * Usage:
 *   useEffect(() => {
 *     const unsub = onAuthChange((user) => setCurrentUser(user));
 *     return () => unsub();
 *   }, []);
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ════════════════════════════════════════════════════════════════════
//  USER PROFILE
// ════════════════════════════════════════════════════════════════════

/**
 * Get the current user's profile from Firestore.
 *
 * Usage:
 *   const { profile } = await getUserProfile(user.uid);
 */
export async function getUserProfile(uid) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) return { profile: snap.data(), error: null };
    return { profile: null, error: "User not found" };
  } catch (error) {
    return { profile: null, error: error.message };
  }
}

/**
 * Update a user's profile fields.
 *
 * Usage:
 *   await updateUserProfile(user.uid, { plan: "premium", growthScore: 72 });
 */
export async function updateUserProfile(uid, fields) {
  try {
    await updateDoc(doc(db, "users", uid), {
      ...fields,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ════════════════════════════════════════════════════════════════════
//  DAILY CHECK-IN
// ════════════════════════════════════════════════════════════════════

/**
 * Save a daily check-in for the current user.
 * One check-in per day — overwrites if same date exists.
 *
 * Usage:
 *   await saveCheckIn(user.uid, {
 *     mood:         2,          // emoji index 0-4
 *     stress:       4,
 *     energy:       3,
 *     focus:        3,
 *     relationship: 3,
 *   });
 */
export async function saveCheckIn(uid, data) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const ref = doc(db, "users", uid, "checkIns", today);
    await setDoc(ref, {
      ...data,
      date:      today,
      createdAt: serverTimestamp(),
    });

    // Update streak + lastCheckIn on user profile
    await updateDoc(doc(db, "users", uid), {
      lastCheckIn: serverTimestamp(),
      updatedAt:   serverTimestamp(),
    });

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Get the last 7 days of check-ins for a user.
 *
 * Usage:
 *   const { checkIns } = await getRecentCheckIns(user.uid);
 */
export async function getRecentCheckIns(uid) {
  try {
    const ref = collection(db, "users", uid, "checkIns");
    const q   = query(ref, orderBy("date", "desc"), limit(7));
    const snap = await getDocs(q);
    const checkIns = snap.docs.map(d => d.data());
    return { checkIns, error: null };
  } catch (error) {
    return { checkIns: [], error: error.message };
  }
}

// ════════════════════════════════════════════════════════════════════
//  JOURNAL ENTRIES — Securely stored per user
// ════════════════════════════════════════════════════════════════════

/**
 * Save a journal entry.
 *
 * Usage:
 *   await saveJournalEntry(user.uid, { mood: "grateful", text: "I am grateful for..." });
 */
export async function saveJournalEntry(uid, { mood, text }) {
  try {
    const ref = collection(db, "users", uid, "journal");
    const docRef = await addDoc(ref, {
      mood,
      text,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
}

/**
 * Get all journal entries for a user, newest first.
 *
 * Usage:
 *   const { entries } = await getJournalEntries(user.uid);
 */
export async function getJournalEntries(uid) {
  try {
    const ref  = collection(db, "users", uid, "journal");
    const q    = query(ref, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { entries, error: null };
  } catch (error) {
    return { entries: [], error: error.message };
  }
}

/**
 * Subscribe to journal entries in real-time.
 * Returns the unsubscribe function.
 *
 * Usage:
 *   useEffect(() => {
 *     const unsub = subscribeToJournal(user.uid, (entries) => setEntries(entries));
 *     return () => unsub();
 *   }, [user.uid]);
 */
export function subscribeToJournal(uid, callback) {
  const ref = collection(db, "users", uid, "journal");
  const q   = query(ref, orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const entries = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(entries);
  });
}

/**
 * Delete a journal entry.
 *
 * Usage:
 *   await deleteJournalEntry(user.uid, entryId);
 */
export async function deleteJournalEntry(uid, entryId) {
  try {
    await deleteDoc(doc(db, "users", uid, "journal", entryId));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ════════════════════════════════════════════════════════════════════
//  BOOKING / CONSULTATIONS
// ════════════════════════════════════════════════════════════════════

/**
 * Save a confirmed booking after Stripe payment.
 *
 * Usage:
 *   await saveBooking(user.uid, { slot: "Mon 9:00 AM", stripePaymentId: "pi_xxxxx", amount: 9900 });
 */
export async function saveBooking(uid, { slot, stripePaymentId, amount }) {
  try {
    const ref = collection(db, "bookings");
    const docRef = await addDoc(ref, {
      uid,
      slot,
      stripePaymentId,
      amount,
      status:    "confirmed",
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
}

/**
 * Get all bookings for a user.
 *
 * Usage:
 *   const { bookings } = await getUserBookings(user.uid);
 */
export async function getUserBookings(uid) {
  try {
    const ref  = collection(db, "bookings");
    const q    = query(ref, where("uid","==",uid), orderBy("createdAt","desc"));
    const snap = await getDocs(q);
    const bookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { bookings, error: null };
  } catch (error) {
    return { bookings: [], error: error.message };
  }
}

// ════════════════════════════════════════════════════════════════════
//  STREAK CALCULATOR
// ════════════════════════════════════════════════════════════════════

/**
 * Calculate and update the user's current streak.
 * Call this after each successful check-in.
 *
 * Usage:
 *   const { streak } = await calculateStreak(user.uid);
 */
export async function calculateStreak(uid) {
  try {
    const { checkIns } = await getRecentCheckIns(uid);
    if (!checkIns.length) return { streak: 0, error: null };

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < checkIns.length; i++) {
      const checkDate = new Date(checkIns[i].date);
      const diffDays  = Math.round((today - checkDate) / (1000 * 60 * 60 * 24));
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }

    await updateDoc(doc(db, "users", uid), { streak, updatedAt: serverTimestamp() });
    return { streak, error: null };
  } catch (error) {
    return { streak: 0, error: error.message };
  }
}

export { auth, db };
