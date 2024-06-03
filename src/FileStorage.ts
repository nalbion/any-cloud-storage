import { ReadFileOptions, SaveFileOptions } from './types';

/** Implementations include Local file, S3, Git, Firebase & GCP storage. */ 
export default abstract class FileStorage {
  abstract saveFile(filePath: string, data: Buffer, options?: SaveFileOptions): Promise<void>;
  abstract readFile(filePath: string, options?: ReadFileOptions): Promise<Buffer>;
  abstract deleteFile(filePath: string): Promise<void>;
  abstract listFiles(directoryPath: string): Promise<string[]>;

  async saveTextFile(filePath: string, data: string, options?: SaveFileOptions): Promise<void> {
    await this.saveFile(filePath, Buffer.from(data, options?.encoding || 'utf-8'), options);
  }

  async readTextFile(filePath: string, options?: ReadFileOptions): Promise<string> {
    return (await this.readFile(filePath)).toString(options?.encoding || 'utf-8');
  }

  abstract getAbsolutePath(filePath: string): string | Promise<string>;
}
