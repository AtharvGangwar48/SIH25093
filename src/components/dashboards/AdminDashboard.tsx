import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Users, Building, Trophy, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalAchievements: 0,
    totalEvents: 0,
    pendingVerifications: 0
  });
  const [achievementData, setAchievementData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user statistics
      const { data: students } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'student');

      const { data: faculty } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'faculty');

      const { data: achievements } = await supabase
        .from('achievements')
        .select('id, category, verification_status');

      const { data: events } = await supabase
        .from('events')
        .select('id');

      // Calculate stats
      setStats({
        totalStudents: students?.length || 0,
        totalFaculty: faculty?.length || 0,
        totalAchievements: achievements?.length || 0,
        totalEvents: events?.length || 0,
        pendingVerifications: achievements?.filter(a => a.verification_status === 'pending').length || 0
      });

      // Prepare achievement category data for charts
      const categoryData = achievements?.reduce((acc: any, achievement) => {
        const category = achievement.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {});

      const chartData = Object.entries(categoryData || {}).map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count
      }));

      setAchievementData(chartData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200',
      change: '+12%'
    },
    {
      title: 'Faculty Members',
      value: stats.totalFaculty,
      icon: <Building className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50 border-green-200',
      change: '+3%'
    },
    {
      title: 'Total Achievements',
      value: stats.totalAchievements,
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200',
      change: '+28%'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: <Calendar className="h-6 w-6 text-red-500" />,
      color: 'bg-red-50 border-red-200',
      change: '-5%'
    }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive analytics and management tools for institutional oversight.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <div
              key={index}
              className={`p-6 bg-white rounded-xl shadow-sm border-2 ${stat.color} hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-white shadow-sm">
                  {stat.icon}
                </div>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Achievement Categories Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={achievementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Status Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievement Status Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Verified', value: stats.totalAchievements - stats.pendingVerifications },
                      { name: 'Pending', value: stats.pendingVerifications }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {[{ name: 'Verified', value: stats.totalAchievements - stats.pendingVerifications }, { name: 'Pending', value: stats.pendingVerifications }].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage students, faculty, and administrative users</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Manage Users
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart3 className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">View detailed reports and institutional analytics</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200">
              View Reports
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Building className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Institution Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure institutional settings and preferences</p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-200">
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};