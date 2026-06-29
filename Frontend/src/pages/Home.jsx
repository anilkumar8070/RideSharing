import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Train, Plane, Bus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div className="p-4 h-full overflow-y-auto flex flex-col items-center justify-center pb-20" 
         style={{ backgroundColor: colors.bg.primary }}>
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-extrabold mb-2 flex items-center gap-2" style={{ color: colors.text.primary }}>
           <img src="/logo.png" alt="Onwego Logo" className="w-8 h-8 object-contain rounded-full" /> Onwego
        </h1>
        <p className="mb-8 font-bold" style={{ color: colors.text.secondary }}>How are you travelling?</p>

        <p className="text-sm mb-4 font-bold tracking-wide" style={{ color: colors.text.tertiary }}>
          Select your mode of transport to find co-travellers nearby.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Train */}
          <button onClick={() => navigate('/create-ride?mode=Train')} 
                  className="group p-6 rounded-2xl flex flex-col items-center justify-center border-4 transition-transform hover:scale-105" 
                  style={{ backgroundColor: colors.bg.primary, borderColor: '#7EBDF6' }}>
            <Train size={36} color="#7EBDF6" className="mb-2" />
            <span className="font-extrabold" style={{ color: colors.text.primary }}>Train</span>
            <span className="text-xs mt-1 font-bold" style={{ color: colors.text.secondary }}>Enter PNR no.</span>
          </button>
          
          {/* Flight */}
          <button onClick={() => navigate('/create-ride?mode=Flight')} 
                  className="group p-6 rounded-2xl flex flex-col items-center justify-center border-4 transition-transform hover:scale-105" 
                  style={{ backgroundColor: colors.bg.primary, borderColor: '#F99152' }}>
            <Plane size={36} color="#F99152" className="mb-2" />
            <span className="font-extrabold" style={{ color: colors.text.primary }}>Flight</span>
            <span className="text-xs mt-1 font-bold" style={{ color: colors.text.secondary }}>Enter flight no.</span>
          </button>

          {/* Bus */}
          <button onClick={() => navigate('/create-ride?mode=Bus')} 
                  className="group p-6 rounded-2xl flex flex-col items-center justify-center border-4 transition-transform hover:scale-105" 
                  style={{ backgroundColor: colors.bg.primary, borderColor: '#6ED2AE' }}>
            <Bus size={36} color="#6ED2AE" className="mb-2" />
            <span className="font-extrabold" style={{ color: colors.text.primary }}>Bus</span>
            <span className="text-xs mt-1 font-bold" style={{ color: colors.text.secondary }}>Enter route/bus no.</span>
          </button>

          {/* Already There */}
          <button onClick={() => navigate('/create-ride?mode=Already There')} 
                  className="group p-6 rounded-2xl flex flex-col items-center justify-center border-4 transition-transform hover:scale-105" 
                  style={{ backgroundColor: colors.bg.primary, borderColor: '#6ED2AE' }}>
            <MapPin size={36} color="#6ED2AE" className="mb-2" />
            <span className="font-extrabold" style={{ color: colors.text.primary }}>Already there</span>
            <span className="text-xs mt-1 font-bold text-center" style={{ color: colors.text.secondary }}>At station / airport</span>
          </button>
        </div>

        <button 
          onClick={() => navigate('/home')} 
          className="w-full py-4 mt-2 rounded-2xl font-extrabold flex justify-center items-center gap-2 border-4 transition-transform hover:scale-105"
          style={{ 
            backgroundColor: colors.primary,
            borderColor: colors.primary,
            color: colors.bg.primary
          }}
        >
          Find co-travellers →
        </button>
      </div>
    </div>
  );
};

export default Home;