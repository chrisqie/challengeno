import React from 'react';
import { X, Trophy, Award, TrendingUp, TrendingDown, Users, Target, Star } from 'lucide-react';

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

interface GameSettlementModalProps {
  settlement: GameSettlement;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
}

const GameSettlementModal: React.FC<GameSettlementModalProps> = ({
  settlement,
  currentUserId,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const currentUserResult = settlement.settlementResults.find(r => r.userId === currentUserId);
  const isWinner = currentUserResult?.finalResult === 'SUCCESS';
  const successRate = Math.round((settlement.successfulParticipants / settlement.totalParticipants) * 100);

  const getResultIcon = (result: 'SUCCESS' | 'FAILURE') => {
    return result === 'SUCCESS' ? (
      <Trophy className="w-5 h-5 text-yellow-500" />
    ) : (
      <X className="w-5 h-5 text-red-500" />
    );
  };

  const getResultColor = (result: 'SUCCESS' | 'FAILURE') => {
    return result === 'SUCCESS' ? 'text-green-600' : 'text-red-600';
  };

  const getResultBg = (result: 'SUCCESS' | 'FAILURE') => {
    return result === 'SUCCESS' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  const getAchievementIcon = (achievement: string) => {
    switch (achievement) {
      case '完美履约':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case '初出茅庐':
        return <Target className="w-4 h-4 text-blue-500" />;
      case '连胜达人':
      case '三连胜':
        return <Award className="w-4 h-4 text-purple-500" />;
      default:
        return <Award className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Game Settlement</h2>
            <p className="text-sm text-gray-600 mt-1">{settlement.gameTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Current User Result */}
          {currentUserResult && (
            <div className={`p-6 border-b ${getResultBg(currentUserResult.finalResult)}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getResultIcon(currentUserResult.finalResult)}
                  <div>
                    <h3 className={`text-lg font-semibold ${getResultColor(currentUserResult.finalResult)}`}>
                      {isWinner ? 'Congratulations! You succeeded!' : 'Challenge completed'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Recognition rate: {Math.round(currentUserResult.recognizeRate * 100)}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 text-blue-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold">+{currentUserResult.pointsEarned}</span>
                      </div>
                      <p className="text-xs text-gray-500">Participation Points</p>
                    </div>
                    {currentUserResult.trustPointsChange !== 0 && (
                      <div className="text-center">
                        <div className={`flex items-center space-x-1 ${
                          currentUserResult.trustPointsChange > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {currentUserResult.trustPointsChange > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="font-semibold">
                            {currentUserResult.trustPointsChange > 0 ? '+' : ''}{currentUserResult.trustPointsChange}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Trust Points</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              {currentUserResult.achievements.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Achievements Unlocked:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentUserResult.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1 bg-white bg-opacity-50 px-3 py-1 rounded-full border"
                      >
                        {getAchievementIcon(achievement)}
                        <span className="text-sm font-medium">{achievement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Game Statistics */}
          <div className="p-6 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Participants</p>
                    <p className="text-xl font-semibold text-gray-900">{settlement.totalParticipants}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Successful</p>
                    <p className="text-xl font-semibold text-green-600">{settlement.successfulParticipants}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-xl font-semibold text-gray-900">{successRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* All Participants Results */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Participants</h3>
            <div className="space-y-3">
              {settlement.settlementResults.map((result, index) => (
                <div
                  key={result.userId}
                  className={`p-4 rounded-lg border ${
                    result.userId === currentUserId ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        {getResultIcon(result.finalResult)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {result.username}
                          {result.userId === currentUserId && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Recognition: {Math.round(result.recognizeRate * 100)}%</span>
                          <span>Evaluations: {result.totalEvaluations}</span>
                          {!result.evidenceSubmitted && (
                            <span className="text-red-600">No Evidence</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-3">
                        <div className="text-center">
                          <p className="text-sm font-medium text-blue-600">+{result.pointsEarned}</p>
                          <p className="text-xs text-gray-500">Points</p>
                        </div>
                        {result.trustPointsChange !== 0 && (
                          <div className="text-center">
                            <p className={`text-sm font-medium ${
                              result.trustPointsChange > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {result.trustPointsChange > 0 ? '+' : ''}{result.trustPointsChange}
                            </p>
                            <p className="text-xs text-gray-500">Trust</p>
                          </div>
                        )}
                      </div>
                      {result.achievements.length > 0 && (
                        <div className="flex space-x-1 mt-2">
                          {result.achievements.map((achievement, achIndex) => (
                            <div
                              key={achIndex}
                              className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs"
                            >
                              {getAchievementIcon(achievement)}
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Completed on {new Date(settlement.completedAt).toLocaleString()}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSettlementModal;
