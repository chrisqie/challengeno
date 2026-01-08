import { Injectable, BadRequestException } from '@nestjs/common';
import { EvidenceType } from '@prisma/client';

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileInfo?: {
    type: string;
    size: number;
    extension: string;
  };
}

export interface FileValidationOptions {
  maxSize: number; // in bytes
  allowedTypes: string[];
  allowedExtensions: string[];
}

@Injectable()
export class FileValidationService {
  private readonly DEFAULT_MAX_SIZE = 30 * 1024 * 1024; // 30MB
  private readonly VIDEO_MAX_SIZE = 150 * 1024 * 1024; // 150MB

  // 获取证据类型的验证选项
  getValidationOptions(evidenceType: EvidenceType): FileValidationOptions {
    switch (evidenceType) {
      case EvidenceType.PHOTO:
        return {
          maxSize: this.DEFAULT_MAX_SIZE,
          allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        };
      
      case EvidenceType.VIDEO:
        return {
          maxSize: this.VIDEO_MAX_SIZE,
          allowedTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
          allowedExtensions: ['.mp4', '.avi', '.mov', '.wmv', '.webm']
        };
      
      case EvidenceType.DOCUMENT:
        return {
          maxSize: this.DEFAULT_MAX_SIZE,
          allowedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
          ],
          allowedExtensions: ['.pdf', '.doc', '.docx', '.txt']
        };
      
      default:
        return {
          maxSize: this.DEFAULT_MAX_SIZE,
          allowedTypes: ['image/jpeg', 'image/png'],
          allowedExtensions: ['.jpg', '.jpeg', '.png']
        };
    }
  }

  // 验证base64文件内容
  validateBase64File(
    base64Content: string,
    evidenceType: EvidenceType
  ): FileValidationResult {
    try {
      // 解析base64内容
      const fileInfo = this.parseBase64Content(base64Content);
      console.log('File validation - parsed info:', fileInfo);

      if (!fileInfo) {
        console.log('File validation failed: Invalid file format');
        return {
          isValid: false,
          error: 'Invalid file format'
        };
      }

      // 获取验证选项
      const options = this.getValidationOptions(evidenceType);
      console.log('File validation - options:', options);
      console.log('File validation - checking:', {
        fileType: fileInfo.type,
        fileSize: fileInfo.size,
        fileSizeMB: (fileInfo.size / 1024 / 1024).toFixed(2),
        maxSizeMB: (options.maxSize / 1024 / 1024).toFixed(2),
        allowedTypes: options.allowedTypes
      });

      // 验证文件大小
      if (fileInfo.size > options.maxSize) {
        const maxSizeMB = Math.round(options.maxSize / (1024 * 1024));
        console.log(`File validation failed: Size ${(fileInfo.size / 1024 / 1024).toFixed(2)}MB exceeds ${maxSizeMB}MB limit`);
        return {
          isValid: false,
          error: `File size exceeds ${maxSizeMB}MB limit`
        };
      }

      // 验证文件类型
      if (!options.allowedTypes.includes(fileInfo.type)) {
        console.log(`File validation failed: Type '${fileInfo.type}' not in allowed types`);
        return {
          isValid: false,
          error: `File type '${fileInfo.type}' is not allowed. Allowed types: ${options.allowedTypes.join(', ')}`
        };
      }

      console.log('File validation passed!');
      return {
        isValid: true,
        fileInfo
      };
    } catch (error) {
      console.error('File validation error:', error);
      return {
        isValid: false,
        error: 'Failed to validate file'
      };
    }
  }

  // 解析base64内容获取文件信息
  private parseBase64Content(base64Content: string): {
    type: string;
    size: number;
    extension: string;
  } | null {
    try {
      // 检查base64格式
      const matches = base64Content.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) {
        return null;
      }

      const mimeType = matches[1];
      const base64Data = matches[2];

      // 计算文件大小（base64编码后的大小约为原文件的4/3）
      const sizeInBytes = Math.round((base64Data.length * 3) / 4);

      // 获取文件扩展名
      const extension = this.getExtensionFromMimeType(mimeType);

      return {
        type: mimeType,
        size: sizeInBytes,
        extension
      };
    } catch (error) {
      return null;
    }
  }

  // 根据MIME类型获取文件扩展名
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'video/mp4': '.mp4',
      'video/avi': '.avi',
      'video/mov': '.mov',
      'video/wmv': '.wmv',
      'video/webm': '.webm',
      'application/pdf': '.pdf',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'text/plain': '.txt'
    };

    return mimeToExt[mimeType] || '';
  }

  // 验证文件内容安全性（基础检查）
  validateContentSecurity(base64Content: string): FileValidationResult {
    try {
      // 检查是否包含可疑内容
      const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /vbscript:/i,
        /onload=/i,
        /onerror=/i
      ];

      const decodedContent = Buffer.from(
        base64Content.split(',')[1] || base64Content,
        'base64'
      ).toString('utf-8');

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(decodedContent)) {
          return {
            isValid: false,
            error: 'File contains potentially malicious content'
          };
        }
      }

      return { isValid: true };
    } catch (error) {
      // 如果无法解码为文本，可能是二进制文件，这是正常的
      return { isValid: true };
    }
  }

  // 综合验证方法
  validateEvidence(
    evidenceContent: string,
    evidenceType: EvidenceType
  ): void {
    // 对于文本类型，不需要文件验证
    if (evidenceType === EvidenceType.TEXT) {
      if (!evidenceContent || evidenceContent.trim().length < 20) {
        throw new BadRequestException('Text evidence must be at least 20 characters long');
      }
      return;
    }

    // 如果evidenceContent为空或不是base64格式，跳过验证（允许纯文字提交）
    if (!evidenceContent || !evidenceContent.startsWith('data:')) {
      return;
    }

    // 对于文件类型，进行文件验证
    const fileValidation = this.validateBase64File(evidenceContent, evidenceType);
    if (!fileValidation.isValid) {
      throw new BadRequestException(fileValidation.error);
    }

    // 安全性检查
    const securityValidation = this.validateContentSecurity(evidenceContent);
    if (!securityValidation.isValid) {
      throw new BadRequestException(securityValidation.error);
    }
  }

  // 获取文件大小限制信息（用于前端显示）
  getFileSizeLimits(): Record<EvidenceType, number> {
    return {
      [EvidenceType.PHOTO]: this.DEFAULT_MAX_SIZE,
      [EvidenceType.VIDEO]: this.VIDEO_MAX_SIZE,
      [EvidenceType.DOCUMENT]: this.DEFAULT_MAX_SIZE,
      [EvidenceType.TEXT]: 0, // 不适用
      [EvidenceType.AUTOMATIC]: 0, // 不适用
      [EvidenceType.MANUAL]: 0, // 不适用
    };
  }

  // 获取支持的文件类型信息（用于前端显示）
  getSupportedTypes(): Record<EvidenceType, string[]> {
    return {
      [EvidenceType.PHOTO]: ['JPG', 'PNG', 'GIF', 'WebP'],
      [EvidenceType.VIDEO]: ['MP4', 'AVI', 'MOV', 'WMV', 'WebM'],
      [EvidenceType.DOCUMENT]: ['PDF', 'DOC', 'DOCX', 'TXT'],
      [EvidenceType.TEXT]: [], // 不适用
      [EvidenceType.AUTOMATIC]: [], // 不适用
      [EvidenceType.MANUAL]: [], // 不适用
    };
  }
}
