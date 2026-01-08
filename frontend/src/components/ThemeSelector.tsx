import React from 'react';
import { Crown, Palette, Check } from 'lucide-react';
import { useThemeStore, THEMES } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface ThemeSelectorProps {
  className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
  const { user } = useAuthStore();
  const { currentTheme, setTheme, getAvailableThemes } = useThemeStore();
  
  const isVip = user?.isVip && user?.vipExpiresAt && new Date(user.vipExpiresAt) > new Date();
  const availableThemes = getAvailableThemes(isVip || false);

  const handleThemeSelect = (themeId: string) => {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;

    if (theme.isVipOnly && !isVip) {
      toast.error('此主题需要VIP会员才能使用');
      return;
    }

    setTheme(themeId);
    toast.success(`已切换到${theme.name}`);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-lg font-semibold">
        <Palette className="w-5 h-5" />
        <span>主题选择</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {THEMES.map((theme) => {
          const isAvailable = availableThemes.some(t => t.id === theme.id);
          const isSelected = currentTheme.id === theme.id;

          return (
            <div
              key={theme.id}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50' 
                  : isAvailable 
                    ? 'border-gray-200 hover:border-gray-300 bg-white' 
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }
              `}
              onClick={() => isAvailable && handleThemeSelect(theme.id)}
            >
              {/* VIP标识 */}
              {theme.isVipOnly && (
                <div className="absolute top-2 right-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                </div>
              )}

              {/* 选中标识 */}
              {isSelected && (
                <div className="absolute top-2 left-2">
                  <Check className="w-4 h-4 text-blue-500" />
                </div>
              )}

              {/* 主题预览 */}
              <div className="mb-3">
                <div 
                  className="w-full h-16 rounded-md mb-2"
                  style={{
                    background: theme.gradient || theme.colors.primary,
                  }}
                />
                <div className="flex gap-2">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.colors.secondary }}
                  />
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.colors.accent }}
                  />
                </div>
              </div>

              {/* 主题信息 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-1">
                  {theme.name}
                  {theme.isVipOnly && !isVip && (
                    <span className="ml-2 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                      VIP
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </div>

              {/* 不可用遮罩 */}
              {!isAvailable && (
                <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Crown className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">需要VIP</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isVip && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <span className="font-medium text-yellow-800">升级VIP解锁更多主题</span>
          </div>
          <p className="text-sm text-yellow-700 mb-3">
            VIP会员可以使用所有精美的渐变主题，让你的界面更加个性化。
          </p>
          <button
            onClick={() => window.location.href = '/vip'}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            立即升级VIP
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
