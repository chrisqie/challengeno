import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { gamesAPI } from '../services/api';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Award,
  Target
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';

interface SettlementResult {
  userId: string;
  username: string;
  evidenceSubmitted: boolean;
  selfReportedSuccess: boolean;
  recognizeRate: number;
  recognizeCount: number;
  totalEvaluations: number;
  finalResult: 'SUCCESS' | 'FAILURE';
  pointsEarned: number;
  trustPointsChange: number;
  achievements: string[];
}

interface GameSettlement {
  gameId: string;
  gameTitle: string;
  totalParticipants: number;
  successfulParticipants: number;
  settlementResults: SettlementResult[];
  completedAt: string;
}

const GameSettlementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'details' | 'rankings'>('overview');

  const { data: settlement, isLoading, error } = useQuery(
    ['game-settlement', id],
    () => gamesAPI.getGameSettlement(id!),
    {
      select: (response: any) => response.data as GameSettlement,
      enabled: !!id,
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !settlement) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">无法加载结算结果</h2>
        <p className="text-gray-600 mb-4">游戏可能还未完成结算</p>
        <button
          onClick={() => navigate(-1)}
          className="btn-primary"
        >
          返回
        </button>
      </div>
    );
  }

  const myResult = settlement?.settlementResults.find((r: SettlementResult) => r.userId === user?.id);
  const successRate = settlement ? (settlement.successfulParticipants / settlement.totalParticipants) * 100 : 0;

  const getResultIcon = (result: string) => {
    return result === 'SUCCESS' ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getResultColor = (result: string) => {
    return result === 'SUCCESS' ? 'text-green-600' : 'text-red-600';
  };

  const getResultBg = (result: string) => {
    return result === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">挑战结算</h1>
          <p className="text-gray-600">{settlement?.gameTitle}</p>
        </div>
      </div>

      {/* 我的结果卡片 */}
      {myResult && (
        <div className={`card p-6 border-2 ${getResultBg(myResult.finalResult)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getResultIcon(myResult.finalResult)}
              <h2 className={`text-xl font-bold ${getResultColor(myResult.finalResult)}`}>
                {myResult.finalResult === 'SUCCESS' ? '挑战成功！' : '挑战失败'}
              </h2>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">认可度</div>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(myResult.recognizeRate * 100)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">参与积分</span>
              </div>
              <div className="text-lg font-semibold">+{myResult.pointsEarned}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-purple-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">信任积分</span>
              </div>
              <div className={`text-lg font-semibold ${
                myResult.trustPointsChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {myResult.trustPointsChange >= 0 ? '+' : ''}{myResult.trustPointsChange}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-orange-600 mb-1">
                <Award className="w-4 h-4" />
                <span className="text-sm">成就</span>
              </div>
              <div className="text-lg font-semibold">{myResult.achievements.length}</div>
            </div>
          </div>

          {myResult.achievements.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">获得成就</h3>
              <div className="flex flex-wrap gap-2">
                {myResult.achievements.map((achievement: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"
                  >
                    🏆 {achievement}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 整体统计 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">挑战统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-600 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-sm">总参与者</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{settlement?.totalParticipants}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-600 mb-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm">成功者</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{settlement?.successfulParticipants}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-purple-600 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm">成功率</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{Math.round(successRate)}%</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-gray-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm">完成时间</span>
            </div>
            <div className="text-sm text-gray-900">
              {settlement?.completedAt ? new Date(settlement.completedAt).toLocaleDateString('zh-CN') : '-'}
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="card">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: '概览', icon: Trophy },
              { key: 'details', label: '详细结果', icon: Users },
              { key: 'rankings', label: '排行榜', icon: Star },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                  selectedTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">挑战概览</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">成功参与者</h4>
                  <div className="space-y-2">
                    {settlement?.settlementResults
                      .filter((r: SettlementResult) => r.finalResult === 'SUCCESS')
                      .slice(0, 5)
                      .map((result: SettlementResult) => (
                        <div key={result.userId} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">@{result.username}</span>
                          <span className="text-xs text-gray-500">
                            ({Math.round(result.recognizeRate * 100)}% 认可)
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">未完成参与者</h4>
                  <div className="space-y-2">
                    {settlement?.settlementResults
                      .filter((r: SettlementResult) => r.finalResult === 'FAILURE')
                      .slice(0, 5)
                      .map((result: SettlementResult) => (
                        <div key={result.userId} className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span className="text-sm">@{result.username}</span>
                          <span className="text-xs text-gray-500">
                            ({Math.round(result.recognizeRate * 100)}% 认可)
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'details' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">详细结果</h3>
              <div className="space-y-3">
                {settlement?.settlementResults.map((result: SettlementResult) => (
                  <div key={result.userId} className={`p-4 rounded-lg border ${getResultBg(result.finalResult)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getResultIcon(result.finalResult)}
                        <div>
                          <div className="font-medium">@{result.username}</div>
                          <div className="text-sm text-gray-600">
                            认可度: {Math.round(result.recognizeRate * 100)}% 
                            ({result.recognizeCount}/{result.totalEvaluations})
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">积分变化</div>
                        <div className="font-medium">
                          +{result.pointsEarned} / {result.trustPointsChange >= 0 ? '+' : ''}{result.trustPointsChange}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'rankings' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">认可度排行榜</h3>
              <div className="space-y-3">
                {settlement?.settlementResults
                  .sort((a: SettlementResult, b: SettlementResult) => b.recognizeRate - a.recognizeRate)
                  .map((result: SettlementResult, index: number) => (
                    <div key={result.userId} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">@{result.username}</div>
                        <div className="text-sm text-gray-600">
                          认可度: {Math.round(result.recognizeRate * 100)}%
                        </div>
                      </div>
                      <div className="text-right">
                        {getResultIcon(result.finalResult)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameSettlementPage;
