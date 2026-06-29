import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, Award } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const Analytics = () => {
  const [stats, setStats] = useState({
    completedRides: 0,
    cancelledRides: 0,
    totalRides: 0,
    averageRating: 0,
    totalRatings: 0,
    loyaltyPoints: 0
  });
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/users/me/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 h-full flex items-center justify-center transition-colors" 
           style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>Loading...</div>;
  }

  const completionRate = stats.totalRides > 0 
    ? Math.round((stats.completedRides / stats.totalRides) * 100)
    : 0;

  return (
    <div className="p-4 h-full overflow-y-auto pb-20 md:pb-0 transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp style={{ color: colors.primary }} size={32} />
          Your Analytics
        </h1>
        <p className="mb-8" style={{ color: colors.text.secondary }}>Track your Onwego journey and achievements</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Total Rides */}
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-700/10 p-6 rounded-xl border border-blue-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Total Rides</p>
                <p className="text-3xl font-bold text-blue-300 mt-2">{stats.totalRides}</p>
              </div>
              <Users className="text-blue-400" size={32} />
            </div>
          </div>

          {/* Completed Rides */}
          <div className="bg-gradient-to-br from-green-900/30 to-green-700/10 p-6 rounded-xl border border-green-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Completed Rides</p>
                <p className="text-3xl font-bold text-green-300 mt-2">{stats.completedRides}</p>
                <p className="text-xs text-green-400 mt-2">Completion Rate: {completionRate}%</p>
              </div>
              <Award className="text-green-400" size={32} />
            </div>
          </div>

          {/* Cancelled Rides */}
          <div className="bg-gradient-to-br from-red-900/30 to-red-700/10 p-6 rounded-xl border border-red-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Cancelled Rides</p>
                <p className="text-3xl font-bold text-red-300 mt-2">{stats.cancelledRides}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">✕</span>
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-700/10 p-6 rounded-xl border border-yellow-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Average Rating</p>
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-3xl font-bold text-yellow-300">{stats.averageRating.toFixed(1)}</p>
                  <span className="text-xs text-gray-400">/ 5.0</span>
                </div>
                <p className="text-xs text-yellow-400 mt-2">({stats.totalRatings} ratings)</p>
              </div>
              <Star className="text-yellow-400" size={32} />
            </div>
          </div>

          {/* Loyalty Points */}
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-700/10 p-6 rounded-xl border border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Loyalty Points</p>
                <p className="text-3xl font-bold text-purple-300 mt-2">{stats.loyaltyPoints}</p>
                <p className="text-xs text-purple-400 mt-2">Redeem for discounts</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">💎</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-700/10 p-6 rounded-xl border border-emerald-500/20">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Trust Score</p>
                <p className="text-3xl font-bold text-emerald-300 mt-2">
                  {((stats.totalRatings > 0 ? (stats.averageRating / 5) * 100 : 100)).toFixed(0)}%
                </p>
                <p className="text-xs text-emerald-400 mt-2">Based on your history</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-4">Performance Summary</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Ride Completion Rate</span>
                <span className="text-primary font-semibold">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-emerald-500 h-full transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">User Rating</span>
                <span className="text-primary font-semibold">{stats.averageRating.toFixed(1)}/5.0</span>
              </div>
              <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-full transition-all"
                  style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-3">💡 Tips to improve your profile:</p>
            <ul className="text-sm text-gray-300 space-y-2">
              <li>✓ Complete more rides to build trust</li>
              <li>✓ Maintain a high rating by being punctual and friendly</li>
              <li>✓ Update your profile information regularly</li>
              <li>✓ Respond quickly to match requests</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
