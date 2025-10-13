import React, { createContext, useContext, useState } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  applyRoleTheme: () => void;
  resetToLightTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<Theme>('light');

  // 始终应用浅色主题
  const applyTheme = () => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  };

  // 所有用户都使用浅色主题
  const applyRoleTheme = () => {
    applyTheme();
  };

  // 重置为浅色主题（兼容原有代码）
  const resetToLightTheme = () => {
    applyTheme();
  };

  const handleSetTheme = () => {
    applyTheme();
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, applyRoleTheme, resetToLightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
