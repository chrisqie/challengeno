import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

// 文件类型定义
export type FileType = 'image' | 'video';

export interface PresignedUploadUrl {
  uploadUrl: string;      // 预签名上传 URL
  fileUrl: string;        // 文件最终的 CDN URL
  key: string;            // 文件在 OSS 中的 key
  expiresIn: number;      // 签名过期时间（秒）
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private s3Client: S3Client | null = null;
  private bucket: string;
  private cdnEndpoint: string;
  private isConfigured: boolean = false;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('SPACES_ENDPOINT');
    const region = this.configService.get<string>('SPACES_REGION');
    const accessKeyId = this.configService.get<string>('SPACES_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('SPACES_SECRET_ACCESS_KEY');

    this.bucket = this.configService.get<string>('SPACES_BUCKET');

    // CDN_ENDPOINT: 如果未配置，使用默认的 CDN URL
    const cdnEndpoint = this.configService.get<string>('CDN_ENDPOINT');
    this.cdnEndpoint = cdnEndpoint || `https://${this.bucket}.${region}.cdn.digitaloceanspaces.com`;

    if (!endpoint || !region || !accessKeyId || !secretAccessKey || !this.bucket) {
      this.logger.warn('⚠️  DigitalOcean Spaces configuration is missing - file upload features will be disabled');
      this.isConfigured = false;
      return;
    }

    this.s3Client = new S3Client({
      endpoint: `https://${endpoint}`,
      region: region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: false, // DigitalOcean Spaces uses virtual-hosted-style URLs
    });

    this.isConfigured = true;
    this.logger.log(`✅ UploadService initialized with bucket: ${this.bucket}`);
    this.logger.log(`📍 CDN Endpoint: ${this.cdnEndpoint}`);
  }

  /**
   * 上传文件到 DigitalOcean Spaces
   * @param file - 文件 Buffer
   * @param folder - 文件夹路径（例如：'evidence', 'avatars'）
   * @param filename - 文件名（可选，不提供则自动生成）
   * @returns CDN URL
   */
  async uploadFile(
    file: Buffer,
    folder: string,
    filename?: string,
    contentType?: string,
  ): Promise<string> {
    if (!this.isConfigured || !this.s3Client) {
      throw new BadRequestException('文件上传功能未配置，请联系管理员');
    }

    try {
      // 生成唯一文件名
      const uniqueFilename = filename || this.generateUniqueFilename();
      const key = `${folder}/${uniqueFilename}`;

      // 上传到 Spaces
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ACL: 'public-read', // 公开读取
        ContentType: contentType || 'application/octet-stream',
      });

      await this.s3Client.send(command);

      // 返回 CDN URL
      const cdnUrl = `${this.cdnEndpoint}/${key}`;
      this.logger.log(`File uploaded successfully: ${cdnUrl}`);
      
      return cdnUrl;
    } catch (error) {
      this.logger.error(`Failed to upload file: ${error.message}`, error.stack);
      throw new BadRequestException('文件上传失败');
    }
  }

  /**
   * 上传 base64 图片
   * @param base64Data - base64 字符串（包含 data:image/jpeg;base64, 前缀）
   * @param folder - 文件夹路径
   * @param filename - 文件名（可选）
   * @returns CDN URL
   */
  async uploadBase64Image(
    base64Data: string,
    folder: string,
    filename?: string,
  ): Promise<string> {
    try {
      // 解析 base64 数据
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new BadRequestException('Invalid base64 image data');
      }

      const contentType = matches[1];
      const base64Content = matches[2];
      const buffer = Buffer.from(base64Content, 'base64');

      // 验证文件大小（最大 10MB）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (buffer.length > maxSize) {
        throw new BadRequestException('文件大小超过限制（最大10MB）');
      }

      // 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(contentType)) {
        throw new BadRequestException('不支持的图片格式');
      }

      // 生成文件名
      const ext = this.getExtensionFromMimeType(contentType);
      const uniqueFilename = filename || `${this.generateUniqueFilename()}.${ext}`;

      return await this.uploadFile(buffer, folder, uniqueFilename, contentType);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to upload base64 image: ${error.message}`, error.stack);
      throw new BadRequestException('图片上传失败');
    }
  }

  /**
   * 上传 base64 视频
   * @param base64Data - base64 字符串
   * @param folder - 文件夹路径
   * @param filename - 文件名（可选）
   * @returns CDN URL
   */
  async uploadBase64Video(
    base64Data: string,
    folder: string,
    filename?: string,
  ): Promise<string> {
    try {
      // 使用字符串操作而不是正则表达式，避免大文件时的性能问题
      if (!base64Data.startsWith('data:')) {
        throw new BadRequestException('Invalid base64 video data format');
      }

      const commaIndex = base64Data.indexOf(',');
      if (commaIndex === -1) {
        throw new BadRequestException('Invalid base64 video data format');
      }

      const header = base64Data.substring(0, commaIndex);
      const base64Content = base64Data.substring(commaIndex + 1);

      // 提取 content type
      const contentTypeMatch = header.match(/^data:([^;]+);base64$/);
      if (!contentTypeMatch) {
        throw new BadRequestException('Invalid base64 video data format');
      }

      const contentType = contentTypeMatch[1];
      const buffer = Buffer.from(base64Content, 'base64');

      // 验证文件大小（最大 150MB）
      const maxSize = 150 * 1024 * 1024; // 150MB
      if (buffer.length > maxSize) {
        throw new BadRequestException('视频大小超过限制（最大150MB）');
      }

      // 验证文件类型
      const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!allowedTypes.includes(contentType)) {
        throw new BadRequestException('不支持的视频格式');
      }

      const ext = this.getExtensionFromMimeType(contentType);
      const uniqueFilename = filename || `${this.generateUniqueFilename()}.${ext}`;

      return await this.uploadFile(buffer, folder, uniqueFilename, contentType);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to upload base64 video: ${error.message}`, error.stack);
      throw new BadRequestException('视频上传失败');
    }
  }

  /**
   * 删除文件
   * @param fileUrl - 文件的 CDN URL
   */
  async deleteFile(fileUrl: string): Promise<void> {
    if (!this.isConfigured || !this.s3Client) {
      this.logger.warn('File upload not configured, skipping delete');
      return;
    }

    try {
      // 从 CDN URL 提取 key
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        this.logger.warn(`Invalid file URL: ${fileUrl}`);
        return;
      }

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      // 不抛出异常，删除失败不影响主流程
    }
  }

  /**
   * 检查文件是否存在
   * @param fileUrl - 文件的 CDN URL
   * @returns boolean
   */
  async fileExists(fileUrl: string): Promise<boolean> {
    if (!this.isConfigured || !this.s3Client) {
      return false;
    }

    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) return false;

      const command = new HeadObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 生成预签名 URL（用于私有文件访问）
   * @param fileUrl - 文件的 CDN URL
   * @param expiresIn - 过期时间（秒），默认 3600
   * @returns 预签名 URL
   */
  async getSignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
    if (!this.isConfigured || !this.s3Client) {
      throw new BadRequestException('文件上传功能未配置，请联系管理员');
    }

    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (!key) {
        throw new BadRequestException('Invalid file URL');
      }

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      const signedUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`, error.stack);
      throw new BadRequestException('生成访问链接失败');
    }
  }

  /**
   * 生成唯一文件名
   */
  private generateUniqueFilename(): string {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString('hex');
    return `${timestamp}_${randomString}`;
  }

  /**
   * 生成预签名上传 URL（前端直接上传到 OSS）
   * @param fileType - 文件类型（image 或 video）
   * @param folder - 文件夹路径
   * @param contentType - MIME 类型
   * @param userId - 用户ID（可选，用于生成唯一文件名）
   * @returns 预签名 URL 信息
   */
  async generatePresignedUploadUrl(
    fileType: FileType,
    folder: string,
    contentType: string,
    userId?: string,
  ): Promise<PresignedUploadUrl> {
    if (!this.isConfigured || !this.s3Client) {
      throw new BadRequestException('文件上传功能未配置，请联系管理员');
    }

    try {
      // 验证文件类型
      const allowedTypes = this.getAllowedContentTypes(fileType);
      if (!allowedTypes.includes(contentType)) {
        throw new BadRequestException(`不支持的${fileType === 'image' ? '图片' : '视频'}格式`);
      }

      // 生成唯一文件名
      const ext = this.getExtensionFromMimeType(contentType);
      const timestamp = Date.now();
      const randomString = crypto.randomBytes(8).toString('hex');
      const filename = userId
        ? `${userId}_${timestamp}_${randomString}.${ext}`
        : `${timestamp}_${randomString}.${ext}`;

      const key = `${folder}/${filename}`;

      // 生成预签名 URL（15分钟有效期）
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: contentType,
        ACL: 'public-read',
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: 900, // 15分钟
      });

      // 生成 CDN URL
      const fileUrl = `${this.cdnEndpoint}/${key}`;

      return {
        uploadUrl,
        fileUrl,
        key,
        expiresIn: 900,
      };
    } catch (error) {
      this.logger.error(`Failed to generate presigned URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * 获取允许的 Content-Type 列表
   */
  private getAllowedContentTypes(fileType: FileType): string[] {
    if (fileType === 'image') {
      return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    } else if (fileType === 'video') {
      return ['video/mp4', 'video/webm', 'video/quicktime'];
    }
    return [];
  }

  /**
   * 从 MIME 类型获取文件扩展名
   */
  private getExtensionFromMimeType(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/quicktime': 'mov',
    };
    return mimeToExt[mimeType] || 'bin';
  }

  /**
   * 从 CDN URL 提取文件 key
   */
  private extractKeyFromUrl(url: string): string | null {
    try {
      // CDN URL 格式: https://app-together.nyc3.cdn.digitaloceanspaces.com/folder/filename.jpg
      // Origin URL 格式: https://app-together.nyc3.digitaloceanspaces.com/folder/filename.jpg
      const urlObj = new URL(url);
      // 移除开头的 '/'
      return urlObj.pathname.substring(1);
    } catch (error) {
      return null;
    }
  }

  /**
   * 获取上传服务配置状态
   * @returns 配置状态信息
   */
  getConfigStatus() {
    const endpoint = this.configService.get<string>('SPACES_ENDPOINT');
    const region = this.configService.get<string>('SPACES_REGION');
    const accessKeyId = this.configService.get<string>('SPACES_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('SPACES_SECRET_ACCESS_KEY');
    const cdnEndpointFromEnv = this.configService.get<string>('CDN_ENDPOINT');

    return {
      isConfigured: this.isConfigured,
      config: {
        endpoint: endpoint || '未配置',
        region: region || '未配置',
        bucket: this.bucket || '未配置',
        cdnEndpoint: this.cdnEndpoint || '未配置',
        cdnEndpointSource: cdnEndpointFromEnv ? '来自配置文件' : '自动生成',
        hasAccessKey: !!accessKeyId,
        hasSecretKey: !!secretAccessKey,
      },
      message: this.isConfigured
        ? '文件上传功能已配置'
        : '文件上传功能未配置，请检查环境变量：SPACES_ENDPOINT, SPACES_REGION, SPACES_BUCKET, SPACES_ACCESS_KEY_ID, SPACES_SECRET_ACCESS_KEY'
    };
  }
}

