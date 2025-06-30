import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { ArrowLeft, Plus, DollarSign, Calendar, Users, Save, Trash2, Edit, Clock, AlertTriangle } from 'lucide-react';

export const GroupFeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getFilteredGroups, getFilteredStudents } = useStore();
  
  const groups = getFilteredGroups();
  const students = getFilteredStudents();
  
  const [showAddFeeModal, setShowAddFeeModal] = useState(false);
  const [showEditFeeModal, setShowEditFeeModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);
  const [feeType, setFeeType] = useState<'monthly' | 'one-time'>('monthly');
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; feeId: string; feeName: string }>({
    isOpen: false,
    feeId: '',
    feeName: ''
  });
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  
  const group = groups.find(g => g.id === id);
  
  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Group not found</h2>
        <Link to="/finance">
          <Button className="mt-4" icon={ArrowLeft}>Back to Finance</Button>
        </Link>
      </div>
    );
  }

  const groupStudents = students.filter(s => group.studentIds.includes(s.id));
  
  // Mock group fees data
  const groupFees = [
    {
      id: 'gf-1',
      groupId: group.id,
      name: 'Monthly Training Fee',
      amount: 15000,
      type: 'monthly' as const,
      dueDay: 1,
      deadline: 5,
      isActive: true,
      createdAt: '2024-01-01'
    },
    {
      id: 'gf-2',
      groupId: group.id,
      name: 'Equipment Fee',
      amount: 7500,
      type: 'one-time' as const,
      dueDate: '2024-12-31',
      deadline: 5,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'gf-3',
      groupId: group.id,
      name: 'Tournament Entry Fee',
      amount: 5000,
      type: 'one-time' as const,
      dueDate: '2025-01-15',
      deadline: 5,
      isActive: false,
      createdAt: '2024-02-01'
    }
  ];

  // Calculate monthly totals
  const monthlyTotal = groupFees
    .filter(fee => fee.isActive && fee.type === 'monthly')
    .reduce((sum, fee) => sum + fee.amount, 0);
  
  const oneTimeTotal = groupFees
    .filter(fee => fee.isActive && fee.type === 'one-time')
    .reduce((sum, fee) => sum + fee.amount, 0);

  const handleAddFee = (formData: FormData) => {
    const type = formData.get('type') as 'monthly' | 'one-time';
    const newFee: any = {
      id: `gf-${Date.now()}`,
      groupId: group.id,
      name: formData.get('name') as string,
      amount: parseInt(formData.get('amount') as string),
      type: type,
      deadline: parseInt(formData.get('deadline') as string),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    if (type === 'monthly') {
      newFee.dueDay = parseInt(formData.get('dueDay') as string);
    } else {
      newFee.dueDate = formData.get('dueDate') as string;
    }
    
    console.log('Adding new fee:', newFee);
    setShowAddFeeModal(false);
    setFeeType('monthly');
  };

  const handleEditFee = (formData: FormData) => {
    if (!selectedFee) return;
    
    const type = formData.get('type') as 'monthly' | 'one-time';
    const updatedFee: any = {
      ...selectedFee,
      name: formData.get('name') as string,
      amount: parseInt(formData.get('amount') as string),
      type: type,
      deadline: parseInt(formData.get('deadline') as string),
    };

    if (type === 'monthly') {
      updatedFee.dueDay = parseInt(formData.get('dueDay') as string);
      delete updatedFee.dueDate;
    } else {
      updatedFee.dueDate = formData.get('dueDate') as string;
      delete updatedFee.dueDay;
    }
    
    console.log('Updating fee:', updatedFee);
    setShowEditFeeModal(false);
    setSelectedFee(null);
    setFeeType('monthly');
  };

  const handleDeleteClick = (fee: any) => {
    setDeleteConfirm({
      isOpen: true,
      feeId: fee.id,
      feeName: fee.name
    });
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting fee:', deleteConfirm.feeId);
    setDeleteConfirm({ isOpen: false, feeId: '', feeName: '' });
  };

  const handleEditClick = (fee: any) => {
    setSelectedFee(fee);
    setFeeType(fee.type);
    setShowEditFeeModal(true);
  };

  const FeeForm = ({ isEdit = false }: { isEdit?: boolean }) => {
    const currentFee = isEdit ? selectedFee : null;
    const currentFeeType = isEdit ? feeType : feeType;

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        if (isEdit) {
          handleEditFee(formData);
        } else {
          handleAddFee(formData);
        }
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fee Name *
            </label>
            <input
              type="text"
              name="name"
              required
              defaultValue={isEdit ? currentFee?.name : ''}
              placeholder="e.g., Monthly Training Fee, Equipment Fee"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fee Type *
            </label>
            <select
              name="type"
              required
              value={currentFeeType}
              onChange={(e) => setFeeType(e.target.value as 'monthly' | 'one-time')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select Type</option>
              <option value="monthly">Monthly Recurring</option>
              <option value="one-time">One-time Fee</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (KSh) *
            </label>
            <input
              type="number"
              name="amount"
              required
              min="0"
              step="100"
              defaultValue={isEdit ? currentFee?.amount : ''}
              placeholder="15000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {currentFeeType === 'monthly' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Day of Month *
              </label>
              <select
                name="dueDay"
                required={currentFeeType === 'monthly'}
                defaultValue={isEdit && currentFee?.dueDay ? currentFee.dueDay : ''}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Day</option>
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                name="dueDate"
                required={currentFeeType === 'one-time'}
                defaultValue={isEdit && currentFee?.dueDate ? currentFee.dueDate : ''}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Deadline (Days After Due) *
            </label>
            <input
              type="number"
              name="deadline"
              required
              min="1"
              max="30"
              defaultValue={isEdit ? currentFee?.deadline : 5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={() => {
            if (isEdit) {
              setShowEditFeeModal(false);
              setSelectedFee(null);
            } else {
              setShowAddFeeModal(false);
            }
            setFeeType('monthly');
          }}>
            Cancel
          </Button>
          <Button type="submit" icon={Save}>
            {isEdit ? 'Update Fee' : 'Create Fee'}
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
          <Link to="/finance">
            <Button variant="ghost" icon={ArrowLeft} size="small">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
              {group.name} Fees
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage fees for {group.ageRange} group
            </p>
          </div>
        </div>
        <Button icon={Plus} onClick={() => setShowAddFeeModal(true)}>
          Add Fee
        </Button>
      </div>

      {/* Add Fee Modal */}
      <Modal
        isOpen={showAddFeeModal}
        onClose={() => {
          setShowAddFeeModal(false);
          setFeeType('monthly');
        }}
        title="Add New Fee"
        size="large"
      >
        <FeeForm />
      </Modal>

      {/* Edit Fee Modal */}
      <Modal
        isOpen={showEditFeeModal}
        onClose={() => {
          setShowEditFeeModal(false);
          setSelectedFee(null);
          setFeeType('monthly');
        }}
        title="Edit Fee"
        size="large"
      >
        <FeeForm isEdit={true} />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, feeId: '', feeName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Fee"
        message={`Are you sure you want to delete "${deleteConfirm.feeName}"? This will remove the fee from all students in this group.`}
        confirmText="Delete Fee"
        variant="danger"
      />

      {/* Month Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="current">Current Month</option>
                <option value="next">Next Month</option>
                <option value="all">All Fees</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Group Fees */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fee Structure
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All fees applicable to {group.name}
              </p>
            </div>
            
            {groupFees.length > 0 ? (
              <div className="space-y-4">
                {groupFees.map((fee) => (
                  <div key={fee.id} className={`border ${fee.isActive ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-700 opacity-60'} rounded-lg p-4 hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${fee.type === 'monthly' ? 'bg-primary-100 dark:bg-primary-900' : 'bg-blue-100 dark:bg-blue-900'}`}>
                          <DollarSign className={`w-5 h-5 ${fee.type === 'monthly' ? 'text-primary-600 dark:text-primary-400' : 'text-blue-600 dark:text-blue-400'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {fee.name}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={fee.type === 'monthly' ? 'primary' : 'secondary'} size="small">
                              {fee.type}
                            </Badge>
                            <Badge variant={fee.isActive ? 'success' : 'secondary'} size="small">
                              {fee.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          KSh {fee.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {fee.type === 'monthly' ? 'per month' : 'one-time'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Due Date</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {fee.type === 'monthly' 
                              ? `${fee.dueDay}${fee.dueDay === 1 ? 'st' : fee.dueDay === 2 ? 'nd' : fee.dueDay === 3 ? 'rd' : 'th'} of each month`
                              : new Date(fee.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Payment Deadline</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {fee.deadline} days after due date
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Students Affected</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {groupStudents.length} students
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="small" 
                          icon={Edit}
                          onClick={() => handleEditClick(fee)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="small"
                        >
                          {fee.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="small" 
                        icon={Trash2} 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteClick(fee)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No fees configured for this group</p>
                <Button 
                  icon={Plus} 
                  className="mt-4"
                  onClick={() => setShowAddFeeModal(true)}
                >
                  Add Fee
                </Button>
              </div>
            )}
          </Card>

          {/* Students in Group */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Students in Group
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {groupStudents.length} students affected by these fees
              </p>
            </div>
            
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
                        Age: {new Date().getFullYear() - new Date(student.dateOfBirth).getFullYear()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="small">
                    View Payments
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Fee Summary */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fee Summary
              </h3>
            </div>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  KSh {monthlyTotal.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly Recurring Fees
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  KSh {oneTimeTotal.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  One-time Fees
                </div>
              </div>
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  KSh {(monthlyTotal + oneTimeTotal).toLocaleString()}
                </div>
                <div className="text-sm text-primary-600 dark:text-primary-400">
                  Total Fees
                </div>
              </div>
            </div>
          </Card>

          {/* Group Information */}
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
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Students</label>
                <p className="text-gray-900 dark:text-white">{groupStudents.length} students</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <Badge variant={group.isActive ? 'success' : 'secondary'}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Status */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Status
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current month overview
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    65%
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400">
                    Paid
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    25%
                  </div>
                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                    Pending
                  </div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    10%
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400">
                    Overdue
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Payment Reminders
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Next automatic reminder: 3 days before deadline
                </p>
                <Button variant="ghost" size="small" className="mt-2 w-full">
                  Send Manual Reminder
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};