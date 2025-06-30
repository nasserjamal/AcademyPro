import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Calendar, Users, Target, Save, Edit, Clock, User, ChevronLeft, ChevronRight, Star, Award } from 'lucide-react';

export const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { assessments, getFilteredGroups, getFilteredStudents, getFilteredCoaches, updateAssessment } = useStore();
  const groups = getFilteredGroups();
  const students = getFilteredStudents();
  const coaches = getFilteredCoaches();
  
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showMarkingModal, setShowMarkingModal] = useState(false);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [studentScores, setStudentScores] = useState<Record<string, Record<string, number>>>({});
  const [studentComments, setStudentComments] = useState<Record<string, Record<string, string>>>({});
  const [isAssessing, setIsAssessing] = useState(false);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Check if this is an upcoming assessment (mock data) or existing assessment
  const upcomingAssessments = [
    {
      id: 'upcoming-1',
      groupId: 'group-1',
      scheduledDate: '2025-07-05',
      scheduledTime: '16:00',
      assessorId: 'coach-1',
      type: 'Monthly Group Review',
      status: 'scheduled',
      description: 'Monthly skills assessment focusing on technical development and teamwork',
      parameters: [
        { name: 'Ball Control', weight: 20, description: 'Individual ball handling and first touch' },
        { name: 'Passing Accuracy', weight: 15, description: 'Short and long passing precision' },
        { name: 'Teamwork', weight: 25, description: 'Communication and collaboration during drills' }
      ]
    },
    {
      id: 'upcoming-2',
      groupId: 'group-2',
      scheduledDate: '2025-07-08',
      scheduledTime: '15:30',
      assessorId: 'coach-2',
      type: 'Skills Assessment',
      status: 'scheduled',
      description: 'Basic skills evaluation for younger players',
      parameters: [
        { name: 'Ball Control', weight: 30, description: 'Basic ball handling skills' },
        { name: 'Speed', weight: 20, description: 'Running speed and agility' }
      ]
    }
  ];

  const upcomingAssessment = upcomingAssessments.find(a => a.id === id);
  const existingAssessment = assessments.find(a => a.id === id);
  
  const assessment = upcomingAssessment || existingAssessment;
  
  if (!assessment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Assessment not found</h2>
        <Link to="/assessments">
          <Button className="mt-4" icon={ArrowLeft}>Back to Assessments</Button>
        </Link>
      </div>
    );
  }

  const group = groups.find(g => g.id === assessment.groupId);
  const groupStudents = students.filter(s => group?.studentIds.includes(s.id));
  const assessor = coaches.find(c => c.id === assessment.assessorId);
  
  const isUpcoming = !!upcomingAssessment;
  const isCompleted = existingAssessment && existingAssessment.overallScore > 0;

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!isPastDate(newDate)) {
      setSelectedDate(newDate);
    }
  };

  const handleStartAssessment = () => {
    setIsAssessing(true);
    setCurrentStudentIndex(0);
    
    // Initialize scores for all students and parameters
    const initialScores: Record<string, Record<string, number>> = {};
    const initialComments: Record<string, Record<string, string>> = {};
    
    groupStudents.forEach(student => {
      initialScores[student.id] = {};
      initialComments[student.id] = {};
      assessment.parameters.forEach(param => {
        initialScores[student.id][param.name] = 0;
        initialComments[student.id][param.name] = '';
      });
    });
    
    setStudentScores(initialScores);
    setStudentComments(initialComments);
    setShowMarkingModal(true);
  };

  const updateStudentScore = (studentId: string, parameterName: string, score: number) => {
    setStudentScores(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [parameterName]: score
      }
    }));
  };

  const updateStudentComment = (studentId: string, parameterName: string, comment: string) => {
    setStudentComments(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [parameterName]: comment
      }
    }));
  };

  const calculateStudentAverage = (studentId: string) => {
    const scores = studentScores[studentId] || {};
    const totalWeightedScore = assessment.parameters.reduce((sum, param) => {
      const score = scores[param.name] || 0;
      const weight = param.weight || 10;
      return sum + (score * weight);
    }, 0);
    
    const totalWeight = assessment.parameters.reduce((sum, param) => sum + (param.weight || 10), 0);
    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(1) : '0.0';
  };

  const navigateStudent = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentStudentIndex > 0) {
      setCurrentStudentIndex(currentStudentIndex - 1);
    } else if (direction === 'next' && currentStudentIndex < groupStudents.length - 1) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    }
  };

  const saveAssessment = () => {
    // Calculate overall group score
    const allStudentAverages = groupStudents.map(student => 
      parseFloat(calculateStudentAverage(student.id))
    );
    const groupAverage = allStudentAverages.reduce((sum, avg) => sum + avg, 0) / allStudentAverages.length;

    // Create assessment parameters with group averages
    const assessmentParameters = assessment.parameters.map(param => {
      const paramScores = groupStudents.map(student => 
        studentScores[student.id]?.[param.name] || 0
      );
      const paramAverage = paramScores.reduce((sum, score) => sum + score, 0) / paramScores.length;
      
      return {
        name: param.name,
        score: Math.round(paramAverage * 10) / 10,
        maxScore: param.weight || 10,
        comments: param.description || ''
      };
    });

    const newAssessment = {
      id: `assessment-${Date.now()}`,
      groupId: assessment.groupId,
      assessmentDate: upcomingAssessment?.scheduledDate || new Date().toISOString().split('T')[0],
      assessorId: assessment.assessorId,
      parameters: assessmentParameters,
      notes: `Group assessment completed. Individual student scores recorded for ${groupStudents.length} students.`,
      overallScore: Math.round(groupAverage * 10) / 10,
      academyId: 'academy-1'
    };

    updateAssessment(newAssessment.id, newAssessment);
    setIsAssessing(false);
    setShowMarkingModal(false);
    
    // Navigate back to assessments
    window.location.href = '/assessments';
  };

  const handleReschedule = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log('Rescheduling assessment to:', formattedDate, selectedTime);
      // Here you would update the assessment with new date/time
      setShowRescheduleModal(false);
      setSelectedDate(null);
      setSelectedTime('');
    }
  };

  const openRescheduleModal = () => {
    // Initialize with current assessment date if available
    if (upcomingAssessment?.scheduledDate) {
      setSelectedDate(new Date(upcomingAssessment.scheduledDate));
      setCurrentMonth(new Date(upcomingAssessment.scheduledDate));
    }
    if (upcomingAssessment?.scheduledTime) {
      setSelectedTime(upcomingAssessment.scheduledTime);
    }
    setShowRescheduleModal(true);
  };

  const RescheduleModal = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Create array of days for the calendar
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Reschedule Assessment
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {group?.name} - {assessment.type}
          </p>
        </div>

        {/* Calendar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant="ghost"
              size="small"
              icon={ChevronLeft}
              onClick={() => navigateMonth('prev')}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <Button
              variant="ghost"
              size="small"
              icon={ChevronRight}
              onClick={() => navigateMonth('next')}
            />
          </div>

          {/* Calendar Grid */}
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="p-2"></div>;
                }

                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isCurrentDay = isToday(date);
                const isPast = isPastDate(date);

                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    disabled={isPast}
                    className={`
                      p-2 text-sm rounded-lg transition-colors relative
                      ${isPast 
                        ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' 
                        : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                      ${isSelected 
                        ? 'bg-primary-500 text-white hover:bg-primary-600' 
                        : ''
                      }
                      ${isCurrentDay && !isSelected 
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400' 
                        : ''
                      }
                    `}
                  >
                    {day}
                    {isCurrentDay && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Time
          </label>
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Selected Date/Time Display */}
        {selectedDate && selectedTime && (
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
              New Assessment Date & Time:
            </p>
            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} at {selectedTime}
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => {
            setShowRescheduleModal(false);
            setSelectedDate(null);
            setSelectedTime('');
          }}>
            Cancel
          </Button>
          <Button 
            icon={Save} 
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime}
          >
            Reschedule Assessment
          </Button>
        </div>
      </div>
    );
  };

  const MarkingModal = () => {
    if (groupStudents.length === 0) return null;
    
    const currentStudent = groupStudents[currentStudentIndex];
    const studentAverage = calculateStudentAverage(currentStudent.id);
    
    return (
      <div className="space-y-6">
        {/* Header with Student Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="small"
              icon={ChevronLeft}
              onClick={() => navigateStudent('prev')}
              disabled={currentStudentIndex === 0}
            />
            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Student {currentStudentIndex + 1} of {groupStudents.length}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {assessment.type} - {group?.name}
              </p>
            </div>
            <Button
              variant="ghost"
              size="small"
              icon={ChevronRight}
              onClick={() => navigateStudent('next')}
              disabled={currentStudentIndex === groupStudents.length - 1}
            />
          </div>
          <Button variant="secondary" onClick={() => {
            setShowMarkingModal(false);
            setIsAssessing(false);
          }}>
            Close
          </Button>
        </div>

        {/* Student Info Card */}
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              {currentStudent.profileImage ? (
                <img 
                  src={currentStudent.profileImage} 
                  alt={`${currentStudent.firstName} ${currentStudent.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-primary-600 dark:text-primary-400 font-semibold text-xl">
                  {currentStudent.firstName[0]}{currentStudent.lastName[0]}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStudent.firstName} {currentStudent.lastName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Age: {new Date().getFullYear() - new Date(currentStudent.dateOfBirth).getFullYear()}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Award className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Average: {studentAverage}/10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Parameters */}
        <div className="space-y-4">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            Assessment Parameters
          </h5>
          
          {assessment.parameters.map((param, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h6 className="font-medium text-gray-900 dark:text-white">
                    {param.name}
                  </h6>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {param.description}
                  </p>
                </div>
                <Badge variant="secondary" size="small">
                  Max: {param.weight || 10}
                </Badge>
              </div>

              {/* Score Input with Star Rating */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Score (0-{param.weight || 10})
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      max={param.weight || 10}
                      step="0.1"
                      value={studentScores[currentStudent.id]?.[param.name] || 0}
                      onChange={(e) => updateStudentScore(currentStudent.id, param.name, parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {/* Star Rating Visual */}
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, starIndex) => {
                        const score = studentScores[currentStudent.id]?.[param.name] || 0;
                        const maxScore = param.weight || 10;
                        const normalizedScore = (score / maxScore) * 5;
                        const isFilled = starIndex < normalizedScore;
                        
                        return (
                          <Star
                            key={starIndex}
                            className={`w-5 h-5 ${
                              isFilled 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={studentComments[currentStudent.id]?.[param.name] || ''}
                    onChange={(e) => updateStudentComment(currentStudent.id, param.name, e.target.value)}
                    placeholder="Add specific feedback..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Student Progress Indicator */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Assessment Progress
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentStudentIndex + 1} of {groupStudents.length} students
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStudentIndex + 1) / groupStudents.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Navigation and Save */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              icon={ChevronLeft}
              onClick={() => navigateStudent('prev')}
              disabled={currentStudentIndex === 0}
            >
              Previous Student
            </Button>
            <Button
              variant="secondary"
              icon={ChevronRight}
              iconPosition="right"
              onClick={() => navigateStudent('next')}
              disabled={currentStudentIndex === groupStudents.length - 1}
            >
              Next Student
            </Button>
          </div>
          
          <Button icon={Save} onClick={saveAssessment}>
            Complete Assessment
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/assessments">
            <Button variant="ghost" icon={ArrowLeft} size="small">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {group?.name} Assessment
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isUpcoming ? 'Scheduled Assessment' : 'Assessment Results'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isUpcoming && (
            <>
              <Badge variant="warning">Scheduled</Badge>
              <Button variant="secondary" onClick={openRescheduleModal}>
                Reschedule
              </Button>
              <Button icon={Edit} onClick={handleStartAssessment}>
                Start Assessment
              </Button>
            </>
          )}
          {isCompleted && (
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {existingAssessment.overallScore}/10
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedDate(null);
          setSelectedTime('');
        }}
        title="Reschedule Assessment"
        size="medium"
      >
        <RescheduleModal />
      </Modal>

      {/* Marking Modal */}
      <Modal
        isOpen={showMarkingModal}
        onClose={() => {
          setShowMarkingModal(false);
          setIsAssessing(false);
        }}
        title="Assessment Marking"
        size="large"
      >
        <MarkingModal />
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assessment Information */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assessment Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Group</label>
                <div className="flex items-center mt-1">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-gray-900 dark:text-white">{group?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {group?.ageRange} • {groupStudents.length} students
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {isUpcoming ? 'Scheduled Date' : 'Assessment Date'}
                </label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(upcomingAssessment?.scheduledDate || existingAssessment?.assessmentDate || '').toLocaleDateString()}
                    </p>
                    {upcomingAssessment?.scheduledTime && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {upcomingAssessment.scheduledTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Assessor</label>
                <div className="flex items-center mt-1">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-900 dark:text-white">
                    {assessor?.firstName} {assessor?.lastName}
                  </p>
                </div>
              </div>
            </div>
            {assessment.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white mt-1">{assessment.description}</p>
              </div>
            )}
          </Card>

          {/* Assessment Parameters */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assessment Parameters
              </h3>
            </div>
            <div className="space-y-4">
              {assessment.parameters.map((param, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {param.name}
                    </h4>
                    <Badge variant="secondary" size="small">
                      Weight: {param.weight || 10}
                    </Badge>
                  </div>
                  {param.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {param.description}
                    </p>
                  )}
                  {isCompleted && existingAssessment && (
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(param.score / param.maxScore) * 100}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {param.score}/{param.maxScore}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Actions
              </h3>
            </div>
            <div className="space-y-3">
              {isUpcoming && (
                <>
                  <Button 
                    className="w-full" 
                    onClick={handleStartAssessment}
                  >
                    Start Assessment
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="secondary"
                    onClick={openRescheduleModal}
                  >
                    Reschedule
                  </Button>
                </>
              )}
              {isCompleted && (
                <>
                  <Button className="w-full" variant="secondary">
                    Edit Results
                  </Button>
                  <Button className="w-full" variant="secondary">
                    Export Report
                  </Button>
                  <Button className="w-full" variant="secondary">
                    Share with Parents
                  </Button>
                </>
              )}
              <Button className="w-full" variant="secondary">
                View Group Details
              </Button>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Quick Stats
              </h3>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {groupStudents.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Students to Assess
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {assessment.parameters.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Assessment Parameters
                </div>
              </div>
              {isCompleted && existingAssessment && (
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {existingAssessment.overallScore}
                  </div>
                  <div className="text-sm text-primary-600 dark:text-primary-400">
                    Group Average Score
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Group Information */}
          {group && (
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Group Information
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Group Name</label>
                  <p className="text-gray-900 dark:text-white">{group.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Age Range</label>
                  <p className="text-gray-900 dark:text-white">{group.ageRange}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white">{group.description}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};