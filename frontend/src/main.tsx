import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import App from './App.tsx'
import './index.css'
import './i18n' // 引入 i18n 配置
import { useThemeStore } from './stores/themeStore'
import { monitorPageLoad } from './utils/performance'

// 初始化主题
useThemeStore.getState().setTheme(useThemeStore.getState().currentTheme.id)

// 启动性能监控
monitorPageLoad()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5分钟内数据视为新鲜
      cacheTime: 10 * 60 * 1000, // 缓存保留10分钟
    },
  },
})

// 将queryClient设置为全局变量，供积分刷新Hook使用
;(window as any).queryClient = queryClient

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
