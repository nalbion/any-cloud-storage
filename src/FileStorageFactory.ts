import type FileStorage from './FileStorage';
import { FileStorageConfig } from './types';

export default class FileStorageFactory {
  static async create(config: FileStorageConfig): Promise<FileStorage> {
    switch (config.type) {
      case 'file':
        return await createFileStorage(config);
      case 'firebase':
        return await createFirebaseStorage(config);
      case 'gcp':
        return await createGcpStorage(config);
      case 'git':
        return await createGitStorage(config);
      case 's3':
        return await createS3Storage(config);
      case 'supabase':
        return await createSupabaseStorage(config);
      default:
        throw new Error(`Unsupported storage type: ${config.type}`);
    }
  }
}

async function createFirebaseStorage(config: Record<string, any>): Promise<FileStorage> {
  const { default: FirebaseClientFileStorage } = await import('./implementations/FirebaseClientStorage');
  return new FirebaseClientFileStorage(config.storage);
}

async function createGcpStorage(config: Record<string, any>): Promise<FileStorage> {
  const { default: GcpStorage } = await import('./implementations/GcpStorage');
  return new GcpStorage(config as any);
}

async function createGitStorage(config: Record<string, any>): Promise<FileStorage> {
  const { default: GitStorage } = await import('./implementations/GitStorage');
  return new GitStorage(config as any);
}

async function createFileStorage(config: Record<string, any>): Promise<FileStorage> {
  const { default: LocalFileStorage } = await import('./implementations/LocalFileStorage');
  return new LocalFileStorage(config as any);
}

async function createS3Storage(config: Record<string, any>): Promise<FileStorage> {
  const { default: S3Storage } = await import('./implementations/S3Storage');
  return new S3Storage(config as any);
}

async function createSupabaseStorage(config: Record<string, any>): Promise<FileStorage> {
  const { default: SupabaseStorage } = await import('./implementations/SupabaseStorage');
  return new SupabaseStorage(config as any);
}
