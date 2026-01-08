import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 检测是否为iOS设备
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // 检测是否已经是独立应用模式
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // 监听PWA安装提示事件
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // 延迟显示提示，避免打扰用户
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 监听应用安装事件
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // 24小时后再次显示
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // 检查是否在24小时内被关闭过
  const isDismissedRecently = () => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (!dismissed) return false;
    
    const dismissedTime = parseInt(dismissed);
    const now = Date.now();
    const hoursPassed = (now - dismissedTime) / (1000 * 60 * 60);
    
    return hoursPassed < 24;
  };

  // 如果已经是独立应用或最近被关闭过，不显示提示
  if (isStandalone || isDismissedRecently()) {
    return null;
  }

  // iOS设备显示手动安装提示
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:hidden">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Smartphone className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              安装到主屏幕
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              点击分享按钮 <span className="inline-block w-4 h-4 bg-blue-500 rounded text-white text-center text-xs leading-4">↗</span>，然后选择"添加到主屏幕"
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDismiss}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                稍后再说
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Android设备显示安装按钮
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 md:hidden">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Download className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              安装BetTogether应用
            </h3>
            <p className="text-xs text-gray-600 mb-3">
              安装到桌面，获得更好的使用体验
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-md hover:bg-primary-700 transition-colors"
              >
                立即安装
              </button>
              <button
                onClick={handleDismiss}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                稍后再说
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;
