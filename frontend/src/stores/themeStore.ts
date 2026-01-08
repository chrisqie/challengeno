import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Theme {
  id: string;
  name: string;
  description: string;
  isVipOnly: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  gradient?: string;
  cardStyle: 'default' | 'premium' | 'elegant' | 'modern';
}

export const THEMES: Theme[] = [
  {
    id: 'light',
    name: '浅色模式',
    description: '经典浅色主题',
    isVipOnly: false,
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
    cardStyle: 'default',
  },
  {
    id: 'dark',
    name: '深色模式',
    description: '护眼深色主题',
    isVipOnly: false,
    colors: {
      primary: '#60A5FA',
      secondary: '#3B82F6',
      accent: '#93C5FD',
      background: '#1E293B',
      surface: '#334155',
      text: '#F1F5F9',
    },
    cardStyle: 'default',
  },
  {
    id: 'gradient-blue',
    name: '蓝色渐变',
    description: 'VIP专属蓝色渐变主题',
    isVipOnly: true,
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      background: '#F0F4FF',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardStyle: 'premium',
  },
  {
    id: 'gradient-purple',
    name: '紫色渐变',
    description: 'VIP专属紫色渐变主题',
    isVipOnly: true,
    colors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    cardStyle: 'elegant',
  },
  {
    id: 'gradient-green',
    name: '绿色渐变',
    description: 'VIP专属绿色渐变主题',
    isVipOnly: true,
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#1F2937',
    },
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    cardStyle: 'modern',
  },
];

interface ThemeState {
  currentTheme: Theme;
  isDarkMode: boolean;
  followSystem: boolean;
  setTheme: (themeId: string) => void;
  toggleDarkMode: () => void;
  setFollowSystem: (follow: boolean) => void;
  getAvailableThemes: (isVip: boolean) => Theme[];
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: THEMES[0], // 默认浅色主题
      isDarkMode: false,
      followSystem: false,

      setTheme: (themeId: string) => {
        const theme = THEMES.find(t => t.id === themeId);
        if (theme) {
          set({
            currentTheme: theme,
            isDarkMode: theme.id === 'dark'
          });
          // 应用主题到CSS变量
          applyThemeToCSS(theme);
        }
      },

      toggleDarkMode: () => {
        const { isDarkMode } = get();
        const newTheme = isDarkMode ? THEMES.find(t => t.id === 'light') : THEMES.find(t => t.id === 'dark');
        if (newTheme) {
          console.log('🌓 切换主题:', {
            from: isDarkMode ? 'dark' : 'light',
            to: newTheme.id,
            newIsDarkMode: !isDarkMode
          });
          set({
            currentTheme: newTheme,
            isDarkMode: !isDarkMode,
            followSystem: false // 手动切换时取消跟随系统
          });
          applyThemeToCSS(newTheme);
        }
      },

      setFollowSystem: (follow: boolean) => {
        set({ followSystem: follow });
        if (follow) {
          // 检测系统主题
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = prefersDark ? THEMES.find(t => t.id === 'dark') : THEMES.find(t => t.id === 'light');
          if (theme) {
            set({
              currentTheme: theme,
              isDarkMode: prefersDark
            });
            applyThemeToCSS(theme);
          }
        }
      },

      getAvailableThemes: (isVip: boolean) => {
        return THEMES.filter(theme => !theme.isVipOnly || isVip);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.currentTheme) {
          // 确保isDarkMode状态与currentTheme一致
          const isDark = state.currentTheme.id === 'dark';
          if (state.isDarkMode !== isDark) {
            useThemeStore.setState({ isDarkMode: isDark });
          }
          applyThemeToCSS(state.currentTheme);
        }
        // 如果跟随系统,监听系统主题变化
        if (state?.followSystem) {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = (e: MediaQueryListEvent) => {
            const theme = e.matches ? THEMES.find(t => t.id === 'dark') : THEMES.find(t => t.id === 'light');
            if (theme) {
              useThemeStore.setState({
                currentTheme: theme,
                isDarkMode: e.matches
              });
              applyThemeToCSS(theme);
            }
          };
          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }
  )
);

// 应用主题到CSS变量
function applyThemeToCSS(theme: Theme) {
  const root = document.documentElement;

  console.log('🎨 应用主题到CSS:', {
    themeId: theme.id,
    themeName: theme.name,
    colors: theme.colors
  });

  // 设置主题属性(用于CSS选择器)
  root.setAttribute('data-theme', theme.id === 'dark' ? 'dark' : 'light');

  // 添加或移除dark class (用于Tailwind dark模式)
  if (theme.id === 'dark') {
    root.classList.add('dark');
    console.log('✅ 添加了 dark class');
  } else {
    root.classList.remove('dark');
    console.log('✅ 移除了 dark class');
  }

  // 设置CSS变量
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-surface', theme.colors.surface);
  root.style.setProperty('--color-text', theme.colors.text);

  if (theme.gradient) {
    root.style.setProperty('--gradient-primary', theme.gradient);
  }

  // 设置卡片样式类
  root.setAttribute('data-card-style', theme.cardStyle);

  console.log('✅ CSS变量已设置');
}
