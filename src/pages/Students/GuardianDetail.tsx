import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Users, AlertTriangle, Eye, Trash2, Save, Plus, X } from 'lucide-react';

export const GuardianDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFilteredGuardians, getFilteredStudents, getFilteredFees, updateGuardian, deleteGuardian } = useStore();
  
  const guardians = getFilteredGuardians();
  const students = getFilteredStudents();
  const fees = getFilteredFees();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; guardianId: string; guardianName: string }>({
    isOpen: false,
    guardianId: '',
    guardianName: ''
  });
  
  const guardian = guardians.find(g => g.id === id);
  
  if (!guardian) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Guardian not found</h2>
        <Link to="/students/guardians">
          <Button className="mt-4" icon={ArrowLeft}>Back to Guardians</Button>
        </Link>
      </div>
    );
  }

  const guardianStudents = students.filter(s => guardian.studentIds.includes(s.id));
  
  // Calculate total balance for all children
  const totalBalance = guardianStudents.reduce((total, student) => {
    const studentFees = fees.filter(f => f.studentId === student.id && f.status !== 'paid');
    return total + studentFees.reduce((sum, fee) => sum + fee.amount, 0);
  }, 0);

  const allFees = guardianStudents.flatMap(student => 
    fees.filter(f => f.studentId === student.id).map(fee => ({
      ...fee,
      studentName: `${student.firstName} ${student.lastName}`
    }))
  );

  const getFeeStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const getPrimaryPhone = () => {
    const primary = guardian.phoneNumbers.find(p => p.isPrimary);
    return primary || guardian.phoneNumbers[0];
  };

  const getSecondaryPhones = () => {
    return guardian.phoneNumbers.filter(p => !p.isPrimary);
  };

  const handleEditGuardian = (formData: FormData) => {
    const updates = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      relationship: formData.get('relationship') as string,
      address: formData.get('address') as string || '',
      phoneNumbers: phoneNumbers
    };
    
    updateGuardian(guardian.id, updates);
    setShowEditModal(false);
    setPhoneNumbers([]);
  };

  const handleDeleteClick = () => {
    setDeleteConfirm({
      isOpen: true,
      guardianId: guardian.id,
      guardianName: `${guardian.firstName} ${guardian.lastName}`
    });
  };

  const handleDeleteConfirm = () => {
    deleteGuardian(guardian.id);
    navigate('/students/guardians');
  };

  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, {
      id: `phone-${Date.now()}`,
      number: '',
      type: 'secondary',
      isPrimary: false
    }]);
  };

  const removePhoneNumber = (index: number) => {
    setPhoneNumbers(phoneNumbers.filter((_, i) => i !== index));
  };

  const updatePhoneNumber = (index: number, field: string, value: string | boolean) => {
    const updated = [...phoneNumbers];
    updated[index] = { ...updated[index], [field]: value };
    
    // If setting as primary, make sure only one is primary
    if (field === 'isPrimary' && value === true) {
      updated.forEach((phone, i) => {
        if (i !== index) {
          phone.isPrimary = false;
        }
      });
    }
    
    setPhoneNumbers(updated);
  };

  const EditGuardianForm = () => {
    // Initialize phone numbers when modal opens
    React.useEffect(() => {
      if (showEditModal && phoneNumbers.length === 0) {
        setPhoneNumbers([...guardian.phoneNumbers]);
      }
    }, [showEditModal]);

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        handleEditGuardian(formData);
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              defaultValue={guardian.firstName}
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
              defaultValue={guardian.lastName}
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
              defaultValue={guardian.email}
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
              defaultValue={guardian.relationship}
              required
              placeholder="e.g., Mother, Father, Guardian"
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
              defaultValue={guardian.address || ''}
              placeholder="Enter guardian's address (optional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Phone Numbers Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Numbers
            </label>
            <Button
              type="button"
              variant="secondary"
              size="small"
              icon={Plus}
              onClick={addPhoneNumber}
            >
              Add Phone
            </Button>
          </div>
          <div className="space-y-3">
            {phoneNumbers.map((phone, index) => (
              <div key={phone.id} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <input
                  type="tel"
                  value={phone.number}
                  onChange={(e) => updatePhoneNumber(index, 'number', e.target.value)}
                  placeholder="Phone number"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <select
                  value={phone.type}
                  onChange={(e) => updatePhoneNumber(index, 'type', e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="emergency">Emergency</option>
                </select>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={phone.isPrimary}
                    onChange={(e) => updatePhoneNumber(index, 'isPrimary', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Primary</span>
                </label>
                {phoneNumbers.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="small"
                    icon={X}
                    onClick={() => removePhoneNumber(index)}
                    className="text-red-600 hover:text-red-700"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => {
            setShowEditModal(false);
            setPhoneNumbers([]);
          }}>
            Cancel
          </Button>
          <Button type="submit" icon={Save}>
            Update Guardian
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/students/guardians">
            <Button variant="ghost" icon={ArrowLeft} size="small">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {guardian.firstName} {guardian.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Guardian Profile
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button icon={Edit} onClick={() => setShowEditModal(true)}>
            Edit Profile
          </Button>
          <Button 
            variant="danger" 
            icon={Trash2} 
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
          >
            Delete Guardian
          </Button>
        </div>
      </div>

      {/* Edit Guardian Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setPhoneNumbers([]);
        }}
        title="Edit Guardian Profile"
        size="large"
      >
        <EditGuardianForm />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, guardianId: '', guardianName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Guardian"
        message={`Are you sure you want to delete ${deleteConfirm.guardianName}? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete Guardian"
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
                  <span className="text-primary-600 dark:text-primary-400 font-semibold text-2xl">
                    {guardian.firstName[0]}{guardian.lastName[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {guardian.firstName} {guardian.lastName}
                  </h2>
                  <Badge variant="secondary" className="mt-2">
                    {guardian.relationship}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                  <div className="flex items-center mt-1">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">{guardian.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Primary Phone</label>
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">{getPrimaryPhone()?.number}</span>
                  </div>
                </div>
                {getSecondaryPhones().length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Phones</label>
                    <div className="mt-1 space-y-1">
                      {getSecondaryPhones().map((phone) => (
                        <div key={phone.id} className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-900 dark:text-white">{phone.number}</span>
                          <Badge variant="secondary" size="small" className="ml-2">
                            {phone.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {guardian.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                    <div className="flex items-start mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <span className="text-gray-900 dark:text-white">{guardian.address}</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Number of Children</label>
                  <div className="flex items-center mt-1">
                    <Users className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">
                      {guardianStudents.length} {guardianStudents.length === 1 ? 'child' : 'children'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Students */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Children
              </h3>
            </div>
            {guardianStudents.length > 0 ? (
              <div className="space-y-4">
                {guardianStudents.map((student) => (
                  <div key={student.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          {student.profileImage ? (
                            <img 
                              src={student.profileImage} 
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-primary-600 dark:text-primary-400 font-semibold">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Age: {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}
                          </p>
                          <Badge variant="success" size="small" className="mt-1">
                            {student.status}
                          </Badge>
                        </div>
                      </div>
                      <Link to={`/students/${student.id}`}>
                        <Button variant="ghost" size="small" icon={Eye}>
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No children enrolled.</p>
            )}
          </Card>

          {/* Financial Summary */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Financial Summary
              </h3>
            </div>
            
            {totalBalance > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
                  <div>
                    <span className="text-sm font-medium text-red-700 dark:text-red-200">
                      Total Outstanding Balance
                    </span>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      KSh {totalBalance.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {allFees.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-white">Recent Transactions</h4>
                {allFees.slice(0, 10).map((fee) => (
                  <div key={fee.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {fee.description}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {fee.studentName} • Due: {new Date(fee.dueDate).toLocaleDateString()}
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
              <p className="text-gray-500 dark:text-gray-400">No financial records found.</p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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
                  {guardianStudents.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {guardianStudents.length === 1 ? 'Child' : 'Children'} Enrolled
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {guardian.phoneNumbers.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Phone Numbers
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className={`text-2xl font-bold ${totalBalance > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {totalBalance > 0 ? `KSh ${totalBalance.toLocaleString()}` : 'Paid Up'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Financial Status
                </div>
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact Information
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                <div className="flex items-center mt-1">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <a href={`mailto:${guardian.email}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {guardian.email}
                  </a>
                </div>
              </div>
              
              {guardian.phoneNumbers.map((phone) => (
                <div key={phone.id}>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {phone.type.charAt(0).toUpperCase() + phone.type.slice(1)} Phone
                    {phone.isPrimary && ' (Primary)'}
                  </label>
                  <div className="flex items-center mt-1">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    <a href={`tel:${phone.number}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                      {phone.number}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Actions
              </h3>
            </div>
            <div className="space-y-3">
              <Button className="w-full" variant="secondary">
                Send Message
              </Button>
              <Button className="w-full" variant="secondary">
                View Payment History
              </Button>
              <Button className="w-full" variant="secondary">
                Generate Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};