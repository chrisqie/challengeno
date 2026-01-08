import { useState, useEffect } from 'react'
import { MapPin, Globe, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface LocationInfo {
  ip: string
  city: string
  region: string
  country: string
  country_name: string
  country_code: string
  latitude: number
  longitude: number
  timezone: string
}

interface LocationDisplayProps {
  className?: string
  showDetails?: boolean
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
  className = '', 
  showDetails = false 
}) => {
  const [location, setLocation] = useState<LocationInfo | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/location/current')
        const result = await response.json()

        if (result.success && result.data) {
          setLocation(result.data)
        } else {
          setError('无法获取位置信息')
        }
      } catch (err) {
        console.error('Location fetch error:', err)
        setError('位置检测失败')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()
  }, [])

  const getCountryFlag = (countryCode: string): string => {
    const flagMap: Record<string, string> = {
      'CN': '🇨🇳', 'US': '🇺🇸', 'JP': '🇯🇵', 'KR': '🇰🇷', 'GB': '🇬🇧',
      'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹', 'ES': '🇪🇸', 'RU': '🇷🇺',
      'IN': '🇮🇳', 'BR': '🇧🇷', 'CA': '🇨🇦', 'AU': '🇦🇺', 'MX': '🇲🇽',
      'TH': '🇹🇭', 'VN': '🇻🇳', 'SG': '🇸🇬', 'MY': '🇲🇾', 'ID': '🇮🇩',
      'PH': '🇵🇭', 'TW': '🇹🇼', 'HK': '🇭🇰', 'MO': '🇲🇴',
      // 添加更多国家支持
      'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹', 'SE': '🇸🇪',
      'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'PL': '🇵🇱', 'CZ': '🇨🇿',
      'HU': '🇭🇺', 'RO': '🇷🇴', 'BG': '🇧🇬', 'GR': '🇬🇷', 'PT': '🇵🇹',
      'IE': '🇮🇪', 'IS': '🇮🇸', 'LU': '🇱🇺', 'MT': '🇲🇹', 'CY': '🇨🇾',
      'EE': '🇪🇪', 'LV': '🇱🇻', 'LT': '🇱🇹', 'SI': '🇸🇮', 'SK': '🇸🇰',
      'HR': '🇭🇷', 'BA': '🇧🇦', 'RS': '🇷🇸', 'ME': '🇲🇪', 'MK': '🇲🇰',
      'AL': '🇦🇱', 'XK': '🇽🇰', 'MD': '🇲🇩', 'UA': '🇺🇦', 'BY': '🇧🇾'
    }
    return flagMap[countryCode?.toUpperCase()] || '🌍'
  }

  const formatLocationText = (): string => {
    if (!location) return '未知位置'
    
    const parts = []
    if (location.city) parts.push(location.city)
    if (location.region && location.region !== location.city) {
      parts.push(location.region)
    }
    if (location.country_name) parts.push(location.country_name)
    
    return parts.join(', ') || '未知位置'
  }

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        <Loader2 className="animate-spin" size={16} />
        <span className="text-sm">检测位置中...</span>
      </div>
    )
  }

  if (error || !location) {
    return (
      <div className={`flex items-center space-x-2 text-gray-400 ${className}`}>
        <Globe size={16} />
        <span className="text-sm">{error || '位置未知'}</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <MapPin size={16} className="text-blue-500" />
      <div className="flex items-center space-x-1">
        <span className="text-lg">
          {getCountryFlag(location.country_code)}
        </span>
        <span className="text-sm text-gray-700">
          {formatLocationText()}
        </span>
      </div>
      
      {showDetails && (
        <div className="ml-2 text-xs text-gray-500">
          <div>IP: {location.ip}</div>
          <div>时区: {location.timezone}</div>
          <div>坐标: {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}</div>
        </div>
      )}
    </div>
  )
}

export default LocationDisplay
