import * as fs from 'fs';
import { simpleGit, type SimpleGitOptions, type SimpleGit } from 'simple-git';

import LocalFileStorage, { LocalFileStorageConfig } from './LocalFileStorage';
import { SaveFileOptions } from '../types';

export type GitStorageConfig = LocalFileStorageConfig & {
  repoUrl: string;
  username: string;
  options?: Partial<SimpleGitOptions>;
};

export default class GitStorage extends LocalFileStorage {
  private readonly git: SimpleGit;

  constructor(config: GitStorageConfig) {
    super(config);

    const git = config.options ? simpleGit(config.options) : simpleGit(config.basePath);

    git
      .init((result) => {
        console.log('git repo initialised:', JSON.stringify(result, null, 2));
      })
      .addRemote('main', config.repoUrl, (result) => {
        console.log('remote added:', JSON.stringify(result, null, 2));
      })
      .addConfig('user.name', config.username, (result) => {
        console.log('user name set:', JSON.stringify(result, null, 2));
      })
      .catch((err) => {
        console.error('Failed to initialise git:', err);
      });

    this.git = git;
  }

  override async saveFile(filePath: string, data: Buffer, options?: SaveFileOptions): Promise<void> {
    super.saveFile(filePath, data, options);
    await this.git.add(filePath);
    await this.git.commit(options?.description || `Update ${filePath}`);
    await this.git.push();
  }
}
