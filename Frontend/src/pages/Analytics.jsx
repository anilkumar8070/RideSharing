import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Star, Award, XCircle, Gem, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    return <div className="page-shell flex items-center justify-center" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>Loading...</div>;
  }

  const completionRate = stats.totalRides > 0
    ? Math.round((stats.completedRides / stats.totalRides) * 100)
    : 0;
  const trustScore = (stats.totalRatings > 0 ? (stats.averageRating / 5) * 100 : 100).toFixed(0);

  return (
    <div className="page-shell" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="page-inner">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-extrabold uppercase" style={{ color: colors.primary }}>Journey health</p>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold md:text-4xl">
              <TrendingUp style={{ color: colors.primary }} size={34} />
              Your Analytics
            </h1>
            <p className="mt-2 font-medium" style={{ color: colors.text.secondary }}>Track your Onwego journey and achievements.</p>
          </div>
          <div className="rounded-2xl px-5 py-4" style={{ backgroundColor: colors.bg.primary, border: `1px solid ${colors.border}` }}>
            <p className="text-xs font-bold uppercase" style={{ color: colors.text.tertiary }}>Trust score</p>
            <p className="text-3xl font-extrabold" style={{ color: colors.primary }}>{trustScore}%</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard icon={Users} label="Total Rides" value={stats.totalRides} hint="All rides created" color={colors.secondary} colors={colors} />
          <StatCard icon={Award} label="Completed Rides" value={stats.completedRides} hint={`Completion Rate: ${completionRate}%`} color={colors.primary} colors={colors} />
          <StatCard icon={XCircle} label="Cancelled Rides" value={stats.cancelledRides} hint="Trips not completed" color={colors.status.error} colors={colors} />
          <StatCard icon={Star} label="Average Rating" value={stats.averageRating.toFixed(1)} hint={`${stats.totalRatings} ratings`} color={colors.status.warning} colors={colors} />
          <StatCard icon={Gem} label="Loyalty Points" value={stats.loyaltyPoints} hint="Redeem for discounts" color={colors.accent} colors={colors} />
          <StatCard icon={ShieldCheck} label="Trust Score" value={`${trustScore}%`} hint="Based on your history" color={colors.primaryDark} colors={colors} />
        </div>

        <section className="surface rounded-2xl p-6" style={{ '--surface': colors.bg.primary, '--border': colors.border, '--shadow': colors.shadow }}>
          <h2 className="mb-5 text-xl font-extrabold">Performance Summary</h2>
          <Progress label="Ride Completion Rate" value={completionRate} color={colors.primary} colors={colors} />
          <Progress label="User Rating" value={(stats.averageRating / 5) * 100} text={`${stats.averageRating.toFixed(1)}/5.0`} color={colors.status.warning} colors={colors} />

          <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: colors.bg.tertiary }}>
            <p className="mb-3 text-sm font-extrabold" style={{ color: colors.text.primary }}>Tips to improve your profile</p>
            <div className="grid gap-2 text-sm font-medium md:grid-cols-2" style={{ color: colors.text.secondary }}>
              {['Complete more rides to build trust', 'Stay punctual and friendly', 'Keep your profile information fresh', 'Respond quickly to match requests'].map((tip) => (
                <div key={tip} className="flex items-center gap-2">
                  <CheckCircle2 size={16} style={{ color: colors.primary }} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, hint, color, colors }) => (
  <div className="soft-card" style={{ '--surface': colors.bg.primary, '--border': colors.border }}>
    <div className="flex justify-between gap-4">
      <div>
        <p className="text-sm font-bold" style={{ color: colors.text.tertiary }}>{label}</p>
        <p className="mt-2 text-3xl font-extrabold" style={{ color }}>{value}</p>
        <p className="mt-2 text-xs font-semibold" style={{ color: colors.text.secondary }}>{hint}</p>
      </div>
      <div className="icon-tile" style={{ '--tile': colors.bg.tertiary, '--tile-fg': color }}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Progress = ({ label, value, text, color, colors }) => (
  <div className="mb-5 last:mb-0">
    <div className="mb-2 flex justify-between text-sm font-bold">
      <span style={{ color: colors.text.secondary }}>{label}</span>
      <span style={{ color }}>{text || `${Math.round(value)}%`}</span>
    </div>
    <div className="h-3 overflow-hidden rounded-full" style={{ backgroundColor: colors.bg.tertiary }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: `linear-gradient(90deg, ${color}, ${colors.secondary})` }} />
    </div>
  </div>
);

export default Analytics;
