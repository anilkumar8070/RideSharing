import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowRight, Bus, MapPin, Plane, Route, Sparkles, Train, Users } from 'lucide-react';

const createRideSchema = z.object({
  transportMode: z.enum(['Train', 'Flight', 'Bus', 'Already There']),
  transportId: z.string().optional(),
  startLocationName: z.string().min(2, 'Boarding Station is required').optional(),
  destinationName: z.string().min(2, 'Destination is required'),
  coachAndSeat: z.string().optional(),
  interests: z.string().optional(),
});

const modeConfig = {
  Train: { icon: Train, colorKey: 'secondary', label: 'Train', idLabel: 'PNR Number / Train No.', idPlaceholder: '12903 or 8492028341', seatPlaceholder: 'B2, Seat 45' },
  Flight: { icon: Plane, colorKey: 'accent', label: 'Flight', idLabel: 'Flight Number', idPlaceholder: '6E-241', seatPlaceholder: 'Seat 12A' },
  Bus: { icon: Bus, colorKey: 'primary', label: 'Bus', idLabel: 'Bus Route / Number', idPlaceholder: 'HR-55, Volvo-92', seatPlaceholder: 'Seat 4' },
  'Already There': { icon: MapPin, colorKey: 'primaryDark', label: 'Already there', idLabel: '', idPlaceholder: '', seatPlaceholder: 'Gate 3, platform 2, exit B' },
};

const CreateRide = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const mode = searchParams.get('mode') || 'Train';
  const config = modeConfig[mode] || modeConfig.Train;
  const Icon = config.icon;
  const accent = colors[config.colorKey] || colors.primary;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createRideSchema),
    defaultValues: { transportMode: mode },
  });

  const onSubmit = async (data) => {
    try {
      const mockPayload = {
        transportMode: data.transportMode,
        transportId: data.transportId,
        startLocationName: data.startLocationName || 'Station/Airport',
        startCoordinates: [75.0, 31.0],
        destinationName: data.destinationName,
        destinationCoordinates: [75.5, 31.2],
        timeOfArrival: new Date().toISOString(),
        coachAndSeat: data.coachAndSeat,
        interests: data.interests ? data.interests.split(',').map((i) => i.trim()) : [],
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

  return (
    <div className="page-shell" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="page-inner max-w-5xl">
        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_320px]">
          <section className="rounded-2xl p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${colors.bg.primary}, ${colors.primaryLight})`, border: `1px solid ${colors.border}` }}>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${colors.secondary})` }}>
              <Icon size={30} />
            </div>
            <p className="mb-2 text-sm font-extrabold uppercase" style={{ color: accent }}>Create ride</p>
            <h1 className="text-3xl font-extrabold md:text-5xl">Enter details for {config.label}</h1>
            <p className="mt-3 max-w-2xl font-medium" style={{ color: colors.text.secondary }}>
              The cleaner your trip details are, the better Onwego can match you with people heading the same way.
            </p>
          </section>

          <aside className="soft-card" style={{ '--surface': colors.bg.primary, '--border': colors.border }}>
            <Sparkles size={24} style={{ color: colors.accent }} />
            <h2 className="mt-3 text-lg font-extrabold">Matching tips</h2>
            <div className="mt-4 space-y-3 text-sm font-medium" style={{ color: colors.text.secondary }}>
              <p>Add the exact station or gate where possible.</p>
              <p>Use destination names people would recognize locally.</p>
              <p>Interests help break the ice once you match.</p>
            </div>
          </aside>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="surface rounded-2xl p-5 md:p-7" style={{ '--surface': colors.bg.primary, '--border': colors.border, '--shadow': colors.shadow }}>
          <input type="hidden" {...register('transportMode')} value={mode} />

          <div className="grid gap-5 md:grid-cols-2">
            {mode !== 'Already There' && (
              <Field label={config.idLabel} error={errors.transportId} colors={colors}>
                <input type="text" placeholder={config.idPlaceholder} className="field" {...register('transportId')} />
              </Field>
            )}

            <Field label="Boarding Station / Origin" error={errors.startLocationName} colors={colors} icon={Route}>
              <input type="text" placeholder="New Delhi Railway Station" className="field" {...register('startLocationName')} />
            </Field>

            <Field label="Destination Name" error={errors.destinationName} colors={colors} icon={MapPin}>
              <input type="text" placeholder="LPU, Phagwara" className="field" {...register('destinationName')} />
            </Field>

            <Field label="Seat / Location" error={errors.coachAndSeat} colors={colors}>
              <input type="text" placeholder={config.seatPlaceholder} className="field" {...register('coachAndSeat')} />
            </Field>

            <Field label="Interests / Tags" error={errors.interests} colors={colors} icon={Users} className="md:col-span-2">
              <input type="text" placeholder="Tech, Music, Gaming" className="field" {...register('interests')} />
            </Field>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={() => navigate('/home')} className="ghost-button" style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.border, color: colors.text.primary }}>
              Change mode
            </button>
            <button type="submit" disabled={isSubmitting} className="primary-button min-w-48">
              {isSubmitting ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : (
                <>
                  List Ride & Match <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Field = ({ label, error, children, colors, icon: Icon, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-2 flex items-center gap-2 text-sm font-bold" style={{ color: colors.text.secondary }}>
      {Icon && <Icon size={16} style={{ color: colors.primary }} />}
      {label}
    </span>
    {children}
    {error && <span className="mt-1 block text-xs font-semibold" style={{ color: colors.status.error }}>{error.message}</span>}
  </label>
);

export default CreateRide;
