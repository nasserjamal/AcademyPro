export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address?: string;
  guardianIds: string[];
  groupIds: string[];
  medicalInfo: MedicalInfo;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'suspended';
  profileImage?: string;
  academyId: string;
}

export interface Guardian {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: PhoneNumber[];
  relationship: string;
  address?: string;
  studentIds: string[];
  academyId: string;
}

export interface PhoneNumber {
  id: string;
  number: string;
  type: 'primary' | 'secondary' | 'emergency';
  isPrimary: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  ageRange: string;
  maxStudents: number;
  coachIds: string[];
  studentIds: string[];
  schedule: GroupSchedule[];
  createdAt: string;
  isActive: boolean;
  academyId: string;
}

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  description?: string;
  groupIds: string[];
  profileImage?: string;
  hireDate: string;
  academyId: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  groupId: string;
  coachIds: string[];
  drillIds: string[];
  attendanceIds: string[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  academyId: string;
}

export interface Drill {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  equipmentNeeded: string[];
  mediaUrls: string[];
  assessmentParameters: string[];
  instructions: string[];
  academyId: string;
}

export interface Assessment {
  id: string;
  studentId?: string; // Keep for backward compatibility
  groupId?: string; // New field for group assessments
  assessmentDate: string;
  assessorId: string;
  parameters: AssessmentParameter[];
  notes: string;
  overallScore: number;
  academyId: string;
}

export interface AssessmentParameter {
  name: string;
  score: number;
  maxScore: number;
  comments?: string;
}

export interface Fee {
  id: string;
  studentId: string;
  amount: number;
  type: 'monthly' | 'registration' | 'equipment' | 'tournament' | 'other';
  description: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  paidDate?: string;
  paymentMethod?: string;
  academyId: string;
}

export interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
  approvedBy: string;
  academyId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  targetGroups: string[];
  targetStudents: string[];
  createdBy: string;
  createdAt: string;
  deliveryStatus: Record<string, 'sent' | 'delivered' | 'read'>;
  academyId: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'match' | 'tournament' | 'ceremony' | 'training' | 'other';
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  groupIds: string[];
  coachIds: string[];
  rsvpRequired: boolean;
  rsvpList: Record<string, 'yes' | 'no' | 'maybe'>;
  academyId: string;
}

export interface Academy {
  id: string;
  name: string;
  description?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  timezone: string;
  currency: string;
  settings: AcademySettings;
  createdAt: string;
  isActive: boolean;
}

export interface AcademySettings {
  maxStudentsPerGroup: number;
  sessionDuration: number;
  assessmentFrequency: 'weekly' | 'monthly' | 'quarterly';
  feeStructure: {
    monthly: number;
    registration: number;
    equipment: number;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface MedicalInfo {
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  doctorContact?: {
    name: string;
    phone: string;
  };
  medicalHistory: MedicalHistoryEntry[];
}

export interface MedicalHistoryEntry {
  id: string;
  title: string;
  description: string;
  date: string;
  addedBy: string;
}

export interface GroupSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'finance' | 'guardian';
  permissions: string[];
  academyIds: string[];
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  markedBy: string;
  markedAt: string;
  academyId: string;
}

export interface StudentAttendance {
  studentId: string;
  month: string;
  year: number;
  sessions: {
    sessionId: string;
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
  }[];
  attendanceRate: number;
}