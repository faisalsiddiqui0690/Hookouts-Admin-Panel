import { useEffect } from 'react';

export const useLucideIcons = () => {
  useEffect(() => {
    // Initialize Lucide icons
    if ((window as any).lucide) {
      (window as any).lucide.createIcons();
    }
    
    // Force re-initialization after content loads
    const timer = setTimeout(() => {
      if ((window as any).lucide) {
        (window as any).lucide.createIcons();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
};
