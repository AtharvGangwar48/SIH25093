import React from 'react';
import { GraduationCap, Trophy, BarChart3, Shield, Users, Calendar } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      title: "Achievement Tracking",
      description: "Centralize all academic and extracurricular achievements in one verified platform."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
      title: "Dynamic Analytics",
      description: "Real-time insights and data-driven reports for institutional decision making."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-500" />,
      title: "Verified Profiles",
      description: "Faculty-approved achievements ensure authenticity and credibility."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-500" />,
      title: "Digital Portfolios",
      description: "Auto-generated professional portfolios showcasing student accomplishments."
    },
    {
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      title: "Event Management",
      description: "Track participation in events, competitions, and extracurricular activities."
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-pink-500" />,
      title: "Academic Integration",
      description: "Seamlessly integrate with academic records and institutional systems."
    }
  ];

  const roles = [
    {
      title: "Students",
      description: "Track achievements, build portfolios, and showcase your accomplishments",
      color: "from-green-400 to-blue-500"
    },
    {
      title: "Faculty",
      description: "Verify student achievements, manage events, and track student progress",
      color: "from-purple-400 to-pink-500"
    },
    {
      title: "Administrators",
      description: "Access comprehensive analytics, manage institutions, and oversee operations",
      color: "from-yellow-400 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                <GraduationCap className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Student Hub</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empower students with a comprehensive platform to track achievements, build verified portfolios, 
              and showcase their academic and extracurricular excellence.
            </p>
            
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Today
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-72 h-72 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage student achievements and institutional data in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started with Smart Student Hub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div
                key={index}
                className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${role.color} mb-6 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">{role.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{role.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Student Achievement Tracking?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of institutions already using Smart Student Hub to empower their students
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};