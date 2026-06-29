import React from 'react';
import { UserCircle2, CheckCircle, ShieldCheck, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TravelerCard = ({ match }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-4 shadow-lg text-white">
            {/* Header: User Info & Trust Badge */}
            <div className="flex justify-between items-start mb-4 border-b border-gray-700 pb-3">
                <div className="flex items-center gap-3">
                    <UserCircle2 size={40} className="text-gray-400" />
                    <div>
                        <h3 className="font-bold text-lg">{match.traveler.name || 'Traveler'}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            {match.traveler.isPhoneVerified && (
                                <span className="flex items-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                    <ShieldCheck size={12} className="mr-1" /> Phone Verified
                                </span>
                            )}
                            <span className="text-xs text-gray-400">{match.traveler.rideCount || 0} rides</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-1">Destination</span>
                    <span className="font-semibold text-primary">{match.destinationName}</span>
                </div>
            </div>

            {/* Body: Location & Fare Info */}
            <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm">
                    <Navigation size={16} className="text-blue-400 mr-2" />
                    <span className="text-gray-300">Destination difference: <strong className="text-white">{match.distanceToTheirDestination}</strong></span>
                </div>

                {/* Standout Feature: Fare Split Estimator UI */}
                <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Total Est. Fare:</span>
                        <span className="line-through text-gray-500 text-sm">{match.fareEstimation?.totalFare}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-primary">Your Split Fare:</span>
                        <span className="text-lg font-bold text-primary">{match.fareEstimation?.splitFare}</span>
                    </div>
                    <div className="mt-2 text-xs text-emerald-400 bg-emerald-400/10 p-1.5 rounded text-center">
                        Save {match.fareEstimation?.savings} by sharing!
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button 
                    onClick={() => navigate(`/chat/${match.matchRideId}`)}
                    className="flex-1 bg-primary text-secondary font-bold py-3 rounded-lg hover:bg-emerald-400 transition"
                >
                    Chat & Share
                </button>
            </div>
        </div>
    );
};

export default TravelerCard;