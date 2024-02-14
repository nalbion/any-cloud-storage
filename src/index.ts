import FileStorage from './FileStorage';
import FileStorageFactory from './FileStorageFactory';
import { FileStorageConfig } from './types';

export { default as FileStorage } from './FileStorage';
export { default as FileStorageFactory } from './FileStorageFactory';
export { default as LocalFileStorage } from './implementations/LocalFileStorage';
export * from './types';

/**
 * @example
 *
 *  import createStorage from 'any-cloud-storage';
 *
 *  const storage = await createStorage({ type: 'file', basePath: '/tmp' });
 *
 *  await storage.saveTextFile('test.txt', 'Hello, world!');
 *  const data = await storage.readTextFile('test.txt');
 */
const createStorage = (config: FileStorageConfig): Promise<FileStorage> => {
  return FileStorageFactory.create(config);
};

export default createStorage;
