import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Star, Check, X, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rideId, setRideId] = useState(null);
  const navigate = useNavigate();
  const { colors } = useTheme();

  useEffect(() => {
    // Get the last created ride to find matches for
    fetchMyRides();
  }, []);

  const fetchMyRides = async () => {
    try {
      const res = await api.get('/rides/my-rides');
      if (res.data.success && res.data.data.length > 0) {
        const lastRide = res.data.data[0];
        setRideId(lastRide._id);
        fetchMatches(lastRide._id);
      }
    } catch (err) {
      console.error('Failed to fetch rides');
      setLoading(false);
    }
  };

  const fetchMatches = async (id) => {
    try {
      const res = await api.get(`/match/${id}`);
      if (res.data.success) {
        setMatches(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (matchRideId) => {
    try {
      const response = await api.post(`/rides/${rideId}/accept-match/${matchRideId}`);
      toast.success(response.data.message || 'Match accepted!');
      fetchMatches(rideId);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept match');
    }
  };

  const handleReject = async (userId) => {
    try {
      await api.post(`/rides/${rideId}/reject-match/${userId}`);
      toast.success('Match rejected');
      fetchMatches(rideId);
    } catch (err) {
      toast.error('Failed to reject match');
    }
  };

  const handleChat = (matchId) => {
    // Create a unique, deterministic room ID for these two rides
    const roomId = [rideId, matchId].sort().join('-');
    navigate(`/chat/${roomId}`);
  };

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center transition-colors" 
           style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" 
               style={{ borderColor: colors.border, borderTopColor: colors.primary }}></div>
          <p style={{ color: colors.text.secondary }}>Finding passengers traveling with you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="page-inner max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-sm font-extrabold uppercase" style={{ color: colors.primary }}>Potential co-travelers</p>
            <h1 className="text-3xl font-extrabold md:text-4xl">Travel Buddies Found</h1>
            <p className="mt-2 font-medium" style={{ color: colors.text.secondary }}>People traveling on your route appear here.</p>
          </div>
          <button onClick={() => navigate('/create-ride')} className="primary-button">Create Ride</button>
        </div>

        {matches.length === 0 ? (
          <div className="surface rounded-2xl p-12 text-center" 
               style={{ '--surface': colors.bg.primary, '--border': colors.border, '--shadow': colors.shadow }}>
            <div className="icon-tile mx-auto mb-4 h-16 w-16" style={{ '--tile': colors.bg.tertiary, '--tile-fg': colors.primary }}>
              <MapPin size={32} />
            </div>
            <p className="mb-2 text-xl font-extrabold">No matches found yet</p>
            <p className="mb-6 text-sm font-medium" style={{ color: colors.text.secondary }}>Post a ride to find co-travelers heading your way.</p>
            <button
              onClick={() => navigate('/create-ride')}
              className="primary-button"
            >
              Create a Ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.matchRideId} className="soft-card" 
                   style={{ '--surface': colors.bg.primary, '--border': colors.border }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-extrabold text-white"
                         style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                      {match.traveler.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold">{match.traveler.name}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Star size={16} style={{ color: colors.status.warning }} />
                        <span style={{ color: colors.text.secondary }}>{match.traveler.averageRating?.toFixed(1) || 5.0}/5.0</span>
                        <span style={{ color: colors.text.tertiary }}>({match.traveler.rideCount || 0} rides)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {['Train', 'Flight', 'Bus'].includes(match.transportMode) ? (
                    <>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin size={16} style={{ color: colors.primary }} className="mt-1 shrink-0" />
                        <div>
                          <p style={{ color: colors.text.tertiary }}>
                            {match.transportMode === 'Train' ? 'Train / PNR' : match.transportMode === 'Flight' ? 'Flight No.' : 'Bus / Route'}
                          </p>
                          <p style={{ color: colors.text.secondary }}>{match.transportId || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Clock size={16} style={{ color: colors.primary }} className="mt-1 shrink-0" />
                        <div>
                          <p style={{ color: colors.text.tertiary }}>Seat / Location</p>
                          <p style={{ color: colors.text.secondary }}>{match.coachAndSeat || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Star size={16} style={{ color: colors.primary }} className="mt-1 shrink-0" />
                        <div>
                          <p style={{ color: colors.text.tertiary }}>Interests</p>
                          <p style={{ color: colors.text.secondary }}>{match.interests?.length > 0 ? match.interests.join(', ') : 'N/A'}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin size={16} style={{ color: colors.primary }} className="mt-1 shrink-0" />
                        <div>
                          <p style={{ color: colors.text.tertiary }}>Destination</p>
                          <p style={{ color: colors.text.secondary }}>{match.destinationName}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <Clock size={16} style={{ color: colors.primary }} className="mt-1 shrink-0" />
                        <div>
                          <p style={{ color: colors.text.tertiary }}>Time</p>
                          <p style={{ color: colors.text.secondary }}>{new Date(match.timeOfArrival).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin size={16} style={{ color: colors.primary }} className="mt-1 shrink-0" />
                        <div>
                          <p style={{ color: colors.text.tertiary }}>Distance</p>
                          <p style={{ color: colors.text.secondary }}>{match.distanceToTheirDestination}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Fare Information */}
                {!['Train', 'Flight', 'Bus'].includes(match.transportMode) && (
                  <div className="mb-4 rounded-2xl p-4" style={{ backgroundColor: colors.bg.tertiary }}>
                    <p className="text-xs mb-2" style={{ color: colors.text.tertiary }}>FARE ESTIMATE</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm" style={{ color: colors.text.tertiary }}>Total Fare</p>
                        <p className="text-lg font-bold" style={{ color: colors.primary }}>{match.fareEstimation.totalFare}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm" style={{ color: colors.text.tertiary }}>Your Share</p>
                        <p className="text-lg font-bold" style={{ color: colors.status.success }}>{match.fareEstimation.splitFare}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm" style={{ color: colors.text.tertiary }}>Save</p>
                        <p className="text-lg font-bold" style={{ color: colors.status.success }}>{match.fareEstimation.savings}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {match.isMutualMatch ? (
                    <button
                      onClick={() => handleChat(match.matchRideId)}
                      className="ghost-button flex-1"
                      style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.primary, color: colors.primary }}
                    >
                      <MessageCircle size={18} />
                      Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccept(match.matchRideId)}
                      disabled={match.hasAccepted}
                      className="ghost-button flex-1 disabled:opacity-50"
                      style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.status.success, color: colors.status.success }}
                    >
                      <Check size={18} />
                      {match.hasAccepted ? 'Pending...' : 'Accept'}
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(match.traveler._id)}
                    className="ghost-button flex-1"
                    style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.status.error, color: colors.status.error }}
                  >
                    <X size={18} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches; 
