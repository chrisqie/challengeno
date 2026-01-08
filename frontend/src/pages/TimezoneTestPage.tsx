import React, { useState, useEffect } from 'react'
import { Clock, Globe, Users, RefreshCw } from 'lucide-react'
import { TimeUtil } from '../utils/time'

/**
 * 时区同步测试页面
 * 用于验证全球用户时间同步是否正确
 */
const TimezoneTestPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [testResults, setTestResults] = useState<any>(null)

  // 模拟不同时区的游戏开始时间（UTC）
  const testGameTimes = [
    '2024-10-26T15:30:00.000Z', // UTC 15:30
    '2024-10-26T07:00:00.000Z', // UTC 07:00 (对应北京时间15:00)
    '2024-10-27T02:15:00.000Z', // UTC 02:15 (明天)
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const runTimezoneTest = () => {
    const results = testGameTimes.map((utcTime, index) => ({
      id: index + 1,
      utcTime,
      ...TimeUtil.testGlobalTimeSync(utcTime)
    }))
    setTestResults(results)
  }

  const createTestGame = () => {
    // 创建一个1小时后开始的测试游戏
    const startTime = new Date()
    startTime.setHours(startTime.getHours() + 1)
    
    const utcTime = TimeUtil.toServerTime(TimeUtil.toDateTimeLocalValue(startTime))
    const testResult = TimeUtil.testGlobalTimeSync(utcTime)
    
    console.log('创建测试游戏:', {
      本地时间: TimeUtil.toDateTimeLocalValue(startTime),
      发送UTC: utcTime,
      同步测试: testResult
    })
    
    alert(`测试游戏创建成功！\n本地显示: ${testResult.localDisplay}\n倒计时: ${testResult.timeUntil}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">全球时区同步测试</h1>
          </div>

          {/* 当前时间信息 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">当前本地时间</h3>
              </div>
              <p className="text-lg font-mono">{TimeUtil.formatCurrentTime()}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">用户时区</h3>
              </div>
              <p className="text-lg font-mono">{TimeUtil.getUserTimezone()}</p>
              <p className="text-sm text-gray-600">UTC{TimeUtil.getTimezoneOffsetString()}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">UTC时间</h3>
              </div>
              <p className="text-lg font-mono">{currentTime.toISOString().slice(0, 19).replace('T', ' ')} UTC</p>
            </div>
          </div>

          {/* 测试按钮 */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={runTimezoneTest}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>运行时区同步测试</span>
            </button>
            
            <button
              onClick={createTestGame}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>创建1小时后开始的测试游戏</span>
            </button>
          </div>

          {/* 测试结果 */}
          {testResults && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">时区同步测试结果</h2>
              
              {testResults.map((result: any) => (
                <div key={result.id} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-3">测试游戏 #{result.id}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">服务器UTC时间:</p>
                      <p className="font-mono text-blue-600">{result.serverUTC}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">本地显示时间:</p>
                      <p className="font-mono text-green-600">{result.localDisplay}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">距离开始:</p>
                      <p className="font-mono text-purple-600">{result.timeUntil}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">时区信息:</p>
                      <p className="font-mono text-orange-600">{result.userTimezone} (UTC{result.timezoneOffset >= 0 ? '+' : ''}{result.timezoneOffset})</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 说明文档 */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">🌍 全球时区同步说明</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• <strong>服务器存储</strong>：所有时间以UTC格式存储在数据库中</li>
              <li>• <strong>前端显示</strong>：自动转换为用户本地时区显示</li>
              <li>• <strong>倒计时同步</strong>：全球用户看到相同的剩余时间</li>
              <li>• <strong>测试方法</strong>：不同时区的用户应该看到相同的"距离开始"时间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimezoneTestPage
