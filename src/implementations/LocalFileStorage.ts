import fs from 'fs';
import path from 'path';
import FileStorage from '../FileStorage';
import { FileStorageConfig, ReadFileOptions, SaveFileOptions } from '../types';

export type LocalFileStorageConfig = FileStorageConfig & {
  basePath: string;
};

export default class LocalFileStorage extends FileStorage {
  private basePath: string;

  constructor(config: LocalFileStorageConfig) {
    super();
    this.basePath = config.basePath as string;
  }

  override async saveFile(filePath: string, data: Buffer, options?: SaveFileOptions): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    await fs.promises.writeFile(fullPath, data, { encoding: options?.encoding || 'utf-8' });
  }

  override async readFile(filePath: string, _options?: ReadFileOptions): Promise<Buffer> {
    const fullPath = path.join(this.basePath, filePath);
    return await fs.promises.readFile(fullPath);
  }

  override async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    await fs.promises.unlink(fullPath);
  }

  override async listFiles(directoryPath: string): Promise<string[]> {
    const fullPath = path.join(this.basePath, directoryPath);
    return await fs.promises.readdir(fullPath);
  }

  override getAbsolutePath(filePath: string): string {
    return path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  }
}
