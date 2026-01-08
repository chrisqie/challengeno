import { useState, useEffect } from 'react'
import { MapPin, Globe, RefreshCw, Info } from 'lucide-react'
import LocationDisplay from '../components/LocationDisplay'
import LocationSelector from '../components/LocationSelector'
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
  currency?: string
  languages?: string
}

const LocationTestPage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | null>(null)
  const [countries, setCountries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const fetchLocationData = async () => {
    setIsLoading(true)
    try {
      const [locationRes, countriesRes] = await Promise.all([
        fetch('/api/location/current'),
        fetch('/api/location/countries')
      ])

      const locationData = await locationRes.json()
      const countriesData = await countriesRes.json()

      if (locationData.success) {
        setCurrentLocation(locationData.data)
      }

      if (countriesData.success) {
        setCountries(countriesData.data)
      }

      toast.success('位置信息更新成功')
    } catch (error) {
      console.error('Failed to fetch location data:', error)
      toast.error('获取位置信息失败')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLocationData()
  }, [])

  const handleLocationChange = (location: LocationInfo | null, maxDistance: number, enableFilter: boolean) => {
    console.log('Location changed:', { location, maxDistance, enableFilter })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            地理位置功能测试
          </h1>
          <p className="text-gray-600">
            测试IP地理定位API和位置显示组件
          </p>
        </div>

        {/* 当前位置显示 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <Globe className="mr-2" size={20} />
              当前位置信息
            </h2>
            <button
              onClick={fetchLocationData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className={isLoading ? 'animate-spin' : ''} size={16} />
              <span>刷新</span>
            </button>
          </div>

          {/* 简单位置显示 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">简单显示：</h3>
            <LocationDisplay />
          </div>

          {/* 详细位置显示 */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">详细显示：</h3>
            <LocationDisplay showDetails={true} />
          </div>

          {/* 原始数据 */}
          {currentLocation && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">原始API数据：</h3>
              <div className="bg-gray-100 rounded-md p-4 text-sm">
                <pre className="whitespace-pre-wrap text-gray-800">
                  {JSON.stringify(currentLocation, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 国家列表 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2" size={20} />
            支持的国家列表
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {countries.map((country) => (
              <div
                key={country.code}
                className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md"
              >
                <span className="text-lg">{country.flag}</span>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {country.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {country.code}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 位置选择器组件测试 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Info className="mr-2" size={20} />
            位置选择器组件
          </h2>
          
          <LocationSelector
            onLocationChange={handleLocationChange}
            className="max-w-md"
          />
        </div>

        {/* API测试链接 */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">API测试链接：</h3>
          <div className="space-y-2 text-sm">
            <div>
              <strong>当前位置：</strong>
              <a 
                href="/api/location/current" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-2"
              >
                /api/location/current
              </a>
            </div>
            <div>
              <strong>国家列表：</strong>
              <a 
                href="/api/location/countries" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline ml-2"
              >
                /api/location/countries
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationTestPage
