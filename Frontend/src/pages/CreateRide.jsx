import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { MapPin, Train as TrainIcon, Plane, Bus as BusIcon, Route } from 'lucide-react';

const createRideSchema = z.object({
  transportMode: z.enum(['Train', 'Flight', 'Bus', 'Already There']),
  transportId: z.string().optional(),
  startLocationName: z.string().min(2, 'Boarding Station is required').optional(),
  destinationName: z.string().min(2, 'Destination is required'),
  coachAndSeat: z.string().optional(),
  interests: z.string().optional(),
});

const CreateRide = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const mode = searchParams.get('mode') || 'Train';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createRideSchema),
    defaultValues: {
      transportMode: mode,
    },
  });

  const onSubmit = async (data) => {
    try {
      // Mocking start and destination coordinates for this template UI upgrade
      // In a real app we would use Google Maps Autocomplete or similar to grab coordinates
      const mockPayload = {
        transportMode: data.transportMode,
        transportId: data.transportId,
        startLocationName: data.startLocationName || 'Station/Airport',
        startCoordinates: [75.0, 31.0], // Mock lng lat
        destinationName: data.destinationName,
        destinationCoordinates: [75.5, 31.2], // Mock lng lat
        timeOfArrival: new Date().toISOString(), // Mock current time
        coachAndSeat: data.coachAndSeat,
        interests: data.interests ? data.interests.split(',').map(i => i.trim()) : [],
      };

      const res = await api.post('/rides', mockPayload);

      if (res.data.success) {
         toast.success('Your travel plan is live!');
         navigate('/matches');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to list ride');
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'Train': return <TrainIcon size={40} style={{ color: colors.primary }} className="mb-2" />;
      case 'Flight': return <Plane size={40} style={{ color: colors.primary }} className="mb-2" />;
      case 'Bus': return <BusIcon size={40} style={{ color: colors.accent }} className="mb-2" />;
      default: return <MapPin size={40} style={{ color: colors.accent }} className="mb-2" />;
    }
  };

  // Helper component for error display
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <span className="text-red-400 text-xs mt-1 ml-1 block text-left">{error.message}</span>;
  };

  return (
    <div className="p-4 h-full overflow-y-auto flex flex-col items-center transition-colors pb-20"
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      
      <div className="mt-8 p-6 rounded-2xl border w-full max-w-sm shadow-xl flex flex-col items-center"
           style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
         {getIcon()}
         <h1 className="text-2xl font-bold mb-1">Enter Details for {mode}</h1>
         <p className="text-sm mb-8 text-center" style={{ color: colors.text.secondary }}>Post your upcoming arrival details, and we'll notify co-travelers headed your way.</p>
         
         <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5">
           
           {/* Hidden field for mode */}
           <input type="hidden" {...register('transportMode')} value={mode} />

           {mode === 'Train' && (
             <div>
               <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color: colors.text.tertiary }}>PNR Number / Train No.</label>
               <input 
                 type="text" 
                 placeholder="e.g. 12903 or 8492028341" 
                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                 style={{
                   backgroundColor: colors.bg.tertiary,
                   borderColor: errors.transportId ? '#EF4444' : colors.border,
                   color: colors.text.primary
                 }}
                 {...register('transportId')}
               />
               <ErrorMessage error={errors.transportId} />
             </div>
           )}
           
           {mode === 'Flight' && (
             <div>
               <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color: colors.text.tertiary }}>Flight Number</label>
               <input 
                 type="text" 
                 placeholder="e.g. 6E-241" 
                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                 style={{
                   backgroundColor: colors.bg.tertiary,
                   borderColor: errors.transportId ? '#EF4444' : colors.border,
                   color: colors.text.primary
                 }}
                 {...register('transportId')}
               />
               <ErrorMessage error={errors.transportId} />
             </div>
           )}

           {mode === 'Bus' && (
             <div>
               <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color: colors.text.tertiary }}>Bus Route / Number</label>
               <input 
                 type="text" 
                 placeholder="e.g. HR-55, Volve-92" 
                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                 style={{
                   backgroundColor: colors.bg.tertiary,
                   borderColor: errors.transportId ? '#EF4444' : colors.border,
                   color: colors.text.primary
                 }}
                 {...register('transportId')}
               />
               <ErrorMessage error={errors.transportId} />
             </div>
           )}

           <div>
              <label className="text-xs uppercase tracking-wider mb-1 block flex items-center gap-1" style={{ color: colors.text.tertiary }}>
                <Route size={14}/> Boarding Station / Origin
              </label>
              <input 
                type="text" 
                placeholder="e.g. New Delhi Railway Station" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                style={{
                  backgroundColor: colors.bg.tertiary,
                  borderColor: errors.startLocationName ? '#EF4444' : colors.border,
                  color: colors.text.primary
                }}
                {...register('startLocationName')}
              />
              <ErrorMessage error={errors.startLocationName} />
           </div>

           <div>
              <label className="text-xs uppercase tracking-wider mb-1 block flex items-center gap-1" style={{ color: colors.text.tertiary }}>
                <Route size={14}/> Destination Name
              </label>
              <input 
                type="text" 
                placeholder="e.g. LPU, Phagwara" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                style={{
                  backgroundColor: colors.bg.tertiary,
                  borderColor: errors.destinationName ? '#EF4444' : colors.border,
                  color: colors.text.primary
                }}
                {...register('destinationName')}
              />
              <ErrorMessage error={errors.destinationName} />
           </div>

           {['Train', 'Flight', 'Bus', 'Already there'].includes(mode) && (
             <div>
                <label className="text-xs uppercase tracking-wider mb-1 block flex items-center gap-1" style={{ color: colors.text.tertiary }}>
                  Seat / Location (Optional)
                </label>
                <input 
                  type="text" 
                  placeholder={mode === 'Train' ? "e.g. B2, Seat 45" : mode === 'Flight' ? "e.g. Seat 12A" : "e.g. Seat 4"} 
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                  style={{
                    backgroundColor: colors.bg.tertiary,
                    borderColor: errors.coachAndSeat ? '#EF4444' : colors.border,
                    color: colors.text.primary
                  }}
                  {...register('coachAndSeat')}
                />
                <ErrorMessage error={errors.coachAndSeat} />
             </div>
           )}

           <div>
              <label className="text-xs uppercase tracking-wider mb-1 block flex items-center gap-1" style={{ color: colors.text.tertiary }}>
                Interests/Tags (Optional, comma separated)
              </label>
              <input 
                type="text" 
                placeholder="e.g. Tech, Music, Gaming" 
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                style={{
                  backgroundColor: colors.bg.tertiary,
                  borderColor: errors.interests ? '#EF4444' : colors.border,
                  color: colors.text.primary
                }}
                {...register('interests')}
              />
              <ErrorMessage error={errors.interests} />
           </div>

           <button 
             type="submit" 
             disabled={isSubmitting}
             className="text-lg font-bold py-3 mt-4 rounded-lg transition disabled:opacity-70 flex justify-center items-center h-14"
             style={{ 
               backgroundColor: colors.primary,
               color: 'white'
             }}
           >
              {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               ) : (
                  'List Ride & Match'
               )}
           </button>
         </form>
      </div>
    </div>
  );
};

export default CreateRide; 
