/**
 * 性能监控工具
 * 用于监控和报告应用性能指标
 */

// Web Vitals 指标
export interface WebVitals {
  FCP?: number  // First Contentful Paint
  LCP?: number  // Largest Contentful Paint
  FID?: number  // First Input Delay
  CLS?: number  // Cumulative Layout Shift
  TTFB?: number // Time to First Byte
}

// 性能指标收集
export const collectPerformanceMetrics = (): WebVitals => {
  const metrics: WebVitals = {}

  if ('performance' in window && 'getEntriesByType' in performance) {
    // 获取导航时间
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      metrics.TTFB = navigation.responseStart - navigation.requestStart
    }

    // 获取绘制时间
    const paintEntries = performance.getEntriesByType('paint')
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    if (fcp) {
      metrics.FCP = fcp.startTime
    }

    // 获取 LCP（需要 PerformanceObserver）
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        metrics.LCP = lastEntry.renderTime || lastEntry.loadTime
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // PerformanceObserver 不支持
    }
  }

  return metrics
}

// 报告性能指标
export const reportPerformanceMetrics = (metrics: WebVitals) => {
  // 在开发环境打印性能指标
  if (import.meta.env.DEV) {
    console.group('📊 Performance Metrics')
    if (metrics.TTFB) console.log(`⏱️  TTFB: ${metrics.TTFB.toFixed(2)}ms`)
    if (metrics.FCP) console.log(`🎨 FCP: ${metrics.FCP.toFixed(2)}ms`)
    if (metrics.LCP) console.log(`🖼️  LCP: ${metrics.LCP.toFixed(2)}ms`)
    if (metrics.FID) console.log(`👆 FID: ${metrics.FID.toFixed(2)}ms`)
    if (metrics.CLS) console.log(`📐 CLS: ${metrics.CLS.toFixed(4)}`)
    console.groupEnd()
  }

  // 在生产环境可以发送到分析服务
  // 例如: sendToAnalytics(metrics)
}

// 监控页面加载性能
export const monitorPageLoad = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const metrics = collectPerformanceMetrics()
        reportPerformanceMetrics(metrics)
      }, 0)
    })
  }
}

// 预加载关键资源
export const preloadCriticalResources = (urls: string[]) => {
  urls.forEach(url => {
    const link = document.createElement('link')
    link.rel = 'preload'
    
    // 根据文件类型设置 as 属性
    if (url.endsWith('.js')) {
      link.as = 'script'
    } else if (url.endsWith('.css')) {
      link.as = 'style'
    } else if (url.match(/\.(jpg|jpeg|png|webp|svg)$/)) {
      link.as = 'image'
    } else if (url.match(/\.(woff|woff2|ttf|otf)$/)) {
      link.as = 'font'
      link.crossOrigin = 'anonymous'
    }
    
    link.href = url
    document.head.appendChild(link)
  })
}

// 延迟加载非关键资源
export const deferNonCriticalResources = () => {
  // 延迟加载第三方脚本
  const scripts = document.querySelectorAll('script[data-defer]')
  scripts.forEach(script => {
    const newScript = document.createElement('script')
    newScript.src = script.getAttribute('data-src') || ''
    newScript.async = true
    document.body.appendChild(newScript)
  })
}

// 检测网络连接质量
export const getNetworkQuality = (): 'slow' | 'medium' | 'fast' => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection
    const effectiveType = connection?.effectiveType
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'slow'
    } else if (effectiveType === '3g') {
      return 'medium'
    }
  }
  return 'fast'
}

// 根据网络质量调整资源加载策略
export const adaptToNetworkQuality = () => {
  const quality = getNetworkQuality()
  
  if (quality === 'slow') {
    // 慢速网络：禁用自动播放视频、减少图片质量等
    console.log('🐌 Slow network detected, optimizing...')
    return {
      imageQuality: 'low',
      autoplayVideos: false,
      prefetchLimit: 2
    }
  } else if (quality === 'medium') {
    return {
      imageQuality: 'medium',
      autoplayVideos: false,
      prefetchLimit: 5
    }
  } else {
    return {
      imageQuality: 'high',
      autoplayVideos: true,
      prefetchLimit: 10
    }
  }
}

