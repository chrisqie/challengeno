import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { gamesAPI } from '../services/api';
import { ArrowLeft, Camera, FileText, Video, AlertTriangle, Clock, Save, CheckCircle, Users, Share2, MessageCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EvidenceUpload from '../components/EvidenceUpload';
import EvidenceSubmissionGuide from '../components/EvidenceSubmissionGuide';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface EvidenceForm {
  evidenceType: 'PHOTO' | 'VIDEO';
  evidenceContent: string;
  evidenceDescription?: string;
  selfReportedSuccess: boolean | null;
}

const SubmitEvidencePageV2: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: game, isLoading } = useQuery(
    ['game', id],
    () => gamesAPI.getGame(id!),
    {
      select: (response) => response.data,
      enabled: !!id,
    }
  );

  // 获取参与者列表
  const { data: participants } = useQuery(
    ['game-participants', id],
    () => gamesAPI.getGameParticipants(id!),
    {
      select: (response) => response.data,
      enabled: !!id && !!game,
    }
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isDirty }
  } = useForm<EvidenceForm>({
    defaultValues: {
      evidenceType: 'PHOTO',
      selfReportedSuccess: null,  // 默认为null，强制用户选择
    },
  });

  const evidenceType = watch('evidenceType');

  // 自动保存草稿
  useEffect(() => {
    if (isDirty && game) {
      const timer = setTimeout(() => {
        const formData = getValues();
        localStorage.setItem(`evidence_draft_${id}`, JSON.stringify({
          ...formData,
          timestamp: Date.now()
        }));
        setIsDraftSaved(true);
        setTimeout(() => setIsDraftSaved(false), 2000);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isDirty, getValues, id, game]);

  // 加载草稿
  useEffect(() => {
    const savedDraft = localStorage.getItem(`evidence_draft_${id}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        const isRecent = Date.now() - draft.timestamp < 24 * 60 * 60 * 1000; // 24小时内
        
        if (isRecent) {
          setValue('evidenceType', draft.evidenceType);
          setValue('evidenceDescription', draft.evidenceDescription);
          setValue('selfReportedSuccess', draft.selfReportedSuccess);
          if (draft.evidenceType === 'TEXT') {
            setValue('evidenceContent', draft.evidenceContent);
          }
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, [id, setValue]);

  const submitMutation = useMutation(
    async (data: EvidenceForm) => {
      let fileUrl = '';

      // 如果有文件，先上传到 OSS
      if (selectedFile) {
        console.log('🔄 开始上传文件到 OSS:', selectedFile.name, selectedFile.size, selectedFile.type);

        try {
          // 1. 获取预签名 URL
          const urlResponse = await gamesAPI.getEvidenceUploadUrl(id!, {
            contentType: selectedFile.type,
            evidenceType: data.evidenceType
          });
          console.log('✅ 获取上传签名成功:', urlResponse.data);

          const { uploadUrl, fileUrl: ossFileUrl } = urlResponse.data.data;

          // 2. 直接上传到 OSS
          console.log('📤 开始上传到 OSS...');
          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: selectedFile,
            headers: {
              'Content-Type': selectedFile.type,
              'x-amz-acl': 'public-read', // 设置文件为公开可读
            },
          });

          if (!uploadResponse.ok) {
            throw new Error('上传到 OSS 失败');
          }

          console.log('✅ 上传到 OSS 成功');
          fileUrl = ossFileUrl;
        } catch (error) {
          console.error('❌ 文件上传失败:', error);
          throw new Error('文件上传失败，请重试');
        }
      }

      // 准备提交数据
      const submitData: any = {
        evidenceType: data.evidenceType,
        selfReportedSuccess: (data.selfReportedSuccess as any) === 'true' || data.selfReportedSuccess === true,
      };

      // 添加文件 URL 和/或文字说明
      if (fileUrl) {
        // 有文件时，保存文件URL
        submitData.evidenceContent = fileUrl;
        // 如果还有文字说明，也一起发送
        if (data.evidenceDescription && data.evidenceDescription.trim()) {
          submitData.evidenceDescription = data.evidenceDescription;
        }
      } else if (data.evidenceDescription && data.evidenceDescription.trim()) {
        // 没有文件时，只发送文字说明
        submitData.evidenceDescription = data.evidenceDescription;
      }

      console.log('Submitting evidence:', submitData);
      return gamesAPI.submitEvidence(id!, submitData);
    },
    {
      onSuccess: () => {
        // 清除草稿
        localStorage.removeItem(`evidence_draft_${id}`);
        toast.success(t('evidence.submitSuccess'), {
          duration: 3000,
          style: {
            background: '#10B981',
            color: 'white',
          }
        });
        queryClient.invalidateQueries(['game', id]);
        navigate(`/game/${id}`);
      },
      onError: (error: any) => {
        let message = t('evidence.submitFailed');

        if (error.response?.status === 400) {
          message = error.response.data?.message || t('evidence.invalidFormat');
        } else if (error.response?.status === 403) {
          message = t('evidence.timeExpired');
        } else if (error.response?.status === 409) {
          message = t('evidence.alreadySubmitted');
        } else if (error.response?.status === 413) {
          message = t('evidence.fileTooLarge');
        } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          message = t('evidence.networkError');
        }

        console.error('Evidence submission error:', error);
        toast.error(message, {
          duration: 5000,
          style: {
            background: '#EF4444',
            color: 'white',
          }
        });
      },
    }
  );

  // 文件选择处理（不再转换为 base64）
  const handleFileSelect = (file: File, content: string) => {
    setSelectedFile(file);
    // 不再保存 base64 到 form，只保存文件对象

    // 创建预览URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // 文件移除处理
  const handleFileRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValue('evidenceContent', '');
    
    // 清理URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  // 获取接受的文件类型
  const getAcceptedTypes = () => {
    switch (evidenceType) {
      case 'PHOTO':
        return ['image/*'];
      case 'VIDEO':
        return ['video/*'];
      default:
        return ['image/*'];
    }
  };

  // 获取支持的文件格式提示
  const getSupportedFormats = () => {
    switch (evidenceType) {
      case 'PHOTO':
        return 'JPG, PNG, GIF, WebP';
      case 'VIDEO':
        return 'MP4, AVI, MOV, WMV, WebM';
      default:
        return '';
    }
  };

  // 表单提交
  const onSubmit = (data: EvidenceForm) => {
    // 验证：必须上传文件或填写文字说明
    // 如果有文件，文字说明可选且无字数限制
    // 如果没有文件，文字说明必填且至少20字符
    const hasFile = selectedFile !== null;
    const hasText = data.evidenceDescription && data.evidenceDescription.trim().length > 0;
    const textLength = data.evidenceDescription?.trim().length || 0;

    console.log('Form validation:', {
      hasFile,
      hasText,
      textLength,
      selectedFile: selectedFile?.name,
      evidenceDescription: data.evidenceDescription
    });

    // 如果没有文件，必须有至少20字符的文字说明
    if (!hasFile && (!hasText || textLength < 20)) {
      toast.error(t('evidence.mustUploadOrText'));
      return;
    }

    // 如果有文件，文字说明可选（可以为空或任意长度）
    // 不需要额外验证

    // 验证必须选择自我评价
    if (data.selfReportedSuccess === null || data.selfReportedSuccess === undefined) {
      toast.error(t('evidence.mustSelectSelfEvaluation'));
      return;
    }

    setShowConfirmDialog(true);
  };

  // 确认提交
  const handleConfirmSubmit = () => {
    const data = getValues();
    setShowConfirmDialog(false);
    submitMutation.mutate(data);
  };

  // 计算剩余时间
  const getTimeRemaining = () => {
    if (!game?.evidenceDeadline) return null;
    
    const deadline = new Date(game.evidenceDeadline);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    }
    
    return `${hours}h ${minutes}m remaining`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Challenge not found</h3>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  const timeRemaining = getTimeRemaining();
  const isExpired = timeRemaining === 'Expired';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/game/${id}`)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Submit Evidence</h1>
        <div className="flex items-center space-x-2">
          {isDraftSaved && (
            <div className="flex items-center space-x-1 text-green-600 text-sm">
              <Save className="w-4 h-4" />
              <span>Saved</span>
            </div>
          )}
        </div>
      </div>

      {/* Challenge Info */}
      <div className="card p-4">
        <h2 className="font-semibold text-gray-900 mb-2">{game.title}</h2>
        <p className="text-sm text-gray-600 mb-3">{game.description}</p>
        
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-500">
            <p>Evidence Instructions: {game.evidenceInstructions}</p>
          </div>
          <div className={`flex items-center space-x-1 ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-medium">{timeRemaining}</span>
          </div>
        </div>
        
        {isExpired && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Evidence submission deadline has passed</span>
            </div>
          </div>
        )}
      </div>

      {/* 单人游戏友好提示 */}
      {!isExpired && participants && participants.length === 1 && (
        <div className="card p-8 text-center bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300">
          <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('evidence.noParticipants.title')}
          </h3>
          <p className="text-gray-600 mb-1">
            {t('evidence.noParticipants.subtitle')}
          </p>
          <p className="text-gray-500 text-sm mb-6">
            {t('evidence.noParticipants.encouragement')}
          </p>

          <div className="space-y-3 mb-6 max-w-md mx-auto">
            <div className="flex items-start space-x-3 text-left bg-white p-3 rounded-lg">
              <Share2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{t('evidence.noParticipants.shareLink')}</p>
                <p className="text-sm text-gray-600">{t('evidence.noParticipants.shareLinkDesc')}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 text-left bg-white p-3 rounded-lg">
              <MessageCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">{t('evidence.noParticipants.shareSocial')}</p>
                <p className="text-sm text-gray-600">{t('evidence.noParticipants.shareSocialDesc')}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const url = window.location.origin + `/game/${id}`;
              navigator.clipboard.writeText(url);
              toast.success(t('evidence.noParticipants.linkCopied'));
            }}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>{t('evidence.noParticipants.copyLink')}</span>
          </button>
        </div>
      )}

      {!isExpired && (!participants || participants.length > 1) && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Evidence Type */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evidence Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${evidenceType === 'PHOTO' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  {...register('evidenceType')}
                  type="radio"
                  value="PHOTO"
                  className="sr-only"
                />
                <Camera className={`w-8 h-8 ${evidenceType === 'PHOTO' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Photo</span>
                <span className="text-xs text-gray-500 text-center">{getSupportedFormats()}</span>
              </label>

              <label className={`flex flex-col items-center space-y-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${evidenceType === 'VIDEO' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  {...register('evidenceType')}
                  type="radio"
                  value="VIDEO"
                  className="sr-only"
                />
                <Video className={`w-8 h-8 ${evidenceType === 'VIDEO' ? 'text-purple-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Video</span>
                <span className="text-xs text-gray-500 text-center">{getSupportedFormats()}</span>
              </label>
            </div>
          </div>

          {/* Evidence Content */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Evidence (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can upload a file, write a text description, or both. At least one is required.
            </p>

            <EvidenceUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              acceptedTypes={getAcceptedTypes()}
              maxSize={evidenceType === 'VIDEO' ? 150 : 30}
              currentFile={selectedFile}
              previewUrl={previewUrl}
              disabled={submitMutation.isLoading}
              supportedFormats={getSupportedFormats()}
            />
          </div>

          {/* Text Description */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {selectedFile ? t('evidence.textDescriptionOptional') : t('evidence.textDescriptionRequired')}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedFile
                ? t('evidence.textDescriptionHintOptional')
                : t('evidence.textDescriptionHintRequired')}
            </p>

            <textarea
              {...register('evidenceDescription')}
              rows={6}
              className="input"
              placeholder={selectedFile
                ? t('evidence.textPlaceholderOptional')
                : t('evidence.textPlaceholderRequired')}
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                {t('evidence.charactersCount', { count: watch('evidenceDescription')?.length || 0 })}
              </p>
              {errors.evidenceDescription && (
                <p className="text-sm text-red-600">{errors.evidenceDescription.message}</p>
              )}
            </div>
          </div>

          {/* Self Evaluation */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Self Evaluation</h3>
            <p className="text-gray-600 mb-4">Please honestly evaluate whether you successfully completed this challenge:</p>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  {...register('selfReportedSuccess')}
                  type="radio"
                  value="true"
                  className="w-4 h-4 text-green-600"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">✅</span>
                  <span className="text-gray-700 font-medium">Successfully Completed</span>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  {...register('selfReportedSuccess')}
                  type="radio"
                  value="false"
                  className="w-4 h-4 text-red-600"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-red-600">❌</span>
                  <span className="text-gray-700 font-medium">Not Completed</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitMutation.isLoading}
            className="w-full btn-primary py-3 text-lg"
          >
            {submitMutation.isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <LoadingSpinner size="sm" />
                <span>Submitting...</span>
              </div>
            ) : (
              'Submit Evidence'
            )}
          </button>
        </form>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your evidence? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitEvidencePageV2;
