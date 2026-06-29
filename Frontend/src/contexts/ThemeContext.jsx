import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check local storage
    const saved = localStorage.getItem('theme-mode');
    if (saved) return saved === 'dark';
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
    // Update document class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? darkColors : lightColors
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

const brand = {
  mint: '#14b88f',
  blue: '#2563eb',
  orange: '#f97316',
  ink: '#18201f',
  white: '#ffffff'
};

const lightColors = {
  primary: brand.mint, 
  primaryLight: '#d9f8ee',
  primaryDark: '#087d62',
  
  secondary: brand.blue, 
  secondaryDark: '#1d4ed8',
  
  accent: brand.orange, 
  accentLight: '#ffedd5',
  
  bg: {
    primary: '#ffffff', 
    secondary: '#f5f8f7', 
    tertiary: '#eef5f2',
    hover: '#e7f8f1'
  },
  
  text: {
    primary: brand.ink, 
    secondary: '#4b5c59', 
    tertiary: '#7b8d89'
  },
  
  status: {
    success: brand.mint,
    warning: brand.orange,
    error: brand.orange,
    info: brand.blue
  },
  
  border: '#d7e4df',
  borderLight: '#eef5f2',
  shadow: '0 18px 50px rgba(24, 32, 31, 0.10)'
};

const darkColors = {
  primary: '#4fd9b2',
  primaryLight: '#123a31',
  primaryDark: '#9bf1d4',
  secondary: '#7ebdf6',
  secondaryDark: '#bfdbfe',
  accent: '#fb923c',
  accentLight: '#431f0b',
  bg: {
    primary: '#111817',
    secondary: '#091110',
    tertiary: '#172321',
    hover: '#1d302c'
  },
  text: {
    primary: '#f6fffc',
    secondary: '#c0d1cc',
    tertiary: '#81938e'
  },
  status: {
    success: '#4fd9b2',
    warning: '#fb923c',
    error: '#fb7185',
    info: '#7ebdf6'
  },
  border: '#263a36',
  borderLight: '#1b2b28',
  shadow: '0 18px 50px rgba(0, 0, 0, 0.38)'
};
