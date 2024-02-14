import { Storage } from '@google-cloud/storage';
import FileStorage from '../FileStorage';
import { FileStorageConfig, SaveFileOptions } from '../types';

export type GcpStorageConfig = FileStorageConfig & {
  bucketName: string;
  /**
   * The API endpoint of the service used to make requests.
   * Defaults to `storage.googleapis.com`.
   */
  apiEndpoint?: string;
};

export default class GcpStorage extends FileStorage {
  private storage: Storage;
  private bucketName: string;

  constructor(config: GcpStorageConfig) {
    super();
    this.storage = new Storage(config);
    this.bucketName = config.bucketName;
  }

  async saveFile(filePath: string, data: Buffer, options?: SaveFileOptions): Promise<void> {
    const file = this.storage.bucket(this.bucketName).file(filePath);
    await file.save(data, { contentType: options?.contentType });
  }

  async readFile(filePath: string): Promise<Buffer> {
    const file = this.storage.bucket(this.bucketName).file(filePath);
    const data = await file.download();
    return data[0];
  }

  async deleteFile(filePath: string): Promise<void> {
    const file = this.storage.bucket(this.bucketName).file(filePath);
    await file.delete();
  }

  async listFiles(directoryPath: string): Promise<string[]> {
    const [files] = await this.storage.bucket(this.bucketName).getFiles({ prefix: directoryPath });
    return files.map((file) => file.name);
  }
}
