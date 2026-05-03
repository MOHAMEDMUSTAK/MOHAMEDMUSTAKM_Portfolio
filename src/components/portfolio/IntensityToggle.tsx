import { useState, useEffect, createContext, useContext } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

type Intensity = 'normal' | 'light';

const IntensityContext = createContext<{ intensity: Intensity; toggle: () => void }>({
  intensity: 'normal',
  toggle: () => {},
});

export const useIntensity = () => useContext(IntensityContext);

export function IntensityProvider({ children }: { children: React.ReactNode }) {
  const [intensity, setIntensity] = useState<Intensity>('normal');

  useEffect(() => {
    document.documentElement.setAttribute('data-intensity', intensity);
  }, [intensity]);

  const toggle = () => setIntensity(prev => prev === 'normal' ? 'light' : 'normal');

  return (
    <IntensityContext.Provider value={{ intensity, toggle }}>
      {children}
    </IntensityContext.Provider>
  );
}

export default function IntensityToggle() {
  const { intensity, toggle } = useIntensity();

  return (
    <motion.button
      onClick={toggle}
      className="fixed bottom-6 right-24 z-50 w-10 h-10 rounded-full flex items-center justify-center border border-border/30 transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={intensity === 'normal' ? 'Switch to light intensity' : 'Switch to normal intensity'}
      title={intensity === 'normal' ? 'Light mode' : 'Dark mode'}
    >
      {intensity === 'normal' ? (
        <Sun className="w-4 h-4 text-muted-foreground" />
      ) : (
        <Moon className="w-4 h-4 text-primary" />
      )}
    </motion.button>
  );
}
