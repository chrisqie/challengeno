import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, Image, Video, AlertCircle, CheckCircle } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface EvidenceUploadProps {
  onFileSelect: (file: File, content: string) => void;
  onFileRemove: () => void;
  acceptedTypes: string[];
  maxSize: number; // in MB
  currentFile?: File | null;
  previewUrl?: string | null;
  disabled?: boolean;
  supportedFormats?: string;
}

interface FileValidation {
  isValid: boolean;
  error?: string;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes,
  maxSize,
  currentFile,
  previewUrl,
  disabled = false,
  supportedFormats = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 文件验证
  const validateFile = (file: File): FileValidation => {
    // 检查文件大小
    if (file.size > maxSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size exceeds ${maxSize}MB limit`
      };
    }

    // 检查文件类型
    const fileType = file.type;
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image/*') return fileType.startsWith('image/');
      if (type === 'video/*') return fileType.startsWith('video/');
      if (type === 'application/*') return fileType.startsWith('application/');
      return fileType === type;
    });

    if (!isValidType) {
      return {
        isValid: false,
        error: `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  };

  // 处理文件选择
  const handleFileSelect = useCallback(async (file: File) => {
    if (disabled) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // 读取文件内容
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setUploadProgress(100);
        setTimeout(() => {
          onFileSelect(file, content);
          setIsProcessing(false);
          setUploadProgress(0);
        }, 500);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File processing error:', error);
      setIsProcessing(false);
      setUploadProgress(0);
      alert('Failed to process file');
    }
  }, [disabled, maxSize, acceptedTypes, onFileSelect]);

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, handleFileSelect]);

  // 点击上传
  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 文件输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // 获取文件图标
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (file.type.startsWith('video/')) return <Video className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* 上传区域 */}
      {!currentFile && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
            ${isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          {isProcessing ? (
            <div className="space-y-4">
              <LoadingSpinner size="lg" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Processing file...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop files here or click to upload
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Max size: {maxSize}MB
                </p>
                {supportedFormats && (
                  <p className="text-xs text-gray-400 mt-1">
                    Supported formats: {supportedFormats}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 文件预览 */}
      {currentFile && (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-blue-600">
                {getFileIcon(currentFile)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{currentFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(currentFile.size)}</p>
              </div>
            </div>
            <button
              onClick={onFileRemove}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              disabled={disabled}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 预览内容 */}
          {previewUrl && (
            <div className="mt-4">
              {currentFile.type.startsWith('image/') && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg border"
                />
              )}
              {currentFile.type.startsWith('video/') && (
                <video
                  src={previewUrl}
                  controls
                  className="max-w-full max-h-64 mx-auto rounded-lg border"
                />
              )}
            </div>
          )}

          {/* 状态指示 */}
          <div className="flex items-center space-x-2 mt-3 text-sm">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-600">File ready for submission</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceUpload;
