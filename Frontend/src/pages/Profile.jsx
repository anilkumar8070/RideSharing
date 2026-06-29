import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, LogOut, Star, Award, Settings, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => { 
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colors } = useTheme();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        toast.error('User not found. Please login again.');
        navigate('/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch reviews
      try {
        const res = await api.get(`/reviews/user/${parsedUser._id}`);
        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        // Don't fail the entire profile if reviews fail
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      toast.error('Failed to load profile. Please try again.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="p-4 h-full flex items-center justify-center" 
           style={{ backgroundColor: colors.bg.secondary }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" 
               style={{ borderColor: colors.primary }}></div>
          <p style={{ color: colors.text.secondary }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 h-full flex items-center justify-center" 
           style={{ backgroundColor: colors.bg.secondary }}>
        <div className="text-center">
          <p className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>
            No user data found
          </p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl font-semibold"
            style={{ backgroundColor: colors.primary, color: 'white' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="page-inner max-w-5xl">
        {/* Profile Header */}
        <div className="surface rounded-2xl p-6 mb-6" 
             style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-extrabold" 
                   style={{ backgroundColor: colors.primary, color: 'white' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold" style={{ color: colors.primary }}>{user.name}</h1>
                <p style={{ color: colors.text.secondary }}>Member since 2026</p>
                {user.averageRating && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <Star size={16} style={{ color: colors.status.warning }} fill="currentColor" />
                      <span className="text-sm font-semibold">{user.averageRating.toFixed(1)}/5.0</span>
                    </div>
                    <span className="text-xs" style={{ color: colors.text.tertiary }}>({user.totalRatings} ratings)</span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl transition"
              style={{ backgroundColor: colors.bg.tertiary, color: colors.primary }}
            >
              <Edit2 size={18} />
              Edit Profile
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-xl text-center" style={{ backgroundColor: colors.bg.tertiary }}>
              <p className="text-2xl font-extrabold" style={{ color: colors.primary }}>{user.rideCount || 0}</p>
              <p className="text-xs" style={{ color: colors.text.tertiary }}>Total Rides</p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ backgroundColor: colors.bg.tertiary }}>
              <p className="text-2xl font-extrabold" style={{ color: colors.status.success }}>{user.completedRides || 0}</p>
              <p className="text-xs" style={{ color: colors.text.tertiary }}>Completed</p>
            </div>
            <div className="p-3 rounded-xl text-center" style={{ backgroundColor: colors.bg.tertiary }}>
              <p className="text-2xl font-extrabold" style={{ color: colors.status.info }}>{user.loyaltyPoints || 0}</p>
              <p className="text-xs" style={{ color: colors.text.tertiary }}>Points</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="soft-card mb-6" 
             style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
          <h2 className="text-xl font-extrabold mb-4" style={{ color: colors.text.primary }}>Personal Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl border" 
                 style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
              <div style={{ color: colors.primary }}><User size={20} /></div>
              <div>
                <p className="text-xs uppercase font-bold" style={{ color: colors.text.tertiary }}>Full Name</p>
                <p style={{ color: colors.text.secondary }}>{user.name}</p>
              </div>
            </div>

            {user.email && (
              <div className="flex items-center gap-4 p-4 rounded-xl border" 
                   style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
                <div style={{ color: colors.primary }}><Mail size={20} /></div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: colors.text.tertiary }}>Email Address</p>
                  <p style={{ color: colors.text.secondary }}>{user.email}</p>
                </div>
              </div>
            )}

            {user.phone && (
              <div className="flex items-center gap-4 p-4 rounded-xl border" 
                   style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
                <div style={{ color: colors.primary }}><Phone size={20} /></div>
                <div>
                  <p className="text-xs uppercase font-bold" style={{ color: colors.text.tertiary }}>Phone Number</p>
                  <p style={{ color: colors.text.secondary }}>{user.phone}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 p-4 rounded-xl border" 
                 style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
              <div style={{ color: colors.primary }}><MapPin size={20} /></div>
              <div>
                <p className="text-xs uppercase font-bold" style={{ color: colors.text.tertiary }}>Home Address</p>
                <p style={{ color: colors.text.secondary }}>{user.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="soft-card mb-6" 
               style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2" style={{ color: colors.text.primary }}>
              <Star size={24} style={{ color: colors.status.warning }} />
              Reviews & Ratings
            </h2>
            
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 rounded-xl border" 
                     style={{ backgroundColor: colors.bg.tertiary, borderColor: colors.border }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: colors.text.primary }}>{review.title}</p>
                      <p className="text-sm" style={{ color: colors.text.secondary }}>by {review.riderFrom.name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          style={{ color: i < review.rating ? colors.status.warning : colors.border }}
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>{review.comment}</p>
                  <p className="text-xs mt-2" style={{ color: colors.text.tertiary }}>{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate('/analytics')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition font-semibold"
            style={{ backgroundColor: colors.bg.tertiary, color: colors.primary, borderColor: colors.primary }}
          >
            <Award size={20} />
            View Analytics
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition font-semibold"
            style={{ backgroundColor: colors.bg.tertiary, color: colors.text.primary, borderColor: colors.border, border: '1px solid' }}
          >
            <Settings size={20} />
            Settings
          </button>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition font-semibold"
          style={{ backgroundColor: colors.bg.tertiary, color: colors.status.error, borderColor: colors.status.error }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  ); 
};
export default Profile;
