import { useState, useEffect, useRef } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
  fallback?: string
}

/**
 * 优化的图片组件
 * - 支持懒加载
 * - 支持加载占位符
 * - 支持加载失败回退
 * - 支持 Intersection Observer
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  onLoad,
  onError,
  fallback = '/icons/icon-192x192.png'
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(loading === 'eager' ? src : null)
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      // 使用 Intersection Observer 实现懒加载
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src)
              observer.disconnect()
            }
          })
        },
        {
          rootMargin: '50px', // 提前 50px 开始加载
        }
      )

      observer.observe(imgRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [src, loading])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setImageError(true)
    setIsLoading(false)
    setImageSrc(fallback)
    onError?.()
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && imageSrc && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        ref={imgRef}
        src={imageSrc || undefined}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
    </div>
  )
}

export default OptimizedImage

