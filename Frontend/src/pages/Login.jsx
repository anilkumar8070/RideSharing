import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

// Define validation schemas matching our backend Zod schemas
const loginSchema = z.object({
  identifier: z.string().min(3, 'Email or Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  identifier: z.string().min(3, 'Email or Phone is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { isDark, toggleTheme, colors } = useTheme();

  // Using react-hook-form with dynamic schema based on login vs register
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const switchMode = (mode) => {
    setIsLogin(mode);
    reset(); // clear form errors and values on switch
  };

  const onSubmit = async (data) => {
    try {
      const isEmail = data.identifier.includes('@');
      let endpoint = isLogin ? '/auth/login' : '/auth/register';
      let payload;

      if (isLogin) {
        payload = {
          identifier: data.identifier,
          password: data.password,
        };
      } else {
        payload = {
          name: data.name,
          address: data.address,
          email: isEmail ? data.identifier : undefined,
          phone: !isEmail ? data.identifier : undefined,
          password: data.password,
        };
      }

      // use the configured axios instance
      const res = await api.post(endpoint, payload);

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        toast.success(`Welcome to Onwego${!isLogin ? ', ' + data.name : ''}!`);
        navigate('/home');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Authentication Failed';
      toast.error(errMsg);
    }
  };

  // Helper component for error display
  const ErrorMessage = ({ error }) => {
    if (!error) return null;
    return <span className="text-red-400 text-xs mt-1 ml-1 block text-left">{error.message}</span>;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 overflow-y-auto pb-20 transition-colors" 
         style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-full transition"
        style={{ backgroundColor: colors.bg.tertiary, color: colors.primary }}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <h1 className="text-4xl font-bold mb-2 tracking-tighter" style={{ color: colors.primary }}>Onwego</h1>
      <p className="mb-8 text-center text-sm" style={{ color: colors.text.secondary }}>Find co-travelers and split your cab fare!</p>

      <div className="flex gap-2 mb-8 p-1 rounded-lg" style={{ backgroundColor: colors.bg.tertiary }}>
        <button
          type="button"
          onClick={() => switchMode(true)}
          className={`px-8 py-2 rounded-md font-semibold transition`}
          style={{
            backgroundColor: isLogin ? colors.primary : 'transparent',
            color: isLogin ? 'white' : colors.text.secondary
          }}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => switchMode(false)}
          className={`px-8 py-2 rounded-md font-semibold transition`}
          style={{
            backgroundColor: !isLogin ? colors.primary : 'transparent',
            color: !isLogin ? 'white' : colors.text.secondary
          }}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm flex flex-col gap-4">
        {!isLogin && (
          <>
            <div>
              <input
                type="text"
                placeholder="Your Name (e.g. Rahul)"
                autoComplete="name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                style={{
                  backgroundColor: colors.bg.primary,
                  borderColor: errors.name ? '#EF4444' : colors.border,
                  color: colors.text.primary
                }}
                {...register('name')}
              />
              <ErrorMessage error={errors.name} />
            </div>
            <div>
              <input
                type="text"
                placeholder="Address"
                autoComplete="street-address"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
                style={{
                  backgroundColor: colors.bg.primary,
                  borderColor: errors.address ? '#EF4444' : colors.border,
                  color: colors.text.primary
                }}
                {...register('address')}
              />
              <ErrorMessage error={errors.address} />
            </div>
          </>
        )}

        <div>
          <input
            type="text"
            placeholder="Phone Number or Email"
            autoComplete="username"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
            style={{
              backgroundColor: colors.bg.primary,
              borderColor: errors.identifier ? '#EF4444' : colors.border,
              color: colors.text.primary
            }}
            {...register('identifier')}
          />
          <ErrorMessage error={errors.identifier} />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 transition"
            style={{
              backgroundColor: colors.bg.primary,
              borderColor: errors.password ? '#EF4444' : colors.border,
              color: colors.text.primary
            }}
            {...register('password')}
          />
          <ErrorMessage error={errors.password} />
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
          ) : isLogin ? (
            'Secure Login'
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default Login; 
