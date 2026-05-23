// Advanced theme management with accent colors
export const accentColors = {
  purple: {
    primary: "#8b5cf6",
    light: "#a78bfa",
    dark: "#7c3aed",
    gradient: "from-purple-500 to-pink-500"
  },
  blue: {
    primary: "#3b82f6",
    light: "#60a5fa",
    dark: "#2563eb",
    gradient: "from-blue-500 to-cyan-500"
  },
  green: {
    primary: "#10b981",
    light: "#34d399",
    dark: "#059669",
    gradient: "from-green-500 to-emerald-500"
  },
  orange: {
    primary: "#f97316",
    light: "#fb923c",
    dark: "#ea580c",
    gradient: "from-orange-500 to-red-500"
  },
  pink: {
    primary: "#ec4899",
    light: "#f472b6",
    dark: "#db2777",
    gradient: "from-pink-500 to-rose-500"
  },
  teal: {
    primary: "#14b8a6",
    light: "#2dd4bf",
    dark: "#0d9488",
    gradient: "from-teal-500 to-cyan-500"
  }
};

export type AccentColor = keyof typeof accentColors;

export const animationSpeeds = {
  slow: { duration: 0.8, ease: "easeOut" },
  normal: { duration: 0.5, ease: "easeInOut" },
  fast: { duration: 0.3, ease: "easeIn" },
  instant: { duration: 0.15, ease: "linear" }
};

export type AnimationSpeed = keyof typeof animationSpeeds;

class ThemeManager {
  getAccentColor(): AccentColor {
    return (localStorage.getItem("accentColor") as AccentColor) || "purple";
  }

  setAccentColor(color: AccentColor) {
    localStorage.setItem("accentColor", color);
    this.applyAccentColor(color);
  }

  applyAccentColor(color: AccentColor) {
    const accent = accentColors[color];
    document.documentElement.style.setProperty("--accent-primary", accent.primary);
    document.documentElement.style.setProperty("--accent-light", accent.light);
    document.documentElement.style.setProperty("--accent-dark", accent.dark);
  }

  getAnimationSpeed(): AnimationSpeed {
    return (localStorage.getItem("animationSpeed") as AnimationSpeed) || "normal";
  }

  setAnimationSpeed(speed: AnimationSpeed) {
    localStorage.setItem("animationSpeed", speed);
  }

  getAnimationConfig() {
    const speed = this.getAnimationSpeed();
    return animationSpeeds[speed];
  }
}

export const themeManager = new ThemeManager();
