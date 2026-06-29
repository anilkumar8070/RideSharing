import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MapPin, Clock, Users, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const MyRides = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colors } = useTheme();

  useEffect(() => {
    fetchMyRides();
  }, []);

  const fetchMyRides = async () => {
    try {
      const res = await api.get('/rides/my-rides');
      if (res.data.success) {
        setRides(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (rideId) => {
    if (window.confirm('Are you sure you want to cancel this ride?')) {
      try {
        const res = await api.patch(`/rides/${rideId}/cancel`, {
          reason: 'User cancelled'
        });
        if (res.data.success) {
          toast.success('Ride cancelled successfully');
          fetchMyRides();
        }
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to cancel ride');
      }
    }
  };

  const getStatusColor = (status) => {
    const baseStyle = { padding: '0.375rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600', border: '1px solid' };
    switch(status) {
      case 'looking': return { ...baseStyle, backgroundColor: colors.bg.tertiary, color: colors.status.info, borderColor: colors.status.info };
      case 'matched': return { ...baseStyle, backgroundColor: colors.bg.tertiary, color: colors.status.success, borderColor: colors.status.success };
      case 'in-transit': return { ...baseStyle, backgroundColor: colors.bg.tertiary, color: colors.status.warning, borderColor: colors.status.warning };
      case 'completed': return { ...baseStyle, backgroundColor: colors.bg.tertiary, color: colors.status.success, borderColor: colors.status.success };
      case 'cancelled': return { ...baseStyle, backgroundColor: colors.bg.tertiary, color: colors.status.error, borderColor: colors.status.error };
      default: return { ...baseStyle, backgroundColor: colors.bg.tertiary, color: colors.text.secondary, borderColor: colors.text.secondary };
    }
  };

  if (loading) {
    return <div className="page-shell flex items-center justify-center transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>Loading rides...</div>;
  }

  return (
    <div className="page-shell transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="page-inner max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-extrabold uppercase" style={{ color: colors.primary }}>Ride control</p>
            <h1 className="flex items-center gap-2 text-3xl font-extrabold md:text-4xl">
              <Users style={{ color: colors.primary }} size={34} />
              My Rides
            </h1>
            <p className="mt-2 font-medium" style={{ color: colors.text.secondary }}>View and manage your posted rides.</p>
          </div>
          <button onClick={() => navigate('/home')} className="primary-button">Create Ride</button>
        </div>

        {rides.length === 0 ? (
          <div className="surface rounded-2xl p-12 text-center" 
               style={{ '--surface': colors.bg.primary, '--border': colors.border, '--shadow': colors.shadow }}>
            <div className="icon-tile mx-auto mb-4 h-16 w-16" style={{ '--tile': colors.bg.tertiary, '--tile-fg': colors.primary }}>
              <Users size={32} />
            </div>
            <p className="mb-2 text-xl font-extrabold">No rides posted yet</p>
            <p className="mb-6 text-sm font-medium" style={{ color: colors.text.secondary }}>Start by choosing how you are arriving.</p>
            <button 
              onClick={() => navigate('/home')}
              className="primary-button"
            >
              Create a Ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride._id} className="soft-card" 
                   style={{ '--surface': colors.bg.primary, '--border': colors.border }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-extrabold">{ride.destinationName}</h3>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>{ride.transportMode} {ride.transportId ? `(${ride.transportId})` : ''}</p>
                  </div>
                  <span style={getStatusColor(ride.status)}>
                    {ride.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} style={{ color: colors.primary }} />
                    <div>
                      <p style={{ color: colors.text.tertiary }}>From</p>
                      <p style={{ color: colors.text.secondary }}>{ride.startLocationName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} style={{ color: colors.primary }} />
                    <div>
                      <p style={{ color: colors.text.tertiary }}>Time</p>
                      <p style={{ color: colors.text.secondary }}>{new Date(ride.timeOfArrival).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} style={{ color: colors.primary }} />
                    <div>
                      <p style={{ color: colors.text.tertiary }}>Matched</p>
                      <p style={{ color: colors.text.secondary }}>{ride.confirmedMatches.length}/{ride.capacity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} style={{ color: colors.primary }} />
                    <div>
                      <p style={{ color: colors.text.tertiary }}>Destination</p>
                      <p style={{ color: colors.text.secondary }}>{ride.destinationName}</p>
                    </div>
                  </div>
                </div>

                {ride.confirmedMatches.length > 0 && (
                  <div className="mb-4 rounded-2xl p-4" style={{ backgroundColor: colors.bg.tertiary }}>
                    <p className="text-xs mb-2" style={{ color: colors.text.tertiary }}>CO-TRAVELERS</p>
                    <div className="flex gap-2">
                      {ride.confirmedMatches.map((traveler) => (
                        <div key={traveler._id} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: colors.bg.secondary }}>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold" style={{ backgroundColor: colors.primary, color: 'white' }}>
                            {traveler.name.charAt(0)}
                          </div>
                          <span className="text-sm" style={{ color: colors.text.primary }}>{traveler.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/ride/${ride._id}`)}
                    className="ghost-button flex-1"
                    style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.primary, color: colors.primary }}
                  >
                    <Edit2 size={16} />
                    View Details
                  </button>
                  {ride.status !== 'completed' && ride.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(ride._id)}
                      className="ghost-button px-4"
                      style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.status.error, color: colors.status.error }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;
