import React, { useState, useRef } from 'react';
import { Camera, Upload, X, RotateCcw, Check, Loader } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useQueryClient } from 'react-query';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface AvatarUploadProps {
  currentAvatar?: string;
  onAvatarChange: (avatarUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
  allowRemove?: boolean;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 'md',
  allowRemove = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    if (!file) return;

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件');
      return;
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('图片大小不能超过5MB');
      return;
    }

    // 创建预览
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传文件
    uploadFile(file);
  };

  // 上传文件（直接上传到 OSS）
  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      console.log('🔄 开始上传头像:', file.name, file.size, file.type);

      // 1. 获取预签名 URL
      const urlResponse = await usersAPI.getAvatarUploadUrl({ contentType: file.type });
      console.log('✅ 获取上传签名成功:', urlResponse.data);

      const { uploadUrl, fileUrl } = urlResponse.data.data;

      // 2. 直接上传到 OSS
      console.log('📤 开始上传到 OSS...');
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
          'x-amz-acl': 'public-read', // 设置文件为公开可读
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('上传到 OSS 失败');
      }

      console.log('✅ 上传到 OSS 成功');

      // 3. 确认上传完成
      const confirmResponse = await usersAPI.confirmAvatarUpload({ avatarUrl: fileUrl });
      console.log('✅ 头像更新成功:', confirmResponse.data);

      onAvatarChange(fileUrl);
      toast.success('头像上传成功');
      setPreviewUrl(null);

      // 更新用户状态
      updateUser({ avatar: fileUrl });

      // 刷新所有相关缓存
      queryClient.invalidateQueries(['user-profile']);
      queryClient.invalidateQueries(['auth-user']);
      queryClient.invalidateQueries(['user-achievements']);

      // 强制重新获取用户资料
      queryClient.refetchQueries(['user-profile', user?.id]);
    } catch (error: any) {
      console.error('❌ 头像上传失败:', error);
      console.error('❌ 错误详情:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });

      // 显示具体的错误信息
      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          '头像上传失败，请重试';
      console.error('具体错误:', errorMessage);
      toast.error(errorMessage);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  // 处理拖拽
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // 移除头像
  const handleRemoveAvatar = () => {
    onAvatarChange('');
    setPreviewUrl(null);
    toast.success('头像已移除');
  };

  // 重新选择
  const handleReselect = () => {
    setPreviewUrl(null);
    fileInputRef.current?.click();
  };

  const displayAvatar = previewUrl || currentAvatar;

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* 头像显示区域 */}
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden border-2 border-dashed transition-colors ${
          dragOver 
            ? 'border-blue-400 bg-blue-50' 
            : displayAvatar 
              ? 'border-gray-300' 
              : 'border-gray-400 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {displayAvatar ? (
          <>
            <img
              src={displayAvatar}
              alt="头像"
              className="w-full h-full object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Loader className={`${iconSizes[size]} text-white animate-spin`} />
              </div>
            )}
            {previewUrl && !isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Check className={`${iconSizes[size]} text-white`} />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Camera className={iconSizes[size]} />
            <span className="text-xs mt-1">头像</span>
          </div>
        )}

        {/* 悬浮操作按钮 */}
        {displayAvatar && !isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all"
              title="更换头像"
            >
              <Camera className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center space-x-2">
        {!displayAvatar && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            disabled={isUploading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>上传头像</span>
          </button>
        )}

        {previewUrl && !isUploading && (
          <>
            <button
              onClick={handleReselect}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>重选</span>
            </button>
          </>
        )}

        {displayAvatar && allowRemove && !previewUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveAvatar();
            }}
            className="flex items-center space-x-1 px-3 py-2 text-red-600 text-sm border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>移除</span>
          </button>
        )}
      </div>

      {/* 文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />

      {/* 提示信息 */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          支持 JPG、PNG 格式，最大 5MB
        </p>
        {dragOver && (
          <p className="text-xs text-blue-600 mt-1">
            松开鼠标上传图片
          </p>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
