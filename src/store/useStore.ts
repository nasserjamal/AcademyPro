import { create } from 'zustand';
import { Student, Guardian, Group, Coach, Session, Drill, Assessment, Fee, Expense, Announcement, Event, User, Academy } from '../types';
import { mockData } from '../data/mockData';

// Configuration flag to switch between mockup and Firebase backend
const USE_FIREBASE_BACKEND = false;

// Firebase simulation functions
const firebaseOperations = {
  // Students
  addStudent: async (student: Student) => {
    console.log('Firebase: Adding student to Firestore collection "students"', student);
    // In real implementation: await addDoc(collection(db, 'students'), student);
  },
  updateStudent: async (id: string, updates: Partial<Student>) => {
    console.log(`Firebase: Updating student ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'students', id), updates);
  },
  deleteStudent: async (id: string) => {
    console.log(`Firebase: Deleting student ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'students', id));
  },

  // Guardians
  addGuardian: async (guardian: Guardian) => {
    console.log('Firebase: Adding guardian to Firestore collection "guardians"', guardian);
    // In real implementation: await addDoc(collection(db, 'guardians'), guardian);
  },
  updateGuardian: async (id: string, updates: Partial<Guardian>) => {
    console.log(`Firebase: Updating guardian ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'guardians', id), updates);
  },
  deleteGuardian: async (id: string) => {
    console.log(`Firebase: Deleting guardian ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'guardians', id));
  },

  // Groups
  addGroup: async (group: Group) => {
    console.log('Firebase: Adding group to Firestore collection "groups"', group);
    // In real implementation: await addDoc(collection(db, 'groups'), group);
  },
  updateGroup: async (id: string, updates: Partial<Group>) => {
    console.log(`Firebase: Updating group ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'groups', id), updates);
  },
  deleteGroup: async (id: string) => {
    console.log(`Firebase: Deleting group ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'groups', id));
  },

  // Coaches
  addCoach: async (coach: Coach) => {
    console.log('Firebase: Adding coach to Firestore collection "coaches"', coach);
    // In real implementation: await addDoc(collection(db, 'coaches'), coach);
  },
  updateCoach: async (id: string, updates: Partial<Coach>) => {
    console.log(`Firebase: Updating coach ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'coaches', id), updates);
  },
  deleteCoach: async (id: string) => {
    console.log(`Firebase: Deleting coach ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'coaches', id));
  },

  // Sessions
  addSession: async (session: Session) => {
    console.log('Firebase: Adding session to Firestore collection "sessions"', session);
    // In real implementation: await addDoc(collection(db, 'sessions'), session);
  },
  updateSession: async (id: string, updates: Partial<Session>) => {
    console.log(`Firebase: Updating session ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'sessions', id), updates);
  },
  deleteSession: async (id: string) => {
    console.log(`Firebase: Deleting session ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'sessions', id));
  },

  // Drills
  addDrill: async (drill: Drill) => {
    console.log('Firebase: Adding drill to Firestore collection "drills"', drill);
    // In real implementation: await addDoc(collection(db, 'drills'), drill);
  },
  updateDrill: async (id: string, updates: Partial<Drill>) => {
    console.log(`Firebase: Updating drill ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'drills', id), updates);
  },
  deleteDrill: async (id: string) => {
    console.log(`Firebase: Deleting drill ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'drills', id));
  },

  // Assessments
  addAssessment: async (assessment: Assessment) => {
    console.log('Firebase: Adding assessment to Firestore collection "assessments"', assessment);
    // In real implementation: await addDoc(collection(db, 'assessments'), assessment);
  },
  updateAssessment: async (id: string, updates: Partial<Assessment>) => {
    console.log(`Firebase: Updating assessment ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'assessments', id), updates);
  },
  deleteAssessment: async (id: string) => {
    console.log(`Firebase: Deleting assessment ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'assessments', id));
  },

  // Fees
  addFee: async (fee: Fee) => {
    console.log('Firebase: Adding fee to Firestore collection "fees"', fee);
    // In real implementation: await addDoc(collection(db, 'fees'), fee);
  },
  updateFee: async (id: string, updates: Partial<Fee>) => {
    console.log(`Firebase: Updating fee ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'fees', id), updates);
  },

  // Expenses
  addExpense: async (expense: Expense) => {
    console.log('Firebase: Adding expense to Firestore collection "expenses"', expense);
    // In real implementation: await addDoc(collection(db, 'expenses'), expense);
  },
  updateExpense: async (id: string, updates: Partial<Expense>) => {
    console.log(`Firebase: Updating expense ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'expenses', id), updates);
  },

  // Announcements
  addAnnouncement: async (announcement: Announcement) => {
    console.log('Firebase: Adding announcement to Firestore collection "announcements"', announcement);
    // In real implementation: await addDoc(collection(db, 'announcements'), announcement);
  },
  updateAnnouncement: async (id: string, updates: Partial<Announcement>) => {
    console.log(`Firebase: Updating announcement ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'announcements', id), updates);
  },
  deleteAnnouncement: async (id: string) => {
    console.log(`Firebase: Deleting announcement ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'announcements', id));
  },

  // Events
  addEvent: async (event: Event) => {
    console.log('Firebase: Adding event to Firestore collection "events"', event);
    // In real implementation: await addDoc(collection(db, 'events'), event);
  },
  updateEvent: async (id: string, updates: Partial<Event>) => {
    console.log(`Firebase: Updating event ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'events', id), updates);
  },
  deleteEvent: async (id: string) => {
    console.log(`Firebase: Deleting event ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'events', id));
  },

  // Academies
  addAcademy: async (academy: Academy) => {
    console.log('Firebase: Adding academy to Firestore collection "academies"', academy);
    // In real implementation: await addDoc(collection(db, 'academies'), academy);
  },
  updateAcademy: async (id: string, updates: Partial<Academy>) => {
    console.log(`Firebase: Updating academy ${id} in Firestore`, updates);
    // In real implementation: await updateDoc(doc(db, 'academies', id), updates);
  },
  deleteAcademy: async (id: string) => {
    console.log(`Firebase: Deleting academy ${id} from Firestore`);
    // In real implementation: await deleteDoc(doc(db, 'academies', id));
  },

  // Data fetching operations
  fetchStudents: async (academyId?: string) => {
    console.log('Firebase: Fetching students from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    // In real implementation: 
    // const q = academyId 
    //   ? query(collection(db, 'students'), where('academyId', '==', academyId))
    //   : collection(db, 'students');
    // const snapshot = await getDocs(q);
    // return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return [];
  },

  fetchGuardians: async (academyId?: string) => {
    console.log('Firebase: Fetching guardians from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchGroups: async (academyId?: string) => {
    console.log('Firebase: Fetching groups from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchCoaches: async (academyId?: string) => {
    console.log('Firebase: Fetching coaches from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchSessions: async (academyId?: string) => {
    console.log('Firebase: Fetching sessions from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchDrills: async (academyId?: string) => {
    console.log('Firebase: Fetching drills from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchAssessments: async (academyId?: string) => {
    console.log('Firebase: Fetching assessments from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchFees: async (academyId?: string) => {
    console.log('Firebase: Fetching fees from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchExpenses: async (academyId?: string) => {
    console.log('Firebase: Fetching expenses from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchAnnouncements: async (academyId?: string) => {
    console.log('Firebase: Fetching announcements from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchEvents: async (academyId?: string) => {
    console.log('Firebase: Fetching events from Firestore', academyId ? `for academy ${academyId}` : 'all academies');
    return [];
  },

  fetchAcademies: async () => {
    console.log('Firebase: Fetching academies from Firestore');
    return [];
  }
};

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // User
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

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

  // User
  currentUser: USE_FIREBASE_BACKEND ? null : mockData.users[0],
  setCurrentUser: (user) => set({ currentUser: user }),

  // Academy Management
  academies: USE_FIREBASE_BACKEND ? [] : mockData.academies,
  activeAcademyId: USE_FIREBASE_BACKEND ? null : (localStorage.getItem('activeAcademyId') || mockData.academies[0]?.id || null),
  setActiveAcademy: (academyId) => {
    localStorage.setItem('activeAcademyId', academyId);
    set({ activeAcademyId: academyId });
  },
  addAcademy: (academy) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addAcademy(academy);
      // In Firebase mode, you would typically refetch data or use real-time listeners
      // For now, we'll just log the operation
    } else {
      set((state) => ({ academies: [...state.academies, academy] }));
    }
  },
  updateAcademy: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateAcademy(id, updates);
    } else {
      set((state) => ({
        academies: state.academies.map(a => a.id === id ? { ...a, ...updates } : a)
      }));
    }
  },
  deleteAcademy: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteAcademy(id);
    } else {
      set((state) => ({
        academies: state.academies.filter(a => a.id !== id)
      }));
    }
  },

  // Students
  students: USE_FIREBASE_BACKEND ? [] : mockData.students,
  addStudent: (student) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addStudent(student);
    } else {
      set((state) => ({ students: [...state.students, student] }));
    }
  },
  updateStudent: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateStudent(id, updates);
    } else {
      set((state) => ({
        students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    }
  },
  deleteStudent: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteStudent(id);
    } else {
      set((state) => ({
        students: state.students.filter(s => s.id !== id)
      }));
    }
  },

  // Guardians
  guardians: USE_FIREBASE_BACKEND ? [] : mockData.guardians,
  addGuardian: (guardian) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addGuardian(guardian);
    } else {
      set((state) => ({ guardians: [...state.guardians, guardian] }));
    }
  },
  updateGuardian: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateGuardian(id, updates);
    } else {
      set((state) => ({
        guardians: state.guardians.map(g => g.id === id ? { ...g, ...updates } : g)
      }));
    }
  },
  deleteGuardian: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteGuardian(id);
    } else {
      set((state) => ({
        guardians: state.guardians.filter(g => g.id !== id)
      }));
    }
  },

  // Groups
  groups: USE_FIREBASE_BACKEND ? [] : mockData.groups,
  addGroup: (group) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addGroup(group);
    } else {
      set((state) => ({ groups: [...state.groups, group] }));
    }
  },
  updateGroup: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateGroup(id, updates);
    } else {
      set((state) => ({
        groups: state.groups.map(g => g.id === id ? { ...g, ...updates } : g)
      }));
    }
  },
  deleteGroup: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteGroup(id);
    } else {
      set((state) => ({
        groups: state.groups.filter(g => g.id !== id)
      }));
    }
  },

  // Coaches
  coaches: USE_FIREBASE_BACKEND ? [] : mockData.coaches,
  addCoach: (coach) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addCoach(coach);
    } else {
      set((state) => ({ coaches: [...state.coaches, coach] }));
    }
  },
  updateCoach: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateCoach(id, updates);
    } else {
      set((state) => ({
        coaches: state.coaches.map(c => c.id === id ? { ...c, ...updates } : c)
      }));
    }
  },
  deleteCoach: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteCoach(id);
    } else {
      set((state) => ({
        coaches: state.coaches.filter(c => c.id !== id)
      }));
    }
  },

  // Sessions
  sessions: USE_FIREBASE_BACKEND ? [] : mockData.sessions,
  addSession: (session) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addSession(session);
    } else {
      set((state) => ({ sessions: [...state.sessions, session] }));
    }
  },
  updateSession: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateSession(id, updates);
    } else {
      set((state) => ({
        sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s)
      }));
    }
  },
  deleteSession: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteSession(id);
    } else {
      set((state) => ({
        sessions: state.sessions.filter(s => s.id !== id)
      }));
    }
  },

  // Drills
  drills: USE_FIREBASE_BACKEND ? [] : mockData.drills,
  addDrill: (drill) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addDrill(drill);
    } else {
      set((state) => ({ drills: [...state.drills, drill] }));
    }
  },
  updateDrill: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateDrill(id, updates);
    } else {
      set((state) => ({
        drills: state.drills.map(d => d.id === id ? { ...d, ...updates } : d)
      }));
    }
  },
  deleteDrill: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteDrill(id);
    } else {
      set((state) => ({
        drills: state.drills.filter(d => d.id !== id)
      }));
    }
  },

  // Assessments
  assessments: USE_FIREBASE_BACKEND ? [] : mockData.assessments,
  addAssessment: (assessment) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addAssessment(assessment);
    } else {
      set((state) => ({ assessments: [...state.assessments, assessment] }));
    }
  },
  updateAssessment: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateAssessment(id, updates);
    } else {
      set((state) => ({
        assessments: state.assessments.map(a => a.id === id ? { ...a, ...updates } : a)
      }));
    }
  },
  deleteAssessment: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteAssessment(id);
    } else {
      set((state) => ({
        assessments: state.assessments.filter(a => a.id !== id)
      }));
    }
  },

  // Finance
  fees: USE_FIREBASE_BACKEND ? [] : mockData.fees,
  expenses: USE_FIREBASE_BACKEND ? [] : mockData.expenses,
  addFee: (fee) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addFee(fee);
    } else {
      set((state) => ({ fees: [...state.fees, fee] }));
    }
  },
  updateFee: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateFee(id, updates);
    } else {
      set((state) => ({
        fees: state.fees.map(f => f.id === id ? { ...f, ...updates } : f)
      }));
    }
  },
  addExpense: (expense) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addExpense(expense);
    } else {
      set((state) => ({ expenses: [...state.expenses, expense] }));
    }
  },
  updateExpense: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateExpense(id, updates);
    } else {
      set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
      }));
    }
  },

  // Announcements
  announcements: USE_FIREBASE_BACKEND ? [] : mockData.announcements,
  addAnnouncement: (announcement) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addAnnouncement(announcement);
    } else {
      set((state) => ({ announcements: [...state.announcements, announcement] }));
    }
  },
  updateAnnouncement: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateAnnouncement(id, updates);
    } else {
      set((state) => ({
        announcements: state.announcements.map(a => a.id === id ? { ...a, ...updates } : a)
      }));
    }
  },
  deleteAnnouncement: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteAnnouncement(id);
    } else {
      set((state) => ({
        announcements: state.announcements.filter(a => a.id !== id)
      }));
    }
  },

  // Events
  events: USE_FIREBASE_BACKEND ? [] : mockData.events,
  addEvent: (event) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.addEvent(event);
    } else {
      set((state) => ({ events: [...state.events, event] }));
    }
  },
  updateEvent: (id, updates) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.updateEvent(id, updates);
    } else {
      set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
      }));
    }
  },
  deleteEvent: (id) => {
    if (USE_FIREBASE_BACKEND) {
      firebaseOperations.deleteEvent(id);
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
    
    console.log('Firebase: Loading all data from Firestore...');
    
    try {
      // In a real implementation, you would fetch all data here
      // const [academies, students, guardians, groups, coaches, sessions, drills, assessments, fees, expenses, announcements, events] = await Promise.all([
      //   firebaseOperations.fetchAcademies(),
      //   firebaseOperations.fetchStudents(),
      //   firebaseOperations.fetchGuardians(),
      //   firebaseOperations.fetchGroups(),
      //   firebaseOperations.fetchCoaches(),
      //   firebaseOperations.fetchSessions(),
      //   firebaseOperations.fetchDrills(),
      //   firebaseOperations.fetchAssessments(),
      //   firebaseOperations.fetchFees(),
      //   firebaseOperations.fetchExpenses(),
      //   firebaseOperations.fetchAnnouncements(),
      //   firebaseOperations.fetchEvents()
      // ]);
      
      // set({
      //   academies,
      //   students,
      //   guardians,
      //   groups,
      //   coaches,
      //   sessions,
      //   drills,
      //   assessments,
      //   fees,
      //   expenses,
      //   announcements,
      //   events
      // });
      
      console.log('Firebase: Data loading completed');
    } catch (error) {
      console.error('Firebase: Error loading data:', error);
    }
  }
}));

// Initialize dark mode on app start
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}

// Load Firebase data on app start if using Firebase backend
if (USE_FIREBASE_BACKEND) {
  useStore.getState().loadFirebaseData();
}