import React, { useState } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { useStore } from '../../store/useStore';
import { Download, BarChart3, Users, Calendar, DollarSign, Target, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

// Mock data for reports
const attendanceData = [
  { month: 'Aug', rate: 85, sessions: 24 },
  { month: 'Sep', rate: 92, sessions: 26 },
  { month: 'Oct', rate: 88, sessions: 25 },
  { month: 'Nov', rate: 95, sessions: 28 },
  { month: 'Dec', rate: 90, sessions: 22 }
];

const performanceData = [
  { parameter: 'Ball Control', average: 7.2, improvement: 0.8 },
  { parameter: 'Passing', average: 6.8, improvement: 1.2 },
  { parameter: 'Speed', average: 8.1, improvement: 0.5 },
  { parameter: 'Stamina', average: 7.5, improvement: 1.0 },
  { parameter: 'Teamwork', average: 8.3, improvement: 0.3 },
  { parameter: 'Shooting', average: 6.5, improvement: 1.5 }
];

const revenueData = [
  { month: 'Aug', revenue: 12500, expenses: 8500, profit: 4000 },
  { month: 'Sep', revenue: 13200, expenses: 9100, profit: 4100 },
  { month: 'Oct', revenue: 11800, expenses: 8900, profit: 2900 },
  { month: 'Nov', revenue: 14000, expenses: 9800, profit: 4200 },
  { month: 'Dec', revenue: 13500, expenses: 9200, profit: 4300 }
];

const drillUsageData = [
  { name: 'Cone Dribbling', usage: 45, effectiveness: 8.2 },
  { name: 'Passing Square', usage: 38, effectiveness: 7.8 },
  { name: 'Shooting Practice', usage: 32, effectiveness: 7.5 },
  { name: 'Defensive Drills', usage: 28, effectiveness: 8.0 },
  { name: 'Fitness Training', usage: 25, effectiveness: 7.9 }
];

const groupPerformance = [
  { group: 'U-14 Eagles', attendance: 92, performance: 8.1, color: '#10B981' },
  { group: 'U-12 Lions', attendance: 88, performance: 7.5, color: '#EF4444' },
  { group: 'U-16 Sharks', attendance: 95, performance: 8.4, color: '#3B82F6' },
  { group: 'U-10 Cubs', attendance: 85, performance: 7.2, color: '#F59E0B' }
];

export const Reports: React.FC = () => {
  const { students, sessions, assessments, fees, expenses } = useStore();
  const [selectedReport, setSelectedReport] = useState<'attendance' | 'performance' | 'financial' | 'drills'>('attendance');
  const [dateRange, setDateRange] = useState<'month' | 'quarter' | 'year'>('month');

  const reportTypes = [
    { id: 'attendance', label: 'Attendance Reports', icon: Calendar },
    { id: 'performance', label: 'Performance Analytics', icon: Target },
    { id: 'financial', label: 'Financial Reports', icon: DollarSign },
    { id: 'drills', label: 'Drill Usage', icon: BarChart3 }
  ];

  const exportReport = (type: string) => {
    // Simulate export functionality
    console.log(`Exporting ${type} report...`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into academy performance
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <Button variant="secondary" icon={Download}>
            Export All
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id as any)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedReport === type.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${
                  selectedReport === type.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  selectedReport === type.id
                    ? 'text-primary-900 dark:text-primary-100'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {type.label}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Attendance Reports */}
      {selectedReport === 'attendance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Attendance Analytics
            </h2>
            <Button variant="secondary" size="small" icon={Download} onClick={() => exportReport('attendance')}>
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trend */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Monthly Attendance Trend
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average attendance rate across all groups
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
                    dataKey="rate" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Group Performance */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Group Attendance Comparison
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Attendance rates by group
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={groupPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="group" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="attendance" fill="#10B981" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Attendance Summary */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Attendance Summary
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {students.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  90%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {sessions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  5
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Absent Students</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Performance Reports */}
      {selectedReport === 'performance' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Performance Analytics
            </h2>
            <Button variant="secondary" size="small" icon={Download} onClick={() => exportReport('performance')}>
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Radar */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Overall Performance Radar
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average scores across all assessment parameters
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={performanceData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="parameter" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                  />
                  <Radar
                    name="Average Score"
                    dataKey="average"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Improvement Trends */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Improvement Trends
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average improvement by skill area
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="parameter" type="category" stroke="#6B7280" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }}
                  />
                  <Bar dataKey="improvement" fill="#3B82F6" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance Summary
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {assessments.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  7.5
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  +12%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  85%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Students Improving</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Financial Reports */}
      {selectedReport === 'financial' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Financial Analytics
            </h2>
            <Button variant="secondary" size="small" icon={Download} onClick={() => exportReport('financial')}>
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Revenue vs Expenses
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly financial performance
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
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={4} />
                  <Bar dataKey="expenses" fill="#EF4444" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Profit Trend */}
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profit Trend
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Monthly profit analysis
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
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
                    dataKey="profit" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Financial Summary */}
          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Financial Summary
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  $67,000
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+8%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  $45,500
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-xs text-red-600">+3%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  $21,500
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Net Profit</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">+15%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  32%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</div>
                <div className="flex items-center justify-center mt-1">
                  <TrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-xs text-yellow-600">+2%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Drill Usage Reports */}
      {selectedReport === 'drills' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Drill Usage Analytics
            </h2>
            <Button variant="secondary" size="small" icon={Download} onClick={() => exportReport('drills')}>
              Export Report
            </Button>
          </div>

          <Card>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Most Used Drills
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drill usage frequency and effectiveness ratings
              </p>
            </div>
            <div className="space-y-4">
              {drillUsageData.map((drill, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {drill.name}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Usage:</span>
                        <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ width: `${(drill.usage / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                          {drill.usage}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Effectiveness:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {drill.effectiveness}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};