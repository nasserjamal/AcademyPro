import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { Plus, Target, Calendar, Users, BarChart3, Save, Edit, Trash2, X, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const defaultAssessmentParameters = [
  'Ball Control',
  'Passing Accuracy',
  'Speed',
  'Stamina',
  'Teamwork',
  'Shooting Accuracy',
  'Defensive Skills',
  'Leadership'
];

interface AssessmentParameter {
  name: string;
  weight: number;
  description: string;
}

export const Assessments: React.FC = () => {
  const navigate = useNavigate();
  const { assessments, getFilteredGroups, coaches, addAssessment } = useStore();
  const groups = getFilteredGroups();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [showParametersModal, setShowParametersModal] = useState(false);
  const [showCreateAssessmentModal, setShowCreateAssessmentModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [assessmentParameters, setAssessmentParameters] = useState<string[]>([...defaultAssessmentParameters]);
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);
  const [selectedParameters, setSelectedParameters] = useState<AssessmentParameter[]>([]);
  const [deleteParamConfirm, setDeleteParamConfirm] = useState<{ isOpen: boolean; paramIndex: number; paramName: string }>({
    isOpen: false,
    paramIndex: -1,
    paramName: ''
  });

  // Reschedule state
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getGroup = (groupId: string) => {
    return groups.find(g => g.id === groupId);
  };

  const getCoach = (coachId: string) => {
    return coaches.find(c => c.id === coachId);
  };

  // Mock upcoming group assessments
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
    },
    {
      id: 'upcoming-3',
      groupId: 'group-3',
      scheduledDate: '2025-07-10',
      scheduledTime: '18:00',
      assessorId: 'coach-1',
      type: 'Performance Evaluation',
      status: 'scheduled',
      description: 'Advanced performance evaluation for competitive players',
      parameters: [
        { name: 'Shooting Accuracy', weight: 25, description: 'Goal scoring ability and precision' },
        { name: 'Defensive Skills', weight: 20, description: 'Tackling and positioning' },
        { name: 'Leadership', weight: 15, description: 'On-field leadership and decision making' }
      ]
    }
  ];

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

  const getScoreBadgeVariant = (score: number, maxScore: number = 10) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const handleAssessmentClick = (assessmentId: string) => {
    navigate(`/assessments/${assessmentId}`);
  };

  const handleStartAssessment = (assessmentId: string) => {
    // Navigate to assessment detail page for marking
    navigate(`/assessments/${assessmentId}`);
  };

  const handleRescheduleClick = (assessment: any) => {
    setSelectedAssessment(assessment);
    // Initialize with current assessment date
    setSelectedDate(new Date(assessment.scheduledDate));
    setCurrentMonth(new Date(assessment.scheduledDate));
    setSelectedTime(assessment.scheduledTime);
    setShowRescheduleModal(true);
  };

  const handleReschedule = () => {
    if (selectedDate && selectedTime && selectedAssessment) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      console.log('Rescheduling assessment:', selectedAssessment.id, 'to:', formattedDate, selectedTime);
      // Here you would update the assessment with new date/time
      setShowRescheduleModal(false);
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedAssessment(null);
    }
  };

  const addParameter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAssessmentParameters([...assessmentParameters, '']);
  };

  const updateParameter = (index: number, value: string) => {
    const updated = [...assessmentParameters];
    updated[index] = value;
    setAssessmentParameters(updated);
  };

  const handleDeleteParameter = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const paramName = assessmentParameters[index];
    setDeleteParamConfirm({
      isOpen: true,
      paramIndex: index,
      paramName: paramName
    });
  };

  const confirmDeleteParameter = () => {
    const updated = assessmentParameters.filter((_, i) => i !== deleteParamConfirm.paramIndex);
    setAssessmentParameters(updated);
    setDeleteParamConfirm({ isOpen: false, paramIndex: -1, paramName: '' });
  };

  const saveParameters = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Saving parameters:', assessmentParameters.filter(p => p.trim() !== ''));
    setShowParametersModal(false);
  };

  const handleCoachSelection = (coachId: string) => {
    setSelectedCoaches(prev => 
      prev.includes(coachId) 
        ? prev.filter(id => id !== coachId)
        : [...prev, coachId]
    );
  };

  const handleParameterSelection = (paramName: string) => {
    const isSelected = selectedParameters.some(p => p.name === paramName);
    
    if (isSelected) {
      setSelectedParameters(prev => prev.filter(p => p.name !== paramName));
    } else {
      setSelectedParameters(prev => [...prev, {
        name: paramName,
        weight: 10,
        description: ''
      }]);
    }
  };

  const updateSelectedParameter = (paramName: string, field: 'weight' | 'description', value: string | number) => {
    setSelectedParameters(prev => 
      prev.map(p => 
        p.name === paramName 
          ? { ...p, [field]: value }
          : p
      )
    );
  };

  const removeSelectedParameter = (paramName: string) => {
    setSelectedParameters(prev => prev.filter(p => p.name !== paramName));
  };

  const handleCreateAssessment = (formData: FormData) => {
    const groupId = formData.get('groupId') as string;
    const description = formData.get('description') as string;
    const notes = formData.get('notes') as string;
    const assessmentDate = formData.get('assessmentDate') as string;
    const assessmentTime = formData.get('assessmentTime') as string;
    
    // Convert selected parameters to assessment format
    const parameters = selectedParameters.map(param => ({
      name: param.name,
      score: 0, // Will be filled during actual assessment
      maxScore: param.weight,
      comments: param.description
    }));

    const newAssessment = {
      id: `assessment-${Date.now()}`,
      groupId,
      assessmentDate,
      assessmentTime,
      assessorId: selectedCoaches[0] || '', // Primary assessor
      assessorIds: selectedCoaches, // All selected coaches
      description,
      parameters,
      notes,
      overallScore: 0, // Will be calculated during assessment
      status: 'scheduled' as const,
      type: 'Group Assessment',
      academyId: 'academy-1'
    };

    addAssessment(newAssessment);
    setShowCreateAssessmentModal(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setSelectedCoaches([]);
    setSelectedParameters([]);
  };

  const getTotalWeight = () => {
    return selectedParameters.reduce((sum, param) => sum + param.weight, 0);
  };

  const ParametersModal = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Manage Assessment Parameters
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Add, edit, or remove assessment criteria for group evaluations
        </p>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {assessmentParameters.map((param, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Target className="w-5 h-5 text-primary-500 flex-shrink-0" />
            <input
              type="text"
              value={param}
              onChange={(e) => updateParameter(index, e.target.value)}
              placeholder="Enter parameter name..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={(e) => handleDeleteParameter(index, e)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={addParameter}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Parameter
        </button>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="secondary" onClick={() => setShowParametersModal(false)}>
          Cancel
        </Button>
        <button
          type="button"
          onClick={saveParameters}
          className="inline-flex items-center px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Parameters
        </button>
      </div>
    </div>
  );

  const CreateAssessmentModal = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleCreateAssessment(formData);
    }}>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Group *
            </label>
            <select
              name="groupId"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.ageRange}) - {group.studentIds.length} students
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assessment Date *
            </label>
            <input
              type="date"
              name="assessmentDate"
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assessment Time *
            </label>
            <input
              type="time"
              name="assessmentTime"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="e.g., Monthly Skills Assessment, Pre-Tournament Evaluation, End of Season Review..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Coach Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select Coaches *
          </label>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Choose one or more coaches to conduct this assessment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {coaches.map((coach) => (
              <label key={coach.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCoaches.includes(coach.id)}
                  onChange={() => handleCoachSelection(coach.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    {coach.profileImage ? (
                      <img 
                        src={coach.profileImage} 
                        alt={`${coach.firstName} ${coach.lastName}`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-xs">
                        {coach.firstName[0]}{coach.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {coach.firstName} {coach.lastName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {coach.phone}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          {selectedCoaches.length === 0 && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-2">
              Please select at least one coach
            </p>
          )}
        </div>

        {/* Assessment Parameters Definition */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                Define Assessment Parameters
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select parameters and define their weights for this assessment
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Weight: {getTotalWeight()}
              </p>
            </div>
          </div>

          {/* Available Parameters */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Available Parameters
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {assessmentParameters.map((param, index) => {
                const isSelected = selectedParameters.some(p => p.name === param);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleParameterSelection(param)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900/30 dark:border-primary-400 dark:text-primary-300'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {param}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Parameters Configuration */}
          {selectedParameters.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Configure Selected Parameters
              </label>
              <div className="space-y-4 max-h-60 overflow-y-auto">
                {selectedParameters.map((param, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {param.name}
                      </h5>
                      <button
                        type="button"
                        onClick={() => removeSelectedParameter(param.name)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Weight (Max Score)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={param.weight}
                          onChange={(e) => updateSelectedParameter(param.name, 'weight', parseInt(e.target.value) || 10)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Description (Optional)
                        </label>
                        <input
                          type="text"
                          value={param.description}
                          onChange={(e) => updateSelectedParameter(param.name, 'description', e.target.value)}
                          placeholder={`Describe what will be assessed for ${param.name.toLowerCase()}...`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedParameters.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select parameters from above to configure this assessment
              </p>
            </div>
          )}
        </div>

        {/* Overall Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Overall Assessment Notes (Optional)
          </label>
          <textarea
            name="notes"
            rows={4}
            placeholder="General notes about this assessment, specific focus areas, objectives, or any special instructions for the coaches..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => {
            setShowCreateAssessmentModal(false);
            resetCreateForm();
          }}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            icon={Save}
            disabled={selectedCoaches.length === 0 || selectedParameters.length === 0}
          >
            Schedule Assessment
          </Button>
        </div>
      </div>
    </form>
  );

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
            {selectedAssessment?.type} - {getGroup(selectedAssessment?.groupId)?.name}
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
            setSelectedAssessment(null);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Group Assessments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track group performance and progress
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button icon={Plus} onClick={() => setShowCreateAssessmentModal(true)}>
            Schedule Assessment
          </Button>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showParametersModal}
        onClose={() => setShowParametersModal(false)}
        title="Manage Assessment Parameters"
        size="large"
      >
        <ParametersModal />
      </Modal>

      <Modal
        isOpen={showCreateAssessmentModal}
        onClose={() => {
          setShowCreateAssessmentModal(false);
          resetCreateForm();
        }}
        title="Schedule New Group Assessment"
        size="large"
      >
        <CreateAssessmentModal />
      </Modal>

      <Modal
        isOpen={showRescheduleModal}
        onClose={() => {
          setShowRescheduleModal(false);
          setSelectedDate(null);
          setSelectedTime('');
          setSelectedAssessment(null);
        }}
        title="Reschedule Assessment"
        size="medium"
      >
        <RescheduleModal />
      </Modal>

      <ConfirmDialog
        isOpen={deleteParamConfirm.isOpen}
        onClose={() => setDeleteParamConfirm({ isOpen: false, paramIndex: -1, paramName: '' })}
        onConfirm={confirmDeleteParameter}
        title="Delete Parameter"
        message={`Are you sure you want to delete "${deleteParamConfirm.paramName}"? This will affect all future assessments.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Assessment Parameters Management */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Assessment Parameters
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage the criteria used for group evaluations
            </p>
          </div>
          <Button variant="secondary" size="small" onClick={() => setShowParametersModal(true)}>
            Manage Parameters
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {assessmentParameters.map((parameter, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
              <Target className="w-5 h-5 text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {parameter}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Assessment Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Upcoming Assessments
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Assessment History
          </button>
        </nav>
      </div>

      {/* Upcoming Assessments Tab */}
      {activeTab === 'upcoming' && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Group Assessments
            </h3>
          </div>
          <div className="space-y-4">
            {upcomingAssessments.map((assessment) => {
              const group = getGroup(assessment.groupId);
              const assessor = getCoach(assessment.assessorId);

              return (
                <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {group?.name} - {assessment.type}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {assessment.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(assessment.scheduledDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {assessment.scheduledTime}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {assessor?.firstName} {assessor?.lastName}
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {group?.studentIds.length || 0} students
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning">
                        Scheduled
                      </Badge>
                    </div>
                  </div>

                  {/* Assessment Parameters Preview */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">ASSESSMENT PARAMETERS</p>
                    <div className="flex flex-wrap gap-2">
                      {assessment.parameters.map((param, index) => (
                        <div key={index} className="flex items-center space-x-1">
                          <Badge variant="primary" size="small">
                            {param.name}
                          </Badge>
                          <span className="text-xs text-gray-500">({param.weight})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="small"
                      onClick={() => handleRescheduleClick(assessment)}
                    >
                      Reschedule
                    </Button>
                    <Button 
                      variant="primary" 
                      size="small" 
                      icon={Edit}
                      onClick={() => handleStartAssessment(assessment.id)}
                    >
                      Start Assessment
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Assessment History Tab */}
      {activeTab === 'history' && (
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Group Assessment History
            </h3>
          </div>
          <div className="space-y-4">
            {assessments.map((assessment) => {
              // For now, we'll treat existing assessments as group assessments
              // In a real implementation, you'd have a groupId field
              const group = groups[0]; // Mock group assignment
              const assessor = getCoach(assessment.assessorId);

              return (
                <div 
                  key={assessment.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAssessmentClick(assessment.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {group?.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {group?.description} • {group?.ageRange}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(assessment.assessmentDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {assessor?.firstName} {assessor?.lastName}
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {group?.studentIds.length || 0} students
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {assessment.overallScore}/10
                      </div>
                      <Badge variant={getScoreBadgeVariant(assessment.overallScore)}>
                        {assessment.overallScore >= 8 ? 'Excellent' : 
                         assessment.overallScore >= 6 ? 'Good' : 'Needs Improvement'}
                      </Badge>
                    </div>
                  </div>

                  {/* Parameter Scores */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {assessment.parameters.slice(0, 4).map((param, index) => (
                      <div key={index} className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {param.name}
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                            {param.score}
                          </span>
                          <span className="text-sm text-gray-500">/{param.maxScore}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(param.score / param.maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notes */}
                  {assessment.notes && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Group Assessment Notes:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {assessment.notes}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" size="small" icon={BarChart3}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="small">
                      Edit Assessment
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {assessments.length === 0 && activeTab === 'history' && (
        <Card className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <Target className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No group assessments found</h3>
            <p className="text-sm mb-4">
              Start by scheduling your first group assessment
            </p>
            <Button icon={Plus} onClick={() => setShowCreateAssessmentModal(true)}>
              Schedule Assessment
            </Button>
          </div>
        </Card>
      )}

      {upcomingAssessments.length === 0 && activeTab === 'upcoming' && (
        <Card className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No upcoming group assessments</h3>
            <p className="text-sm mb-4">
              Schedule assessments for your training groups
            </p>
            <Button icon={Plus} onClick={() => setShowCreateAssessmentModal(true)}>
              Schedule Assessment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};