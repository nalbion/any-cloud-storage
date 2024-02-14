import FileStorage from '../FileStorage';
import { FileStorageConfig, SaveFileOptions } from '../types';
import { createClient } from '@supabase/supabase-js';

export type SupabaseStorageConfig = FileStorageConfig & {
  url: string;
  key: string;
  bucket: string;
};

export default class SupabaseStorage extends FileStorage {
  private client;
  private bucket: string;

  constructor(config: SupabaseStorageConfig) {
    super();
    const { url, key, bucket } = config;
    this.client = createClient(url, key);
    this.bucket = bucket;
  }

  override async saveFile(filePath: string, data: Buffer, options?: SaveFileOptions | undefined): Promise<void> {
    await this.client.storage
      .from(this.bucket)
      .update(filePath, data, { contentType: options?.contentType, upsert: true });
  }

  override async readFile(filePath: string): Promise<Buffer> {
    const { data, error } = await this.client.storage.from(this.bucket).download(filePath);
    if (error) {
      throw error;
    }

    return Buffer.from(await (data as any).arrayBuffer());
  }

  override async deleteFile(filePath: string): Promise<void> {
    await this.client.storage.from(this.bucket).remove([filePath]);
  }

  override async listFiles(directoryPath: string): Promise<string[]> {
    const { data, error } = await this.client.storage.from(this.bucket).list(directoryPath);
    if (error) {
      throw error;
    }

    return data.map((entry) => entry.name);
  }

  override getAbsolutePath(filePath: string): string {
    return `${this.client.storage.from(this.bucket).getPublicUrl(filePath)}`;
  }
}
