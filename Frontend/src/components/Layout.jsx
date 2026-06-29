import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, PlusCircle, Users, User, Bell, Settings, HelpCircle, TrendingUp, Moon, Sun, CarFront } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const navItems = [
    { to: '/home', icon: Home, label: 'Home' },
    { to: '/create-ride', icon: PlusCircle, label: 'Create Ride', mobile: 'Create' },
    { to: '/my-rides', icon: CarFront, label: 'My Rides', mobile: 'Rides' },
    { to: '/matches', icon: Users, label: 'Matches' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics', mobile: 'Stats' },
    { to: '/notifications', icon: Bell, label: 'Notifications', mobile: 'Alerts' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];
  const sideItems = [
    ...navItems.slice(0, 5),
    { divider: true },
    ...navItems.slice(5),
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/support', icon: HelpCircle, label: 'Support' },
  ];
  const cssVars = {
    '--surface': colors.bg.primary,
    '--surface-muted': colors.bg.tertiary,
    '--border': colors.border,
    '--shadow': colors.shadow,
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden md:flex-row" style={{ ...cssVars, backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden w-72 shrink-0 flex-col overflow-y-auto border-r md:flex" 
             style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
        <div className="sticky top-0 border-b p-5 backdrop-blur" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Onwego Logo" className="h-10 w-10 rounded-xl object-contain" />
              <div>
                <h1 className="text-xl font-extrabold" style={{ color: colors.text.primary }}>Onwego</h1>
                <p className="text-xs font-semibold" style={{ color: colors.text.tertiary }}>Shared rides, calmer trips</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2 transition hover:scale-105"
              style={{ backgroundColor: colors.bg.tertiary, color: colors.primary }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-4">
          {sideItems.map((item, index) => {
            if (item.divider) return <div key={index} className="my-3 h-px" style={{ backgroundColor: colors.border }} />;
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className="flex items-center gap-3 rounded-xl p-3 font-bold transition"
                style={({isActive}) => isActive ?
                  { background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, color: 'white', boxShadow: '0 12px 28px rgba(20, 184, 143, 0.22)' } :
                  { color: colors.text.secondary }
                }>
                <Icon size={22} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Top Header (hidden on desktop) */}
      <header className="z-10 flex shrink-0 items-center justify-between border-b p-4 md:hidden" 
              style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Onwego Logo" className="h-9 w-9 rounded-xl object-contain" />
          <h1 className="text-xl font-extrabold" style={{ color: colors.text.primary }}>Onwego</h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition"
          style={{ backgroundColor: colors.bg.tertiary, color: colors.primary }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
        <div className="w-full h-full">
           <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <nav className="absolute bottom-0 z-20 flex w-full shrink-0 justify-around overflow-x-auto border-t p-2 pb-4 text-xs shadow-[0_-14px_35px_rgba(24,32,31,0.10)] md:hidden" 
           style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
        {navItems.slice(0, 6).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.to} to={item.to} className="flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 font-semibold transition"
              style={({isActive}) => isActive ? { color: colors.primary, backgroundColor: colors.bg.tertiary } : { color: colors.text.secondary }}>
              <Icon size={20} />
              <span className="text-[10px]">{item.mobile || item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout; 
