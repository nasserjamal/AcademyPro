import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Target, UserCheck, Save, Plus, X, Clock, Users, MapPin, Calendar, Edit } from 'lucide-react';
import { format } from 'date-fns';

export const SessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFilteredSessions, getFilteredGroups, getFilteredCoaches, getFilteredDrills, getFilteredStudents } = useStore();
  
  const sessions = getFilteredSessions();
  const groups = getFilteredGroups();
  const coaches = getFilteredCoaches();
  const drills = getFilteredDrills();
  const students = getFilteredStudents();
  
  const [showDrillsModal, setShowDrillsModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedDrills, setSelectedDrills] = useState<string[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({
    'student-1': 'present',
    'student-2': 'present',
    'student-4': 'absent',
    'student-5': 'late',
    'student-6': 'present',
    'student-7': 'present',
    'student-8': 'present',
  });
  const [isEditingAttendance, setIsEditingAttendance] = useState(false);
  
  const session = sessions.find(s => s.id === id);
  
  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Session not found</h2>
        <Link to="/sessions">
          <Button className="mt-4" icon={ArrowLeft}>Back to Sessions</Button>
        </Link>
      </div>
    );
  }

  const group = groups.find(g => g.id === session.groupId);
  const sessionCoaches = coaches.filter(c => session.coachIds.includes(c.id));
  const sessionDrills = drills.filter(d => session.drillIds.includes(d.id));
  const groupStudents = students.filter(s => group?.studentIds.includes(s.id));
  
  const hasAttendance = session.attendanceIds.length > 0;

  // Mock attendance data based on state
  const mockAttendance = [
    { studentId: 'student-1', name: 'John Smith', status: attendanceData['student-1'] || 'present' },
    { studentId: 'student-2', name: 'Mike Johnson', status: attendanceData['student-2'] || 'present' },
    { studentId: 'student-4', name: 'David Brown', status: attendanceData['student-4'] || 'absent' },
    { studentId: 'student-5', name: 'Emma Davis', status: attendanceData['student-5'] || 'late' },
    { studentId: 'student-6', name: 'Alex Miller', status: attendanceData['student-6'] || 'present' },
    { studentId: 'student-7', name: 'Grace Taylor', status: attendanceData['student-7'] || 'present' },
    { studentId: 'student-8', name: 'Ryan Anderson', status: attendanceData['student-8'] || 'present' },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'ongoing': return 'warning';
      case 'scheduled': return 'primary';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const getAttendanceStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'danger';
      default: return 'secondary';
    }
  };

  const handleDrillSelection = (drillId: string) => {
    setSelectedDrills(prev => 
      prev.includes(drillId) 
        ? prev.filter(id => id !== drillId)
        : [...prev, drillId]
    );
  };

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
    // Here you would save the attendance data to the backend
    console.log('Saving attendance:', attendanceData);
    setIsEditingAttendance(false);
    setShowAttendanceModal(false);
  };

  const saveDrills = () => {
    // Here you would update the session with selected drills
    console.log('Saving drills:', selectedDrills);
    setShowDrillsModal(false);
  };

  const DrillsModal = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          Assign Drills to Session
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {session.title}
        </p>
      </div>

      <div className="max-h-60 overflow-y-auto space-y-3">
        {drills.map((drill) => (
          <label key={drill.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedDrills.includes(drill.id) || session.drillIds.includes(drill.id)}
              onChange={() => handleDrillSelection(drill.id)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">{drill.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{drill.description}</p>
              <div className="flex items-center space-x-4 mt-1">
                <Badge variant="secondary" size="small">{drill.category}</Badge>
                <Badge variant="secondary" size="small">{drill.difficulty}</Badge>
                <span className="text-xs text-gray-500">{drill.duration} min</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => setShowDrillsModal(false)}>
          Cancel
        </Button>
        <Button icon={Save} onClick={saveDrills}>
          Save Drills
        </Button>
      </div>
    </div>
  );

  const AttendanceModal = () => {
    const attendanceStats = {
      present: mockAttendance.filter(a => a.status === 'present').length,
      absent: mockAttendance.filter(a => a.status === 'absent').length,
      late: mockAttendance.filter(a => a.status === 'late').length,
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            {hasAttendance ? 'Attendance Report' : 'Take Attendance'}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {session.title} - {group?.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(session.date), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">{attendanceStats.present}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Present</div>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="text-lg font-bold text-red-600 dark:text-red-400">{attendanceStats.absent}</div>
            <div className="text-sm text-red-600 dark:text-red-400">Absent</div>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{attendanceStats.late}</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Late</div>
          </div>
        </div>

        {/* Attendance List */}
        <div className="space-y-3">
          {mockAttendance.map((record) => (
            <div key={record.studentId} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-xs">
                    {record.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{record.name}</span>
              </div>
              
              {isEditingAttendance || !hasAttendance ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAttendanceChange(record.studentId, 'present')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      record.status === 'present'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-green-900/20 dark:hover:text-green-300'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(record.studentId, 'late')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      record.status === 'late'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-yellow-900/20 dark:hover:text-yellow-300'
                    }`}
                  >
                    Late
                  </button>
                  <button
                    onClick={() => handleAttendanceChange(record.studentId, 'absent')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      record.status === 'absent'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-300'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              ) : (
                <Badge variant={getAttendanceStatusBadgeVariant(record.status)}>
                  {record.status}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          {hasAttendance && !isEditingAttendance ? (
            <Button 
              variant="secondary" 
              icon={Edit}
              onClick={() => setIsEditingAttendance(true)}
            >
              Edit Attendance
            </Button>
          ) : (
            <div></div>
          )}
          
          <div className="flex space-x-4">
            {isEditingAttendance && (
              <Button 
                variant="secondary" 
                onClick={() => {
                  setIsEditingAttendance(false);
                  // Reset to original data if needed
                }}
              >
                Cancel
              </Button>
            )}
            {(isEditingAttendance || !hasAttendance) && (
              <Button icon={Save} onClick={saveAttendance}>
                Save Attendance
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/sessions">
            <Button variant="ghost" icon={ArrowLeft} size="small">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {session.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Session Details
            </p>
          </div>
        </div>
        <Badge variant={getStatusBadgeVariant(session.status)}>
          {session.status}
        </Badge>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showDrillsModal}
        onClose={() => setShowDrillsModal(false)}
        title="Assign Drills"
        size="large"
      >
        <DrillsModal />
      </Modal>

      <Modal
        isOpen={showAttendanceModal}
        onClose={() => {
          setShowAttendanceModal(false);
          setIsEditingAttendance(false);
        }}
        title="Attendance"
        size="medium"
      >
        <AttendanceModal />
      </Modal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Information */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Session Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date & Time</label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-gray-900 dark:text-white">
                      {format(new Date(session.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.startTime} - {session.endTime}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Group</label>
                <div className="flex items-center mt-1">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-gray-900 dark:text-white">{group?.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{group?.ageRange}</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Coach</label>
                <div className="mt-1">
                  {sessionCoaches.map(coach => (
                    <p key={coach.id} className="text-gray-900 dark:text-white">
                      {coach.firstName} {coach.lastName}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</label>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <p className="text-gray-900 dark:text-white">
                    {(() => {
                      const start = new Date(`2000-01-01 ${session.startTime}`);
                      const end = new Date(`2000-01-01 ${session.endTime}`);
                      const diff = (end.getTime() - start.getTime()) / (1000 * 60);
                      return `${diff} minutes`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
            {session.description && (
              <div className="mt-6">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white mt-1">{session.description}</p>
              </div>
            )}
          </Card>

          {/* Planned Drills */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Planned Drills ({sessionDrills.length})
              </h3>
              <Button 
                icon={Target} 
                size="small"
                onClick={() => setShowDrillsModal(true)}
              >
                Manage Drills
              </Button>
            </div>
            
            {sessionDrills.length > 0 ? (
              <div className="space-y-4">
                {sessionDrills.map((drill) => (
                  <div key={drill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {drill.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {drill.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" size="small">{drill.category}</Badge>
                        <Badge variant="secondary" size="small">{drill.difficulty}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {drill.duration} min
                      </div>
                      <div>
                        Equipment: {drill.equipmentNeeded.join(', ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No drills planned for this session</p>
                <Button 
                  icon={Plus} 
                  className="mt-4"
                  onClick={() => setShowDrillsModal(true)}
                >
                  Add Drills
                </Button>
              </div>
            )}
          </Card>

          {/* Attendance */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Attendance
              </h3>
              <div className="flex space-x-2">
                {hasAttendance && (
                  <Button 
                    icon={Edit} 
                    size="small"
                    variant="secondary"
                    onClick={() => {
                      setIsEditingAttendance(true);
                      setShowAttendanceModal(true);
                    }}
                  >
                    Edit
                  </Button>
                )}
                <Button 
                  icon={UserCheck} 
                  size="small"
                  onClick={() => setShowAttendanceModal(true)}
                >
                  {hasAttendance ? 'View Attendance' : 'Take Attendance'}
                </Button>
              </div>
            </div>
            
            {hasAttendance ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {mockAttendance.filter(a => a.status === 'present').length}
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">Present</div>
                  </div>
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      {mockAttendance.filter(a => a.status === 'absent').length}
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400">Absent</div>
                  </div>
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {mockAttendance.filter(a => a.status === 'late').length}
                    </div>
                    <div className="text-sm text-yellow-600 dark:text-yellow-400">Late</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {mockAttendance.slice(0, 5).map((record) => (
                    <div key={record.studentId} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-sm text-gray-900 dark:text-white">{record.name}</span>
                      <Badge variant={getAttendanceStatusBadgeVariant(record.status)} size="small">
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                  {mockAttendance.length > 5 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      +{mockAttendance.length - 5} more students
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Attendance not taken yet</p>
                <Button 
                  icon={UserCheck} 
                  className="mt-4"
                  onClick={() => setShowAttendanceModal(true)}
                >
                  Take Attendance
                </Button>
              </div>
            )}
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
              <Button 
                className="w-full" 
                variant="secondary"
                onClick={() => setShowDrillsModal(true)}
              >
                Manage Drills
              </Button>
              <Button 
                className="w-full" 
                variant="secondary"
                onClick={() => setShowAttendanceModal(true)}
              >
                {hasAttendance ? 'View Attendance' : 'Take Attendance'}
              </Button>
              <Button className="w-full" variant="secondary">
                Edit Session
              </Button>
              <Button className="w-full" variant="secondary">
                Cancel Session
              </Button>
            </div>
          </Card>

          {/* Session Stats */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Session Stats
              </h3>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {groupStudents.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Registered Students
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessionDrills.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Planned Drills
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {hasAttendance ? Math.round((mockAttendance.filter(a => a.status === 'present').length / mockAttendance.length) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Attendance Rate
                </div>
              </div>
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