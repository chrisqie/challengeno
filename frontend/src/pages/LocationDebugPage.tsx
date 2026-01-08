import React from 'react'
import { MapPin, Zap } from 'lucide-react'
import LocationDisplay from '../components/LocationDisplay'

const LocationDebugPage = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">地理位置功能调试页面</h1>
      
      {/* 测试图标 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">图标测试</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>MapPin图标</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Zap图标</span>
          </div>
        </div>
      </div>

      {/* 测试按钮样式 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">按钮样式测试</h2>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <MapPin className="w-3 h-3" />
            <span>Local</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600">
            <Zap className="w-3 h-3" />
            <span>Tough</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium text-gray-600 hover:text-blue-600">
            <span>全部</span>
          </button>
        </div>
      </div>

      {/* 测试LocationDisplay组件 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">LocationDisplay组件测试</h2>
        <LocationDisplay />
      </div>

      {/* 测试距离显示 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">距离显示测试</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>0.5km</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>5.2km</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>25km</span>
          </div>
        </div>
      </div>

      {/* 测试地理位置限制显示 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">地理位置限制显示测试</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-1 text-blue-600">
            <MapPin className="w-4 h-4" />
            <span>本地 50km</span>
          </div>
          <div className="flex items-center space-x-1 text-purple-600">
            <MapPin className="w-4 h-4" />
            <span>北京市朝阳区</span>
          </div>
        </div>
      </div>

      {/* 测试表单元素 */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">表单元素测试</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              地理位置限制
            </label>
            <select className="input">
              <option value="NONE">无限制</option>
              <option value="LOCAL">本地挑战</option>
              <option value="CUSTOM">自定义位置</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最大距离: 50km
            </label>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              defaultValue="50"
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5km</span>
              <span>200km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationDebugPage
