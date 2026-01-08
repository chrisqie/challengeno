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

interface Country {
  code: string
  name: string
  flag: string
}

interface LocationSelectorProps {
  onLocationChange: (location: LocationInfo | null, maxDistance: number, enableFilter: boolean) => void
  className?: string
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ 
  onLocationChange, 
  className = '' 
}) => {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null)
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [maxDistance, setMaxDistance] = useState<number>(300)
  const [enableLocationFilter, setEnableLocationFilter] = useState<boolean>(false)
  const [isDetecting, setIsDetecting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 获取当前位置和国家列表
  useEffect(() => {
    const initializeLocation = async () => {
      setIsLoading(true)
      
      try {
        // 并行获取当前位置和国家列表
        const [locationResponse, countriesResponse] = await Promise.all([
          fetch('/api/location/current'),
          fetch('/api/location/countries')
        ])

        // 处理当前位置
        if (locationResponse.ok) {
          const locationResult = await locationResponse.json()
          if (locationResult.success && locationResult.data) {
            setCurrentLocation(locationResult.data)
            setSelectedCountry(locationResult.data.country_code)
          }
        }

        // 处理国家列表
        if (countriesResponse.ok) {
          const countriesResult = await countriesResponse.json()
          if (countriesResult.success) {
            setCountries(countriesResult.data)
          } else {
            // 如果API失败，使用本地国家列表
            setCountries(getLocalCountryList())
          }
        } else {
          // 使用本地国家列表作为备用
          setCountries(getLocalCountryList())
        }

      } catch (error) {
        console.error('Failed to initialize location:', error)
        toast.error('获取位置信息失败')
        // 即使出错也要设置备用国家列表
        setCountries(getLocalCountryList())
      } finally {
        setIsLoading(false)
      }
    }

    initializeLocation()
  }, [])

  // 本地国家列表（备用）
  const getLocalCountryList = (): Country[] => {
    return [
      { code: 'CN', name: '中国', flag: '🇨🇳' },
      { code: 'US', name: '美国', flag: '🇺🇸' },
      { code: 'JP', name: '日本', flag: '🇯🇵' },
      { code: 'KR', name: '韩国', flag: '🇰🇷' },
      { code: 'GB', name: '英国', flag: '🇬🇧' },
      { code: 'FR', name: '法国', flag: '🇫🇷' },
      { code: 'DE', name: '德国', flag: '🇩🇪' },
      { code: 'IT', name: '意大利', flag: '🇮🇹' },
      { code: 'ES', name: '西班牙', flag: '🇪🇸' },
      { code: 'RU', name: '俄罗斯', flag: '🇷🇺' },
      { code: 'IN', name: '印度', flag: '🇮🇳' },
      { code: 'BR', name: '巴西', flag: '🇧🇷' },
      { code: 'CA', name: '加拿大', flag: '🇨🇦' },
      { code: 'AU', name: '澳大利亚', flag: '🇦🇺' },
      { code: 'MX', name: '墨西哥', flag: '🇲🇽' },
      { code: 'TH', name: '泰国', flag: '🇹🇭' },
      { code: 'VN', name: '越南', flag: '🇻🇳' },
      { code: 'SG', name: '新加坡', flag: '🇸🇬' },
      { code: 'MY', name: '马来西亚', flag: '🇲🇾' },
      { code: 'ID', name: '印度尼西亚', flag: '🇮🇩' },
      { code: 'PH', name: '菲律宾', flag: '🇵🇭' },
      { code: 'TW', name: '台湾', flag: '🇹🇼' },
      { code: 'HK', name: '香港', flag: '🇭🇰' },
      { code: 'MO', name: '澳门', flag: '🇲🇴' }
    ]
  }

  // 当设置改变时通知父组件
  useEffect(() => {
    onLocationChange(currentLocation, maxDistance, enableLocationFilter)
  }, [currentLocation, maxDistance, enableLocationFilter, onLocationChange])

  // 重新检测位置
  const detectLocation = async () => {
    setIsDetecting(true)
    
    try {
      const response = await fetch('/api/location/current')
      const result = await response.json()
      
      if (result.success && result.data) {
        setCurrentLocation(result.data)
        setSelectedCountry(result.data.country_code)
        toast.success('位置检测成功')
      } else {
        toast.error('位置检测失败')
      }
    } catch (error) {
      console.error('Location detection failed:', error)
      toast.error('位置检测失败')
    } finally {
      setIsDetecting(false)
    }
  }

  // 手动选择国家
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    
    const selectedCountryInfo = countries.find(c => c.code === countryCode)
    if (selectedCountryInfo) {
      // 创建一个基于选择国家的位置信息
      const manualLocation: LocationInfo = {
        ip: currentLocation?.ip || '',
        city: '',
        region: '',
        country: countryCode,
        country_name: selectedCountryInfo.name,
        country_code: countryCode,
        latitude: 0,
        longitude: 0,
        timezone: currentLocation?.timezone || '',
      }
      setCurrentLocation(manualLocation)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="animate-spin mr-2" size={16} />
        <span className="text-sm text-gray-600">正在获取位置信息...</span>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 标题 */}
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <MapPin size={16} />
        <span>地理位置设置</span>
      </div>

      {/* 当前位置显示 */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe size={16} className="text-blue-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {currentLocation ? (
                  <>
                    {countries.find(c => c.code === currentLocation.country_code)?.flag || '🌍'} 
                    {' '}
                    {currentLocation.country_name}
                    {currentLocation.city && `, ${currentLocation.city}`}
                  </>
                ) : (
                  '位置未知'
                )}
              </div>
              <div className="text-xs text-gray-500">
                {currentLocation?.ip && `IP: ${currentLocation.ip}`}
              </div>
            </div>
          </div>
          
          <button
            onClick={detectLocation}
            disabled={isDetecting}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {isDetecting ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              '重新检测'
            )}
          </button>
        </div>
      </div>

      {/* 手动选择国家 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          手动选择国家/地区
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">请选择国家/地区</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* 地理过滤开关 */}
      <div className="border-t pt-4">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={enableLocationFilter}
            onChange={(e) => setEnableLocationFilter(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            仅显示附近的挑战
          </span>
        </label>
        
        {enableLocationFilter && (
          <div className="mt-3 ml-6">
            <label className="block text-sm text-gray-600 mb-2">
              最大距离：{maxDistance} 公里
            </label>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50km</span>
              <span>500km</span>
              <span>1000km</span>
            </div>
          </div>
        )}
      </div>

      {/* 说明文字 */}
      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
        💡 默认不限制距离，以便找到更多挑战伙伴。启用地理过滤后，只显示指定范围内的挑战。
      </div>
    </div>
  )
}

export default LocationSelector
