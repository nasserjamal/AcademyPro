import React from 'react';
import { Card } from '../components/UI/Card';
import { useStore } from '../store/useStore';
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const attendanceData = [
  { month: 'Aug', attendance: 85 },
  { month: 'Sep', attendance: 92 },
  { month: 'Oct', attendance: 88 },
  { month: 'Nov', attendance: 95 },
  { month: 'Dec', attendance: 90 }
];

const revenueData = [
  { month: 'Aug', revenue: 125000, expenses: 85000 },
  { month: 'Sep', revenue: 132000, expenses: 91000 },
  { month: 'Oct', revenue: 118000, expenses: 89000 },
  { month: 'Nov', revenue: 140000, expenses: 98000 },
  { month: 'Dec', revenue: 135000, expenses: 92000 }
];

const groupData = [
  { name: 'U-14 Eagles', value: 18, color: '#10B981' },
  { name: 'U-12 Lions', value: 12, color: '#EF4444' },
  { name: 'U-16 Sharks', value: 15, color: '#3B82F6' },
  { name: 'U-10 Cubs', value: 8, color: '#F59E0B' }
];

export const Dashboard: React.FC = () => {
  const { 
    getFilteredStudents, 
    getFilteredCoaches, 
    getFilteredSessions, 
    getFilteredFees,
    academies,
    activeAcademyId
  } = useStore();

  const students = getFilteredStudents();
  const coaches = getFilteredCoaches();
  const sessions = getFilteredSessions();
  const fees = getFilteredFees();
  
  const activeAcademy = academies.find(a => a.id === activeAcademyId);

  const totalRevenue = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);
  const pendingFees = fees.filter(f => f.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0);
  const overdueFees = fees.filter(f => f.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);

  const upcomingSessions = sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    return sessionDate >= today && sessionDate <= threeDaysFromNow;
  });

  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Active Coaches',
      value: coaches.length,
      change: '+2',
      changeType: 'positive' as const,
      icon: UserCheck,
      color: 'blue'
    },
    {
      title: 'This Month Revenue',
      value: `KSh ${totalRevenue.toLocaleString()}`,
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Upcoming Sessions',
      value: upcomingSessions.length,
      change: 'Next 3 days',
      changeType: 'neutral' as const,
      icon: Calendar,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back! Here's what's happening at {activeAcademy?.name || 'your academy'}.
        </p>
      </div>

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
                    <TrendingUp className={`w-4 h-4 mr-1 ${
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
        {/* Attendance Chart */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Attendance Rate
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Average attendance across all groups
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
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
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Revenue vs Expenses
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Monthly financial overview (KSh)
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
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Group Distribution */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Group Distribution
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Students by age group
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={groupData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {groupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {groupData.map((group, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: group.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {group.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {group.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  New student John Smith enrolled
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  Session completed: U-14 Eagles
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  Payment received from Mike Johnson
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900 dark:text-white">
                  Equipment maintenance scheduled
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Alerts */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Important Alerts
            </h3>
          </div>
          <div className="space-y-3">
            {overdueFees > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-200">
                    Overdue Payments
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300">
                    KSh {overdueFees.toLocaleString()} in overdue fees
                  </p>
                </div>
              </div>
            )}
            {pendingFees > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
                    Pending Payments
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    KSh {pendingFees.toLocaleString()} awaiting payment
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                  Upcoming Tournament
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  New Year Tournament in 15 days
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};