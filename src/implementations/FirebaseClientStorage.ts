import FileStorage from '../FileStorage';
import { FileStorageConfig, SaveFileOptions } from '../types';

type FirebaseFileStorageConfig = FileStorageConfig & {
  /** eg: "gs://my-custom-bucket" */
  bucketUrl?: string;
};

import { getApp } from 'firebase/app';
import { ref, uploadBytes, getBytes, deleteObject, getStorage, FirebaseStorage, list } from 'firebase/storage';

export default class FirebaseClientFileStorage extends FileStorage {
  private storage: FirebaseStorage;

  constructor(config: FirebaseFileStorageConfig) {
    super();
    const app = getApp();
    this.storage = getStorage(app, config.bucketUrl);
  }

  override async saveFile(filePath: string, data: Buffer, options?: SaveFileOptions): Promise<void> {
    await uploadBytes(this.getRef(filePath), data, {
      contentDisposition: filePath,
      contentEncoding: options?.encoding,
    });
  }

  override async readFile(filePath: string): Promise<Buffer> {
    // not available in Node: getBlob(this.getRef(filePath));
    const bytes = await getBytes(this.getRef(filePath));
    return Buffer.from(bytes);
  }

  override async deleteFile(filePath: string): Promise<void> {
    await deleteObject(this.getRef(filePath));
  }

  override async listFiles(directoryPath: string): Promise<string[]> {
    const files = await list(this.getRef(directoryPath));
    return files.items.map((file) => file.name);
  }

  private getRef(filePath: string) {
    return ref(this.storage, filePath);
  }
}
