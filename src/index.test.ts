import path from 'path';
import createStorage from './index';
import { promises as fs } from 'fs';

describe('createStorage', () => {
  const basePath = './examples';
  const testFileName = 'test.txt';
  const testFileContent = 'Hello, world!';

  beforeAll(async () => {
    await fs.mkdir(basePath);
  });

  beforeEach(async () => {});

  afterEach(async () => {
    await fs.rm(path.join(basePath, testFileName));
  });

  afterAll(async () => {
    await fs.rmdir(basePath, { recursive: true });
  });

  it('should save and read a text file', async () => {
    // Given
    const storage = await createStorage({ type: 'file', basePath });

    // When we save a text file
    await storage.saveTextFile(testFileName, testFileContent);

    // Then we can read the saved text file
    const data = await storage.readTextFile(testFileName);
    // Verify the content of the text file
    expect(data).toBe(testFileContent);
  });

  it('should save and read a binary file', async () => {
    const storage = await createStorage({ type: 'file', basePath });

    // When we save a binary file
    const buffer = Buffer.from(testFileContent);
    await storage.saveFile(testFileName, buffer);

    // Then we can read the saved binary file
    const data = await storage.readFile(testFileName);
    // Verify the content of the binary file
    expect(data.toString()).toBe(testFileContent);
  });
});
