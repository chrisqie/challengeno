import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, XCircle, FileText, Image, Video, Upload, X } from 'lucide-react';
import { disputesAPI } from '../services/api';
import { DISPUTE_TYPE_LABELS, DISPUTE_STATUS_LABELS, ArbitrationStatus, EvidenceType, DisputeType } from '../types/arbitration';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const DisputeDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [evidenceForm, setEvidenceForm] = useState({
    type: EvidenceType.IMAGE,
    title: '',
    description: '',
    content: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: dispute, isLoading } = useQuery(
    ['dispute', id],
    () => disputesAPI.getDispute(id!),
    {
      select: (response) => response.data,
      enabled: !!id,
    }
  );

  const addEvidenceMutation = useMutation(
    (data: any) => disputesAPI.addEvidence(id!, data),
    {
      onSuccess: () => {
        toast.success('证据添加成功');
        setShowEvidenceForm(false);
        setEvidenceForm({
          type: EvidenceType.IMAGE,
          title: '',
          description: '',
          content: '',
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsUploading(false);
        queryClient.invalidateQueries(['dispute', id]);
      },
      onError: (error: any) => {
        setIsUploading(false);
        toast.error(error.response?.data?.message || '添加证据失败');
      },
    }
  );

  const cancelDisputeMutation = useMutation(
    () => disputesAPI.cancelDispute(id!),
    {
      onSuccess: () => {
        toast.success('争议已取消');
        queryClient.invalidateQueries(['dispute', id]);
        navigate('/disputes');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '取消争议失败');
      },
    }
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        toast.error('只支持图片文件');
        return;
      }

      // 检查文件大小（最大10MB）
      if (file.size > 10 * 1024 * 1024) {
        toast.error('图片大小不能超过10MB');
        return;
      }

      setSelectedFile(file);

      // 创建预览URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      // 将文件转换为base64字符串存储
      const reader = new FileReader();
      reader.onload = (e) => {
        setEvidenceForm(prev => ({ ...prev, content: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEvidenceForm(prev => ({ ...prev, content: '' }));

    // 清理URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!evidenceForm.content.trim()) {
      toast.error('请上传图片证据');
      return;
    }

    setIsUploading(true);
    addEvidenceMutation.mutate(evidenceForm);
  };

  const handleCancelDispute = () => {
    if (window.confirm('确定要取消这个争议吗？取消后无法恢复。')) {
      cancelDisputeMutation.mutate();
    }
  };

  const getStatusColor = (status: ArbitrationStatus) => {
    switch (status) {
      case ArbitrationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ArbitrationStatus.UNDER_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case ArbitrationStatus.INVESTIGATING:
        return 'bg-purple-100 text-purple-800';
      case ArbitrationStatus.WAITING_EVIDENCE:
        return 'bg-orange-100 text-orange-800';
      case ArbitrationStatus.RESOLVED:
        return 'bg-green-100 text-green-800';
      case ArbitrationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case ArbitrationStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800';
      case ArbitrationStatus.ESCALATED:
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ArbitrationStatus) => {
    switch (status) {
      case ArbitrationStatus.PENDING:
        return <Clock className="w-5 h-5" />;
      case ArbitrationStatus.UNDER_REVIEW:
      case ArbitrationStatus.INVESTIGATING:
        return <AlertTriangle className="w-5 h-5" />;
      case ArbitrationStatus.RESOLVED:
        return <CheckCircle className="w-5 h-5" />;
      case ArbitrationStatus.REJECTED:
      case ArbitrationStatus.CANCELLED:
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getEvidenceIcon = (type: EvidenceType) => {
    switch (type) {
      case EvidenceType.IMAGE:
      case EvidenceType.SCREENSHOT:
        return <Image className="w-4 h-4" />;
      case EvidenceType.VIDEO:
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // 检查用户是否已经提交过证据
  const hasSubmittedEvidence = dispute?.evidence?.some((evidence: any) => evidence.uploaderId === user?.id);

  const canAddEvidence = dispute &&
    (dispute.initiatorId === user?.id || dispute.targetId === user?.id) &&
    ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'WAITING_EVIDENCE'].includes(dispute.status) &&
    !hasSubmittedEvidence; // 只允许提交一次证据

  const canCancelDispute = dispute && 
    dispute.initiatorId === user?.id &&
    ['PENDING', 'UNDER_REVIEW'].includes(dispute.status);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!dispute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">争议不存在</h3>
          <button
            onClick={() => navigate('/disputes')}
            className="text-primary-600 hover:text-primary-700"
          >
            返回争议列表
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/disputes')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{dispute.title}</h1>
              <p className="text-sm text-gray-500">争议详情</p>
            </div>
            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(dispute.status)}`}>
              {getStatusIcon(dispute.status)}
              <span>{DISPUTE_STATUS_LABELS[dispute.status as ArbitrationStatus]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 争议基本信息 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">争议信息</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">基本信息</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">争议类型:</span>
                  <span className="font-medium">{DISPUTE_TYPE_LABELS[dispute.disputeType as DisputeType]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">相关游戏:</span>
                  <span className="font-medium">{dispute.game?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">创建时间:</span>
                  <span className="font-medium">{new Date(dispute.createdAt).toLocaleString()}</span>
                </div>
                {dispute.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">解决时间:</span>
                    <span className="font-medium">{new Date(dispute.resolvedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">参与方</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">发起人:</span>
                  <span className="font-medium">@{dispute.initiator?.username}</span>
                </div>
                {dispute.target && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">被申请人:</span>
                    <span className="font-medium">@{dispute.target?.username}</span>
                  </div>
                )}
                {dispute.handler && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">处理人:</span>
                    <span className="font-medium">@{dispute.handler?.username}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">争议描述</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{dispute.description}</p>
          </div>

          {dispute.reason && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-900 mb-2">争议理由</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{dispute.reason}</p>
            </div>
          )}

          {dispute.resolution && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">处理结果</h3>
              <p className="text-green-800 whitespace-pre-wrap">{dispute.resolution}</p>
            </div>
          )}
        </div>

        {/* 证据列表 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              证据材料 ({dispute.evidence?.length || 0})
            </h2>
            {canAddEvidence && (
              <button
                onClick={() => setShowEvidenceForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>添加证据</span>
              </button>
            )}
          </div>

          {dispute.evidence && dispute.evidence.length > 0 ? (
            <div className="space-y-4">
              {dispute.evidence.map((evidence: any) => (
                <div key={evidence.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getEvidenceIcon(evidence.type)}
                      <span className="font-medium text-gray-900">
                        {evidence.title || `图片证据 ${evidence.id.slice(0, 8)}`}
                      </span>
                      {evidence.isVerified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已验证
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      @{evidence.uploader?.username}
                    </span>
                  </div>

                  {evidence.description && (
                    <p className="text-gray-600 text-sm mb-2">{evidence.description}</p>
                  )}

                  {/* 显示图片 */}
                  {evidence.type === 'IMAGE' && evidence.content && (
                    <div className="mt-3">
                      <img
                        src={evidence.content}
                        alt={evidence.title || '证据图片'}
                        className="max-w-full h-auto rounded-lg border border-gray-200"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(evidence.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无证据材料</p>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        {canCancelDispute && (
          <div className="flex justify-end">
            <button
              onClick={handleCancelDispute}
              disabled={cancelDisputeMutation.isLoading}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {cancelDisputeMutation.isLoading ? '取消中...' : '取消争议'}
            </button>
          </div>
        )}
      </div>

      {/* 添加证据表单模态框 */}
      {showEvidenceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">添加证据</h3>
              <button
                onClick={() => setShowEvidenceForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvidence} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  证据类型
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-gray-700">图片证据</span>
                </div>
                <input type="hidden" value={EvidenceType.IMAGE} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  证据标题（可选）
                </label>
                <input
                  type="text"
                  value={evidenceForm.title}
                  onChange={(e) => setEvidenceForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="简要描述证据内容"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  证据描述（可选）
                </label>
                <textarea
                  value={evidenceForm.description}
                  onChange={(e) => setEvidenceForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="详细说明证据的相关性和重要性"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  上传图片 *
                </label>
                {previewUrl ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="证据预览"
                        className="w-full h-48 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {selectedFile?.name} ({(selectedFile!.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        点击选择图片
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      支持 JPG、PNG、GIF 格式，最大 10MB
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEvidenceForm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={addEvidenceMutation.isLoading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {addEvidenceMutation.isLoading ? '添加中...' : '添加证据'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeDetailPage;
