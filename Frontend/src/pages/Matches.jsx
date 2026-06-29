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
      <div className="p-4 h-full flex items-center justify-center transition-colors" 
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
    <div className="p-4 h-full overflow-y-auto pb-20 md:pb-0 transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Travel Buddies Found</h1>
        <p className="mb-8" style={{ color: colors.text.secondary }}>Finding people traveling on your exact route...</p>

        {matches.length === 0 ? (
          <div className="p-12 rounded-2xl border text-center" 
               style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
            <MapPin size={48} style={{ color: colors.text.tertiary }} className="mx-auto mb-4" />
            <p className="mb-4" style={{ color: colors.text.secondary }}>No matches found yet</p>
            <p className="text-sm mb-6" style={{ color: colors.text.tertiary }}>Post a ride to find co-travelers heading your way</p>
            <button
              onClick={() => navigate('/create-ride')}
              className="px-6 py-2 rounded-lg font-semibold transition"
              style={{ backgroundColor: colors.primary, color: 'white' }}
            >
              Create a Ride
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.matchRideId} className="p-6 rounded-xl border transition" 
                   style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                         style={{ backgroundColor: colors.primary, color: 'white' }}>
                      {match.traveler.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: colors.primary }}>{match.traveler.name}</h3>
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
                  <div className="p-3 rounded-lg mb-4" style={{ backgroundColor: colors.bg.tertiary }}>
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
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition font-semibold border"
                      style={{ backgroundColor: colors.bg.tertiary, color: colors.primary, borderColor: colors.primary }}
                    >
                      <MessageCircle size={18} />
                      Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAccept(match.matchRideId)}
                      disabled={match.hasAccepted}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition font-semibold border disabled:opacity-50"
                      style={{ backgroundColor: colors.bg.tertiary, color: colors.status.success, borderColor: colors.status.success }}
                    >
                      <Check size={18} />
                      {match.hasAccepted ? 'Pending...' : 'Accept'}
                    </button>
                  )}
                  <button
                    onClick={() => handleReject(match.traveler._id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition font-semibold border"
                    style={{ backgroundColor: colors.bg.tertiary, color: colors.status.error, borderColor: colors.status.error }}
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
