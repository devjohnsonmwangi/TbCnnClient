import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  
  // Enable debug mode for development - shows install button on localhost
  const isDevMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setIsInstallable(false);
      return;
    }

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For development: if no install prompt fires within 2 seconds on localhost, show the button anyway
    const devModeTimeout = isDevMode ? setTimeout(() => {
      if (!deferredPrompt) {
        console.log('PWA Debug Mode: Showing install button for development');
        setIsInstallable(true);
      }
    }, 2000) : null;

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (devModeTimeout) clearTimeout(devModeTimeout);
    };
  }, [isDevMode, deferredPrompt]);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      console.log('PWA Debug Mode: Install button clicked but no prompt available');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
        console.log('App installed successfully');
      } else {
        console.log('Installation dismissed by user');
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation error:', error);
    }
  }, [deferredPrompt]);

  return {
    isInstallable,
    isInstalled,
    handleInstallClick,
  };
}
