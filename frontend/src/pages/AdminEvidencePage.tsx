import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { adminAPI } from '../services/api';
import { 
  FileText, 
  Image, 
  Video, 
  File, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Download,
  Search,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface EvidenceStats {
  totalEvidence: number;
  verifiedCount: number;
  pendingCount: number;
  successRate: number;
}

interface EvidenceItem {
  id: string;
  gameId: string;
  userId: string;
  gameTitle: string;
  username: string;
  evidenceType: 'PHOTO' | 'VIDEO' | 'TEXT' | 'DOCUMENT';
  evidenceContent: string;
  evidenceDescription?: string;
  selfReportedSuccess: boolean;
  evidenceSubmittedAt: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

interface EvidenceStats {
  totalEvidence: number;
  photoCount: number;
  videoCount: number;
  textCount: number;
  documentCount: number;
  verifiedCount: number;
  pendingCount: number;
  successRate: number;
}

const AdminEvidencePage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showEvidenceModal, setShowEvidenceModal] = useState<EvidenceItem | null>(null);

  // 获取证据统计
  const { data: stats, isLoading: statsLoading } = useQuery<EvidenceStats>(
    'admin-evidence-stats',
    () => adminAPI.getEvidenceStats().then(response => response.data),
    {
      refetchInterval: 30000, // 30秒刷新一次
    }
  );

  // 获取证据列表
  const { data: evidenceList, isLoading: evidenceLoading, refetch } = useQuery<EvidenceItem[]>(
    ['admin-evidence-list', selectedGame, selectedType, selectedStatus, searchTerm, dateRange],
    () => adminAPI.getEvidenceList({
      gameId: selectedGame || undefined,
      type: selectedType || undefined,
      status: selectedStatus || undefined,
      search: searchTerm || undefined,
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    }).then(response => response.data),
    {
      refetchInterval: 30000,
    }
  );

  // 获取游戏列表用于筛选
  const { data: games } = useQuery('admin-games-list', () => adminAPI.getGamesList().then(response => response.data));

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'PHOTO': return <Image className="w-4 h-4 text-blue-600" />;
      case 'VIDEO': return <Video className="w-4 h-4 text-purple-600" />;
      case 'TEXT': return <FileText className="w-4 h-4 text-green-600" />;
      case 'DOCUMENT': return <File className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (evidence: EvidenceItem) => {
    if (evidence.isVerified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          已验证
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock className="w-3 h-3 mr-1" />
        待验证
      </span>
    );
  };

  const handleVerifyEvidence = async (evidenceId: string, isValid: boolean) => {
    try {
      await adminAPI.verifyEvidence(evidenceId, isValid);
      toast.success(isValid ? '证据验证通过' : '证据验证不通过');
      refetch();
    } catch (error) {
      toast.error('验证失败');
    }
  };

  const handleExportEvidence = async () => {
    try {
      const response = await adminAPI.exportEvidenceData({
        gameId: selectedGame || undefined,
        type: selectedType || undefined,
        status: selectedStatus || undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
      });

      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `evidence-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('证据数据导出成功');
    } catch (error) {
      toast.error('导出失败');
    }
  };

  const renderEvidencePreview = (evidence: EvidenceItem) => {
    switch (evidence.evidenceType) {
      case 'PHOTO':
        return (
          <img
            src={evidence.evidenceContent}
            alt="证据图片"
            className="max-w-full max-h-64 rounded-lg mx-auto"
          />
        );
      case 'VIDEO':
        return (
          <video
            src={evidence.evidenceContent}
            controls
            className="max-w-full max-h-64 rounded-lg mx-auto"
          />
        );
      case 'TEXT':
        return (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800 whitespace-pre-wrap">{evidence.evidenceContent}</p>
          </div>
        );
      case 'DOCUMENT':
        return (
          <div className="text-center py-8">
            <File className="w-16 h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">文档类型证据</p>
            <a
              href={evidence.evidenceContent}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              查看文档
            </a>
          </div>
        );
      default:
        return <p className="text-gray-500">未知证据类型</p>;
    }
  };

  if (statsLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">证据管理</h1>
        <button
          onClick={handleExportEvidence}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>导出数据</span>
        </button>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">总证据数</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalEvidence}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">已验证</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.verifiedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">待验证</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">成功率</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 游戏筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">游戏</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有游戏</option>
              {games?.map((game: any) => (
                <option key={game.id} value={game.id}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>

          {/* 类型筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">证据类型</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有类型</option>
              <option value="PHOTO">图片</option>
              <option value="VIDEO">视频</option>
              <option value="TEXT">文本</option>
              <option value="DOCUMENT">文档</option>
            </select>
          </div>

          {/* 状态筛选 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">验证状态</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有状态</option>
              <option value="verified">已验证</option>
              <option value="pending">待验证</option>
            </select>
          </div>

          {/* 搜索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索用户名或游戏..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 日期范围 */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 证据列表 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">证据列表</h2>
        </div>

        {evidenceLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : evidenceList && evidenceList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    证据信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    游戏/用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    提交时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {evidenceList.map((evidence) => (
                  <tr key={evidence.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getEvidenceIcon(evidence.evidenceType)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {evidence.evidenceType}
                          </div>
                          <div className="text-sm text-gray-500">
                            {evidence.selfReportedSuccess ? '自评成功' : '自评失败'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{evidence.gameTitle}</div>
                      <div className="text-sm text-gray-500">@{evidence.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(evidence.evidenceSubmittedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(evidence)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowEvidenceModal(evidence)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!evidence.isVerified && (
                          <>
                            <button
                              onClick={() => handleVerifyEvidence(evidence.id, true)}
                              className="text-green-600 hover:text-green-700"
                              title="验证通过"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleVerifyEvidence(evidence.id, false)}
                              className="text-red-600 hover:text-red-700"
                              title="验证不通过"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无证据</h3>
            <p className="text-gray-500">没有找到符合条件的证据</p>
          </div>
        )}
      </div>

      {/* 证据查看模态框 */}
      {showEvidenceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                证据详情
              </h3>
              <button
                onClick={() => setShowEvidenceModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* 证据信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">基本信息</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">游戏:</span> {showEvidenceModal.gameTitle}</div>
                    <div><span className="font-medium">用户:</span> @{showEvidenceModal.username}</div>
                    <div><span className="font-medium">类型:</span> {showEvidenceModal.evidenceType}</div>
                    <div><span className="font-medium">自评:</span> {showEvidenceModal.selfReportedSuccess ? '成功' : '失败'}</div>
                    <div><span className="font-medium">提交时间:</span> {new Date(showEvidenceModal.evidenceSubmittedAt).toLocaleString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">验证状态</h4>
                  <div className="space-y-2">
                    {getStatusBadge(showEvidenceModal)}
                    {showEvidenceModal.isVerified && showEvidenceModal.verifiedAt && (
                      <div className="text-sm text-gray-500">
                        验证时间: {new Date(showEvidenceModal.verifiedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 证据描述 */}
              {showEvidenceModal.evidenceDescription && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">证据描述</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {showEvidenceModal.evidenceDescription}
                  </div>
                </div>
              )}

              {/* 证据内容 */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">证据内容</h4>
                <div className="border border-gray-200 rounded-lg p-4">
                  {renderEvidencePreview(showEvidenceModal)}
                </div>
              </div>

              {/* 操作按钮 */}
              {!showEvidenceModal.isVerified && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleVerifyEvidence(showEvidenceModal.id, false);
                      setShowEvidenceModal(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    验证不通过
                  </button>
                  <button
                    onClick={() => {
                      handleVerifyEvidence(showEvidenceModal.id, true);
                      setShowEvidenceModal(null);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    验证通过
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvidencePage;
