import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import es from './locales/es.json'
import ja from './locales/ja.json'

// 支持的语言
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
]

// 默认语言
export const DEFAULT_LANGUAGE = 'en'

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 传递 i18n 实例给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      ja: { translation: ja },
    },
    fallbackLng: DEFAULT_LANGUAGE,
    debug: false,
    
    interpolation: {
      escapeValue: false, // React 已经安全处理
    },

    detection: {
      // 语言检测顺序
      order: ['localStorage', 'navigator'],
      // 缓存用户语言选择
      caches: ['localStorage'],
      // localStorage 键名
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n

