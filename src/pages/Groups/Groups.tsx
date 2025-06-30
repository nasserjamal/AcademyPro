import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { Plus, Users, UserCheck, Calendar, MapPin, Trash2, Save, Upload, X } from 'lucide-react';

export const Groups: React.FC = () => {
  const navigate = useNavigate();
  const { groups, students, coaches, addGroup, addCoach, updateCoach, deleteCoach } = useStore();
  const [activeTab, setActiveTab] = useState<'groups' | 'coaches'>('groups');
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddCoachModal, setShowAddCoachModal] = useState(false);
  const [showEditCoachModal, setShowEditCoachModal] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; coachId: string; coachName: string }>({
    isOpen: false,
    coachId: '',
    coachName: ''
  });

  const getGroupStudents = (studentIds: string[]) => {
    return students.filter(student => studentIds.includes(student.id));
  };

  const getGroupCoaches = (coachIds: string[]) => {
    return coaches.filter(coach => coachIds.includes(coach.id));
  };

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  const handleAddGroup = (formData: FormData) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      ageRange: `${formData.get('minAge')}-${formData.get('maxAge')}`,
      maxStudents: parseInt(formData.get('maxStudents') as string),
      coachIds: formData.get('coachId') ? [formData.get('coachId') as string] : [],
      studentIds: [],
      schedule: [],
      createdAt: new Date().toISOString(),
      isActive: true,
      academyId: 'academy-1'
    };
    
    addGroup(newGroup);
    setShowAddGroupModal(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleAddCoach = (formData: FormData) => {
    const newCoach = {
      id: `coach-${Date.now()}`,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      description: formData.get('description') as string || undefined,
      groupIds: [],
      profileImage: selectedImage || undefined,
      hireDate: new Date().toISOString().split('T')[0],
      academyId: 'academy-1'
    };
    
    addCoach(newCoach);
    setShowAddCoachModal(false);
    setSelectedImage(null);
  };

  const handleEditClick = (coach: any) => {
    setSelectedCoach(coach);
    setSelectedImage(coach.profileImage || null);
    setShowEditCoachModal(true);
  };

  const handleEditCoach = (formData: FormData) => {
    const updates = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
      description: formData.get('description') as string || undefined,
      profileImage: selectedImage || selectedCoach.profileImage
    };
    
    updateCoach(selectedCoach.id, updates);
    setShowEditCoachModal(false);
    setSelectedCoach(null);
    setSelectedImage(null);
  };

  const handleDeleteClick = (coach: any) => {
    setDeleteConfirm({
      isOpen: true,
      coachId: coach.id,
      coachName: `${coach.firstName} ${coach.lastName}`
    });
  };

  const handleDeleteConfirm = () => {
    deleteCoach(deleteConfirm.coachId);
    setDeleteConfirm({ isOpen: false, coachId: '', coachName: '' });
  };

  const GroupForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddGroup(formData);
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Group Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g., U-14 Eagles"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Students *
          </label>
          <input
            type="number"
            name="maxStudents"
            required
            min="1"
            max="50"
            defaultValue="20"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Age *
          </label>
          <input
            type="number"
            name="minAge"
            required
            min="5"
            max="18"
            defaultValue="10"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Maximum Age *
          </label>
          <input
            type="number"
            name="maxAge"
            required
            min="5"
            max="18"
            defaultValue="14"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assign Coach (Optional)
          </label>
          <select
            name="coachId"
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            required
            rows={3}
            placeholder="Brief description of the group's focus and objectives..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => setShowAddGroupModal(false)}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Create Group
        </Button>
      </div>
    </form>
  );

  const CoachForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      if (isEdit) {
        handleEditCoach(formData);
      } else {
        handleAddCoach(formData);
      }
    }}>
      {/* Coach Image Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Coach Photo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Coach preview" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </span>
              </label>
              {selectedImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  icon={X}
                  onClick={removeImage}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload a photo for the coach (optional). Recommended size: 400x400px
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            defaultValue={isEdit ? selectedCoach?.firstName : ''}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            defaultValue={isEdit ? selectedCoach?.lastName : ''}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            defaultValue={isEdit ? selectedCoach?.phone : ''}
            required
            placeholder="e.g., +254712345678"
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
            defaultValue={isEdit ? selectedCoach?.description : ''}
            placeholder="Brief description about the coach's experience, specialization, or background..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => {
          if (isEdit) {
            setShowEditCoachModal(false);
            setSelectedCoach(null);
          } else {
            setShowAddCoachModal(false);
          }
          setSelectedImage(null);
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          {isEdit ? 'Update Coach' : 'Add Coach'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Groups & Coaches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage training groups and coaching staff
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'groups'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Groups
          </button>
          <button
            onClick={() => setActiveTab('coaches')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'coaches'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Coaches
          </button>
        </nav>
      </div>

      {/* Add Group Modal */}
      <Modal
        isOpen={showAddGroupModal}
        onClose={() => setShowAddGroupModal(false)}
        title="Create New Group"
        size="large"
      >
        <GroupForm />
      </Modal>

      {/* Add Coach Modal */}
      <Modal
        isOpen={showAddCoachModal}
        onClose={() => {
          setShowAddCoachModal(false);
          setSelectedImage(null);
        }}
        title="Add New Coach"
        size="large"
      >
        <CoachForm />
      </Modal>

      {/* Edit Coach Modal */}
      <Modal
        isOpen={showEditCoachModal}
        onClose={() => {
          setShowEditCoachModal(false);
          setSelectedCoach(null);
          setSelectedImage(null);
        }}
        title="Edit Coach"
        size="large"
      >
        <CoachForm isEdit={true} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, coachId: '', coachName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Coach"
        message={`Are you sure you want to delete ${deleteConfirm.coachName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Groups Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button icon={Plus} onClick={() => setShowAddGroupModal(true)}>
              Add Group
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {groups.map((group) => {
              const groupStudents = getGroupStudents(group.studentIds);
              const groupCoaches = getGroupCoaches(group.coachIds);

              return (
                <div
                  key={group.id}
                  onClick={() => handleGroupClick(group.id)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 p-6 hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {group.description}
                      </p>
                    </div>
                    <Badge variant={group.isActive ? 'success' : 'secondary'}>
                      {group.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <Users className="w-4 h-4 mr-2" />
                        Students
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {groupStudents.length}/{group.maxStudents}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Age Range
                      </div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {group.ageRange}
                      </p>
                    </div>
                  </div>

                  {/* Coaches */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">COACHES</p>
                    {groupCoaches.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {groupCoaches.map((coach) => (
                          <div key={coach.id} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-medium">
                                {coach.firstName[0]}{coach.lastName[0]}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {coach.firstName} {coach.lastName}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No coaches assigned</p>
                    )}
                  </div>

                  {/* Schedule */}
                  {group.schedule.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">SCHEDULE</p>
                      <div className="space-y-2">
                        {group.schedule.map((schedule, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium mr-2">
                              {getDayName(schedule.dayOfWeek)}:
                            </span>
                            <span>
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                            <MapPin className="w-3 h-3 ml-2 mr-1" />
                            <span>{schedule.location}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Students List */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">STUDENTS</p>
                    {groupStudents.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {groupStudents.slice(0, 5).map((student) => (
                          <Badge key={student.id} variant="primary" size="small">
                            {student.firstName} {student.lastName}
                          </Badge>
                        ))}
                        {groupStudents.length > 5 && (
                          <Badge variant="secondary" size="small">
                            +{groupStudents.length - 5} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No students enrolled</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coaches Tab */}
      {activeTab === 'coaches' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button icon={Plus} onClick={() => setShowAddCoachModal(true)}>
              Add Coach
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach) => {
              const coachGroups = groups.filter(g => g.coachIds.includes(coach.id));

              return (
                <Card key={coach.id} className="hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      {coach.profileImage ? (
                        <img 
                          src={coach.profileImage} 
                          alt={`${coach.firstName} ${coach.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-primary-600 dark:text-primary-400 font-semibold text-xl">
                          {coach.firstName[0]}{coach.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {coach.firstName} {coach.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {coach.phone}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {coach.description && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ABOUT</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {coach.description}
                      </p>
                    </div>
                  )}

                  {/* Assigned Groups */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">ASSIGNED GROUPS</p>
                    {coachGroups.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {coachGroups.map((group) => (
                          <Badge key={group.id} variant="primary" size="small">
                            {group.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No groups assigned</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="small" 
                      onClick={() => handleEditClick(coach)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="small" 
                      icon={Trash2} 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(coach)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};