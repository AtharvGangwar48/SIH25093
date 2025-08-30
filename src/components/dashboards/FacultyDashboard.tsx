import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Calendar, Users, CheckCircle, Clock, Plus, FileText } from 'lucide-react';
import { Achievement, Event, User } from '../../types';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending achievements for verification
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select(`
          *,
          student:users!achievements_student_id_fkey(full_name, student_id)
        `)
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: false });

      // Fetch faculty events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('created_by', user?.id)
        .order('start_date', { ascending: false });

      // Fetch students from same institution
      const { data: studentsData } = await supabase
        .from('users')
        .select('*')
        .eq('institution_id', user?.institution_id)
        .eq('role', 'student')
        .eq('verification_status', 'verified')
        .order('full_name', { ascending: true });

      setPendingAchievements(achievementsData || []);
      setEvents(eventsData || []);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyAchievement = async (achievementId: string, status: 'verified' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('achievements')
        .update({
          verification_status: status,
          verified_by: user?.id
        })
        .eq('id', achievementId);

      if (!error) {
        setPendingAchievements(prev => 
          prev.filter(achievement => achievement.id !== achievementId)
        );
      }
    } catch (error) {
      console.error('Error verifying achievement:', error);
    }
  };

  const stats = [
    {
      title: 'Pending Verifications',
      value: pendingAchievements.length,
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      color: 'bg-orange-50 border-orange-200'
    },
    {
      title: 'My Events',
      value: events.length,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Active Students',
      value: students.length,
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Verifications Done',
      value: 0, // This would come from a separate query
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Faculty Dashboard
          </h1>
          <p className="text-gray-600">
            Manage events, verify student achievements, and track student progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 bg-white rounded-xl shadow-sm border-2 ${stat.color} hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="p-3 rounded-lg bg-white shadow-sm">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Verifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Verifications</h2>
            
            <div className="space-y-4">
              {pendingAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Student: {(achievement as any).student?.full_name} ({(achievement as any).student?.student_id})
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => verifyAchievement(achievement.id, 'verified')}
                      className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => verifyAchievement(achievement.id, 'rejected')}
                      className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors duration-200"
                    >
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {pendingAchievements.length === 0 && (
                <p className="text-gray-500 text-center py-8">No pending verifications.</p>
              )}
            </div>
          </div>

          {/* My Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Events</h2>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>Create Event</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(event.start_date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'published' 
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <p className="text-gray-500 text-center py-8">No events created yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};