import { useState, useEffect } from 'react';

export default function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Verificar preferência salva no localStorage ou preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // Verificar preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Aplicar tema ao DOM quando mudar
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    console.log('Tema aplicado:', isDarkMode ? 'escuro' : 'claro');
  }, [isDarkMode]);
  
  // Alternar entre temas
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  return {
    isDarkMode,
    toggleTheme
  };
} 