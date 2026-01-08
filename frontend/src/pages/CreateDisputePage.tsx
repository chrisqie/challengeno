import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Send, Upload, X, Image as ImageIcon, FileText, Scale } from 'lucide-react';
import { disputesAPI, gamesAPI } from '../services/api';
import { DisputeType, DISPUTE_TYPE_LABELS } from '../types/arbitration';
import { useAuthStore } from '../stores/authStore';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CreateDisputePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();

  const gameId = searchParams.get('gameId');
  const targetId = searchParams.get('targetId');

  const [formData, setFormData] = useState({
    gameId: gameId || '',
    targetId: targetId || '',
    disputeType: DisputeType.EVIDENCE_DISPUTE,
    title: '',
    description: '',
    reason: '',
    evidenceText: '',
  });

  const [evidenceImages, setEvidenceImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // 获取用户参与的游戏列表
  const { data: games } = useQuery(
    'my-games-for-dispute',
    () => gamesAPI.getGames({ participant: user?.id, status: 'COMPLETED,DISPUTED' }),
    {
      select: (response) => response.data?.games || [],
      enabled: !gameId,
    }
  );

  // 获取选中游戏的参与者
  const { data: gameDetail } = useQuery(
    ['game-for-dispute', formData.gameId],
    () => gamesAPI.getGame(formData.gameId),
    {
      select: (response) => response.data,
      enabled: !!formData.gameId,
    }
  );

  const createDisputeMutation = useMutation(
    async (data: any) => {
      // 上传图片并获取URL
      let evidenceImageUrls: string[] = [];
      if (evidenceImages.length > 0) {
        setUploadingImages(true);
        try {
          // 使用base64编码（临时方案）
          const imagePromises = evidenceImages.map(file => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          });
          evidenceImageUrls = await Promise.all(imagePromises);
        } catch (error) {
          toast.error('图片上传失败');
          throw error;
        } finally {
          setUploadingImages(false);
        }
      }

      return disputesAPI.createDispute({
        ...data,
        evidenceImages: evidenceImageUrls,
      });
    },
    {
      onSuccess: (response) => {
        toast.success('争议已提交，等待管理员处理');
        navigate(gameId ? `/game/${gameId}` : `/disputes/${response.data.id}`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '提交失败');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.gameId) {
      toast.error('请选择相关游戏');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('请输入争议标题');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('请描述争议详情');
      return;
    }

    if (!formData.evidenceText && evidenceImages.length === 0) {
      toast.error('请至少提供文本证据或图片证据');
      return;
    }

    const submitData = {
      ...formData,
      targetId: formData.targetId || undefined,
    };

    createDisputeMutation.mutate(submitData);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + evidenceImages.length > 5) {
      toast.error('最多只能上传5张图片');
      return;
    }
    setEvidenceImages([...evidenceImages, ...files]);
  };

  const removeImage = (index: number) => {
    setEvidenceImages(evidenceImages.filter((_, i) => i !== index));
  };

  const availableParticipants = gameDetail?.participants?.filter(
    (p: any) => p.userId !== user?.id
  ) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">发起争议</h1>
              <p className="text-sm text-gray-500">对游戏结果或参与者行为提出争议</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 提示信息 */}
        <div className="card p-4 mb-6 bg-yellow-50 border border-yellow-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">争议申请须知</p>
              <ul className="space-y-1 text-yellow-700">
                <li>• 争议必须在游戏完成后48小时内提出</li>
                <li>• 每个游戏最多可以发起3次争议</li>
                <li>• 请提供充分的证据支持您的争议（文本或图片）</li>
                <li>• 恶意争议将影响您的信任积分</li>
                <li>• 如果被驳回，您还可以再次发起争议</li>
                <li>• 管理员将在7个工作日内处理您的争议</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 争议表单 */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 选择游戏 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                相关游戏 *
              </label>
              {gameId ? (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{gameDetail?.title || '加载中...'}</span>
                </div>
              ) : (
                <select
                  value={formData.gameId}
                  onChange={(e) => setFormData(prev => ({ ...prev, gameId: e.target.value, targetId: '' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">请选择游戏</option>
                  {games?.map((game: any) => (
                    <option key={game.id} value={game.id}>
                      {game.title} - {game.status === 'COMPLETED' ? '已完成' : '争议中'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 选择被申请人 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                被申请人（可选）
              </label>
              <select
                value={formData.targetId}
                onChange={(e) => setFormData(prev => ({ ...prev, targetId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={!formData.gameId}
              >
                <option value="">针对整个游戏结果</option>
                {availableParticipants.map((participant: any) => (
                  <option key={participant.userId} value={participant.userId}>
                    @{participant.user?.username} ({participant.user?.fullName})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                如果争议针对特定参与者，请选择；否则留空表示对整个游戏结果的争议。如果针对多个被申请人，请在争议描述中列举出来。
              </p>
            </div>

            {/* 争议类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                争议类型 *
              </label>
              <select
                value={formData.disputeType}
                onChange={(e) => setFormData(prev => ({ ...prev, disputeType: e.target.value as DisputeType }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {Object.entries(DISPUTE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* 争议标题 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                争议标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="简要概括争议内容"
                required
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 字符
              </p>
            </div>

            {/* 争议描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                争议描述 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="详细描述争议的具体情况，包括时间、地点、涉及的人员和事件经过"
                required
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/1000 字符
              </p>
            </div>

            {/* 争议理由 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                争议理由（可选）
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="说明为什么认为当前结果不公正，以及您期望的解决方案"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.reason.length}/500 字符
              </p>
            </div>

            {/* 文本证据 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                文本证据
              </label>
              <textarea
                value={formData.evidenceText}
                onChange={(e) => setFormData(prev => ({ ...prev, evidenceText: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="提供支持您争议的文本证据（例如：聊天记录、规则说明、时间节点等）"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.evidenceText.length}/1000 字符 • 至少提供文本证据或图片证据之一
              </p>
            </div>

            {/* 图片证据 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                图片证据
              </label>

              {/* 上传按钮 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={evidenceImages.length >= 5}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer ${evidenceImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    点击上传图片证据（最多5张）
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    支持 JPG、PNG、GIF 格式
                  </p>
                </label>
              </div>

              {/* 图片预览 */}
              {evidenceImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {evidenceImages.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`证据 ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 提交按钮 */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={createDisputeMutation.isLoading || uploadingImages}
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createDisputeMutation.isLoading || uploadingImages}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createDisputeMutation.isLoading || uploadingImages ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>{uploadingImages ? '上传图片中...' : '提交中...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>提交争议</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDisputePage;
