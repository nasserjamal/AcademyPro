import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { Pagination } from '../../components/UI/Pagination';
import { Modal } from '../../components/UI/Modal';
import { ConfirmDialog } from '../../components/UI/ConfirmDialog';
import { useStore } from '../../store/useStore';
import { Plus, Search, Trash2, Phone, Save } from 'lucide-react';

export const Guardians: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredGuardians, getFilteredStudents, addGuardian, deleteGuardian } = useStore();
  const guardians = getFilteredGuardians();
  const students = getFilteredStudents();
  const location = useLocation();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; guardianId: string; guardianName: string }>({
    isOpen: false,
    guardianId: '',
    guardianName: ''
  });
  const itemsPerPage = 10;

  const filteredGuardians = guardians.filter(guardian => {
    const matchesSearch = 
      guardian.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guardian.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guardian.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guardian.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredGuardians.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGuardians = filteredGuardians.slice(startIndex, startIndex + itemsPerPage);

  const getGuardianStudents = (studentIds: string[]) => {
    return students.filter(student => studentIds.includes(student.id));
  };

  const getPrimaryPhone = (phoneNumbers: any[]) => {
    const primary = phoneNumbers.find(p => p.isPrimary);
    return primary ? primary.number : phoneNumbers[0]?.number || '';
  };

  const handleGuardianClick = (guardianId: string) => {
    navigate(`/guardians/${guardianId}`);
  };

  const handleAddGuardian = (formData: FormData) => {
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
      studentIds: formData.get('studentId') ? [formData.get('studentId') as string] : [],
      academyId: 'academy-1'
    };
    
    addGuardian(newGuardian);
    setShowAddModal(false);
  };

  const handleDeleteClick = (guardian: any) => {
    setDeleteConfirm({
      isOpen: true,
      guardianId: guardian.id,
      guardianName: `${guardian.firstName} ${guardian.lastName}`
    });
  };

  const handleDeleteConfirm = () => {
    deleteGuardian(deleteConfirm.guardianId);
    setDeleteConfirm({ isOpen: false, guardianId: '', guardianName: '' });
  };

  const GuardianForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      handleAddGuardian(formData);
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Link to Student
          </label>
          <select
            name="studentId"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
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
            placeholder="Enter guardian's address (optional)"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
          Cancel
        </Button>
        <Button type="submit" icon={Save}>
          Add Guardian
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
            Guardians Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage guardian profiles and student relationships
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Add Guardian
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

      {/* Add Guardian Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Guardian"
        size="large"
      >
        <GuardianForm />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, guardianId: '', guardianName: '' })}
        onConfirm={handleDeleteConfirm}
        title="Delete Guardian"
        message={`Are you sure you want to delete ${deleteConfirm.guardianName}? This action cannot be undone.`}
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
                placeholder="Search guardians..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
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
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Contact</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">No of Children</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedGuardians.map((guardian) => {
                  const guardianStudents = getGuardianStudents(guardian.studentIds);
                  const primaryPhone = getPrimaryPhone(guardian.phoneNumbers);
                  
                  return (
                    <tr key={guardian.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleGuardianClick(guardian.id)}>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-semibold">
                              {guardian.firstName[0]}{guardian.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {guardian.firstName} {guardian.lastName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {guardian.relationship}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-2" />
                            {primaryPhone}
                          </div>
                          {guardian.phoneNumbers.length > 1 && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              +{guardian.phoneNumbers.length - 1} more
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {guardianStudents.length}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            variant="ghost" 
                            size="small" 
                            icon={Trash2} 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteClick(guardian)}
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
            totalItems={filteredGuardians.length}
          />
        </Card>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {paginatedGuardians.map((guardian) => {
          const guardianStudents = getGuardianStudents(guardian.studentIds);
          const primaryPhone = getPrimaryPhone(guardian.phoneNumbers);
          
          return (
            <Card key={guardian.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleGuardianClick(guardian.id)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 dark:text-primary-400 font-semibold text-lg">
                      {guardian.firstName[0]}{guardian.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {guardian.firstName} {guardian.lastName}
                    </h3>
                    <Badge variant="secondary" size="small">
                      {guardian.relationship}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2" />
                  {primaryPhone}
                  {guardian.phoneNumbers.length > 1 && (
                    <span className="ml-2 text-xs text-gray-500">
                      +{guardian.phoneNumbers.length - 1} more
                    </span>
                  )}
                </div>
              </div>

              {/* Children */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">CHILDREN</p>
                <span className="font-medium text-gray-900 dark:text-white">
                  {guardianStudents.length} {guardianStudents.length === 1 ? 'child' : 'children'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700"
                   onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="small" 
                  icon={Trash2} 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteClick(guardian)}
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
            totalItems={filteredGuardians.length}
          />
        </Card>
      </div>

      {filteredGuardians.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <h3 className="text-lg font-medium mb-2">No guardians found</h3>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </Card>
      )}
    </div>
  );
};