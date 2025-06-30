import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { useStore } from '../../store/useStore';
import { Plus, ChevronLeft, ChevronRight, Save, Repeat } from 'lucide-react';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';

export const Sessions: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredSessions, getFilteredGroups, getFilteredCoaches, addSession } = useStore();
  const sessions = getFilteredSessions();
  const groups = getFilteredGroups();
  const coaches = getFilteredCoaches();
  
  const [activeTab, setActiveTab] = useState<'calendar' | 'schedules'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);

  // Generate weekly view - 7 days starting from Monday
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Define group colors
  const groupColors = {
    'group-1': { // U-14 Eagles
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      border: 'border-blue-500',
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/40',
      text: 'text-blue-800 dark:text-blue-200'
    },
    'group-2': { // U-12 Lions
      bg: 'bg-amber-50 dark:bg-amber-900/30',
      border: 'border-amber-500',
      hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/40',
      text: 'text-amber-800 dark:text-amber-200'
    },
    'group-3': { // U-16 Sharks
      bg: 'bg-emerald-50 dark:bg-emerald-900/30',
      border: 'border-emerald-500',
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/40',
      text: 'text-emerald-800 dark:text-emerald-200'
    },
    'default': {
      bg: 'bg-gray-50 dark:bg-gray-700/30',
      border: 'border-gray-500',
      hover: 'hover:bg-gray-100 dark:hover:bg-gray-700/40',
      text: 'text-gray-800 dark:text-gray-200'
    }
  };

  const getSessionsForDay = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return sessions.filter(session => session.date === dateString);
  };

  const getGroup = (groupId: string) => {
    return groups.find(g => g.id === groupId);
  };

  const getGroupColors = (groupId: string) => {
    return groupColors[groupId as keyof typeof groupColors] || groupColors.default;
  };

  const navigateWeeks = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleSessionClick = (sessionId: string) => {
    navigate(`/sessions/${sessionId}`);
  };

  const handleCreateSession = (formData: FormData) => {
    const isRecurring = formData.get('isRecurring') === 'true';
    const newSession = {
      id: `session-${Date.now()}`,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      groupId: formData.get('groupId') as string,
      coachIds: formData.get('coachId') ? [formData.get('coachId') as string] : [],
      drillIds: [],
      attendanceIds: [],
      status: 'scheduled' as const,
      isRecurring: isRecurring,
      academyId: 'academy-1'
    };
    
    addSession(newSession);
    setShowCreateSessionModal(false);
  };

  const CreateSessionForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleCreateSession(formData);
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Session Title *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., Technical Skills Training"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Brief description of the session objectives..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
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
                {group.name} ({group.ageRange})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Coach *
          </label>
          <select
            name="coachId"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Coach</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.firstName} {coach.lastName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Recurring Session
          </label>
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="isRecurring"
                value="false"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">One-time</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isRecurring"
                value="true"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Recurring</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Start Time *
          </label>
          <input
            type="time"
            name="startTime"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            End Time *
          </label>
          <input
            type="time"
            name="endTime"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => setShowCreateSessionModal(false)}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Create Session
        </Button>
      </div>
    </form>
  );

  // Mock recurring sessions data
  const recurringSchedules = [
    {
      id: 'schedule-1',
      title: 'U-14 Eagles Training',
      groupId: 'group-1',
      coachId: 'coach-1',
      dayOfWeek: 'Monday',
      startTime: '16:00',
      endTime: '17:30',
      location: 'Field A',
      isActive: true
    },
    {
      id: 'schedule-2',
      title: 'U-14 Eagles Training',
      groupId: 'group-1',
      coachId: 'coach-1',
      dayOfWeek: 'Wednesday',
      startTime: '16:00',
      endTime: '17:30',
      location: 'Field A',
      isActive: true
    },
    {
      id: 'schedule-3',
      title: 'U-12 Lions Training',
      groupId: 'group-2',
      coachId: 'coach-2',
      dayOfWeek: 'Tuesday',
      startTime: '15:30',
      endTime: '16:30',
      location: 'Field B',
      isActive: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Sessions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage training sessions and schedules
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'schedules'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Schedules
          </button>
        </nav>
      </div>

      {/* Create Session Modal */}
      <Modal
        isOpen={showCreateSessionModal}
        onClose={() => setShowCreateSessionModal(false)}
        title="Create New Session"
        size="large"
      >
        <CreateSessionForm />
      </Modal>

      {/* Weekly View Tab */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Week Navigation */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Week of {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 6), 'MMMM d, yyyy')}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="small"
                  icon={ChevronLeft}
                  onClick={() => navigateWeeks('prev')}
                />
                <Button
                  variant="secondary"
                  size="small"
                  onClick={goToToday}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  icon={ChevronRight}
                  onClick={() => navigateWeeks('next')}
                />
              </div>
            </div>
          </Card>

          {/* Group Color Legend */}
          <Card>
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Group Colors</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {groups.map((group) => {
                const colors = getGroupColors(group.id);
                return (
                  <div key={group.id} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded border-2 ${colors.bg} ${colors.border}`}></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{group.name}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Weekly Table */}
          <Card padding="none" className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    {weekDays.map((day, index) => {
                      const isToday = isSameDay(day, new Date());
                      return (
                        <th
                          key={index}
                          className={`p-4 text-center font-semibold border-r border-gray-200 dark:border-gray-700 last:border-r-0 ${
                            isToday 
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                              : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <div className="text-sm font-medium">
                            {format(day, 'EEEE')}
                          </div>
                          <div className={`text-lg font-bold mt-1 ${
                            isToday ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                          }`}>
                            {format(day, 'd')}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  <tr>
                    {weekDays.map((day, index) => {
                      const daySessions = getSessionsForDay(day);
                      const isToday = isSameDay(day, new Date());

                      return (
                        <td
                          key={index}
                          className={`align-top p-4 border-r border-gray-200 dark:border-gray-700 last:border-r-0 min-h-[300px] ${
                            isToday ? 'bg-primary-50/30 dark:bg-primary-900/10' : 'bg-white dark:bg-gray-900'
                          }`}
                        >
                          <div className="space-y-2">
                            {daySessions.map((session) => {
                              const group = getGroup(session.groupId);
                              const colors = getGroupColors(session.groupId);
                              return (
                                <div
                                  key={session.id}
                                  onClick={() => handleSessionClick(session.id)}
                                  className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 ${colors.bg} ${colors.border} ${colors.hover}`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className={`text-xs font-medium ${colors.text}`}>
                                      {session.startTime} - {session.endTime}
                                    </div>
                                  </div>
                                  <div className={`font-medium text-sm mb-1 ${colors.text}`}>
                                    {session.title}
                                  </div>
                                  <div className={`text-xs opacity-80 ${colors.text}`}>
                                    {group?.name}
                                  </div>
                                  {session.description && (
                                    <div className={`text-xs mt-1 line-clamp-2 opacity-70 ${colors.text}`}>
                                      {session.description}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Schedules Tab */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button icon={Plus} onClick={() => setShowCreateSessionModal(true)}>
              Create New Session
            </Button>
          </div>

          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recurring Sessions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage recurring training schedules
              </p>
            </div>
            
            <div className="space-y-4">
              {recurringSchedules.map((schedule) => {
                const group = getGroup(schedule.groupId);
                const coach = coaches.find(c => c.id === schedule.coachId);
                const colors = getGroupColors(schedule.groupId);

                return (
                  <div key={schedule.id} className={`border-2 rounded-lg p-4 hover:shadow-md transition-shadow ${colors.border} ${colors.bg}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Repeat className="w-5 h-5 text-primary-500" />
                          <h4 className={`font-semibold ${colors.text}`}>
                            {schedule.title}
                          </h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${schedule.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {schedule.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className={`opacity-70 ${colors.text}`}>Day:</span>
                            <p className={`font-medium ${colors.text}`}>{schedule.dayOfWeek}</p>
                          </div>
                          <div>
                            <span className={`opacity-70 ${colors.text}`}>Time:</span>
                            <p className={`font-medium ${colors.text}`}>
                              {schedule.startTime} - {schedule.endTime}
                            </p>
                          </div>
                          <div>
                            <span className={`opacity-70 ${colors.text}`}>Group:</span>
                            <p className={`font-medium ${colors.text}`}>{group?.name}</p>
                          </div>
                          <div>
                            <span className={`opacity-70 ${colors.text}`}>Coach:</span>
                            <p className={`font-medium ${colors.text}`}>
                              {coach ? `${coach.firstName} ${coach.lastName}` : 'Not assigned'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button variant="ghost" size="small">
                          Edit
                        </Button>
                        <Button variant="ghost" size="small" className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};