import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Train, Plane, Bus, ShieldCheck, WalletCards } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div className="page-shell" style={{ backgroundColor: colors.bg.secondary }}>
      <div className="page-inner max-w-5xl">
        <section className="mb-6 rounded-2xl p-6 md:p-8" style={{ background: `linear-gradient(135deg, ${colors.primaryLight}, ${colors.bg.primary})`, border: `1px solid ${colors.border}` }}>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-extrabold uppercase" style={{ color: colors.primary }}>Ready to match</p>
            <h1 className="text-3xl font-extrabold md:text-5xl" style={{ color: colors.text.primary }}>How are you travelling today?</h1>
            <p className="mt-3 max-w-xl font-medium" style={{ color: colors.text.secondary }}>
              Pick your arrival mode and Onwego will surface people heading toward the same destination.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: colors.bg.primary }}>
              <ShieldCheck size={20} style={{ color: colors.primary }} />
              <span className="text-sm font-bold" style={{ color: colors.text.secondary }}>Verified traveler profiles</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ backgroundColor: colors.bg.primary }}>
              <WalletCards size={20} style={{ color: colors.accent }} />
              <span className="text-sm font-bold" style={{ color: colors.text.secondary }}>Split fares with confidence</span>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <TravelMode icon={Train} title="Train" subtitle="Enter PNR or train number" color={colors.secondary} onClick={() => navigate('/create-ride?mode=Train')} colors={colors} />
          <TravelMode icon={Plane} title="Flight" subtitle="Match from arrival airport" color={colors.accent} onClick={() => navigate('/create-ride?mode=Flight')} colors={colors} />
          <TravelMode icon={Bus} title="Bus" subtitle="Use route or bus number" color={colors.primary} onClick={() => navigate('/create-ride?mode=Bus')} colors={colors} />
          <TravelMode icon={MapPin} title="Already there" subtitle="At station, airport, or stand" color={colors.primaryDark} onClick={() => navigate('/create-ride?mode=Already There')} colors={colors} />
        </div>
      </div>
    </div>
  );
};

const TravelMode = ({ icon: Icon, title, subtitle, color, onClick, colors }) => (
  <button onClick={onClick} className="soft-card group flex items-center justify-between text-left hover:-translate-y-1"
    style={{ '--surface': colors.bg.primary, '--border': colors.border }}>
    <div className="flex items-center gap-4">
      <div className="icon-tile h-14 w-14" style={{ '--tile': colors.bg.tertiary, '--tile-fg': color }}>
        <Icon size={28} />
      </div>
      <div>
        <h2 className="text-xl font-extrabold" style={{ color: colors.text.primary }}>{title}</h2>
        <p className="text-sm font-semibold" style={{ color: colors.text.secondary }}>{subtitle}</p>
      </div>
    </div>
    <ArrowRight className="transition group-hover:translate-x-1" size={22} style={{ color }} />
  </button>
);

export default Home;
