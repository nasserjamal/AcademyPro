import React, { useState } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { useStore } from '../../store/useStore';
import { Plus, Megaphone, Send, Eye, Users, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export const Announcements: React.FC = () => {
  const { announcements, groups, students, guardians } = useStore();
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getTargetAudience = (announcement: any) => {
    const targetGroups = groups.filter(g => announcement.targetGroups.includes(g.id));
    const targetStudents = students.filter(s => announcement.targetStudents.includes(s.id));
    
    if (targetGroups.length > 0 && targetStudents.length > 0) {
      return `${targetGroups.length} groups, ${targetStudents.length} students`;
    } else if (targetGroups.length > 0) {
      return `${targetGroups.length} groups`;
    } else if (targetStudents.length > 0) {
      return `${targetStudents.length} students`;
    }
    return 'No recipients';
  };

  const getDeliveryStats = (deliveryStatus: Record<string, string>) => {
    const statuses = Object.values(deliveryStatus);
    const sent = statuses.length;
    const delivered = statuses.filter(s => s === 'delivered' || s === 'read').length;
    const read = statuses.filter(s => s === 'read').length;
    
    return { sent, delivered, read };
  };

  // Mock message data
  const messages = [
    {
      id: 'msg-1',
      recipient: 'Jane Smith (Guardian)',
      subject: 'Training Schedule Update',
      content: 'Hello Jane, please note that next week\'s training schedule has been updated...',
      sentAt: '2024-12-28T10:30:00Z',
      status: 'delivered',
      type: 'individual'
    },
    {
      id: 'msg-2',
      recipient: 'U-14 Eagles Group',
      subject: 'Equipment Reminder',
      content: 'Reminder to all U-14 Eagles parents: Please ensure your child brings...',
      sentAt: '2024-12-27T15:45:00Z',
      status: 'read',
      type: 'group'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Communications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage announcements and messages
          </p>
        </div>
        <Button icon={Plus} className="mt-4 sm:mt-0">
          Create Announcement
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('announcements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'announcements'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'messages'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Message History
          </button>
        </nav>
      </div>

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {announcements.map((announcement) => {
            const PriorityIcon = getPriorityIcon(announcement.priority);
            const deliveryStats = getDeliveryStats(announcement.deliveryStatus);
            
            return (
              <Card key={announcement.id} className="hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      announcement.priority === 'high' ? 'bg-red-100 dark:bg-red-900' :
                      announcement.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <PriorityIcon className={`w-5 h-5 ${
                        announcement.priority === 'high' ? 'text-red-600 dark:text-red-400' :
                        announcement.priority === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {announcement.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getPriorityBadgeVariant(announcement.priority)}>
                    {announcement.priority} priority
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <Users className="w-4 h-4 mr-2" />
                      Target Audience
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getTargetAudience(announcement)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <Send className="w-4 h-4 mr-2" />
                      Delivery Status
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {deliveryStats.read}/{deliveryStats.sent} read
                    </p>
                  </div>
                </div>

                {/* Delivery Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Delivery Progress</span>
                    <span>{Math.round((deliveryStats.delivered / deliveryStats.sent) * 100)}% delivered</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(deliveryStats.delivered / deliveryStats.sent) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{deliveryStats.sent} sent</span>
                    <span>{deliveryStats.delivered} delivered</span>
                    <span>{deliveryStats.read} read</span>
                  </div>
                </div>

                {/* Target Groups/Students */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">RECIPIENTS</p>
                  <div className="flex flex-wrap gap-2">
                    {announcement.targetGroups.map((groupId) => {
                      const group = groups.find(g => g.id === groupId);
                      return group ? (
                        <Badge key={groupId} variant="primary" size="small">
                          {group.name}
                        </Badge>
                      ) : null;
                    })}
                    {announcement.targetStudents.map((studentId) => {
                      const student = students.find(s => s.id === studentId);
                      return student ? (
                        <Badge key={studentId} variant="secondary" size="small">
                          {student.firstName} {student.lastName}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="small" icon={Eye}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="small" icon={Send}>
                      Resend
                    </Button>
                  </div>
                  <Button variant="ghost" size="small">
                    Edit
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button icon={Plus}>
              Send Message
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Recipient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Subject</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Sent</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {message.recipient}
                          </p>
                          <Badge variant={message.type === 'group' ? 'primary' : 'secondary'} size="small">
                            {message.type}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                            {message.content}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900 dark:text-white">
                          {new Date(message.sentAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(message.sentAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          message.status === 'read' ? 'success' :
                          message.status === 'delivered' ? 'warning' :
                          'secondary'
                        }>
                          {message.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="small" icon={Eye}>
                            View
                          </Button>
                          <Button variant="ghost" size="small">
                            Reply
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

      {announcements.length === 0 && activeTab === 'announcements' && (
        <Card className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <Megaphone className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No announcements yet</h3>
            <p className="text-sm mb-4">Start communicating with your academy community</p>
            <Button icon={Plus}>
              Create Announcement
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};