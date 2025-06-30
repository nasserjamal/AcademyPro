import { Student, Guardian, Group, Coach, Session, Drill, Assessment, Fee, Expense, Announcement, Event, User, Academy, PhoneNumber } from '../types';

export const mockData = {
  academies: [
    {
      id: 'academy-1',
      name: 'Fazam Football Academy',
      description: 'Premier football training academy in Nairobi',
      address: '123 Sports Complex, Nairobi, Kenya',
      phone: '+254712345678',
      email: 'info@fazamfootball.com',
      website: 'www.fazamfootball.com',
      timezone: 'Africa/Nairobi',
      currency: 'KSh',
      settings: {
        maxStudentsPerGroup: 20,
        sessionDuration: 90,
        assessmentFrequency: 'monthly' as const,
        feeStructure: {
          monthly: 15000,
          registration: 5000,
          equipment: 7500
        },
        notifications: {
          email: true,
          sms: true,
          push: false
        }
      },
      createdAt: '2024-01-01',
      isActive: true
    },
    {
      id: 'academy-2',
      name: 'Champions Youth Academy',
      description: 'Developing young football talent in Mombasa',
      address: '456 Coastal Road, Mombasa, Kenya',
      phone: '+254723456789',
      email: 'info@championsyouth.com',
      website: 'www.championsyouth.com',
      timezone: 'Africa/Nairobi',
      currency: 'KSh',
      settings: {
        maxStudentsPerGroup: 15,
        sessionDuration: 75,
        assessmentFrequency: 'monthly' as const,
        feeStructure: {
          monthly: 12000,
          registration: 4000,
          equipment: 6000
        },
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      },
      createdAt: '2024-02-15',
      isActive: true
    },
    {
      id: 'academy-3',
      name: 'Future Stars Academy',
      description: 'Building tomorrow\'s football stars in Kisumu',
      address: '789 Lake View, Kisumu, Kenya',
      phone: '+254734567890',
      email: 'info@futurestars.com',
      timezone: 'Africa/Nairobi',
      currency: 'KSh',
      settings: {
        maxStudentsPerGroup: 18,
        sessionDuration: 80,
        assessmentFrequency: 'weekly' as const,
        feeStructure: {
          monthly: 10000,
          registration: 3000,
          equipment: 5000
        },
        notifications: {
          email: true,
          sms: true,
          push: true
        }
      },
      createdAt: '2024-03-01',
      isActive: true
    }
  ] as Academy[],

  users: [
    {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@fazamfootball.com',
      role: 'admin' as const,
      permissions: ['all'],
      academyIds: ['academy-1', 'academy-2', 'academy-3']
    }
  ] as User[],

  students: [
    {
      id: 'student-1',
      firstName: 'John',
      lastName: 'Smith',
      dateOfBirth: '2010-05-15',
      email: 'john.smith@email.com',
      phone: '+254712345678',
      address: '123 Main St, Nairobi, Kenya',
      guardianIds: ['guardian-1'],
      groupIds: ['group-1'],
      medicalInfo: {
        allergies: ['Peanuts'],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: 'Jane Smith',
          phone: '+254712345679',
          relationship: 'Mother'
        },
        medicalHistory: [
          {
            id: 'med-1',
            title: 'Knee Injury',
            description: 'Minor knee sprain during training. Recommended rest for 2 weeks.',
            date: '2024-11-15',
            addedBy: 'coach-1'
          }
        ]
      },
      enrollmentDate: '2024-01-15',
      status: 'active' as const,
      profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      academyId: 'academy-1'
    },
    {
      id: 'student-2',
      firstName: 'Mike',
      lastName: 'Johnson',
      dateOfBirth: '2011-08-22',
      email: 'mike.johnson@email.com',
      phone: '+254712345680',
      address: '456 Oak Ave, Nairobi, Kenya',
      guardianIds: ['guardian-2'],
      groupIds: ['group-1'],
      medicalInfo: {
        allergies: [],
        medications: ['Inhaler'],
        conditions: ['Asthma'],
        emergencyContact: {
          name: 'Bob Johnson',
          phone: '+254712345681',
          relationship: 'Father'
        },
        medicalHistory: []
      },
      enrollmentDate: '2024-02-01',
      status: 'active' as const,
      profileImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      academyId: 'academy-1'
    },
    {
      id: 'student-3',
      firstName: 'Sarah',
      lastName: 'Wilson',
      dateOfBirth: '2012-03-10',
      email: 'sarah.wilson@email.com',
      phone: '+254723456789',
      address: '789 Beach Road, Mombasa, Kenya',
      guardianIds: ['guardian-3'],
      groupIds: ['group-2'],
      medicalInfo: {
        allergies: [],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: 'Mary Wilson',
          phone: '+254723456790',
          relationship: 'Mother'
        },
        medicalHistory: []
      },
      enrollmentDate: '2024-02-15',
      status: 'active' as const,
      academyId: 'academy-1'
    },
    {
      id: 'student-4',
      firstName: 'David',
      lastName: 'Brown',
      dateOfBirth: '2009-12-08',
      email: 'david.brown@email.com',
      phone: '+254734567891',
      address: '321 Hill View, Nairobi, Kenya',
      guardianIds: ['guardian-4'],
      groupIds: ['group-1'],
      medicalInfo: {
        allergies: ['Shellfish'],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: 'Lisa Brown',
          phone: '+254734567892',
          relationship: 'Mother'
        },
        medicalHistory: []
      },
      enrollmentDate: '2024-03-01',
      status: 'active' as const,
      profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      academyId: 'academy-1'
    },
    {
      id: 'student-5',
      firstName: 'Emma',
      lastName: 'Davis',
      dateOfBirth: '2011-07-20',
      email: 'emma.davis@email.com',
      phone: '+254745678902',
      address: '654 Valley Road, Nairobi, Kenya',
      guardianIds: ['guardian-5'],
      groupIds: ['group-1'],
      medicalInfo: {
        allergies: [],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: 'Tom Davis',
          phone: '+254745678903',
          relationship: 'Father'
        },
        medicalHistory: []
      },
      enrollmentDate: '2024-03-15',
      status: 'active' as const,
      profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      academyId: 'academy-1'
    },
    {
      id: 'student-6',
      firstName: 'Alex',
      lastName: 'Miller',
      dateOfBirth: '2010-11-12',
      email: 'alex.miller@email.com',
      phone: '+254756789013',
      address: '987 Garden Estate, Nairobi, Kenya',
      guardianIds: ['guardian-6'],
      groupIds: ['group-1'],
      medicalInfo: {
        allergies: [],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: 'Susan Miller',
          phone: '+254756789014',
          relationship: 'Mother'
        },
        medicalHistory: []
      },
      enrollmentDate: '2024-04-01',
      status: 'inactive' as const,
      profileImage: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg',
      academyId: 'academy-1'
    },
    {
      id: 'student-7',
      firstName: 'Grace',
      lastName: 'Taylor',
      dateOfBirth: '2012-01-25',
      email: 'grace.taylor@email.com',
      phone: '+254767890124',
      address: '147 Riverside Drive, Nairobi, Kenya',
      guardianIds: ['guardian-7'],
      groupIds: ['group-1'],
      medicalInfo: {
        allergies: ['Dairy'],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: 'Paul Taylor',
          phone: '+254767890125',
          relationship: 'Father'
        },
        medicalHistory: []
      },
      enrollmentDate: '2024-04-15',
      status: 'active' as const,
      academyId: 'academy-1'
    },
    {
      id: 'student-8',
      firstName: 'Ryan',
      lastName: 'Anderson',
      dateOfBirth: '2009-09-18',
      email: 'ryan.anderson@email.com',
      phone: '+254778901235',
      address: '258 Parklands, Nairobi, Kenya',
      guardianIds: ['guardian-8'],
      groupIds: ['group-1'],
      medicalInfo: {
        allergies: [],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: 'Karen Anderson',
          phone: '+254778901236',
          relationship: 'Mother'
        },
        medicalHistory: []
      },
      enrollmentDate: '2024-05-01',
      status: 'active' as const,
      profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      academyId: 'academy-1'
    }
  ] as Student[],

  guardians: [
    {
      id: 'guardian-1',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phoneNumbers: [
        {
          id: 'phone-1',
          number: '+254712345679',
          type: 'primary',
          isPrimary: true
        },
        {
          id: 'phone-2',
          number: '+254701234567',
          type: 'secondary',
          isPrimary: false
        }
      ] as PhoneNumber[],
      relationship: 'Mother',
      address: '123 Main St, Nairobi, Kenya',
      studentIds: ['student-1'],
      academyId: 'academy-1'
    },
    {
      id: 'guardian-2',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@email.com',
      phoneNumbers: [
        {
          id: 'phone-3',
          number: '+254712345681',
          type: 'primary',
          isPrimary: true
        }
      ] as PhoneNumber[],
      relationship: 'Father',
      address: '456 Oak Ave, Nairobi, Kenya',
      studentIds: ['student-2'],
      academyId: 'academy-1'
    },
    {
      id: 'guardian-3',
      firstName: 'Mary',
      lastName: 'Wilson',
      email: 'mary.wilson@email.com',
      phoneNumbers: [
        {
          id: 'phone-4',
          number: '+254723456790',
          type: 'primary',
          isPrimary: true
        },
        {
          id: 'phone-5',
          number: '+254734567891',
          type: 'emergency',
          isPrimary: false
        }
      ] as PhoneNumber[],
      relationship: 'Mother',
      address: '789 Beach Road, Mombasa, Kenya',
      studentIds: ['student-3'],
      academyId: 'academy-1'
    },
    {
      id: 'guardian-4',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@email.com',
      phoneNumbers: [
        {
          id: 'phone-6',
          number: '+254734567892',
          type: 'primary',
          isPrimary: true
        },
        {
          id: 'phone-7',
          number: '+254745678903',
          type: 'secondary',
          isPrimary: false
        }
      ] as PhoneNumber[],
      relationship: 'Mother',
      address: '321 Hill View, Nairobi, Kenya',
      studentIds: ['student-4'],
      academyId: 'academy-1'
    },
    {
      id: 'guardian-5',
      firstName: 'Tom',
      lastName: 'Davis',
      email: 'tom.davis@email.com',
      phoneNumbers: [
        {
          id: 'phone-8',
          number: '+254745678903',
          type: 'primary',
          isPrimary: true
        }
      ] as PhoneNumber[],
      relationship: 'Father',
      address: '654 Valley Road, Nairobi, Kenya',
      studentIds: ['student-5'],
      academyId: 'academy-1'
    },
    {
      id: 'guardian-6',
      firstName: 'Susan',
      lastName: 'Miller',
      email: 'susan.miller@email.com',
      phoneNumbers: [
        {
          id: 'phone-9',
          number: '+254756789014',
          type: 'primary',
          isPrimary: true
        },
        {
          id: 'phone-10',
          number: '+254767890125',
          type: 'emergency',
          isPrimary: false
        }
      ] as PhoneNumber[],
      relationship: 'Mother',
      address: '987 Garden Estate, Nairobi, Kenya',
      studentIds: ['student-6'],
      academyId: 'academy-1'
    },
    {
      id: 'guardian-7',
      firstName: 'Paul',
      lastName: 'Taylor',
      email: 'paul.taylor@email.com',
      phoneNumbers: [
        {
          id: 'phone-11',
          number: '+254767890125',
          type: 'primary',
          isPrimary: true
        }
      ] as PhoneNumber[],
      relationship: 'Father',
      address: '147 Riverside Drive, Nairobi, Kenya',
      studentIds: ['student-7'],
      academyId: 'academy-1'
    },
    {
      id: 'guardian-8',
      firstName: 'Karen',
      lastName: 'Anderson',
      email: 'karen.anderson@email.com',
      phoneNumbers: [
        {
          id: 'phone-12',
          number: '+254778901236',
          type: 'primary',
          isPrimary: true
        },
        {
          id: 'phone-13',
          number: '+254789012347',
          type: 'secondary',
          isPrimary: false
        }
      ] as PhoneNumber[],
      relationship: 'Mother',
      address: '258 Parklands, Nairobi, Kenya',
      studentIds: ['student-8'],
      academyId: 'academy-1'
    }
  ] as Guardian[],

  groups: [
    {
      id: 'group-1',
      name: 'U-14 Eagles',
      description: 'Under 14 development group focusing on technical skills',
      ageRange: '12-14',
      maxStudents: 20,
      coachIds: ['coach-1'],
      studentIds: ['student-1', 'student-2', 'student-4', 'student-5', 'student-6', 'student-7', 'student-8'],
      schedule: [
        {
          dayOfWeek: 1,
          startTime: '16:00',
          endTime: '17:30',
          location: 'Field A'
        },
        {
          dayOfWeek: 3,
          startTime: '16:00',
          endTime: '17:30',
          location: 'Field A'
        },
        {
          dayOfWeek: 6,
          startTime: '10:00',
          endTime: '11:30',
          location: 'Field B'
        }
      ],
      createdAt: '2024-01-01',
      isActive: true,
      academyId: 'academy-1'
    },
    {
      id: 'group-2',
      name: 'U-12 Lions',
      description: 'Under 12 beginners group with fun-focused training',
      ageRange: '10-12',
      maxStudents: 15,
      coachIds: ['coach-2'],
      studentIds: ['student-3'],
      schedule: [
        {
          dayOfWeek: 2,
          startTime: '15:30',
          endTime: '16:30',
          location: 'Field C'
        },
        {
          dayOfWeek: 5,
          startTime: '15:30',
          endTime: '16:30',
          location: 'Field C'
        }
      ],
      createdAt: '2024-02-15',
      isActive: true,
      academyId: 'academy-1'
    },
    {
      id: 'group-3',
      name: 'U-16 Sharks',
      description: 'Advanced training for competitive players',
      ageRange: '14-16',
      maxStudents: 18,
      coachIds: ['coach-1'],
      studentIds: [],
      schedule: [
        {
          dayOfWeek: 1,
          startTime: '18:00',
          endTime: '19:30',
          location: 'Field A'
        },
        {
          dayOfWeek: 4,
          startTime: '18:00',
          endTime: '19:30',
          location: 'Field A'
        }
      ],
      createdAt: '2024-03-01',
      isActive: true,
      academyId: 'academy-1'
    }
  ] as Group[],

  coaches: [
    {
      id: 'coach-1',
      firstName: 'Carlos',
      lastName: 'Rodriguez',
      phone: '+254712345682',
      description: 'Experienced coach specializing in technical skills development for youth players. Former professional player with 8 years of coaching experience.',
      groupIds: ['group-1', 'group-3'],
      profileImage: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg',
      hireDate: '2023-08-15',
      academyId: 'academy-1'
    },
    {
      id: 'coach-2',
      firstName: 'Sarah',
      lastName: 'Wilson',
      phone: '+254712345683',
      description: 'Youth development specialist with a passion for nurturing young talent. Focuses on building confidence and fundamental skills.',
      groupIds: ['group-2'],
      profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      hireDate: '2023-09-01',
      academyId: 'academy-1'
    }
  ] as Coach[],

  sessions: [
    // Current week sessions (June 23-29, 2025)
    {
      id: 'session-1',
      title: 'U-14 Eagles Training',
      description: 'Technical skills development and ball control drills',
      date: '2025-06-23',
      startTime: '16:00',
      endTime: '17:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-1', 'drill-2'],
      attendanceIds: ['attendance-1', 'attendance-2'],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-2',
      title: 'U-16 Sharks Training',
      description: 'Advanced tactical training',
      date: '2025-06-23',
      startTime: '18:00',
      endTime: '19:30',
      groupId: 'group-3',
      coachIds: ['coach-1'],
      drillIds: ['drill-2'],
      attendanceIds: [],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-3',
      title: 'U-12 Lions Training',
      description: 'Fun games and basic skills development',
      date: '2025-06-24',
      startTime: '15:30',
      endTime: '16:30',
      groupId: 'group-2',
      coachIds: ['coach-2'],
      drillIds: ['drill-3'],
      attendanceIds: [],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-4',
      title: 'U-14 Eagles Training',
      description: 'Passing accuracy and team coordination',
      date: '2025-06-25',
      startTime: '16:00',
      endTime: '17:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-2'],
      attendanceIds: [],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-5',
      title: 'U-16 Sharks Training',
      description: 'Match preparation and tactics',
      date: '2025-06-26',
      startTime: '18:00',
      endTime: '19:30',
      groupId: 'group-3',
      coachIds: ['coach-1'],
      drillIds: ['drill-1', 'drill-2'],
      attendanceIds: [],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-6',
      title: 'U-12 Lions Training',
      description: 'Dribbling and shooting practice',
      date: '2025-06-27',
      startTime: '15:30',
      endTime: '16:30',
      groupId: 'group-2',
      coachIds: ['coach-2'],
      drillIds: ['drill-1', 'drill-3'],
      attendanceIds: [],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-7',
      title: 'U-14 Eagles Training',
      description: 'Weekend intensive training',
      date: '2025-06-28',
      startTime: '10:00',
      endTime: '11:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-1', 'drill-2'],
      attendanceIds: [],
      status: 'ongoing',
      academyId: 'academy-1'
    },
    {
      id: 'session-8',
      title: 'Goalkeeper Training',
      description: 'Specialized goalkeeper training session',
      date: '2025-06-28',
      startTime: '12:00',
      endTime: '13:00',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-3'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-9',
      title: 'Fitness Training',
      description: 'Conditioning and fitness session',
      date: '2025-06-28',
      startTime: '14:00',
      endTime: '15:00',
      groupId: 'group-3',
      coachIds: ['coach-1'],
      drillIds: [],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    
    // Next week sessions (June 30 - July 6, 2025)
    {
      id: 'session-10',
      title: 'U-14 Eagles Training',
      description: 'Speed and agility training',
      date: '2025-06-30',
      startTime: '16:00',
      endTime: '17:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-1'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-11',
      title: 'U-16 Sharks Training',
      description: 'Tactical formation practice',
      date: '2025-06-30',
      startTime: '18:00',
      endTime: '19:30',
      groupId: 'group-3',
      coachIds: ['coach-1'],
      drillIds: ['drill-2'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-12',
      title: 'U-12 Lions Training',
      description: 'Team building and communication',
      date: '2025-07-01',
      startTime: '15:30',
      endTime: '16:30',
      groupId: 'group-2',
      coachIds: ['coach-2'],
      drillIds: ['drill-2'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-13',
      title: 'U-14 Eagles Training',
      description: 'Set pieces and corner kicks',
      date: '2025-07-02',
      startTime: '16:00',
      endTime: '17:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-2', 'drill-3'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-14',
      title: 'Individual Skills Session',
      description: 'One-on-one skill development',
      date: '2025-07-02',
      startTime: '18:00',
      endTime: '19:00',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-1'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-15',
      title: 'U-16 Sharks Training',
      description: 'Match simulation',
      date: '2025-07-03',
      startTime: '18:00',
      endTime: '19:30',
      groupId: 'group-3',
      coachIds: ['coach-1'],
      drillIds: ['drill-1', 'drill-2'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-16',
      title: 'U-12 Lions Training',
      description: 'Goalkeeping basics and handling',
      date: '2025-07-04',
      startTime: '15:30',
      endTime: '16:30',
      groupId: 'group-2',
      coachIds: ['coach-2'],
      drillIds: ['drill-3'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-17',
      title: 'U-14 Eagles Training',
      description: 'Weekend match preparation',
      date: '2025-07-05',
      startTime: '10:00',
      endTime: '11:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-1', 'drill-2', 'drill-3'],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },
    {
      id: 'session-18',
      title: 'Recovery Session',
      description: 'Light training and recovery',
      date: '2025-07-05',
      startTime: '12:00',
      endTime: '13:00',
      groupId: 'group-3',
      coachIds: ['coach-1'],
      drillIds: [],
      attendanceIds: [],
      status: 'scheduled',
      academyId: 'academy-1'
    },

    // Previous week sessions (June 16-22, 2025)
    {
      id: 'session-19',
      title: 'U-14 Eagles Training',
      description: 'Fitness and conditioning',
      date: '2025-06-16',
      startTime: '16:00',
      endTime: '17:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-1'],
      attendanceIds: ['attendance-3'],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-20',
      title: 'U-12 Lions Training',
      description: 'Basic ball control and coordination',
      date: '2025-06-17',
      startTime: '15:30',
      endTime: '16:30',
      groupId: 'group-2',
      coachIds: ['coach-2'],
      drillIds: ['drill-3'],
      attendanceIds: ['attendance-4'],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-21',
      title: 'U-16 Sharks Training',
      description: 'Defensive positioning and tactics',
      date: '2025-06-19',
      startTime: '18:00',
      endTime: '19:30',
      groupId: 'group-3',
      coachIds: ['coach-1'],
      drillIds: ['drill-2'],
      attendanceIds: [],
      status: 'cancelled',
      academyId: 'academy-1'
    },
    {
      id: 'session-22',
      title: 'U-12 Lions Training',
      description: 'Small-sided games and fun activities',
      date: '2025-06-20',
      startTime: '15:30',
      endTime: '16:30',
      groupId: 'group-2',
      coachIds: ['coach-2'],
      drillIds: ['drill-1', 'drill-3'],
      attendanceIds: ['attendance-5'],
      status: 'completed',
      academyId: 'academy-1'
    },
    {
      id: 'session-23',
      title: 'U-14 Eagles Training',
      description: 'Shooting practice and finishing',
      date: '2025-06-21',
      startTime: '10:00',
      endTime: '11:30',
      groupId: 'group-1',
      coachIds: ['coach-1'],
      drillIds: ['drill-3'],
      attendanceIds: ['attendance-6'],
      status: 'completed',
      academyId: 'academy-1'
    }
  ] as Session[],

  drills: [
    {
      id: 'drill-1',
      title: 'Cone Dribbling',
      description: 'Dribbling through a series of cones to improve ball control',
      category: 'Technical',
      difficulty: 'beginner' as const,
      duration: 15,
      equipmentNeeded: ['Cones', 'Footballs'],
      mediaUrls: ['https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg'],
      assessmentParameters: ['Ball Control', 'Speed'],
      instructions: [
        'Set up 6 cones in a straight line, 2 meters apart',
        'Players dribble through the cones using both feet',
        'Focus on keeping the ball close to feet',
        'Increase speed as technique improves'
      ],
      academyId: 'academy-1'
    },
    {
      id: 'drill-2',
      title: 'Passing Square',
      description: 'Short passing drill in a square formation',
      category: 'Passing',
      difficulty: 'intermediate' as const,
      duration: 20,
      equipmentNeeded: ['Cones', 'Footballs'],
      mediaUrls: ['https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg'],
      assessmentParameters: ['Passing Accuracy', 'First Touch'],
      instructions: [
        'Create a 10x10 meter square with cones',
        'Players at each corner',
        'Pass clockwise around the square',
        'Focus on accuracy and first touch'
      ],
      academyId: 'academy-1'
    },
    {
      id: 'drill-3',
      title: 'Shooting Practice',
      description: 'Basic shooting technique from various angles',
      category: 'Shooting',
      difficulty: 'beginner' as const,
      duration: 25,
      equipmentNeeded: ['Goals', 'Footballs', 'Cones'],
      mediaUrls: ['https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg'],
      assessmentParameters: ['Shooting Accuracy', 'Power'],
      instructions: [
        'Set up shooting positions at different angles',
        'Players take turns shooting at goal',
        'Focus on proper technique and follow-through',
        'Goalkeeper provides feedback'
      ],
      academyId: 'academy-1'
    }
  ] as Drill[],

  assessments: [
    {
      id: 'assessment-1',
      studentId: 'student-1',
      assessmentDate: '2024-12-15',
      assessorId: 'coach-1',
      parameters: [
        { name: 'Ball Control', score: 8, maxScore: 10, comments: 'Good progress, needs work on weaker foot' },
        { name: 'Passing Accuracy', score: 7, maxScore: 10, comments: 'Consistent short passes, long passes need improvement' },
        { name: 'Speed', score: 9, maxScore: 10, comments: 'Excellent pace and acceleration' },
        { name: 'Teamwork', score: 8, maxScore: 10, comments: 'Good communication with teammates' }
      ],
      notes: 'John is showing great improvement in technical skills. Continue focusing on weaker foot development.',
      overallScore: 8.0,
      academyId: 'academy-1'
    }
  ] as Assessment[],

  fees: [
    {
      id: 'fee-1',
      studentId: 'student-1',
      amount: 15000,
      type: 'monthly' as const,
      description: 'December 2024 Training Fees',
      dueDate: '2024-12-01',
      status: 'paid' as const,
      paidDate: '2024-11-28',
      paymentMethod: 'M-Pesa',
      academyId: 'academy-1'
    },
    {
      id: 'fee-2',
      studentId: 'student-2',
      amount: 15000,
      type: 'monthly' as const,
      description: 'December 2024 Training Fees',
      dueDate: '2024-12-01',
      status: 'pending' as const,
      academyId: 'academy-1'
    },
    {
      id: 'fee-3',
      studentId: 'student-1',
      amount: 7500,
      type: 'equipment' as const,
      description: 'Training Kit',
      dueDate: '2024-12-15',
      status: 'overdue' as const,
      academyId: 'academy-1'
    },
    {
      id: 'fee-4',
      studentId: 'student-3',
      amount: 12000,
      type: 'monthly' as const,
      description: 'December 2024 Training Fees',
      dueDate: '2024-12-01',
      status: 'paid' as const,
      paidDate: '2024-11-30',
      paymentMethod: 'Bank Transfer',
      academyId: 'academy-1'
    }
  ] as Fee[],

  expenses: [
    {
      id: 'expense-1',
      category: 'Equipment',
      description: 'New footballs and cones',
      amount: 35000,
      date: '2024-12-20',
      receiptUrl: 'https://example.com/receipt1.pdf',
      approvedBy: 'user-1',
      academyId: 'academy-1'
    },
    {
      id: 'expense-2',
      category: 'Facility',
      description: 'Field maintenance',
      amount: 80000,
      date: '2024-12-15',
      approvedBy: 'user-1',
      academyId: 'academy-1'
    },
    {
      id: 'expense-3',
      category: 'Equipment',
      description: 'Training cones and markers',
      amount: 25000,
      date: '2024-12-18',
      approvedBy: 'user-1',
      academyId: 'academy-1'
    }
  ] as Expense[],

  announcements: [
    {
      id: 'announcement-1',
      title: 'Holiday Training Schedule',
      content: 'Please note that training sessions will be modified during the holiday period. Check the updated schedule in your portal.',
      priority: 'high' as const,
      targetGroups: ['group-1'],
      targetStudents: [],
      createdBy: 'user-1',
      createdAt: '2024-12-20T10:00:00Z',
      deliveryStatus: {
        'guardian-1': 'read',
        'guardian-2': 'delivered'
      },
      academyId: 'academy-1'
    },
    {
      id: 'announcement-2',
      title: 'New Equipment Available',
      content: 'We have received new training equipment. Please see your coach for fitting sessions.',
      priority: 'medium' as const,
      targetGroups: ['group-2'],
      targetStudents: [],
      createdBy: 'user-1',
      createdAt: '2024-12-18T14:30:00Z',
      deliveryStatus: {
        'guardian-3': 'read'
      },
      academyId: 'academy-1'
    }
  ] as Announcement[],

  events: [
    {
      id: 'event-1',
      title: 'New Year Football Tournament',
      description: 'Annual tournament featuring all academy groups',
      type: 'tournament' as const,
      date: '2025-01-15',
      startTime: '09:00',
      endTime: '16:00',
      location: 'Main Stadium',
      groupIds: ['group-1'],
      coachIds: ['coach-1'],
      rsvpRequired: true,
      rsvpList: {
        'guardian-1': 'yes',
        'guardian-2': 'maybe'
      },
      academyId: 'academy-1'
    },
    {
      id: 'event-2',
      title: 'Parent-Coach Meeting',
      description: 'Monthly progress review meeting',
      type: 'ceremony' as const,
      date: '2025-01-05',
      startTime: '18:00',
      endTime: '19:30',
      location: 'Fazam Football Academy Clubhouse',
      groupIds: ['group-2'],
      coachIds: ['coach-2'],
      rsvpRequired: true,
      rsvpList: {
        'guardian-3': 'yes'
      },
      academyId: 'academy-1'
    }
  ] as Event[]
};