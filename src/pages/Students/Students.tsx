import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Pagination } from '../../components/UI/Pagination';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { Plus, Search, Filter, Trash2, Save, Upload, X, UserPlus } from 'lucide-react';

export const Students: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredStudents, getFilteredGuardians, getFilteredGroups, addStudent, deleteStudent, addGuardian } = useStore();
  const students = getFilteredStudents();
  const guardians = getFilteredGuardians();
  const groups = getFilteredGroups();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCreateGuardianModal, setShowCreateGuardianModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; studentId: string; studentName: string }>({
    isOpen: false,
    studentId: '',
    studentName: ''
  });
  const itemsPerPage = 10;

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  const getStudentGuardians = (guardianIds: string[]) => {
    return guardians.filter(guardian => guardianIds.includes(guardian.id));
  };

  const getStudentGroups = (groupIds: string[]) => {
    return groups.filter(group => groupIds.includes(group.id));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'danger';
      default: return 'secondary';
    }
  };

  const handleStudentClick = (studentId: string) => {
    navigate(`/students/${studentId}`);
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

  const handleAddStudent = (formData: FormData) => {
    const newStudent = {
      id: `student-${Date.now()}`,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      address: formData.get('address') as string || '',
      guardianIds: formData.get('guardianId') ? [formData.get('guardianId') as string] : [],
      groupIds: formData.get('groupId') ? [formData.get('groupId') as string] : [],
      medicalInfo: {
        allergies: [],
        medications: [],
        conditions: [],
        emergencyContact: {
          name: '',
          phone: '',
          relationship: ''
        },
        medicalHistory: []
      },
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active' as const,
      profileImage: selectedImage || undefined,
      academyId: 'academy-1'
    };
    
    addStudent(newStudent);
    setShowAddModal(false);
    setSelectedImage(null);
  };

  const handleCreateGuardian = (formData: FormData) => {
    const phoneNumbers = [];
    const primaryPhone = formData.get('primaryPhone') as string;
    const secondaryPhone = formData.get('secondaryPhone') as string;
    
    if (primaryPhone) {
      phoneNumbers.push({
        id: `phone-${Date.now()}`,
        number: primaryPhone,
        type: 'primary',
        isPrimary: true
      });
    }
    
    if (secondaryPhone) {
      phoneNumbers.push({
        id: `phone-${Date.now() + 1}`,
        number: secondaryPhone,
        type: 'secondary',
        isPrimary: false
      });
    }

    const newGuardian = {
      id: `guardian-${Date.now()}`,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phoneNumbers,
      relationship: formData.get('relationship') as string,
      address: formData.get('address') as string || '',
      studentIds: [],
      academyId: 'academy-1'
    };
    
    addGuardian(newGuardian);
    setShowCreateGuardianModal(false);
  };

  const handleDeleteClick = (student: any) => {
    setDeleteConfirm({
      isOpen: true,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`
    });
  };

  const handleDeleteConfirm = () => {
    deleteStudent(deleteConfirm.studentId);
    setDeleteConfirm({ isOpen: false, studentId: '', studentName: '' });
  };

  const StudentForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddStudent(formData);
    }}>
      {/* Student Image Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Student Photo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            {selectedImage ? (
              <img 
                src={selectedImage} 
                alt="Student preview" 
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
              Upload a photo for the student (optional). Recommended size: 400x400px
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
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date of Birth *
          </label>
          <input
            type="date"
            name="dateOfBirth"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Guardian
          </label>
          <div className="flex space-x-2">
            <select
              name="guardianId"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Guardian</option>
              {guardians.map((guardian) => (
                <option key={guardian.id} value={guardian.id}>
                  {guardian.firstName} {guardian.lastName} ({guardian.relationship})
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="secondary"
              size="small"
              icon={UserPlus}
              onClick={() => setShowCreateGuardianModal(true)}
            >
              New
            </Button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Group
          </label>
          <select
            name="groupId"
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
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            name="address"
            rows={3}
            placeholder="Enter student's address (optional)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => {
          setShowAddModal(false);
          setSelectedImage(null);
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Add Student
        </Button>
      </div>
    </form>
  );

  const GuardianForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleCreateGuardian(formData);
    }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
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
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Relationship *
          </label>
          <input
            type="text"
            name="relationship"
            required
            placeholder="e.g., Mother, Father, Guardian"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Phone Number *
          </label>
          <input
            type="tel"
            name="primaryPhone"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Secondary Phone Number
          </label>
          <input
            type="tel"
            name="secondaryPhone"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Address
          </label>
          <textarea
            name="address"
            rows={3}
            placeholder="Enter guardian's address (optional)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => setShowCreateGuardianModal(false)}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Create Guardian
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Students Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage student profiles and enrollment
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Student
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <Link
            to="/students"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/students'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Students
          </Link>
          <Link
            to="/students/guardians"
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              location.pathname === '/students/guardians'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Guardians
          </Link>
        </nav>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedImage(null);
        }}
        title="Add New Student"
        size="large"
      >
        <StudentForm />
      </Modal>

      {/* Create Guardian Modal */}
      <Modal
        isOpen={showCreateGuardianModal}
        onClose={() => setShowCreateGuardianModal(false)}
        title="Create New Guardian"
        size="large"
      >
        <GuardianForm />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, studentId: '', studentName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteConfirm.studentName}? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Student</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Group</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Guardian</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => {
                  const studentGuardians = getStudentGuardians(student.guardianIds);
                  const studentGroups = getStudentGroups(student.groupIds);
                  const primaryGuardian = studentGuardians[0];
                  const primaryGroup = studentGroups[0];
                  
                  return (
                    <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleStudentClick(student.id)}>
                      <td className="py-4 px-6">
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
                              Age: {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {primaryGroup ? (
                          <Badge variant="primary" size="small">
                            {primaryGroup.name}
                          </Badge>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No group</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {primaryGuardian ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {primaryGuardian.firstName} {primaryGuardian.lastName}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {primaryGuardian.relationship}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">No guardian</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getStatusBadgeVariant(student.status)}>
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="small" 
                            icon={Trash2} 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(student)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredStudents.length}
          />
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedStudents.map((student) => {
          const studentGuardians = getStudentGuardians(student.guardianIds);
          const studentGroups = getStudentGroups(student.groupIds);
          const primaryGuardian = studentGuardians[0];
          const primaryGroup = studentGroups[0];
          
          return (
            <Card key={student.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleStudentClick(student.id)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    {student.profileImage ? (
                      <img 
                        src={student.profileImage} 
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                        {student.firstName[0]}{student.lastName[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Age: {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(student.status)}>
                  {student.status}
                </Badge>
              </div>

              {/* Group */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">GROUP</p>
                {primaryGroup ? (
                  <Badge variant="primary" size="small">
                    {primaryGroup.name}
                  </Badge>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No group assigned</span>
                )}
              </div>

              {/* Guardian */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">PRIMARY GUARDIAN</p>
                {primaryGuardian ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {primaryGuardian.firstName} {primaryGuardian.lastName} ({primaryGuardian.relationship})
                  </p>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">No guardian assigned</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
                   onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="small" 
                  icon={Trash2} 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteClick(student)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          );
        })}
        
        {/* Mobile Pagination */}
        <Card padding="none">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredStudents.length}
          />
        </Card>
      </div>

      {filteredStudents.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-medium mb-2">No students found</h3>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        </Card>
      )}
    </div>
  );
};