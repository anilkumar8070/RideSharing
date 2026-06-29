import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MessageCircle, Shield, Users, Wallet, MapPin, Plane, Train } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div className="min-h-screen overflow-y-auto" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <nav className="sticky top-0 z-20 border-b backdrop-blur" style={{ borderColor: colors.border, backgroundColor: `${colors.bg.primary}ee` }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <img src="/logo.png" alt="Onwego Logo" className="h-10 w-10 rounded-xl object-contain" />
            <span className="text-xl font-extrabold">Onwego</span>
          </button>
          <div className="flex gap-3">
            <button onClick={() => navigate('/login')} className="ghost-button" style={{ '--surface-muted': colors.bg.tertiary, '--border': colors.border, color: colors.text.primary }}>
              Log in
            </button>
            <button onClick={() => navigate('/login')} className="primary-button">
              Sign up
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold" style={{ backgroundColor: colors.primaryLight, color: colors.primaryDark }}>
              <Shield size={16} />
              Verified shared travel
            </div>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-tight md:text-7xl">
              Share the ride after your trip arrives.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium md:text-xl" style={{ color: colors.text.secondary }}>
              Meet co-travelers from the same train, flight, bus, or station. Coordinate safely, split fares, and get home with less waiting.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => navigate('/login')} className="primary-button text-base">
                Find a Ride Buddy <ArrowRight size={20} />
              </button>
              <button onClick={() => navigate('/login')} className="ghost-button text-base" style={{ '--surface-muted': colors.bg.primary, '--border': colors.border, color: colors.text.primary }}>
                Create your trip
              </button>
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-2xl border" style={{ borderColor: colors.border, boxShadow: colors.shadow }}>
            <img
              src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1100"
              alt="Travelers coordinating a shared ride"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-7">
              <div className="mb-4 grid gap-3 sm:grid-cols-2">
                <RoutePill icon={Plane} text="Flight 6E-241" />
                <RoutePill icon={MapPin} text="To LPU, Phagwara" />
              </div>
              <div className="rounded-2xl bg-white/95 p-5 text-left text-[#18201f]">
                <p className="text-sm font-extrabold uppercase text-[#14b88f]">Live match</p>
                <h2 className="mt-1 text-2xl font-extrabold">3 travelers nearby</h2>
                <p className="mt-2 font-medium text-[#4b5c59]">Estimated fare drops from Rs 920 to Rs 310 each.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t py-20" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <p className="mb-2 text-sm font-extrabold uppercase" style={{ color: colors.primary }}>Why Onwego</p>
              <h2 className="text-3xl font-extrabold md:text-4xl">Designed for the messy minutes after arrival.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Feature icon={Wallet} title="Split Fares Easily" desc="Estimate shared cab costs before you commit and avoid awkward math at the curb." color={colors.primary} colors={colors} />
              <Feature icon={Shield} title="Verified Travelers" desc="Profiles, ride history, ratings, and secure chat help keep the match trustworthy." color={colors.secondary} colors={colors} />
              <Feature icon={MessageCircle} title="Coordinate Fast" desc="Use chat, quick prompts, and location sharing to agree on pickup points." color={colors.accent} colors={colors} />
            </div>
          </div>
        </section>

        <section className="border-t py-20" style={{ borderColor: colors.border }}>
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ['1', 'Enter details', 'Add train, flight, bus, or current location.'],
                ['2', 'Find matches', 'See people heading toward your area.'],
                ['3', 'Chat safely', 'Coordinate pickup and luggage needs.'],
                ['4', 'Ride & save', 'Travel together and split the cost.'],
              ].map(([number, title, desc]) => (
                <div key={number} className="soft-card" style={{ '--surface': colors.bg.primary, '--border': colors.border }}>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-extrabold text-white" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}>
                    {number}
                  </div>
                  <h3 className="text-lg font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm font-medium" style={{ color: colors.text.secondary }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const RoutePill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-extrabold text-[#18201f]">
    <Icon size={18} className="text-[#14b88f]" />
    {text}
  </div>
);

const Feature = ({ icon: Icon, title, desc, color, colors }) => (
  <div className="soft-card" style={{ '--surface': colors.bg.secondary, '--border': colors.border }}>
    <div className="icon-tile mb-5" style={{ '--tile': colors.bg.primary, '--tile-fg': color }}>
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-extrabold">{title}</h3>
    <p className="mt-3 font-medium leading-7" style={{ color: colors.text.secondary }}>{desc}</p>
  </div>
);

export default Landing;
