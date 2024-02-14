import { S3 } from '@aws-sdk/client-s3';
import { FileNotFound, FileStorageConfig, SaveFileOptions } from '../types';
import FileStorage from '../FileStorage';

export type S3StorageConfig = FileStorageConfig & {
  bucket: string;
};

export default class S3Storage extends FileStorage {
  private s3: S3;
  private bucket: string;

  constructor(config: FileStorageConfig) {
    super();
    this.s3 = new S3(config);
    this.bucket = String(config.bucket);
  }

  override async saveFile(filePath: string, data: Buffer, options?: SaveFileOptions): Promise<void> {
    await this.s3.putObject({
      Bucket: this.bucket,
      Key: filePath,
      Body: data,
      ContentType: options?.contentType,
    });
  }

  override async readFile(filePath: string): Promise<Buffer> {
    const response = await this.s3.getObject({
      Bucket: this.bucket,
      Key: filePath,
    });

    if (response.Body === undefined) {
      throw new FileNotFound(filePath);
    }

    // Untested
    return response.Body.read();
  }

  override async deleteFile(filePath: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucket,
      Key: filePath,
    });
  }

  override async listFiles(directoryPath: string): Promise<string[]> {
    const response = await this.s3.listObjectsV2({
      Bucket: this.bucket,
      Prefix: directoryPath,
    });

    return response.Contents?.map((item) => item.Key || '') || [];
  }

  override getAbsolutePath(filePath: string): string {
    return `https://${this.bucket}.s3.amazonaws.com/${filePath}`;
  }
}
