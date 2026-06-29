import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, PlusCircle, Users, User, Bell, Settings, HelpCircle, TrendingUp, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Layout = () => {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <div className="flex flex-col md:flex-row h-full w-full relative overflow-hidden" style={{ backgroundColor: colors.bg.secondary }}>
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden md:flex flex-col w-64 border-r shadow-xl z-20 shrink-0 overflow-y-auto sticky top-0" 
             style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
        <div className="p-6 border-b sticky top-0" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Onwego Logo" className="w-8 h-8 object-contain rounded-full" />
              <h1 className="text-2xl font-bold tracking-tighter" style={{ color: colors.primary }}>
                Onwego
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition"
              style={{ backgroundColor: colors.bg.tertiary, color: colors.primary }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-4">
          <NavLink to="/home" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors ${
            isActive ? 'text-white' : ''
          }`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <Home size={24} />
            <span className="font-semibold text-lg">Home</span>
          </NavLink>
          <NavLink to="/create-ride" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <PlusCircle size={24} />
            <span className="font-semibold text-lg">Create Ride</span>
          </NavLink>
          <NavLink to="/my-rides" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <Users size={24} />
            <span className="font-semibold text-lg">My Rides</span>
          </NavLink>
          <NavLink to="/matches" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <Users size={24} />
            <span className="font-semibold text-lg">Matches</span>
          </NavLink>
          <NavLink to="/analytics" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <TrendingUp size={24} />
            <span className="font-semibold text-lg">Analytics</span>
          </NavLink>

          {/* Divider */}
          <div className="h-px my-3" style={{ backgroundColor: colors.border }}></div>

          <NavLink to="/notifications" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <Bell size={24} />
            <span className="font-semibold text-lg">Notifications</span>
          </NavLink>
          <NavLink to="/settings" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <Settings size={24} />
            <span className="font-semibold text-lg">Settings</span>
          </NavLink>
          <NavLink to="/support" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <HelpCircle size={24} />
            <span className="font-semibold text-lg">Support</span>
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 p-3 rounded-xl transition-colors`}
          style={({isActive}) => isActive ? 
            { backgroundColor: colors.primary, color: 'white' } :
            { color: colors.text.secondary }
          }>
            <User size={24} />
            <span className="font-semibold text-lg">Profile</span>
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Top Header (hidden on desktop) */}
      <header className="md:hidden p-4 flex justify-between items-center shadow-md z-10 shrink-0 border-b" 
              style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Onwego Logo" className="w-7 h-7 object-contain rounded-full" />
          <h1 className="text-xl font-bold tracking-tighter" style={{ color: colors.primary }}>
            Onwego
          </h1>
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
      <main className="flex-1 flex flex-col w-full h-full relative overflow-y-auto pb-20 md:pb-0">
        <div className="w-full h-full">
           <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <nav className="md:hidden absolute bottom-0 w-full flex justify-around p-2 pb-4 z-20 text-xs shrink-0 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] overflow-x-auto border-t" 
           style={{ backgroundColor: colors.bg.primary, borderColor: colors.border }}>
        <NavLink to="/home" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors`}
        style={({isActive}) => isActive ? 
          { color: colors.primary } :
          { color: colors.text.secondary }
        }>
          <Home size={20} />
          <span className="text-[10px]">Home</span>
        </NavLink>
        <NavLink to="/create-ride" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors`}
        style={({isActive}) => isActive ? 
          { color: colors.primary } :
          { color: colors.text.secondary }
        }>
          <PlusCircle size={20} />
          <span className="text-[10px]">Create</span>
        </NavLink>
        <NavLink to="/my-rides" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors`}
        style={({isActive}) => isActive ? 
          { color: colors.primary } :
          { color: colors.text.secondary }
        }>
          <Users size={20} />
          <span className="text-[10px]">My Rides</span>
        </NavLink>
        <NavLink to="/matches" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors`}
        style={({isActive}) => isActive ? 
          { color: colors.primary } :
          { color: colors.text.secondary }
        }>
          <Users size={20} />
          <span className="text-[10px]">Matches</span>
        </NavLink>
        <NavLink to="/notifications" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors`}
        style={({isActive}) => isActive ? 
          { color: colors.primary } :
          { color: colors.text.secondary }
        }>
          <Bell size={20} />
          <span className="text-[10px]">Alerts</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => `flex flex-col items-center gap-1 transition-colors`}
        style={({isActive}) => isActive ? 
          { color: colors.primary } :
          { color: colors.text.secondary }
        }>
          <User size={20} />
          <span className="text-[10px]">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Layout; 
