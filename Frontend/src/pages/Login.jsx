import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useTheme } from '../contexts/ThemeContext';
import { ArrowLeft, LockKeyhole, Moon, ShieldCheck, Sun, Users, WalletCards } from 'lucide-react';

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
    reset();
  };

  const onSubmit = async (data) => {
    try {
      const isEmail = data.identifier.includes('@');
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { identifier: data.identifier, password: data.password }
        : {
            name: data.name,
            address: data.address,
            email: isEmail ? data.identifier : undefined,
            phone: !isEmail ? data.identifier : undefined,
            password: data.password,
          };

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

  return (
    <div className="min-h-screen overflow-y-auto px-4 py-6" style={{ backgroundColor: colors.bg.secondary, color: colors.text.primary }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button onClick={() => navigate('/')} className="ghost-button" style={{ '--surface-muted': colors.bg.primary, '--border': colors.border, color: colors.text.primary }}>
          <ArrowLeft size={18} /> Back
        </button>
        <button onClick={toggleTheme} className="rounded-xl p-3 transition hover:scale-105" style={{ backgroundColor: colors.bg.primary, color: colors.primary }}>
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      <main className="mx-auto grid min-h-[calc(100vh-96px)] max-w-6xl items-center gap-8 py-8 lg:grid-cols-[1fr_430px]">
        <section className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold" style={{ backgroundColor: colors.primaryLight, color: colors.primaryDark }}>
            <ShieldCheck size={16} />
            Secure traveler network
          </div>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-tight">Get matched before the cab queue gets crowded.</h1>
          <p className="mt-5 max-w-xl text-lg font-medium" style={{ color: colors.text.secondary }}>
            Save trip details, find nearby travelers, and coordinate the final ride home from one clean dashboard.
          </p>
          <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
            <Benefit icon={Users} title="Community" text="Match with travelers from your route." colors={colors} />
            <Benefit icon={WalletCards} title="Savings" text="Split fares without awkward settling." colors={colors} />
          </div>
        </section>

        <section className="surface rounded-2xl p-6 md:p-8" style={{ '--surface': colors.bg.primary, '--border': colors.border, '--shadow': colors.shadow }}>
          <div className="mb-7 text-center">
            <img src="/logo.png" alt="Onwego Logo" className="mx-auto mb-3 h-14 w-14 rounded-2xl object-contain" />
            <h1 className="text-3xl font-extrabold">Onwego</h1>
            <p className="mt-2 text-sm font-medium" style={{ color: colors.text.secondary }}>
              {isLogin ? 'Welcome back. Your next match is waiting.' : 'Create your traveler profile in a minute.'}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl p-1" style={{ backgroundColor: colors.bg.tertiary }}>
            <button type="button" onClick={() => switchMode(true)} className="rounded-lg py-2 font-extrabold transition"
              style={{ backgroundColor: isLogin ? colors.bg.primary : 'transparent', color: isLogin ? colors.primary : colors.text.secondary }}>
              Login
            </button>
            <button type="button" onClick={() => switchMode(false)} className="rounded-lg py-2 font-extrabold transition"
              style={{ backgroundColor: !isLogin ? colors.bg.primary : 'transparent', color: !isLogin ? colors.primary : colors.text.secondary }}>
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {!isLogin && (
              <>
                <Field label="Full name" error={errors.name} colors={colors}>
                  <input type="text" placeholder="Rahul Sharma" autoComplete="name" className="field" {...register('name')} />
                </Field>
                <Field label="Address" error={errors.address} colors={colors}>
                  <input type="text" placeholder="Your home address" autoComplete="street-address" className="field" {...register('address')} />
                </Field>
              </>
            )}

            <Field label="Phone or email" error={errors.identifier} colors={colors}>
              <input type="text" placeholder="you@example.com" autoComplete="username" className="field" {...register('identifier')} />
            </Field>

            <Field label="Password" error={errors.password} colors={colors}>
              <input type="password" placeholder="Minimum 6 characters" autoComplete={isLogin ? 'current-password' : 'new-password'} className="field" {...register('password')} />
            </Field>

            <button type="submit" disabled={isSubmitting} className="primary-button mt-2 h-14 text-lg">
              {isSubmitting ? <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" /> : (
                <>
                  <LockKeyhole size={20} />
                  {isLogin ? 'Secure Login' : 'Create Account'}
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

const Field = ({ label, error, children, colors }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold" style={{ color: colors.text.secondary }}>{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs font-semibold" style={{ color: colors.status.error }}>{error.message}</span>}
  </label>
);

const Benefit = ({ icon: Icon, title, text, colors }) => (
  <div className="soft-card" style={{ '--surface': colors.bg.primary, '--border': colors.border }}>
    <div className="icon-tile mb-4" style={{ '--tile': colors.bg.tertiary, '--tile-fg': colors.primary }}>
      <Icon size={22} />
    </div>
    <h3 className="font-extrabold">{title}</h3>
    <p className="mt-1 text-sm font-medium" style={{ color: colors.text.secondary }}>{text}</p>
  </div>
);

export default Login;
