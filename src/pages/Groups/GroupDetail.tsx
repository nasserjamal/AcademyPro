import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Plus, Users, Calendar, MapPin, Clock, Save, Trash2, UserMinus, UserPlus } from 'lucide-react';

export const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    getFilteredGroups, 
    getFilteredStudents, 
    getFilteredCoaches, 
    updateGroup,
    updateStudent 
  } = useStore();
  
  const groups = getFilteredGroups();
  const students = getFilteredStudents();
  const coaches = getFilteredCoaches();
  
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [removeStudentConfirm, setRemoveStudentConfirm] = useState<{ isOpen: boolean; studentId: string; studentName: string }>({
    isOpen: false,
    studentId: '',
    studentName: ''
  });
  
  const group = groups.find(g => g.id === id);
  
  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Group not found</h2>
        <Link to="/groups">
          <Button className="mt-4" icon={ArrowLeft}>Back to Groups</Button>
        </Link>
      </div>
    );
  }

  const groupStudents = students.filter(s => group.studentIds.includes(s.id));
  const groupCoaches = coaches.filter(c => group.coachIds.includes(c.id));
  const availableStudents = students.filter(s => !group.studentIds.includes(s.id));

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const handleAddStudents = (formData: FormData) => {
    const selectedStudentIds = formData.getAll('studentIds') as string[];
    
    // Update group with new students
    const updatedStudentIds = [...group.studentIds, ...selectedStudentIds];
    updateGroup(group.id, { studentIds: updatedStudentIds });
    
    // Update each student to include this group
    selectedStudentIds.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (student) {
        const updatedGroupIds = [...student.groupIds, group.id];
        updateStudent(studentId, { groupIds: updatedGroupIds });
      }
    });
    
    setShowAddStudentModal(false);
  };

  const handleRemoveStudentClick = (student: any) => {
    setRemoveStudentConfirm({
      isOpen: true,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`
    });
  };

  const handleRemoveStudentConfirm = () => {
    const studentId = removeStudentConfirm.studentId;
    
    // Remove student from group
    const updatedStudentIds = group.studentIds.filter(id => id !== studentId);
    updateGroup(group.id, { studentIds: updatedStudentIds });
    
    // Remove group from student
    const student = students.find(s => s.id === studentId);
    if (student) {
      const updatedGroupIds = student.groupIds.filter(id => id !== group.id);
      updateStudent(studentId, { groupIds: updatedGroupIds });
    }
    
    setRemoveStudentConfirm({ isOpen: false, studentId: '', studentName: '' });
  };

  const handleAddSchedule = (formData: FormData) => {
    const newSchedule = {
      dayOfWeek: parseInt(formData.get('dayOfWeek') as string),
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      location: formData.get('location') as string
    };
    
    const updatedSchedule = [...group.schedule, newSchedule];
    updateGroup(group.id, { schedule: updatedSchedule });
    setShowAddScheduleModal(false);
  };

  const removeSchedule = (index: number) => {
    const updatedSchedule = group.schedule.filter((_, i) => i !== index);
    updateGroup(group.id, { schedule: updatedSchedule });
  };

  const AddStudentForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddStudents(formData);
    }}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Students to Add
        </label>
        <div className="max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3">
          {availableStudents.length > 0 ? (
            <div className="space-y-2">
              {availableStudents.map((student) => (
                <label key={student.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    name="studentIds"
                    value={student.id}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      {student.profileImage ? (
                        <img 
                          src={student.profileImage} 
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-600 dark:text-primary-400 font-semibold text-xs">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Age: {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No available students to add
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => setShowAddStudentModal(false)}>
          Cancel
        </Button>
        <Button type="submit" icon={Save} disabled={availableStudents.length === 0}>
          Add Selected Students
        </Button>
      </div>
    </form>
  );

  const AddScheduleForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddSchedule(formData);
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Day of Week *
          </label>
          <select
            name="dayOfWeek"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Day</option>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
            <option value="6">Saturday</option>
            <option value="0">Sunday</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            required
            placeholder="e.g., Field A, Gym, Main Pitch"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
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
        <Button variant="secondary" onClick={() => setShowAddScheduleModal(false)}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Add Schedule
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/groups">
            <Button variant="ghost" icon={ArrowLeft} size="small">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {group.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Group Management
            </p>
          </div>
        </div>
        <Badge variant={group.isActive ? 'success' : 'secondary'}>
          {group.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddStudentModal}
        onClose={() => setShowAddStudentModal(false)}
        title="Add Students to Group"
        size="large"
      >
        <AddStudentForm />
      </Modal>

      {/* Add Schedule Modal */}
      <Modal
        isOpen={showAddScheduleModal}
        onClose={() => setShowAddScheduleModal(false)}
        title="Add Training Schedule"
        size="medium"
      >
        <AddScheduleForm />
      </Modal>

      {/* Remove Student Confirmation */}
      <ConfirmDialog
        isOpen={removeStudentConfirm.isOpen}
        onClose={() => setRemoveStudentConfirm({ isOpen: false, studentId: '', studentName: '' })}
        onConfirm={handleRemoveStudentConfirm}
        title="Remove Student"
        message={`Are you sure you want to remove ${removeStudentConfirm.studentName} from this group?`}
        confirmText="Remove"
        variant="warning"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Group Information */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Group Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white mt-1">{group.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Age Range</label>
                <p className="text-gray-900 dark:text-white mt-1">{group.ageRange} years</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity</label>
                <p className="text-gray-900 dark:text-white mt-1">
                  {groupStudents.length} / {group.maxStudents} students
                </p>
              </div>
            </div>
          </Card>

          {/* Students Management */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Students ({groupStudents.length})
              </h3>
              <Button 
                icon={UserPlus} 
                size="small"
                onClick={() => setShowAddStudentModal(true)}
                disabled={groupStudents.length >= group.maxStudents}
              >
                Add Students
              </Button>
            </div>
            
            {groupStudents.length > 0 ? (
              <div className="space-y-3">
                {groupStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        {student.profileImage ? (
                          <img 
                            src={student.profileImage} 
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary-600 dark:text-primary-400 font-semibold">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Age: {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()} • 
                          Status: <span className="capitalize">{student.status}</span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      icon={UserMinus}
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleRemoveStudentClick(student)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No students in this group yet</p>
                <Button 
                  icon={UserPlus} 
                  className="mt-4"
                  onClick={() => setShowAddStudentModal(true)}
                >
                  Add Students
                </Button>
              </div>
            )}
          </Card>

          {/* Training Schedule */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Training Schedule
              </h3>
              <Button 
                icon={Plus} 
                size="small"
                onClick={() => setShowAddScheduleModal(true)}
              >
                Add Schedule
              </Button>
            </div>
            
            {group.schedule.length > 0 ? (
              <div className="space-y-3">
                {group.schedule.map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {getDayName(schedule.dayOfWeek)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {schedule.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="small"
                      icon={Trash2}
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeSchedule(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No training schedule set</p>
                <Button 
                  icon={Plus} 
                  className="mt-4"
                  onClick={() => setShowAddScheduleModal(true)}
                >
                  Add Schedule
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions - Moved to Top */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Button className="w-full" variant="secondary">
                Edit Group Details
              </Button>
              <Button className="w-full" variant="secondary">
                Assign Coaches
              </Button>
              <Button className="w-full" variant="secondary">
                View Sessions
              </Button>
              <Button className="w-full" variant="secondary">
                Generate Report
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
                  Total Students
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {group.schedule.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Training Sessions/Week
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((groupStudents.length / group.maxStudents) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Capacity Filled
                </div>
              </div>
            </div>
          </Card>

          {/* Assigned Coaches */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assigned Coaches
              </h3>
            </div>
            {groupCoaches.length > 0 ? (
              <div className="space-y-3">
                {groupCoaches.map((coach) => (
                  <div key={coach.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      {coach.profileImage ? (
                        <img 
                          src={coach.profileImage} 
                          alt={`${coach.firstName} ${coach.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold">
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
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No coaches assigned</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};