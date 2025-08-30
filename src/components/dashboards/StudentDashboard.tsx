import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Trophy, Calendar, FileText, TrendingUp, Plus, Award } from 'lucide-react';
import { Achievement, Event, Portfolio } from '../../types';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('institution_id', user?.institution_id)
        .eq('status', 'published')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5);

      // Fetch portfolio
      const { data: portfolioData } = await supabase
        .from('portfolios')
        .select('*')
        .eq('student_id', user?.id)
        .single();

      setAchievements(achievementsData || []);
      setEvents(eventsData || []);
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Achievements',
      value: achievements.length,
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Verified Achievements',
      value: achievements.filter(a => a.verification_status === 'verified').length,
      icon: <Award className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: 'Total Points',
      value: achievements.reduce((sum, a) => sum + a.points, 0),
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Upcoming Events',
      value: events.length,
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
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
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-gray-600">
            Track your achievements, explore events, and build your professional portfolio.
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
          {/* Recent Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="space-y-4">
              {achievements.slice(0, 5).map((achievement) => (
                <div
                  key={achievement.id}
                  className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">{achievement.category}</span>
                        <span className="text-xs font-medium text-blue-600">{achievement.points} points</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      achievement.verification_status === 'verified' 
                        ? 'bg-green-100 text-green-800'
                        : achievement.verification_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {achievement.verification_status}
                    </span>
                  </div>
                </div>
              ))}
              
              {achievements.length === 0 && (
                <p className="text-gray-500 text-center py-8">No achievements yet. Start adding your accomplishments!</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Events</h2>
            
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors duration-200"
                >
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {new Date(event.start_date).toLocaleDateString()}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                      Register
                    </button>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <p className="text-gray-500 text-center py-8">No upcoming events available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Digital Portfolio</h2>
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              <FileText className="h-4 w-4" />
              <span>{portfolio ? 'Update Portfolio' : 'Generate Portfolio'}</span>
            </button>
          </div>

          {portfolio ? (
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{portfolio.title}</h3>
              <p className="text-gray-600 mb-4">{portfolio.description}</p>
              <div className="flex items-center space-x-6">
                <span className="text-sm text-gray-600">
                  <strong>Total Points:</strong> {portfolio.total_points}
                </span>
                <span className="text-sm text-gray-600">
                  <strong>Last Updated:</strong> {new Date(portfolio.updated_at).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  portfolio.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {portfolio.is_public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Portfolio Yet</h3>
              <p className="text-gray-600 mb-6">Create your digital portfolio to showcase your achievements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};