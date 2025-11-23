import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import crypto from 'crypto';

class StorageService {
  private s3Client: S3Client | null = null;
  private bucket: string;

  constructor() {
    this.bucket = env.AWS_S3_BUCKET;

    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY) {
      this.s3Client = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
        ...(env.AWS_S3_ENDPOINT && { endpoint: env.AWS_S3_ENDPOINT }),
      });
    } else {
      logger.warn('AWS S3 credentials not configured. File operations will fail.');
    }
  }

  async uploadFile(
    projectId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ path: string; size: number }> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    // Generate unique file path
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(8).toString('hex');
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `projects/${projectId}/${timestamp}_${randomId}_${sanitizedFileName}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        })
      );

      logger.info(`File uploaded to S3: ${key}`);

      return {
        path: key,
        size: fileBuffer.length,
      };
    } catch (error) {
      logger.error('Failed to upload file to S3:', error);
      throw error;
    }
  }

  async generateDownloadUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: filePath,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      return url;
    } catch (error) {
      logger.error('Failed to generate download URL:', error);
      throw error;
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!this.s3Client) {
      throw new Error('S3 client not configured');
    }

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: filePath,
        })
      );

      logger.info(`File deleted from S3: ${filePath}`);
    } catch (error) {
      logger.error('Failed to delete file from S3:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
