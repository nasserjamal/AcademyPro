import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, AlertTriangle, Download, ChevronLeft, ChevronRight, Trash2, Save, Upload, X } from 'lucide-react';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFilteredStudents, getFilteredGuardians, getFilteredGroups, getFilteredAssessments, getFilteredFees, updateStudent, deleteStudent } = useStore();
  
  const students = getFilteredStudents();
  const guardians = getFilteredGuardians();
  const groups = getFilteredGroups();
  const assessments = getFilteredAssessments();
  const fees = getFilteredFees();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; studentId: string; studentName: string }>({
    isOpen: false,
    studentId: '',
    studentName: ''
  });
  
  const student = students.find(s => s.id === id);
  
  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Student not found</h2>
        <Link to="/students">
          <Button className="mt-4" icon={ArrowLeft}>Back to Students</Button>
        </Link>
      </div>
    );
  }

  const studentGuardians = guardians.filter(g => student.guardianIds.includes(g.id));
  const studentGroups = groups.filter(g => student.groupIds.includes(g.id));
  const studentAssessments = assessments.filter(a => a.studentId === student.id);
  const studentFees = fees.filter(f => f.studentId === student.id);

  // Mock attendance data for current month
  const currentMonthAttendance = {
    totalSessions: 12,
    attended: 10,
    absent: 1,
    late: 1,
    attendanceRate: 83.3,
    sessions: [
      { date: '2024-12-02', status: 'present' },
      { date: '2024-12-04', status: 'present' },
      { date: '2024-12-07', status: 'absent' },
      { date: '2024-12-09', status: 'present' },
      { date: '2024-12-11', status: 'late' },
      { date: '2024-12-14', status: 'present' },
      { date: '2024-12-16', status: 'present' },
      { date: '2024-12-18', status: 'present' },
      { date: '2024-12-21', status: 'present' },
      { date: '2024-12-23', status: 'present' },
      { date: '2024-12-28', status: 'present' },
      { date: '2024-12-30', status: 'present' }
    ]
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'danger';
      default: return 'secondary';
    }
  };

  const getFeeStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
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

  const totalBalance = studentFees.filter(f => f.status !== 'paid').reduce((sum, fee) => sum + fee.amount, 0);
  const latestAssessment = studentAssessments.sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())[0];

  const downloadStudentCard = () => {
    // Mock PDF download functionality
    console.log('Downloading student ID card for:', student.firstName, student.lastName);
    alert('Student ID card download would start here');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
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

  const handleEditStudent = (formData: FormData) => {
    const updates = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      dateOfBirth: formData.get('dateOfBirth') as string,
      email: formData.get('email') as string || undefined,
      phone: formData.get('phone') as string || undefined,
      address: formData.get('address') as string || '',
      status: formData.get('status') as 'active' | 'inactive' | 'suspended',
      profileImage: selectedImage || student.profileImage
    };
    
    updateStudent(student.id, updates);
    setShowEditModal(false);
    setSelectedImage(null);
  };

  const handleDeleteClick = () => {
    setDeleteConfirm({
      isOpen: true,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`
    });
  };

  const handleDeleteConfirm = () => {
    deleteStudent(student.id);
    navigate('/students');
  };

  const EditStudentForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleEditStudent(formData);
    }}>
      {/* Student Image Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Student Photo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            {selectedImage || student.profileImage ? (
              <img 
                src={selectedImage || student.profileImage} 
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
              {(selectedImage || student.profileImage) && (
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
            defaultValue={student.firstName}
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
            defaultValue={student.lastName}
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
            defaultValue={student.dateOfBirth}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status *
          </label>
          <select
            name="status"
            defaultValue={student.status}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            defaultValue={student.email || ''}
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
            defaultValue={student.phone || ''}
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
            defaultValue={student.address || ''}
            placeholder="Enter student's address (optional)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => {
          setShowEditModal(false);
          setSelectedImage(null);
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Update Student
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/students">
            <Button variant="ghost" icon={ArrowLeft} size="small">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Student Profile
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" icon={Download} onClick={downloadStudentCard}>
            Download ID Card
          </Button>
          <Button icon={Edit} onClick={() => setShowEditModal(true)}>
            Edit Profile
          </Button>
          <Button 
            variant="danger" 
            icon={Trash2} 
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
          >
            Delete Student
          </Button>
        </div>
      </div>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedImage(null);
        }}
        title="Edit Student Profile"
        size="large"
      >
        <EditStudentForm />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, studentId: '', studentName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${deleteConfirm.studentName}? This action cannot be undone and will remove all associated data including assessments, attendance records, and fee history.`}
        confirmText="Delete Student"
        variant="danger"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                  {student.profileImage ? (
                    <img 
                      src={student.profileImage} 
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-2xl">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {student.firstName} {student.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Age: {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}
                  </p>
                  <Badge variant={getStatusBadgeVariant(student.status)} className="mt-2">
                    {student.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date of Birth</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {student.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{student.email}</span>
                    </div>
                  </div>
                )}
                {student.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{student.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {student.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                    <div className="flex items-start mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{student.address}</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Enrollment Date</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Latest Assessment */}
          {latestAssessment && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Latest Assessment
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {latestAssessment.overallScore}/10
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(latestAssessment.assessmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="ghost" size="small">
                    View Previous
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {latestAssessment.parameters.map((param, index) => (
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

              {latestAssessment.notes && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Assessment Notes:
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {latestAssessment.notes}
                  </p>
                </div>
              )}
            </Card>
          )}

          {/* Medical History */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Medical Information
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Allergies</label>
                <div className="mt-2">
                  {student.medicalInfo.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {student.medicalInfo.allergies.map((allergy, index) => (
                        <Badge key={index} variant="danger" size="small">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">None reported</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Medical Conditions</label>
                <div className="mt-2">
                  {student.medicalInfo.conditions.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {student.medicalInfo.conditions.map((condition, index) => (
                        <Badge key={index} variant="warning" size="small">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400">None reported</span>
                  )}
                </div>
              </div>
            </div>

            {student.medicalInfo.medicalHistory && student.medicalInfo.medicalHistory.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                  Medical History
                </h4>
                <div className="space-y-3">
                  {student.medicalInfo.medicalHistory.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {entry.title}
                        </h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {entry.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Attendance */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Attendance
              </h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="small" icon={ChevronLeft} onClick={() => navigateMonth('prev')} />
                <span className="text-sm font-medium text-gray-900 dark:text-white px-4">
                  {monthNames[selectedMonth]} {selectedYear}
                </span>
                <Button variant="ghost" size="small" icon={ChevronRight} onClick={() => navigateMonth('next')} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentMonthAttendance.totalSessions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currentMonthAttendance.attended}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {currentMonthAttendance.absent}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {currentMonthAttendance.attendanceRate}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</div>
              </div>
            </div>

            <div className="space-y-2">
              {currentMonthAttendance.sessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <Badge variant={getAttendanceStatusBadgeVariant(session.status)} size="small">
                    {session.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Groups */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Groups
              </h3>
            </div>
            {studentGroups.length > 0 ? (
              <div className="space-y-3">
                {studentGroups.map((group) => (
                  <div key={group.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {group.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {group.description}
                    </p>
                    <Badge variant="primary" size="small" className="mt-2">
                      {group.ageRange}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Not assigned to any groups.</p>
            )}
          </Card>

          {/* Guardians */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Guardians
              </h3>
            </div>
            {studentGuardians.length > 0 ? (
              <div className="space-y-4">
                {studentGuardians.map((guardian) => (
                  <div key={guardian.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {guardian.firstName} {guardian.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {guardian.relationship}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4 mr-2" />
                        {guardian.email}
                      </div>
                      {guardian.phoneNumbers.map((phone) => (
                        <div key={phone.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="w-4 h-4 mr-2" />
                          {phone.number}
                          {phone.isPrimary && (
                            <Badge variant="primary" size="small" className="ml-2">
                              Primary
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No guardians assigned.</p>
            )}
          </Card>

          {/* Fee Status */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Financial Balance
              </h3>
            </div>
            
            {totalBalance > 0 && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  <div>
                    <span className="text-sm font-medium text-red-700 dark:text-red-200">
                      Outstanding Balance
                    </span>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      KSh {totalBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {studentFees.length > 0 ? (
              <div className="space-y-3">
                {studentFees.slice(0, 5).map((fee) => (
                  <div key={fee.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {fee.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        KSh {fee.amount.toLocaleString()}
                      </p>
                      <Badge variant={getFeeStatusBadgeVariant(fee.status)} size="small">
                        {fee.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No fee records found.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};