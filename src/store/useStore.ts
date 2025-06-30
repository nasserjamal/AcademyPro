import { create } from 'zustand';
import { Student, Guardian, Group, Coach, Session, Drill, Assessment, Fee, Expense, Announcement, Event, User, Academy } from '../types';
import { mockData } from '../data/mockData';

// Configuration flag to switch between mockup and Firebase backend
const USE_FIREBASE_BACKEND = false;

// Firebase imports and operations
let auth: any = null;
let db: any = null;
let storage: any = null;

// Firebase operations object
const firebaseOperations = {
  // Initialize Firebase (will be called when needed)
  initializeFirebase: async () => {
    if (USE_FIREBASE_BACKEND && !auth) {
      try {
        const { auth: firebaseAuth, db: firebaseDb, storage: firebaseStorage } = await import('../config/firebase');
        auth = firebaseAuth;
        db = firebaseDb;
        storage = firebaseStorage;
        console.log('Firebase initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        throw new Error('Firebase initialization failed. Please check your configuration.');
      }
    }
  },

  // Authentication
  signInWithEmailAndPassword: async (email: string, password: string) => {
    await firebaseOperations.initializeFirebase();
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  signOut: async () => {
    await firebaseOperations.initializeFirebase();
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  },

  onAuthStateChanged: async (callback: (user: any) => void) => {
    await firebaseOperations.initializeFirebase();
    const { onAuthStateChanged } = await import('firebase/auth');
    return onAuthStateChanged(auth, callback);
  },

  // Firestore operations
  fetchUserProfile: async (uid: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, getDoc } = await import('firebase/firestore');
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } : null;
  },

  // Students
  addStudent: async (student: Student) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'students'), student);
    console.log('Firebase: Student added with ID:', docRef.id);
    return docRef.id;
  },

  updateStudent: async (id: string, updates: Partial<Student>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'students', id), updates);
    console.log(`Firebase: Student ${id} updated`);
  },

  deleteStudent: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'students', id));
    console.log(`Firebase: Student ${id} deleted`);
  },

  fetchStudents: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'students'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'students');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Guardians
  addGuardian: async (guardian: Guardian) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'guardians'), guardian);
    console.log('Firebase: Guardian added with ID:', docRef.id);
    return docRef.id;
  },

  updateGuardian: async (id: string, updates: Partial<Guardian>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'guardians', id), updates);
    console.log(`Firebase: Guardian ${id} updated`);
  },

  deleteGuardian: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'guardians', id));
    console.log(`Firebase: Guardian ${id} deleted`);
  },

  fetchGuardians: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'guardians'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'guardians');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Groups
  addGroup: async (group: Group) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'groups'), group);
    console.log('Firebase: Group added with ID:', docRef.id);
    return docRef.id;
  },

  updateGroup: async (id: string, updates: Partial<Group>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'groups', id), updates);
    console.log(`Firebase: Group ${id} updated`);
  },

  deleteGroup: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'groups', id));
    console.log(`Firebase: Group ${id} deleted`);
  },

  fetchGroups: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'groups'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'groups');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Coaches
  addCoach: async (coach: Coach) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'coaches'), coach);
    console.log('Firebase: Coach added with ID:', docRef.id);
    return docRef.id;
  },

  updateCoach: async (id: string, updates: Partial<Coach>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'coaches', id), updates);
    console.log(`Firebase: Coach ${id} updated`);
  },

  deleteCoach: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'coaches', id));
    console.log(`Firebase: Coach ${id} deleted`);
  },

  fetchCoaches: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'coaches'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'coaches');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Sessions
  addSession: async (session: Session) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'sessions'), session);
    console.log('Firebase: Session added with ID:', docRef.id);
    return docRef.id;
  },

  updateSession: async (id: string, updates: Partial<Session>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'sessions', id), updates);
    console.log(`Firebase: Session ${id} updated`);
  },

  deleteSession: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'sessions', id));
    console.log(`Firebase: Session ${id} deleted`);
  },

  fetchSessions: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'sessions'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'sessions');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Drills
  addDrill: async (drill: Drill) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'drills'), drill);
    console.log('Firebase: Drill added with ID:', docRef.id);
    return docRef.id;
  },

  updateDrill: async (id: string, updates: Partial<Drill>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'drills', id), updates);
    console.log(`Firebase: Drill ${id} updated`);
  },

  deleteDrill: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'drills', id));
    console.log(`Firebase: Drill ${id} deleted`);
  },

  fetchDrills: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'drills'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'drills');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Assessments
  addAssessment: async (assessment: Assessment) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'assessments'), assessment);
    console.log('Firebase: Assessment added with ID:', docRef.id);
    return docRef.id;
  },

  updateAssessment: async (id: string, updates: Partial<Assessment>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'assessments', id), updates);
    console.log(`Firebase: Assessment ${id} updated`);
  },

  deleteAssessment: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'assessments', id));
    console.log(`Firebase: Assessment ${id} deleted`);
  },

  fetchAssessments: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'assessments'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'assessments');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Fees
  addFee: async (fee: Fee) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'fees'), fee);
    console.log('Firebase: Fee added with ID:', docRef.id);
    return docRef.id;
  },

  updateFee: async (id: string, updates: Partial<Fee>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'fees', id), updates);
    console.log(`Firebase: Fee ${id} updated`);
  },

  fetchFees: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'fees'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'fees');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Expenses
  addExpense: async (expense: Expense) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'expenses'), expense);
    console.log('Firebase: Expense added with ID:', docRef.id);
    return docRef.id;
  },

  updateExpense: async (id: string, updates: Partial<Expense>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'expenses', id), updates);
    console.log(`Firebase: Expense ${id} updated`);
  },

  fetchExpenses: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'expenses'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'expenses');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Announcements
  addAnnouncement: async (announcement: Announcement) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'announcements'), announcement);
    console.log('Firebase: Announcement added with ID:', docRef.id);
    return docRef.id;
  },

  updateAnnouncement: async (id: string, updates: Partial<Announcement>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'announcements', id), updates);
    console.log(`Firebase: Announcement ${id} updated`);
  },

  deleteAnnouncement: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'announcements', id));
    console.log(`Firebase: Announcement ${id} deleted`);
  },

  fetchAnnouncements: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'announcements'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'announcements');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Events
  addEvent: async (event: Event) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'events'), event);
    console.log('Firebase: Event added with ID:', docRef.id);
    return docRef.id;
  },

  updateEvent: async (id: string, updates: Partial<Event>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'events', id), updates);
    console.log(`Firebase: Event ${id} updated`);
  },

  deleteEvent: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'events', id));
    console.log(`Firebase: Event ${id} deleted`);
  },

  fetchEvents: async (academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    let q;
    if (academyId) {
      q = query(collection(db, 'events'), where('academyId', '==', academyId));
    } else {
      q = collection(db, 'events');
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Academies
  addAcademy: async (academy: Academy) => {
    await firebaseOperations.initializeFirebase();
    const { collection, addDoc } = await import('firebase/firestore');
    const docRef = await addDoc(collection(db, 'academies'), academy);
    console.log('Firebase: Academy added with ID:', docRef.id);
    return docRef.id;
  },

  updateAcademy: async (id: string, updates: Partial<Academy>) => {
    await firebaseOperations.initializeFirebase();
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, 'academies', id), updates);
    console.log(`Firebase: Academy ${id} updated`);
  },

  deleteAcademy: async (id: string) => {
    await firebaseOperations.initializeFirebase();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'academies', id));
    console.log(`Firebase: Academy ${id} deleted`);
  },

  fetchAcademies: async () => {
    await firebaseOperations.initializeFirebase();
    const { collection, getDocs } = await import('firebase/firestore');
    const snapshot = await getDocs(collection(db, 'academies'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Real-time listeners
  setupRealtimeListener: async (collectionName: string, callback: (data: any[]) => void, academyId?: string) => {
    await firebaseOperations.initializeFirebase();
    const { collection, query, where, onSnapshot } = await import('firebase/firestore');
    
    let q;
    if (academyId && collectionName !== 'academies') {
      q = query(collection(db, collectionName), where('academyId', '==', academyId));
    } else {
      q = collection(db, collectionName);
    }
    
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Authentication
  currentUser: User | null;
  isLoading: boolean;
  authError: string | null;
  setCurrentUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Academy Management
  academies: Academy[];
  activeAcademyId: string | null;
  setActiveAcademy: (academyId: string) => void;
  addAcademy: (academy: Academy) => void;
  updateAcademy: (id: string, academy: Partial<Academy>) => void;
  deleteAcademy: (id: string) => void;

  // Students
  students: Student[];
  addStudent: (student: Student) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Guardians
  guardians: Guardian[];
  addGuardian: (guardian: Guardian) => void;
  updateGuardian: (id: string, guardian: Partial<Guardian>) => void;
  deleteGuardian: (id: string) => void;

  // Groups
  groups: Group[];
  addGroup: (group: Group) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  // Coaches
  coaches: Coach[];
  addCoach: (coach: Coach) => void;
  updateCoach: (id: string, coach: Partial<Coach>) => void;
  deleteCoach: (id: string) => void;

  // Sessions
  sessions: Session[];
  addSession: (session: Session) => void;
  updateSession: (id: string, session: Partial<Session>) => void;
  deleteSession: (id: string) => void;

  // Drills
  drills: Drill[];
  addDrill: (drill: Drill) => void;
  updateDrill: (id: string, drill: Partial<Drill>) => void;
  deleteDrill: (id: string) => void;

  // Assessments
  assessments: Assessment[];
  addAssessment: (assessment: Assessment) => void;
  updateAssessment: (id: string, assessment: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;

  // Finance
  fees: Fee[];
  expenses: Expense[];
  addFee: (fee: Fee) => void;
  updateFee: (id: string, fee: Partial<Fee>) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  // Events
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  // Filtered data getters
  getFilteredStudents: () => Student[];
  getFilteredGuardians: () => Guardian[];
  getFilteredGroups: () => Group[];
  getFilteredCoaches: () => Coach[];
  getFilteredSessions: () => Session[];
  getFilteredDrills: () => Drill[];
  getFilteredAssessments: () => Assessment[];
  getFilteredFees: () => Fee[];
  getFilteredExpenses: () => Expense[];
  getFilteredAnnouncements: () => Announcement[];
  getFilteredEvents: () => Event[];

  // Firebase data loading
  loadFirebaseData: () => Promise<void>;
  setupRealtimeListeners: () => void;
  cleanupListeners: () => void;

  // Internal state
  unsubscribeFunctions: (() => void)[];
}

export const useStore = create<AppState>((set, get) => ({
  // Theme
  darkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode;
    localStorage.setItem('darkMode', newMode.toString());
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { darkMode: newMode };
  }),

  // Authentication
  currentUser: USE_FIREBASE_BACKEND ? null : mockData.users[0],
  isLoading: false,
  authError: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  signIn: async (email: string, password: string) => {
    if (!USE_FIREBASE_BACKEND) {
      // Mock authentication
      const mockUser = {
        id: 'user-1',
        name: 'Admin User',
        email: 'admin@academypro.com',
        role: 'admin' as const,
        permissions: ['all'],
        academyIds: mockData.academies.map(a => a.id)
      };
      set({ currentUser: mockUser, isLoading: false, authError: null });
      return;
    }

    set({ isLoading: true, authError: null });
    
    try {
      const firebaseUser = await firebaseOperations.signInWithEmailAndPassword(email, password);
      
      // Fetch user profile from Firestore
      const userProfile = await firebaseOperations.fetchUserProfile(firebaseUser.uid);
      
      if (!userProfile) {
        throw new Error('User profile not found. Please contact your administrator.');
      }

      set({ 
        currentUser: userProfile as User, 
        isLoading: false, 
        authError: null 
      });

      // Load data after successful authentication
      get().loadFirebaseData();
      get().setupRealtimeListeners();
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      set({ 
        isLoading: false, 
        authError: errorMessage,
        currentUser: null 
      });
    }
  },

  signOut: async () => {
    if (!USE_FIREBASE_BACKEND) {
      set({ currentUser: null });
      return;
    }

    try {
      // Cleanup listeners before signing out
      get().cleanupListeners();
      
      await firebaseOperations.signOut();
      set({ 
        currentUser: null, 
        authError: null,
        // Reset all data
        students: [],
        guardians: [],
        groups: [],
        coaches: [],
        sessions: [],
        drills: [],
        assessments: [],
        fees: [],
        expenses: [],
        announcements: [],
        events: [],
        academies: []
      });
      
      // Clear stored academy ID
      localStorage.removeItem('activeAcademyId');
      
    } catch (error: any) {
      console.error('Sign out error:', error);
      set({ authError: 'Failed to sign out. Please try again.' });
    }
  },

  // Academy Management
  academies: USE_FIREBASE_BACKEND ? [] : mockData.academies,
  activeAcademyId: USE_FIREBASE_BACKEND ? null : (localStorage.getItem('activeAcademyId') || mockData.academies[0]?.id || null),
  setActiveAcademy: (academyId) => {
    localStorage.setItem('activeAcademyId', academyId);
    set({ activeAcademyId: academyId });
    
    // Reload data for the new academy if using Firebase
    if (USE_FIREBASE_BACKEND) {
      get().loadFirebaseData();
      get().setupRealtimeListeners();
    }
  },
  addAcademy: async (academy) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addAcademy(academy);
      } catch (error) {
        console.error('Error adding academy:', error);
      }
    } else {
      set((state) => ({ academies: [...state.academies, academy] }));
    }
  },
  updateAcademy: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateAcademy(id, updates);
      } catch (error) {
        console.error('Error updating academy:', error);
      }
    } else {
      set((state) => ({
        academies: state.academies.map(a => a.id === id ? { ...a, ...updates } : a)
      }));
    }
  },
  deleteAcademy: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteAcademy(id);
      } catch (error) {
        console.error('Error deleting academy:', error);
      }
    } else {
      set((state) => ({
        academies: state.academies.filter(a => a.id !== id)
      }));
    }
  },

  // Students
  students: USE_FIREBASE_BACKEND ? [] : mockData.students,
  addStudent: async (student) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addStudent(student);
      } catch (error) {
        console.error('Error adding student:', error);
      }
    } else {
      set((state) => ({ students: [...state.students, student] }));
    }
  },
  updateStudent: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateStudent(id, updates);
      } catch (error) {
        console.error('Error updating student:', error);
      }
    } else {
      set((state) => ({
        students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    }
  },
  deleteStudent: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteStudent(id);
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    } else {
      set((state) => ({
        students: state.students.filter(s => s.id !== id)
      }));
    }
  },

  // Guardians
  guardians: USE_FIREBASE_BACKEND ? [] : mockData.guardians,
  addGuardian: async (guardian) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addGuardian(guardian);
      } catch (error) {
        console.error('Error adding guardian:', error);
      }
    } else {
      set((state) => ({ guardians: [...state.guardians, guardian] }));
    }
  },
  updateGuardian: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateGuardian(id, updates);
      } catch (error) {
        console.error('Error updating guardian:', error);
      }
    } else {
      set((state) => ({
        guardians: state.guardians.map(g => g.id === id ? { ...g, ...updates } : g)
      }));
    }
  },
  deleteGuardian: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteGuardian(id);
      } catch (error) {
        console.error('Error deleting guardian:', error);
      }
    } else {
      set((state) => ({
        guardians: state.guardians.filter(g => g.id !== id)
      }));
    }
  },

  // Groups
  groups: USE_FIREBASE_BACKEND ? [] : mockData.groups,
  addGroup: async (group) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addGroup(group);
      } catch (error) {
        console.error('Error adding group:', error);
      }
    } else {
      set((state) => ({ groups: [...state.groups, group] }));
    }
  },
  updateGroup: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateGroup(id, updates);
      } catch (error) {
        console.error('Error updating group:', error);
      }
    } else {
      set((state) => ({
        groups: state.groups.map(g => g.id === id ? { ...g, ...updates } : g)
      }));
    }
  },
  deleteGroup: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteGroup(id);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    } else {
      set((state) => ({
        groups: state.groups.filter(g => g.id !== id)
      }));
    }
  },

  // Coaches
  coaches: USE_FIREBASE_BACKEND ? [] : mockData.coaches,
  addCoach: async (coach) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addCoach(coach);
      } catch (error) {
        console.error('Error adding coach:', error);
      }
    } else {
      set((state) => ({ coaches: [...state.coaches, coach] }));
    }
  },
  updateCoach: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateCoach(id, updates);
      } catch (error) {
        console.error('Error updating coach:', error);
      }
    } else {
      set((state) => ({
        coaches: state.coaches.map(c => c.id === id ? { ...c, ...updates } : c)
      }));
    }
  },
  deleteCoach: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteCoach(id);
      } catch (error) {
        console.error('Error deleting coach:', error);
      }
    } else {
      set((state) => ({
        coaches: state.coaches.filter(c => c.id !== id)
      }));
    }
  },

  // Sessions
  sessions: USE_FIREBASE_BACKEND ? [] : mockData.sessions,
  addSession: async (session) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addSession(session);
      } catch (error) {
        console.error('Error adding session:', error);
      }
    } else {
      set((state) => ({ sessions: [...state.sessions, session] }));
    }
  },
  updateSession: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateSession(id, updates);
      } catch (error) {
        console.error('Error updating session:', error);
      }
    } else {
      set((state) => ({
        sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    }
  },
  deleteSession: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteSession(id);
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    } else {
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id)
      }));
    }
  },

  // Drills
  drills: USE_FIREBASE_BACKEND ? [] : mockData.drills,
  addDrill: async (drill) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addDrill(drill);
      } catch (error) {
        console.error('Error adding drill:', error);
      }
    } else {
      set((state) => ({ drills: [...state.drills, drill] }));
    }
  },
  updateDrill: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateDrill(id, updates);
      } catch (error) {
        console.error('Error updating drill:', error);
      }
    } else {
      set((state) => ({
        drills: state.drills.map(d => d.id === id ? { ...d, ...updates } : d)
      }));
    }
  },
  deleteDrill: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteDrill(id);
      } catch (error) {
        console.error('Error deleting drill:', error);
      }
    } else {
      set((state) => ({
        drills: state.drills.filter(d => d.id !== id)
      }));
    }
  },

  // Assessments
  assessments: USE_FIREBASE_BACKEND ? [] : mockData.assessments,
  addAssessment: async (assessment) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addAssessment(assessment);
      } catch (error) {
        console.error('Error adding assessment:', error);
      }
    } else {
      set((state) => ({ assessments: [...state.assessments, assessment] }));
    }
  },
  updateAssessment: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateAssessment(id, updates);
      } catch (error) {
        console.error('Error updating assessment:', error);
      }
    } else {
      set((state) => ({
        assessments: state.assessments.map(a => a.id === id ? { ...a, ...updates } : a)
      }));
    }
  },
  deleteAssessment: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteAssessment(id);
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    } else {
      set((state) => ({
        assessments: state.assessments.filter(a => a.id !== id)
      }));
    }
  },

  // Finance
  fees: USE_FIREBASE_BACKEND ? [] : mockData.fees,
  expenses: USE_FIREBASE_BACKEND ? [] : mockData.expenses,
  addFee: async (fee) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addFee(fee);
      } catch (error) {
        console.error('Error adding fee:', error);
      }
    } else {
      set((state) => ({ fees: [...state.fees, fee] }));
    }
  },
  updateFee: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateFee(id, updates);
      } catch (error) {
        console.error('Error updating fee:', error);
      }
    } else {
      set((state) => ({
        fees: state.fees.map(f => f.id === id ? { ...f, ...updates } : f)
      }));
    }
  },
  addExpense: async (expense) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addExpense(expense);
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    } else {
      set((state) => ({ expenses: [...state.expenses, expense] }));
    }
  },
  updateExpense: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateExpense(id, updates);
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    } else {
      set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
      }));
    }
  },

  // Announcements
  announcements: USE_FIREBASE_BACKEND ? [] : mockData.announcements,
  addAnnouncement: async (announcement) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addAnnouncement(announcement);
      } catch (error) {
        console.error('Error adding announcement:', error);
      }
    } else {
      set((state) => ({ announcements: [...state.announcements, announcement] }));
    }
  },
  updateAnnouncement: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateAnnouncement(id, updates);
      } catch (error) {
        console.error('Error updating announcement:', error);
      }
    } else {
      set((state) => ({
        announcements: state.announcements.map(a => a.id === id ? { ...a, ...updates } : a)
      }));
    }
  },
  deleteAnnouncement: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteAnnouncement(id);
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    } else {
      set((state) => ({
        announcements: state.announcements.filter(a => a.id !== id)
      }));
    }
  },

  // Events
  events: USE_FIREBASE_BACKEND ? [] : mockData.events,
  addEvent: async (event) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.addEvent(event);
      } catch (error) {
        console.error('Error adding event:', error);
      }
    } else {
      set((state) => ({ events: [...state.events, event] }));
    }
  },
  updateEvent: async (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.updateEvent(id, updates);
      } catch (error) {
        console.error('Error updating event:', error);
      }
    } else {
      set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
      }));
    }
  },
  deleteEvent: async (id) => {
    if (USE_FIREBASE_BACKEND) {
      try {
        await firebaseOperations.deleteEvent(id);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    } else {
      set((state) => ({
        events: state.events.filter(e => e.id !== id)
      }));
    }
  },

  // Filtered data getters
  getFilteredStudents: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.students.filter(s => s.academyId === state.activeAcademyId)
      : state.students;
  },
  getFilteredGuardians: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.guardians.filter(g => g.academyId === state.activeAcademyId)
      : state.guardians;
  },
  getFilteredGroups: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.groups.filter(g => g.academyId === state.activeAcademyId)
      : state.groups;
  },
  getFilteredCoaches: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.coaches.filter(c => c.academyId === state.activeAcademyId)
      : state.coaches;
  },
  getFilteredSessions: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.sessions.filter(s => s.academyId === state.activeAcademyId)
      : state.sessions;
  },
  getFilteredDrills: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.drills.filter(d => d.academyId === state.activeAcademyId)
      : state.drills;
  },
  getFilteredAssessments: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.assessments.filter(a => a.academyId === state.activeAcademyId)
      : state.assessments;
  },
  getFilteredFees: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.fees.filter(f => f.academyId === state.activeAcademyId)
      : state.fees;
  },
  getFilteredExpenses: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.expenses.filter(e => e.academyId === state.activeAcademyId)
      : state.expenses;
  },
  getFilteredAnnouncements: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.announcements.filter(a => a.academyId === state.activeAcademyId)
      : state.announcements;
  },
  getFilteredEvents: () => {
    const state = get();
    return state.activeAcademyId 
      ? state.events.filter(e => e.academyId === state.activeAcademyId)
      : state.events;
  },

  // Firebase data loading
  loadFirebaseData: async () => {
    if (!USE_FIREBASE_BACKEND) return;
    
    const state = get();
    console.log('Firebase: Loading data for academy:', state.activeAcademyId);
    
    try {
      const [
        academies,
        students,
        guardians,
        groups,
        coaches,
        sessions,
        drills,
        assessments,
        fees,
        expenses,
        announcements,
        events
      ] = await Promise.all([
        firebaseOperations.fetchAcademies(),
        firebaseOperations.fetchStudents(state.activeAcademyId || undefined),
        firebaseOperations.fetchGuardians(state.activeAcademyId || undefined),
        firebaseOperations.fetchGroups(state.activeAcademyId || undefined),
        firebaseOperations.fetchCoaches(state.activeAcademyId || undefined),
        firebaseOperations.fetchSessions(state.activeAcademyId || undefined),
        firebaseOperations.fetchDrills(state.activeAcademyId || undefined),
        firebaseOperations.fetchAssessments(state.activeAcademyId || undefined),
        firebaseOperations.fetchFees(state.activeAcademyId || undefined),
        firebaseOperations.fetchExpenses(state.activeAcademyId || undefined),
        firebaseOperations.fetchAnnouncements(state.activeAcademyId || undefined),
        firebaseOperations.fetchEvents(state.activeAcademyId || undefined)
      ]);
      
      set({
        academies,
        students,
        guardians,
        groups,
        coaches,
        sessions,
        drills,
        assessments,
        fees,
        expenses,
        announcements,
        events
      });
      
      console.log('Firebase: Data loading completed');
    } catch (error) {
      console.error('Firebase: Error loading data:', error);
    }
  },

  // Real-time listeners
  unsubscribeFunctions: [],
  
  setupRealtimeListeners: () => {
    if (!USE_FIREBASE_BACKEND) return;
    
    const state = get();
    
    // Cleanup existing listeners
    state.cleanupListeners();
    
    const unsubscribes: (() => void)[] = [];
    
    // Setup listeners for each collection
    const collections = [
      'academies', 'students', 'guardians', 'groups', 'coaches',
      'sessions', 'drills', 'assessments', 'fees', 'expenses',
      'announcements', 'events'
    ];
    
    collections.forEach(async (collectionName) => {
      try {
        const unsubscribe = await firebaseOperations.setupRealtimeListener(
          collectionName,
          (data) => {
            set((state) => ({ [collectionName]: data }));
          },
          state.activeAcademyId || undefined
        );
        unsubscribes.push(unsubscribe);
      } catch (error) {
        console.error(`Error setting up listener for ${collectionName}:`, error);
      }
    });
    
    set({ unsubscribeFunctions: unsubscribes });
  },
  
  cleanupListeners: () => {
    const state = get();
    state.unsubscribeFunctions.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.error('Error cleaning up listener:', error);
      }
    });
    set({ unsubscribeFunctions: [] });
  }
}));

// Initialize dark mode on app start
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}

// Setup Firebase authentication listener if using Firebase backend
if (USE_FIREBASE_BACKEND) {
  // Setup auth state listener
  firebaseOperations.onAuthStateChanged(async (firebaseUser) => {
    const store = useStore.getState();
    
    if (firebaseUser) {
      // User is signed in
      try {
        const userProfile = await firebaseOperations.fetchUserProfile(firebaseUser.uid);
        if (userProfile) {
          store.setCurrentUser(userProfile as User);
          store.loadFirebaseData();
          store.setupRealtimeListeners();
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        store.setCurrentUser(null);
      }
    } else {
      // User is signed out
      store.setCurrentUser(null);
      store.cleanupListeners();
    }
  }).catch(error => {
    console.error('Error setting up auth listener:', error);
  });
}