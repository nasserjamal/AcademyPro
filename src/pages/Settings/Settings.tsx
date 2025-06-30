import React, { useState } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { useStore } from '../../store/useStore';
import { Settings as SettingsIcon, Users, Shield, Bell, Database, Download, Upload, Trash2, Plus, Building2, Edit } from 'lucide-react';

export const Settings: React.FC = () => {
  const { currentUser, academies, activeAcademyId, addAcademy, updateAcademy, deleteAcademy } = useStore();
  const [activeTab, setActiveTab] = useState<'general' | 'academies' | 'users' | 'notifications' | 'data'>('general');
  const [showAddAcademyForm, setShowAddAcademyForm] = useState(false);

  const activeAcademy = academies.find(a => a.id === activeAcademyId);

  // Mock data for settings
  const users = [
    {
      id: 'user-1',
      name: 'Admin User',
      email: 'admin@academypro.com',
      role: 'admin',
      lastLogin: '2024-12-28T10:30:00Z',
      status: 'active'
    },
    {
      id: 'user-2',
      name: 'Carlos Rodriguez',
      email: 'carlos@academypro.com',
      role: 'coach',
      lastLogin: '2024-12-27T15:45:00Z',
      status: 'active'
    },
    {
      id: 'user-3',
      name: 'Sarah Wilson',
      email: 'sarah@academypro.com',
      role: 'coach',
      lastLogin: '2024-12-26T09:20:00Z',
      status: 'active'
    },
    {
      id: 'user-4',
      name: 'Finance Manager',
      email: 'finance@academypro.com',
      role: 'finance',
      lastLogin: '2024-12-25T14:10:00Z',
      status: 'inactive'
    }
  ];

  const actionHistory = [
    {
      id: 'action-1',
      user: 'Admin User',
      action: 'Created new student profile',
      target: 'John Smith',
      timestamp: '2024-12-28T10:30:00Z'
    },
    {
      id: 'action-2',
      user: 'Carlos Rodriguez',
      action: 'Updated session attendance',
      target: 'U-14 Eagles Training',
      timestamp: '2024-12-28T09:15:00Z'
    },
    {
      id: 'action-3',
      user: 'Finance Manager',
      action: 'Processed payment',
      target: 'Mike Johnson - Monthly Fee',
      timestamp: '2024-12-27T16:45:00Z'
    },
    {
      id: 'action-4',
      user: 'Sarah Wilson',
      action: 'Added new drill',
      target: 'Advanced Shooting Drill',
      timestamp: '2024-12-27T11:20:00Z'
    }
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'coach': return 'primary';
      case 'finance': return 'warning';
      case 'guardian': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'suspended': return 'danger';
      default: return 'secondary';
    }
  };

  const handleAddAcademy = (formData: any) => {
    const newAcademy = {
      id: `academy-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      timezone: formData.timezone,
      currency: 'KSh',
      settings: {
        maxStudentsPerGroup: 20,
        sessionDuration: 90,
        assessmentFrequency: 'monthly' as const,
        feeStructure: {
          monthly: 15000,
          registration: 5000,
          equipment: 7500
        },
        notifications: {
          email: true,
          sms: true,
          push: false
        }
      },
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    addAcademy(newAcademy);
    setShowAddAcademyForm(false);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'academies', label: 'Academy Management', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage academy settings and system configuration
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && activeAcademy && (
        <div className="space-y-6">
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Academy Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Basic information about {activeAcademy.name}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academy Name
                </label>
                <input
                  type="text"
                  defaultValue={activeAcademy.name}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  defaultValue={activeAcademy.phone}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue={activeAcademy.email}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  defaultValue={activeAcademy.website}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  rows={3}
                  defaultValue={activeAcademy.address}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timezone
                </label>
                <select
                  defaultValue={activeAcademy.timezone}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Africa/Nairobi">East Africa Time</option>
                  <option value="Africa/Lagos">West Africa Time</option>
                  <option value="Africa/Cairo">Central Africa Time</option>
                  <option value="Africa/Johannesburg">South Africa Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  defaultValue={activeAcademy.currency}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="KSh">KSh - Kenyan Shilling</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button>
                Save Changes
              </Button>
            </div>
          </Card>

          {/* Fee Structure */}
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Fee Structure
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure default fee amounts for this academy
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Fee (KSh)
                </label>
                <input
                  type="number"
                  defaultValue={activeAcademy.settings.feeStructure.monthly}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration Fee (KSh)
                </label>
                <input
                  type="number"
                  defaultValue={activeAcademy.settings.feeStructure.registration}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Equipment Fee (KSh)
                </label>
                <input
                  type="number"
                  defaultValue={activeAcademy.settings.feeStructure.equipment}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button>
                Update Fee Structure
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Academy Management */}
      {activeTab === 'academies' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Academy Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage multiple academies and their settings
              </p>
            </div>
            <Button icon={Plus} onClick={() => setShowAddAcademyForm(true)}>
              Add Academy
            </Button>
          </div>

          {/* Add Academy Form */}
          {showAddAcademyForm && (
            <Card>
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add New Academy
                </h4>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleAddAcademy(Object.fromEntries(formData));
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Academy Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
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
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address *
                    </label>
                    <textarea
                      name="address"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      defaultValue="Africa/Nairobi"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Africa/Nairobi">East Africa Time</option>
                      <option value="Africa/Lagos">West Africa Time</option>
                      <option value="Africa/Cairo">Central Africa Time</option>
                      <option value="Africa/Johannesburg">South Africa Time</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button variant="secondary" onClick={() => setShowAddAcademyForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Academy
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Academies List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {academies.map((academy) => (
              <Card key={academy.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {academy.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {academy.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {academy.id === activeAcademyId && (
                      <Badge variant="success" size="small">Active</Badge>
                    )}
                    <Badge variant={academy.isActive ? 'success' : 'secondary'} size="small">
                      {academy.isActive ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Address:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{academy.address}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Contact:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{academy.phone}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Email:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{academy.email}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Created:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {new Date(academy.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="small" icon={Edit}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="small">
                      Settings
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="small" 
                    icon={Trash2} 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => deleteAcademy(academy.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage user accounts and permissions
              </p>
            </div>
            <Button icon={Users}>
              Add User
            </Button>
          </div>

          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">User</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Role</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Last Login</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-900 dark:text-white">
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(user.lastLogin).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getStatusBadgeVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="small">
                            Edit
                          </Button>
                          <Button variant="ghost" size="small" icon={Shield}>
                            Permissions
                          </Button>
                          {user.id !== currentUser?.id && (
                            <Button variant="ghost" size="small" className="text-red-600 hover:text-red-700">
                              Remove
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Action History */}
          <Card>
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Actions
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track user activities and system changes
              </p>
            </div>
            <div className="space-y-3">
              {actionHistory.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      <span className="text-primary-600 dark:text-primary-400">{action.user}</span> {action.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Target: {action.target}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(action.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(action.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure how and when you receive notifications
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Email Notifications</h4>
                <div className="space-y-3">
                  {[
                    { id: 'new-student', label: 'New student enrollments', enabled: true },
                    { id: 'payment-received', label: 'Payment received', enabled: true },
                    { id: 'overdue-payments', label: 'Overdue payments', enabled: true },
                    { id: 'session-updates', label: 'Session updates and changes', enabled: false },
                    { id: 'assessment-completed', label: 'Assessment completed', enabled: true },
                    { id: 'weekly-reports', label: 'Weekly summary reports', enabled: false }
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {notification.label}
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={notification.enabled}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">SMS Notifications</h4>
                <div className="space-y-3">
                  {[
                    { id: 'urgent-alerts', label: 'Urgent alerts only', enabled: true },
                    { id: 'payment-reminders', label: 'Payment reminders', enabled: false },
                    { id: 'session-cancellations', label: 'Session cancellations', enabled: true }
                  ].map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {notification.label}
                      </label>
                      <input
                        type="checkbox"
                        defaultChecked={notification.enabled}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button>
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Backup & Export
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your academy data and create backups
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Export Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Download all your academy data in various formats
                </p>
                <div className="space-y-2">
                  <Button variant="secondary" size="small" icon={Download} className="w-full">
                    Export Students Data (CSV)
                  </Button>
                  <Button variant="secondary" size="small" icon={Download} className="w-full">
                    Export Financial Data (Excel)
                  </Button>
                  <Button variant="secondary" size="small" icon={Download} className="w-full">
                    Export Complete Backup (JSON)
                  </Button>
                </div>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Import Data
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Import data from external sources or restore backups
                </p>
                <div className="space-y-2">
                  <Button variant="secondary" size="small" icon={Upload} className="w-full">
                    Import Students (CSV)
                  </Button>
                  <Button variant="secondary" size="small" icon={Upload} className="w-full">
                    Import Financial Data
                  </Button>
                  <Button variant="secondary" size="small" icon={Upload} className="w-full">
                    Restore from Backup
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Data Cleanup
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remove old or unnecessary data to optimize system performance
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-200">
                    Archive Old Sessions
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Archive sessions older than 1 year (45 sessions found)
                  </p>
                </div>
                <Button variant="secondary" size="small">
                  Archive
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-200">
                    Delete Inactive Students
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Permanently delete students inactive for 2+ years (3 students found)
                  </p>
                </div>
                <Button variant="danger" size="small" icon={Trash2}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};