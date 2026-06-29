import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Shield, Users, Wallet, ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();

  return (
    <div className="min-h-screen font-sans overflow-y-auto" style={{ backgroundColor: colors.bg.primary, color: colors.text.primary }}>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 lg:px-20 border-b-2" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
        <div className="flex items-center gap-2 text-2xl font-bold">
          <img src="/logo.png" alt="Onwego Logo" className="w-10 h-10 object-contain rounded-full" />
          <span style={{ color: colors.text.primary }}>Onwego</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-5 py-2 font-bold transition-all border-2 rounded-full"
            style={{ borderColor: colors.primary, color: colors.primary, backgroundColor: colors.bg.primary }}
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 font-bold rounded-full transition-all"
            style={{ backgroundColor: colors.primary, color: colors.bg.primary }}
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-20 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              Never Travel <br/> <span style={{ color: colors.primary }}>Solo</span> Again.
            </h1>
            <p className="text-lg lg:text-xl mb-10 font-medium" style={{ color: colors.text.secondary }}>
              Connect with verified solo travelers heading your way. Split fares, make friends, and travel safer together from airports, stations, or anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-4 font-bold rounded-full flex items-center justify-center gap-2 transition-all border-2"
                style={{ backgroundColor: colors.primary, color: colors.bg.primary, borderColor: colors.primary }}
              >
                Find a Ride Buddy <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border-4" style={{ borderColor: colors.border }}>
              <img 
                src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800" 
                alt="Travelers in a cab" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 flex items-end p-8" style={{ backgroundColor: '#FEFDFD', opacity: 0.85 }}>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1.5 rounded-full text-sm font-bold border-2" style={{ borderColor: colors.secondary, color: colors.secondary }}>
                      JFK Airport
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-sm font-bold border-2" style={{ borderColor: colors.secondary, color: colors.secondary }}>
                      To Downtown
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold" style={{ color: colors.text.primary }}>Split cab fare & saved!</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 border-t-2" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4" style={{ color: colors.text.primary }}>Why use Onwego?</h2>
            <p className="text-lg font-medium" style={{ color: colors.text.secondary }}>
              We've built the perfect platform to make shared commuting seamless, safe, and cost-effective.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Wallet size={32} color="#FEFDFD" />}
              title="Split Fares Easily"
              desc="Save up to 60% on expensive airport cabs and intercity rides by sharing the cost with fellow travelers."
              colors={colors}
              bgColor="#6ED2AE"
            />
            <FeatureCard 
              icon={<Shield size={32} color="#FEFDFD" />}
              title="Verified Travelers"
              desc="Travel with peace of mind. Our community relies on verified profiles, ratings, and reviews to build trust."
              colors={colors}
              bgColor="#7EBDF6"
            />
            <FeatureCard 
              icon={<MessageCircle size={32} color="#FEFDFD" />}
              title="Real-time Chat"
              desc="Instantly connect with your matched ride buddy to coordinate meeting points securely within the app."
              colors={colors}
              bgColor="#F99152"
            />
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 border-t-2" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-16" style={{ color: colors.text.primary }}>How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Step number="1" title="Enter Details" desc="Tell us where you are and where you're heading." colors={colors} bgColor="#6ED2AE" />
            <Step number="2" title="Find a Match" desc="Our algorithm finds travelers with the same route." colors={colors} bgColor="#7EBDF6" />
            <Step number="3" title="Connect" desc="Chat and coordinate your meeting point." colors={colors} bgColor="#F99152" />
            <Step number="4" title="Ride & Save" desc="Travel together and split the fare seamlessly." colors={colors} bgColor="#6ED2AE" />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-8 text-center border-t-2" style={{ borderColor: colors.border, backgroundColor: colors.bg.primary, color: colors.text.primary }}>
        <p className="font-bold">&copy; {new Date().getFullYear()} Onwego. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, colors, bgColor }) => (
  <div className="p-8 rounded-3xl border-4" style={{ backgroundColor: colors.bg.primary, borderColor: bgColor }}>
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: bgColor }}>
      {icon}
    </div>
    <h3 className="text-xl font-extrabold mb-3" style={{ color: colors.text.primary }}>{title}</h3>
    <p className="font-medium" style={{ color: colors.text.secondary, lineHeight: '1.6' }}>{desc}</p>
  </div>
);

const Step = ({ number, title, desc, colors, bgColor }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4"
         style={{ backgroundColor: bgColor, color: colors.bg.primary, borderColor: bgColor }}>
      {number}
    </div>
    <h4 className="text-lg font-extrabold mb-2" style={{ color: colors.text.primary }}>{title}</h4>
    <p className="text-sm font-medium" style={{ color: colors.text.secondary }}>{desc}</p>
  </div>
);

export default Landing;
