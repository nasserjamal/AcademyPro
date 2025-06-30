import React, { useState } from 'react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Badge } from '../../components/UI/Badge';
import { useStore } from '../../store/useStore';
import { Plus, Calendar, Clock, MapPin, Users, Trophy, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

export const Events: React.FC = () => {
  const { events, groups, coaches, guardians } = useStore();
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const eventTypes = ['match', 'tournament', 'ceremony', 'training', 'other'];

  const filteredEvents = typeFilter === 'all' 
    ? events 
    : events.filter(e => e.type === typeFilter);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'match':
      case 'tournament':
        return Trophy;
      case 'ceremony':
        return Users;
      case 'training':
        return Calendar;
      default:
        return Calendar;
    }
  };

  const getEventTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'match':
      case 'tournament':
        return 'primary';
      case 'ceremony':
        return 'secondary';
      case 'training':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getEventGroups = (groupIds: string[]) => {
    return groups.filter(g => groupIds.includes(g.id));
  };

  const getEventCoaches = (coachIds: string[]) => {
    return coaches.filter(c => coachIds.includes(c.id));
  };

  const getRSVPStats = (rsvpList: Record<string, string>) => {
    const responses = Object.values(rsvpList);
    const yes = responses.filter(r => r === 'yes').length;
    const no = responses.filter(r => r === 'no').length;
    const maybe = responses.filter(r => r === 'maybe').length;
    const total = responses.length;
    
    return { yes, no, maybe, total };
  };

  const getRSVPIcon = (response: string) => {
    switch (response) {
      case 'yes': return CheckCircle;
      case 'no': return XCircle;
      case 'maybe': return ClockIcon;
      default: return ClockIcon;
    }
  };

  const getRSVPBadgeVariant = (response: string) => {
    switch (response) {
      case 'yes': return 'success';
      case 'no': return 'danger';
      case 'maybe': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Events & Tournaments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage academy events and competitions
          </p>
        </div>
        <Button icon={Plus} className="mt-4 sm:mt-0">
          Create Event
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by type:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Events</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Events List */}
      <div className="space-y-6">
        {filteredEvents.map((event) => {
          const EventIcon = getEventTypeIcon(event.type);
          const eventGroups = getEventGroups(event.groupIds);
          const eventCoaches = getEventCoaches(event.coachIds);
          const rsvpStats = getRSVPStats(event.rsvpList);

          return (
            <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <EventIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
                <Badge variant={getEventTypeBadgeVariant(event.type)}>
                  {event.type}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Date
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    Time
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {event.location}
                  </p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <Users className="w-4 h-4 mr-2" />
                    RSVP Status
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {rsvpStats.yes}/{rsvpStats.total} confirmed
                  </p>
                </div>
              </div>

              {/* Participating Groups */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">PARTICIPATING GROUPS</p>
                <div className="flex flex-wrap gap-2">
                  {eventGroups.map((group) => (
                    <Badge key={group.id} variant="primary" size="small">
                      {group.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Coaches */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">SUPERVISING COACHES</p>
                <div className="flex flex-wrap gap-2">
                  {eventCoaches.map((coach) => (
                    <div key={coach.id} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-1">
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {coach.firstName[0]}{coach.lastName[0]}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {coach.firstName} {coach.lastName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RSVP Details */}
              {event.rsvpRequired && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">RSVP RESPONSES</p>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {rsvpStats.yes}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Attending</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                        {rsvpStats.maybe}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Maybe</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {rsvpStats.no}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Not Attending</div>
                    </div>
                  </div>
                  
                  {/* RSVP Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-l-full transition-all duration-300"
                      style={{ width: `${(rsvpStats.yes / rsvpStats.total) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{rsvpStats.total} invited</span>
                    <span>{Math.round((rsvpStats.yes / rsvpStats.total) * 100)}% confirmed</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="small">
                    View Details
                  </Button>
                  <Button variant="ghost" size="small">
                    Manage RSVP
                  </Button>
                  <Button variant="ghost" size="small">
                    Send Reminder
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="small">
                    Edit Event
                  </Button>
                  <Button variant="ghost" size="small" className="text-red-600 hover:text-red-700">
                    Cancel Event
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <Trophy className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-sm mb-4">
              {typeFilter === 'all' 
                ? 'Start by creating your first academy event'
                : `No ${typeFilter} events scheduled`
              }
            </p>
            <Button icon={Plus}>
              Create Event
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};