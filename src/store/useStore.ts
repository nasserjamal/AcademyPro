import { create } from 'zustand';
import { Student, Guardian, Group, Coach, Session, Drill, Assessment, Fee, Expense, Announcement, Event, User, Academy } from '../types';
import { mockData } from '../data/mockData';

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
  currentUser: mockData.users[0],
  setCurrentUser: (user) => set({ currentUser: user }),

  // Academy Management
  academies: mockData.academies,
  activeAcademyId: localStorage.getItem('activeAcademyId') || mockData.academies[0]?.id || null,
  setActiveAcademy: (academyId) => {
    localStorage.setItem('activeAcademyId', academyId);
    set({ activeAcademyId: academyId });
  },
  addAcademy: (academy) => set((state) => ({ academies: [...state.academies, academy] })),
  updateAcademy: (id, updates) => set((state) => ({
    academies: state.academies.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAcademy: (id) => set((state) => ({
    academies: state.academies.filter(a => a.id !== id)
  })),

  // Students
  students: mockData.students,
  addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
  updateStudent: (id, updates) => set((state) => ({
    students: state.students.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteStudent: (id) => set((state) => ({
    students: state.students.filter(s => s.id !== id)
  })),

  // Guardians
  guardians: mockData.guardians,
  addGuardian: (guardian) => set((state) => ({ guardians: [...state.guardians, guardian] })),
  updateGuardian: (id, updates) => set((state) => ({
    guardians: state.guardians.map(g => g.id === id ? { ...g, ...updates } : g)
  })),
  deleteGuardian: (id) => set((state) => ({
    guardians: state.guardians.filter(g => g.id !== id)
  })),

  // Groups
  groups: mockData.groups,
  addGroup: (group) => set((state) => ({ groups: [...state.groups, group] })),
  updateGroup: (id, updates) => set((state) => ({
    groups: state.groups.map(g => g.id === id ? { ...g, ...updates } : g)
  })),
  deleteGroup: (id) => set((state) => ({
    groups: state.groups.filter(g => g.id !== id)
  })),

  // Coaches
  coaches: mockData.coaches,
  addCoach: (coach) => set((state) => ({ coaches: [...state.coaches, coach] })),
  updateCoach: (id, updates) => set((state) => ({
    coaches: state.coaches.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteCoach: (id) => set((state) => ({
    coaches: state.coaches.filter(c => c.id !== id)
  })),

  // Sessions
  sessions: mockData.sessions,
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
  updateSession: (id, updates) => set((state) => ({
    sessions: state.sessions.map(s => s.id === id ? { ...s, ...updates } : s)
  })),
  deleteSession: (id) => set((state) => ({
    sessions: state.sessions.filter(s => s.id !== id)
  })),

  // Drills
  drills: mockData.drills,
  addDrill: (drill) => set((state) => ({ drills: [...state.drills, drill] })),
  updateDrill: (id, updates) => set((state) => ({
    drills: state.drills.map(d => d.id === id ? { ...d, ...updates } : d)
  })),
  deleteDrill: (id) => set((state) => ({
    drills: state.drills.filter(d => d.id !== id)
  })),

  // Assessments
  assessments: mockData.assessments,
  addAssessment: (assessment) => set((state) => ({ assessments: [...state.assessments, assessment] })),
  updateAssessment: (id, updates) => set((state) => ({
    assessments: state.assessments.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAssessment: (id) => set((state) => ({
    assessments: state.assessments.filter(a => a.id !== id)
  })),

  // Finance
  fees: mockData.fees,
  expenses: mockData.expenses,
  addFee: (fee) => set((state) => ({ fees: [...state.fees, fee] })),
  updateFee: (id, updates) => set((state) => ({
    fees: state.fees.map(f => f.id === id ? { ...f, ...updates } : f)
  })),
  addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
  updateExpense: (id, updates) => set((state) => ({
    expenses: state.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
  })),

  // Announcements
  announcements: mockData.announcements,
  addAnnouncement: (announcement) => set((state) => ({ announcements: [...state.announcements, announcement] })),
  updateAnnouncement: (id, updates) => set((state) => ({
    announcements: state.announcements.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteAnnouncement: (id) => set((state) => ({
    announcements: state.announcements.filter(a => a.id !== id)
  })),

  // Events
  events: mockData.events,
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),

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
  }
}));

// Initialize dark mode on app start
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
}