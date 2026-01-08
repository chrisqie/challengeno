import React, { useState } from 'react'
import { Clock, Calendar, Users, FileText, MessageSquare, Gavel, Archive, MapPin, Zap } from 'lucide-react'
import GameTimeSelector from '../components/GameTimeSelector'
import LocationDisplay from '../components/LocationDisplay'

const GameTimeTestPage = () => {
  const [selectedTimeData, setSelectedTimeData] = useState<any>(null)
  const [selectedLabel, setSelectedLabel] = useState<string>('')

  const handleTimeChange = (timeData: any, label: string) => {
    setSelectedTimeData(timeData)
    setSelectedLabel(label)
    console.log('时间数据:', timeData)
  }

  // 模拟游戏卡片数据（带国旗）
  const mockGameCard = {
    id: '1',
    title: '每日跑步挑战',
    description: '每天跑步5公里，坚持一周',
    category: 'FITNESS',
    creator: {
      username: 'runner123',
      trustPoints: 85,
      isVip: true,
      country: '中国',
      countryCode: 'CN',
      city: '北京'
    },
    locationRestriction: 'LOCAL' as const,
    maxDistance: 50,
    distance: 12.5
  }

  const getCountryFlag = (countryCode: string): string => {
    const flagMap: Record<string, string> = {
      'CN': '🇨🇳', 'US': '🇺🇸', 'JP': '🇯🇵', 'KR': '🇰🇷', 'GB': '🇬🇧',
      'FR': '🇫🇷', 'DE': '🇩🇪', 'IT': '🇮🇹', 'ES': '🇪🇸', 'RU': '🇷🇺',
      'IN': '🇮🇳', 'BR': '🇧🇷', 'CA': '🇨🇦', 'AU': '🇦🇺', 'MX': '🇲🇽',
      'TH': '🇹🇭', 'VN': '🇻🇳', 'SG': '🇸🇬', 'MY': '🇲🇾', 'ID': '🇮🇩',
      'PH': '🇵🇭', 'TW': '🇹🇼', 'HK': '🇭🇰', 'MO': '🇲🇴'
    }
    return flagMap[countryCode?.toUpperCase()] || '🌍'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            游戏时间流程和视觉效果测试页面
          </h1>
          <p className="text-gray-600">
            测试完整的7段时间流程和国旗图标显示效果
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：时间选择器测试 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="mr-2" />
                游戏时间选择器测试
              </h2>
              
              <GameTimeSelector 
                onTimeChange={handleTimeChange}
                defaultDurationHours={168}
              />
            </div>

            {/* 时间数据显示 */}
            {selectedTimeData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">选择的时间数据</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">选择方案:</span>
                    <span className="font-medium">{selectedLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">加入截止:</span>
                    <span>{selectedTimeData.joinDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">游戏开始:</span>
                    <span>{selectedTimeData.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">游戏结束:</span>
                    <span>{selectedTimeData.endDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">证据截止:</span>
                    <span>{selectedTimeData.evidenceDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">互评截止:</span>
                    <span>{selectedTimeData.reviewDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">仲裁截止:</span>
                    <span>{selectedTimeData.arbitrationDeadline}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：视觉效果测试 */}
          <div className="space-y-6">
            {/* 图标测试 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">图标显示测试</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-blue-600">
                    <MapPin className="w-5 h-5" />
                    <span>MapPin图标 (地理位置)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <Zap className="w-5 h-5" />
                    <span>Zap图标 (艰难挑战)</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">国旗图标测试</h3>
                  <div className="grid grid-cols-4 gap-2 text-sm">
                    {[
                      { code: 'CN', name: '中国' },
                      { code: 'US', name: '美国' },
                      { code: 'JP', name: '日本' },
                      { code: 'KR', name: '韩国' },
                      { code: 'GB', name: '英国' },
                      { code: 'FR', name: '法国' },
                      { code: 'DE', name: '德国' },
                      { code: 'IT', name: '意大利' }
                    ].map(country => (
                      <div key={country.code} className="flex items-center space-x-1">
                        <span className="text-lg">{getCountryFlag(country.code)}</span>
                        <span>{country.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 位置显示测试 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">位置显示测试</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">自动检测位置</h3>
                  <LocationDisplay />
                </div>

                <div>
                  <h3 className="font-medium mb-2">详细位置信息</h3>
                  <LocationDisplay showDetails={true} />
                </div>
              </div>
            </div>

            {/* 模拟游戏卡片 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">游戏卡片效果预览</h2>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🏃</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {mockGameCard.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>@{mockGameCard.creator.username}</span>
                        {mockGameCard.creator.isVip && (
                          <span className="ml-1 px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">VIP</span>
                        )}
                        <span className="ml-1">· 信任度 {mockGameCard.creator.trustPoints}</span>
                        {/* 创建者位置信息 */}
                        {mockGameCard.creator.countryCode && (
                          <span className="ml-2 flex items-center space-x-1">
                            <span>{getCountryFlag(mockGameCard.creator.countryCode)}</span>
                            <span>{mockGameCard.creator.city || mockGameCard.creator.country}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    进行中
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {mockGameCard.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>5/10 人</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>7天挑战</span>
                    </div>
                    {/* 距离显示 */}
                    {mockGameCard.distance !== undefined && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{mockGameCard.distance}km</span>
                      </div>
                    )}
                    {/* 地理位置限制显示 */}
                    {mockGameCard.locationRestriction === 'LOCAL' && (
                      <div className="flex items-center space-x-1 text-blue-600">
                        <MapPin className="w-4 h-4" />
                        <span>本地 {mockGameCard.maxDistance}km</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 时间流程说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">完整游戏时间流程说明</h2>
          
          <div className="grid md:grid-cols-7 gap-4 text-center">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-900">1. 开放加入</div>
              <div className="text-xs text-blue-700">其他人可加入</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-green-900">2. 游戏开始</div>
              <div className="text-xs text-green-700">不可再加入</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-orange-900">3. 游戏结束</div>
              <div className="text-xs text-orange-700">挑战完成</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-purple-900">4. 证据提交</div>
              <div className="text-xs text-purple-700">上传证据</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg">
              <MessageSquare className="w-6 h-6 text-pink-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-pink-900">5. 互相评价</div>
              <div className="text-xs text-pink-700">评价他人</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <Gavel className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-red-900">6. 争议仲裁</div>
              <div className="text-xs text-red-700">处理争议</div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <Archive className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-900">7. 游戏关闭</div>
              <div className="text-xs text-gray-700">存档状态</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameTimeTestPage
