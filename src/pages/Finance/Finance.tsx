import React, { useState } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Modal } from '../../components/UI/Modal';
import { Pagination } from '../../components/UI/Pagination';
import { useStore } from '../../store/useStore';
import { Plus, DollarSign, TrendingUp, TrendingDown, Calendar, Filter, Download, AlertTriangle, Users, Save, X, Percent, Edit, Trash2, ArrowRight, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useNavigate } from 'react-router-dom';

const revenueData = [
  { month: 'Aug', revenue: 125000, expenses: 85000 },
  { month: 'Sep', revenue: 132000, expenses: 91000 },
  { month: 'Oct', revenue: 118000, expenses: 89000 },
  { month: 'Nov', revenue: 140000, expenses: 98000 },
  { month: 'Dec', revenue: 135000, expenses: 92000 }
];

const expenseCategories = [
  { name: 'Equipment', value: 35000, color: '#10B981' },
  { name: 'Facility', value: 28000, color: '#EF4444' },
  { name: 'Staff', value: 42000, color: '#3B82F6' },
  { name: 'Utilities', value: 12000, color: '#F59E0B' },
  { name: 'Other', value: 8000, color: '#8B5CF6' }
];

export const Finance: React.FC = () => {
  const navigate = useNavigate();
  const { fees, expenses, getFilteredStudents, getFilteredGroups } = useStore();
  const students = getFilteredStudents();
  const groups = getFilteredGroups();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'groups' | 'students' | 'expenses'>('overview');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showGroupFeeModal, setShowGroupFeeModal] = useState(false);
  const [showStudentDiscountModal, setShowStudentDiscountModal] = useState(false);
  const [showStudentFeeModal, setShowStudentFeeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('current');
  const [feeType, setFeeType] = useState<'monthly' | 'one-time'>('monthly');
  const itemsPerPage = 10;

  // Mock group fees data
  const [groupFees, setGroupFees] = useState([
    {
      id: 'gf-1',
      groupId: 'group-1',
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
      groupId: 'group-1',
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
      groupId: 'group-2',
      name: 'Monthly Training Fee',
      amount: 12000,
      type: 'monthly' as const,
      dueDay: 1,
      deadline: 5,
      isActive: true,
      createdAt: '2024-02-01'
    }
  ]);

  // Mock student discounts data
  const [studentDiscounts, setStudentDiscounts] = useState([
    {
      id: 'sd-1',
      studentId: 'student-1',
      type: 'percentage' as const,
      value: 10,
      reason: 'Sibling discount',
      isActive: true,
      validUntil: '2025-12-31'
    },
    {
      id: 'sd-2',
      studentId: 'student-3',
      type: 'fixed' as const,
      value: 2000,
      reason: 'Financial hardship',
      isActive: true,
      validUntil: '2025-06-30'
    }
  ]);

  // Mock individual student fees data
  const [studentFees, setStudentFees] = useState([
    {
      id: 'sf-1',
      studentId: 'student-1',
      name: 'Extra Training Sessions',
      amount: 5000,
      type: 'monthly' as const,
      dueDay: 15,
      deadline: 5,
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: 'sf-2',
      studentId: 'student-2',
      name: 'Private Coaching',
      amount: 8000,
      type: 'one-time' as const,
      dueDate: '2024-12-20',
      deadline: 5,
      isActive: true,
      createdAt: '2024-01-20'
    }
  ]);

  const getStudent = (studentId: string) => {
    return students.find(s => s.id === studentId);
  };

  const getGroup = (groupId: string) => {
    return groups.find(g => g.id === groupId);
  };

  const getGroupFees = (groupId: string) => {
    return groupFees.filter(fee => fee.groupId === groupId);
  };

  const getStudentIndividualFees = (studentId: string) => {
    return studentFees.filter(fee => fee.studentId === studentId);
  };

  const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
  const pendingRevenue = fees.filter(f => f.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0);
  const overdueRevenue = fees.filter(f => f.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  const filteredFees = feeStatusFilter === 'all' 
    ? fees 
    : fees.filter(f => f.status === feeStatusFilter);

  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFees = filteredFees.slice(startIndex, startIndex + itemsPerPage);

  const getFeeStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const handleAddGroupFee = (formData: FormData) => {
    const type = formData.get('type') as 'monthly' | 'one-time';
    const newGroupFee: any = {
      id: `gf-${Date.now()}`,
      groupId: formData.get('groupId') as string,
      name: formData.get('name') as string,
      amount: parseInt(formData.get('amount') as string),
      type: type,
      deadline: parseInt(formData.get('deadline') as string),
      isActive: true,
      createdAt: new Date().toISOString()
    };

    if (type === 'monthly') {
      newGroupFee.dueDay = parseInt(formData.get('dueDay') as string);
    } else {
      newGroupFee.dueDate = formData.get('dueDate') as string;
    }
    
    setGroupFees([...groupFees, newGroupFee]);
    setShowGroupFeeModal(false);
    setFeeType('monthly');
  };

  const handleAddStudentDiscount = (formData: FormData) => {
    const newDiscount = {
      id: `sd-${Date.now()}`,
      studentId: selectedStudent.id,
      type: formData.get('type') as 'percentage' | 'fixed',
      value: parseFloat(formData.get('value') as string),
      reason: formData.get('reason') as string,
      isActive: true,
      validUntil: formData.get('validUntil') as string
    };
    
    setStudentDiscounts([...studentDiscounts, newDiscount]);
    setShowStudentDiscountModal(false);
    setSelectedStudent(null);
  };

  const handleAddStudentFee = (formData: FormData) => {
    const type = formData.get('type') as 'monthly' | 'one-time';
    const newFee: any = {
      id: `sf-${Date.now()}`,
      studentId: selectedStudent.id,
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
    
    setStudentFees([...studentFees, newFee]);
    setShowStudentFeeModal(false);
    setSelectedStudent(null);
    setFeeType('monthly');
  };

  const getStudentDiscount = (studentId: string) => {
    return studentDiscounts.find(d => d.studentId === studentId && d.isActive);
  };

  const calculateDiscountedAmount = (originalAmount: number, discount: any) => {
    if (!discount) return originalAmount;
    
    if (discount.type === 'percentage') {
      return originalAmount - (originalAmount * discount.value / 100);
    } else {
      return Math.max(0, originalAmount - discount.value);
    }
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/finance/groups/${groupId}`);
  };

  const calculateTotalGroupFees = (groupId: string) => {
    const fees = getGroupFees(groupId);
    const monthlyFees = fees.filter(fee => fee.type === 'monthly').reduce((sum, fee) => sum + fee.amount, 0);
    const oneTimeFees = fees.filter(fee => fee.type === 'one-time').reduce((sum, fee) => sum + fee.amount, 0);
    
    return {
      monthly: monthlyFees,
      oneTime: oneTimeFees,
      total: monthlyFees + oneTimeFees
    };
  };

  const calculateTotalStudentFees = (studentId: string) => {
    const individualFees = getStudentIndividualFees(studentId);
    const monthlyFees = individualFees.filter(fee => fee.type === 'monthly').reduce((sum, fee) => sum + fee.amount, 0);
    const oneTimeFees = individualFees.filter(fee => fee.type === 'one-time').reduce((sum, fee) => sum + fee.amount, 0);
    
    return {
      monthly: monthlyFees,
      oneTime: oneTimeFees,
      total: monthlyFees + oneTimeFees
    };
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `KSh ${totalRevenue.toLocaleString()}`,
      change: '+12%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Pending Payments',
      value: `KSh ${pendingRevenue.toLocaleString()}`,
      change: `${fees.filter(f => f.status === 'pending').length} invoices`,
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'yellow'
    },
    {
      title: 'Overdue Payments',
      value: `KSh ${overdueRevenue.toLocaleString()}`,
      change: `${fees.filter(f => f.status === 'overdue').length} invoices`,
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Net Income',
      value: `KSh ${netIncome.toLocaleString()}`,
      change: netIncome > 0 ? '+8%' : '-3%',
      changeType: netIncome > 0 ? 'positive' as const : 'negative' as const,
      icon: netIncome > 0 ? TrendingUp : TrendingDown,
      color: netIncome > 0 ? 'green' : 'red'
    }
  ];

  const GroupFeeForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddGroupFee(formData);
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
            placeholder="e.g., Monthly Training Fee, Equipment Fee"
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
            Fee Type *
          </label>
          <select
            name="type"
            required
            value={feeType}
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
            placeholder="15000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        {feeType === 'monthly' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Day of Month *
            </label>
            <select
              name="dueDay"
              required={feeType === 'monthly'}
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
              required={feeType === 'one-time'}
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
            defaultValue="5"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => {
          setShowGroupFeeModal(false);
          setFeeType('monthly');
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Create Group Fee
        </Button>
      </div>
    </form>
  );

  const StudentDiscountForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddStudentDiscount(formData);
    }}>
      <div className="mb-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            {selectedStudent?.profileImage ? (
              <img 
                src={selectedStudent.profileImage} 
                alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {selectedStudent?.firstName[0]}{selectedStudent?.lastName[0]}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {selectedStudent?.firstName} {selectedStudent?.lastName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Age: {selectedStudent ? new Date().getFullYear() - new Date(selectedStudent.dateOfBirth).getFullYear() : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Type *
          </label>
          <select
            name="type"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Type</option>
            <option value="percentage">Percentage Discount</option>
            <option value="fixed">Fixed Amount Discount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Discount Value *
          </label>
          <input
            type="number"
            name="value"
            required
            min="0"
            step="0.01"
            placeholder="10 (for 10% or KSh 10)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Reason for Discount *
          </label>
          <input
            type="text"
            name="reason"
            required
            placeholder="e.g., Sibling discount, Financial hardship, Academic excellence"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Valid Until *
          </label>
          <input
            type="date"
            name="validUntil"
            required
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => {
          setShowStudentDiscountModal(false);
          setSelectedStudent(null);
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Add Discount
        </Button>
      </div>
    </form>
  );

  const StudentFeeForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddStudentFee(formData);
    }}>
      <div className="mb-6">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            {selectedStudent?.profileImage ? (
              <img 
                src={selectedStudent.profileImage} 
                alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-primary-600 dark:text-primary-400 font-semibold">
                {selectedStudent?.firstName[0]}{selectedStudent?.lastName[0]}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {selectedStudent?.firstName} {selectedStudent?.lastName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Age: {selectedStudent ? new Date().getFullYear() - new Date(selectedStudent.dateOfBirth).getFullYear() : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fee Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="e.g., Private Coaching, Extra Training Sessions"
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
            value={feeType}
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
            placeholder="5000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        {feeType === 'monthly' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Day of Month *
            </label>
            <select
              name="dueDay"
              required={feeType === 'monthly'}
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
              required={feeType === 'one-time'}
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
            defaultValue="5"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => {
          setShowStudentFeeModal(false);
          setSelectedStudent(null);
          setFeeType('monthly');
        }}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Add Fee
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
            Finance Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage payments, fees, and expenses
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button variant="secondary" icon={Download} className="hidden sm:flex">
            Export Report
          </Button>
          <Button icon={Plus}>
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'groups', label: 'Group Fees' },
            { id: 'students', label: 'Student Fees' },
            { id: 'expenses', label: 'Expenses' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setCurrentPage(1);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showGroupFeeModal}
        onClose={() => {
          setShowGroupFeeModal(false);
          setFeeType('monthly');
        }}
        title="Create Group Fee"
        size="large"
      >
        <GroupFeeForm />
      </Modal>

      <Modal
        isOpen={showStudentDiscountModal}
        onClose={() => {
          setShowStudentDiscountModal(false);
          setSelectedStudent(null);
        }}
        title="Add Student Discount"
        size="medium"
      >
        <StudentDiscountForm />
      </Modal>

      <Modal
        isOpen={showStudentFeeModal}
        onClose={() => {
          setShowStudentFeeModal(false);
          setSelectedStudent(null);
          setFeeType('monthly');
        }}
        title="Add Individual Fee"
        size="medium"
      >
        <StudentFeeForm />
      </Modal>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                      <div className="flex items-center mt-2">
                        <Icon className={`w-4 h-4 mr-1 ${
                          stat.changeType === 'positive' ? 'text-green-500' : 
                          stat.changeType === 'negative' ? 'text-red-500' : 
                          'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 
                          stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-primary-100 dark:bg-primary-900`}>
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expenses */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue vs Expenses
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly financial performance (KSh)
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                    formatter={(value) => [`KSh ${value.toLocaleString()}`, '']}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={4} />
                  <Bar dataKey="expenses" fill="#EF4444" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Expense Categories */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Expense Categories
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Breakdown of monthly expenses
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expenseCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expenseCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `KSh ${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {expenseCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      KSh {category.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Group Fees Tab */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          {/* Month Filter */}
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
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
              <Button icon={Plus} onClick={() => setShowGroupFeeModal(true)}>
                Create Group Fee
              </Button>
            </div>
          </Card>

          {/* Groups List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {groups.map((group) => {
              const groupFeeData = getGroupFees(group.id);
              const feeSummary = calculateTotalGroupFees(group.id);
              const studentCount = group.studentIds.length;
              
              return (
                <Card 
                  key={group.id} 
                  className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleGroupClick(group.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {group.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {group.ageRange} • {studentCount} students
                        </p>
                      </div>
                    </div>
                    <Badge variant={group.isActive ? 'success' : 'secondary'}>
                      {group.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Monthly Fees</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          KSh {feeSummary.monthly.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">One-time Fees</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          KSh {feeSummary.oneTime.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium text-primary-900 dark:text-primary-100">Total Fees</p>
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          KSh {feeSummary.total.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs text-primary-700 dark:text-primary-300 mt-1">
                        Per student per month
                      </p>
                    </div>
                  </div>

                  {/* Fee List Preview */}
                  {groupFeeData.length > 0 ? (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">ACTIVE FEES</p>
                      <div className="space-y-2">
                        {groupFeeData.slice(0, 2).map((fee) => (
                          <div key={fee.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{fee.name}</p>
                              <Badge variant={fee.type === 'monthly' ? 'primary' : 'secondary'} size="small">
                                {fee.type}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              KSh {fee.amount.toLocaleString()}
                            </p>
                          </div>
                        ))}
                        {groupFeeData.length > 2 && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{groupFeeData.length - 2} more fees
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No fees configured for this group
                      </p>
                    </div>
                  )}

                  {/* View Details Button */}
                  <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="small" 
                      icon={Eye}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the card click from triggering
                        navigate(`/finance/groups/${group.id}`);
                      }}
                    >
                      View Fee Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {groups.length === 0 && (
            <Card className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No groups found</h3>
                <p className="text-sm mb-4">
                  Create training groups first to manage group fees
                </p>
                <Button icon={Plus} onClick={() => navigate('/groups')}>
                  Create Group
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Student Fees Tab */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={feeStatusFilter}
                    onChange={(e) => {
                      setFeeStatusFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
              <Button variant="secondary" size="small" className="hidden sm:flex">
                Send Reminders
              </Button>
            </div>
          </Card>

          {/* Students with Individual Fees */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Individual Student Fees
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {studentFees.filter(f => f.isActive).length} active individual fees
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => {
                const individualFees = getStudentIndividualFees(student.id);
                const feeSummary = calculateTotalStudentFees(student.id);
                
                return (
                  <div key={student.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
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
                    </div>

                    {/* Individual Fees */}
                    {individualFees.length > 0 ? (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">INDIVIDUAL FEES</p>
                        <div className="space-y-2">
                          {individualFees.map((fee) => (
                            <div key={fee.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{fee.name}</p>
                                <Badge variant={fee.type === 'monthly' ? 'primary' : 'secondary'} size="small">
                                  {fee.type}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                KSh {fee.amount.toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-medium text-primary-900 dark:text-primary-100">Total Individual Fees</p>
                            <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                              KSh {feeSummary.total.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          No individual fees
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between space-x-2">
                      <Button 
                        variant="ghost" 
                        size="small" 
                        className="flex-1"
                        icon={Plus}
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowStudentFeeModal(true);
                        }}
                      >
                        Add Fee
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="small" 
                        className="flex-1"
                        icon={Percent}
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowStudentDiscountModal(true);
                        }}
                      >
                        Add Discount
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Students with Discounts */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Student Discounts
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {studentDiscounts.filter(d => d.isActive).length} active discounts
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => {
                const discount = getStudentDiscount(student.id);
                
                return (
                  <div key={student.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
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
                    </div>

                    {discount ? (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Percent className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">
                            Active Discount
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {discount.type === 'percentage' 
                            ? `${discount.value}% off` 
                            : `KSh ${discount.value} off`
                          }
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {discount.reason}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Valid until: {new Date(discount.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          No active discount
                        </p>
                      </div>
                    )}

                    <Button 
                      variant="ghost" 
                      size="small" 
                      className="w-full"
                      icon={discount ? Edit : Plus}
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowStudentDiscountModal(true);
                      }}
                    >
                      {discount ? 'Edit Discount' : 'Add Discount'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Individual Fee Management */}
          <div className="hidden md:block">
            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Student</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Description</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Original Amount</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Final Amount</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Due Date</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFees.map((fee) => {
                      const student = getStudent(fee.studentId);
                      const discount = getStudentDiscount(fee.studentId);
                      const finalAmount = calculateDiscountedAmount(fee.amount, discount);
                      
                      return (
                        <tr key={fee.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {student?.firstName} {student?.lastName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {student?.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-gray-900 dark:text-white">{fee.description}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{fee.type}</p>
                          </td>
                          <td className="py-4 px-6">
                            <p className={`font-medium ${discount ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              KSh {fee.amount.toLocaleString()}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-900 dark:text-white">
                              KSh {finalAmount.toLocaleString()}
                            </p>
                            {discount && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                {discount.type === 'percentage' ? `${discount.value}% off` : `KSh ${discount.value} off`}
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-gray-900 dark:text-white">
                              {new Date(fee.dueDate).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={getFeeStatusBadgeVariant(fee.status)}>
                              {fee.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="small">
                                View
                              </Button>
                              {fee.status !== 'paid' && (
                                <Button variant="ghost" size="small">
                                  Mark Paid
                                </Button>
                              )}
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
                totalItems={filteredFees.length}
              />
            </Card>
          </div>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button icon={Plus}>
              Add Expense
            </Button>
          </div>

          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Category</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Description</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Amount</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Approved By</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 px-6">
                        <p className="text-gray-900 dark:text-white">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="secondary">
                          {expense.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-900 dark:text-white">{expense.description}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-900 dark:text-white">
                          KSh {expense.amount.toLocaleString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-900 dark:text-white">{expense.approvedBy}</p>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="small">
                            View Receipt
                          </Button>
                          <Button variant="ghost" size="small">
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};