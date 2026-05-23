// Haptic feedback utilities for web
export const haptics = {
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },

  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 20, 30]);
    }
  },

  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 25, 50]);
    }
  },

  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 15, 30, 15, 30]);
    }
  }
};
