import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { disputesAPI } from '../services/api';
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Clock,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Scale,
  Eye
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

interface CreateDisputeForm {
  disputeType: 'EVALUATION_DISPUTE' | 'EVIDENCE_DISPUTE' | 'GAME_RULE_DISPUTE' | 'HARASSMENT' | 'OTHER';
  title: string;
  description: string;
  reason?: string;
  evidenceText?: string;
}

const DisputePage: React.FC = () => {
  const { gameId, disputeId } = useParams<{ gameId?: string; disputeId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 创建争议表单
  const {
    register: registerDispute,
    handleSubmit: handleDisputeSubmit,
    formState: { errors: disputeErrors },
    watch: watchDispute
  } = useForm<CreateDisputeForm>();

  // 获取争议详情
  const { data: dispute, isLoading: disputeLoading } = useQuery(
    ['dispute', disputeId],
    () => disputesAPI.getDispute(disputeId!),
    {
      enabled: !!disputeId,
      select: (response) => response.data,
    }
  );

  // 创建争议
  const createDisputeMutation = useMutation(
    (data: CreateDisputeForm & { gameId: string }) => disputesAPI.createDispute(data),
    {
      onSuccess: (response) => {
        toast.success('争议已提交，等待处理');
        navigate(`/dispute/${response.data.id}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '提交争议失败');
      },
    }
  );

  const onCreateDispute = (data: CreateDisputeForm) => {
    if (!gameId) {
      toast.error('游戏ID缺失');
      return;
    }

    createDisputeMutation.mutate({
      ...data,
      gameId
    });
  };

  // 取消争议
  const cancelDisputeMutation = useMutation(
    (disputeId: string) => disputesAPI.cancelDispute(disputeId),
    {
      onSuccess: () => {
        toast.success('争议已取消');
        navigate(-1);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '取消失败');
      },
    }
  );

  const handleCancelDispute = () => {
    if (!disputeId) return;

    if (window.confirm('确定要取消这个争议吗？取消后将无法恢复。')) {
      cancelDisputeMutation.mutate(disputeId);
    }
  };

  const getDisputeTypeLabel = (type: string) => {
    const types = {
      'EVALUATION_DISPUTE': '评价争议',
      'EVIDENCE_DISPUTE': '证据争议',
      'GAME_RULE_DISPUTE': '规则争议',
      'HARASSMENT': '骚扰举报',
      'OTHER': '其他'
    };
    return types[type as keyof typeof types] || type;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'text-yellow-600 bg-yellow-50',
      'INVESTIGATING': 'text-blue-600 bg-blue-50',
      'RESOLVED': 'text-green-600 bg-green-50',
      'REJECTED': 'text-red-600 bg-red-50',
      'ESCALATED': 'text-purple-600 bg-purple-50'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  if (disputeId && disputeLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">
            {disputeId ? '争议详情' : '提交争议'}
          </h1>
          <p className="text-gray-600">
            {disputeId ? '查看和管理争议' : '对游戏结果或行为提出争议'}
          </p>
        </div>
      </div>

      {/* 争议详情视图 */}
      {dispute && (
        <div className="space-y-6">
          {/* 争议状态卡片 */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Scale className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{dispute.title}</h2>
                  <p className="text-sm text-gray-600">
                    {getDisputeTypeLabel(dispute.disputeType)} • 
                    创建于 {new Date(dispute.createdAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dispute.status)}`}>
                {dispute.status}
              </span>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700">{dispute.description}</p>
              {dispute.reason && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">争议理由</h4>
                  <p className="text-gray-700">{dispute.reason}</p>
                </div>
              )}
            </div>

            {dispute.resolution && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-blue-900">处理结果</h4>
                </div>
                <p className="text-blue-800">{dispute.resolution}</p>
                {dispute.resolvedAt && (
                  <p className="text-sm text-blue-600 mt-2">
                    处理时间: {new Date(dispute.resolvedAt).toLocaleString('zh-CN')}
                  </p>
                )}
              </div>
            )}

            {/* 取消争议按钮 */}
            {(dispute.status === 'PENDING' || dispute.status === 'UNDER_REVIEW') && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelDispute}
                  disabled={cancelDisputeMutation.isLoading}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelDisputeMutation.isLoading ? '取消中...' : '取消争议'}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  取消后将无法恢复，请谨慎操作
                </p>
              </div>
            )}
          </div>

          {/* 证据列表 */}
          {dispute.evidence && dispute.evidence.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">相关证据</h3>
              <div className="space-y-4">
                {dispute.evidence.map((evidence: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{evidence.title || `证据 ${index + 1}`}</span>
                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                        {evidence.type}
                      </span>
                    </div>
                    {evidence.description && (
                      <p className="text-sm text-gray-600 mb-2">{evidence.description}</p>
                    )}
                    {evidence.type === 'TEXT' ? (
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                        {evidence.content}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Eye className="w-4 h-4" />
                        <span>查看附件</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}


        </div>
      )}

      {/* 创建争议表单 */}
      {!disputeId && (
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-900">提交争议</h2>
          </div>

          <form onSubmit={handleDisputeSubmit(onCreateDispute)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                争议类型 <span className="text-red-500">*</span>
              </label>
              <select
                {...registerDispute('disputeType', { required: '请选择争议类型' })}
                className="input"
              >
                <option value="">选择争议类型</option>
                <option value="EVALUATION_DISPUTE">评价争议 - 对他人评价结果不满</option>
                <option value="EVIDENCE_DISPUTE">证据争议 - 对证据有效性有异议</option>
                <option value="GAME_RULE_DISPUTE">规则争议 - 对游戏规则理解有分歧</option>
                <option value="HARASSMENT">骚扰举报 - 举报不当行为</option>
                <option value="OTHER">其他 - 其他类型的争议</option>
              </select>
              {disputeErrors.disputeType && (
                <p className="mt-1 text-sm text-red-600">{disputeErrors.disputeType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                争议标题 <span className="text-red-500">*</span>
              </label>
              <input
                {...registerDispute('title', { 
                  required: '请输入争议标题',
                  minLength: { value: 5, message: '标题至少5个字符' },
                  maxLength: { value: 100, message: '标题不能超过100个字符' }
                })}
                className="input"
                placeholder="简要描述您的争议"
              />
              {disputeErrors.title && (
                <p className="mt-1 text-sm text-red-600">{disputeErrors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                {...registerDispute('description', { 
                  required: '请详细描述争议内容',
                  minLength: { value: 20, message: '描述至少20个字符' }
                })}
                rows={6}
                className="input"
                placeholder="请详细描述争议的具体情况，包括时间、涉及的人员、具体问题等"
              />
              {disputeErrors.description && (
                <p className="mt-1 text-sm text-red-600">{disputeErrors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                争议理由
              </label>
              <textarea
                {...registerDispute('reason')}
                rows={4}
                className="input"
                placeholder="说明您认为存在问题的具体理由（可选）"
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">提交争议前请注意：</p>
                  <ul className="space-y-1 text-xs">
                    <li>• 请确保您的争议有充分的理由和证据支持</li>
                    <li>• 恶意争议可能会影响您的信任积分</li>
                    <li>• 争议处理通常需要1-3个工作日</li>
                    <li>• 提交后您可以继续添加相关证据</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={createDisputeMutation.isLoading}
              className="w-full btn-primary"
            >
              {createDisputeMutation.isLoading ? '提交中...' : '提交争议'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DisputePage;
