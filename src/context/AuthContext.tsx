import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, StudentProfile, UserRole } from '../types';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { INITIAL_USERS, INITIAL_STUDENTS } from '../utils/seedData';

interface AuthContextType {
  currentUser: User | null;
  studentProfile: StudentProfile | null;
  role: UserRole | null;
  loading: boolean;
  loginError: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Strict null default
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize Auth state from Firebase or Saved Storage
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFirebaseConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && db) {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid);
            const userSnap = await getDoc(userDocRef);

            if (userSnap.exists()) {
              const userData = userSnap.data() as User;
              setCurrentUser({ ...userData, id: firebaseUser.uid });

              if (userData.role === 'student') {
                const stuDocRef = doc(db, 'students', firebaseUser.uid);
                const stuSnap = await getDoc(stuDocRef);
                if (stuSnap.exists()) {
                  setStudentProfile(stuSnap.data() as StudentProfile);
                }
              }
            } else {
              // Account profile not found in database!
              await signOut(auth);
              setCurrentUser(null);
              setStudentProfile(null);
              setLoginError("Account profile not found in database. Contact Admin.");
            }
          } catch (err) {
            console.error("Error fetching user profile from Firestore:", err);
          }
        } else {
          // Check local storage session
          const savedUser = localStorage.getItem('slm_auth_user');
          if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setCurrentUser(parsed);
          }
        }
        setLoading(false);
      });
    } else {
      const savedUser = localStorage.getItem('slm_auth_user');
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
          setCurrentUser(null);
        }
      }
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Synchronize student profile from local/Firestore state when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('slm_auth_user', JSON.stringify(currentUser));

      if (currentUser.role === 'student') {
        const savedStudentsStr = localStorage.getItem('slm_students');
        const studentsList: StudentProfile[] = savedStudentsStr
          ? JSON.parse(savedStudentsStr)
          : INITIAL_STUDENTS;

        const found = studentsList.find(
          (s) => s.userId === currentUser.id || s.email.toLowerCase() === currentUser.email.toLowerCase()
        );
        setStudentProfile(found || null);
      } else {
        setStudentProfile(null);
      }
    } else {
      localStorage.removeItem('slm_auth_user');
      setStudentProfile(null);
    }
  }, [currentUser]);

  // Strict Firebase + Database Auth Flow
  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setLoginError(null);

    try {
      if (isFirebaseConfigured && auth && db) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, pass);
          const uid = userCredential.user.uid;

          // Fetch user document from Firestore
          const userDocRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userDocRef);

          if (!userSnap.exists()) {
            await signOut(auth);
            setCurrentUser(null);
            setStudentProfile(null);
            const msg = "Account profile not found in database. Contact Admin.";
            setLoginError(msg);
            setLoading(false);
            return { success: false, message: msg };
          }

          const userData = userSnap.data() as User;
          const userObj: User = { ...userData, id: uid };
          setCurrentUser(userObj);

          if (userObj.role === 'student') {
            const stuDocRef = doc(db, 'students', uid);
            const stuSnap = await getDoc(stuDocRef);
            if (stuSnap.exists()) {
              setStudentProfile(stuSnap.data() as StudentProfile);
            }
          }

          setLoading(false);
          return { success: true };
        } catch (firebaseErr: any) {
          console.warn("Firebase Auth failed, attempting local record match", firebaseErr);
        }
      }

      // Local state record lookup
      const savedUsersStr = localStorage.getItem('slm_users');
      const allUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : INITIAL_USERS;

      const foundUser = allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        setCurrentUser(foundUser);
        setLoading(false);
        return { success: true };
      }

      const msg = "Account profile not found in database. Contact Admin.";
      setLoginError(msg);
      setLoading(false);
      return { success: false, message: msg };
    } catch (err: any) {
      const msg = err.message || "Authentication failed. Contact Admin.";
      setLoginError(msg);
      setLoading(false);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    if (isFirebaseConfigured && auth) {
      signOut(auth).catch(() => {});
    }
    localStorage.removeItem('slm_auth_user');
    setCurrentUser(null);
    setStudentProfile(null);
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const savedUsersStr = localStorage.getItem('slm_users');
    const allUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : INITIAL_USERS;
    const user = allUsers.find((u) => u.role === targetRole);
    if (user) {
      setCurrentUser(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        studentProfile,
        role: currentUser ? currentUser.role : null,
        loading,
        loginError,
        login,
        logout,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
