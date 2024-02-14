export type StorageType = 'firebase' | 'gcp' | 'git' | 'file' | 's3' | 'supabase';

export type ConfigValue = string | number | boolean | FileStorageConfig;

export type FileStorageConfig = {
  type: StorageType;
  [key: string]: ConfigValue | ConfigValue[];
};

export type ReadFileOptions = {
  encoding?: BufferEncoding;
};

export type SaveFileOptions = {
  encoding?: BufferEncoding;
  /** Used for git commit message */
  description?: string;
  contentType?: string;
};

export class FileNotFound extends Error {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`);
  }
}
