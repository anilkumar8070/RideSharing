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

// Strict Brand Colors
const brand = {
  white: '#FEFDFD',
  mint: '#6ED2AE',
  blue: '#7EBDF6',
  orange: '#F99152',
  black: '#222222'
};

const strictColors = {
  primary: brand.mint, 
  primaryLight: brand.mint,
  primaryDark: brand.mint,
  
  secondary: brand.blue, 
  secondaryDark: brand.blue,
  
  accent: brand.orange, 
  accentLight: brand.orange,
  
  bg: {
    primary: brand.white, 
    secondary: brand.white, 
    tertiary: brand.white,
    hover: brand.white 
  },
  
  text: {
    primary: brand.black, 
    secondary: brand.black, 
    tertiary: brand.black 
  },
  
  status: {
    success: brand.mint,
    warning: brand.orange,
    error: brand.orange,
    info: brand.blue
  },
  
  border: brand.black,
  borderLight: brand.black
};

// Apply to both light and dark mode to guarantee no other colors are ever seen
const lightColors = strictColors;
const darkColors = strictColors;
