import { FolderBase } from '../domain/bases/folder.base.js';
import { GenericTree } from '../domain/generic-tree.js';
import {Result} from '../domain/result.js';

export class CreateFolderUseCase {
  
  constructor() {
    this.genericTree = new GenericTree();
  }

  async execute(folderData) {
    if (!this.isValidParams(folderData)) {
      return Result.fail('[CreateFolderUseCase] Dados inválidos');
    }
    
    // Essa parte depende de um path sem o nome da pasta
    const root = await this.getRootToCreate(folderData.path);

    if (!root) {
      return Result.fail('[CreateFolderUseCase] Pasta raiz não encontrada');
    }

    const newFolder = new FolderBase(folderData);

    const result = await this.genericTree.addNode(newFolder);

    if (!result.success) {
      return Result.fail(result.error);
    }
    
    return Result.ok(result.data);
  }

  isValidParams(folderData) {
    return folderData && folderData.name;
  }

  async getRootToCreate(path) {
    console.log(`[CreateFolderUseCase - getRootToCreate] path: ${path}`);
    if (!path || path === '/') {
      return this.genericTree.getRoot();
    }

    const resultRoot = await this.genericTree.findRoot(path);
    
    if (!resultRoot.success) {
      console.error('[CreateFolderUseCase - getRootToCreate] ', resultRoot.error);
      return null;
    }

    return resultRoot.data;
  }

  
  createLogical() {
    const fs = require('fs');
    const path = require('path');

    const dirName = `dir_${Date.now()}`;
    const dirPath = path.join(this.currentPath, dirName);

    try {
      fs.mkdirSync(dirPath);
      console.log(`Directory created: ${dirPath}`);
      return dirPath;
    } catch (error) {
      console.error('Error creating directory:', error);
      return null;
    }
  }

  syncTree(tree) {
    this.genericTree = this.genericTree.setRoot(tree);
    return Result.ok(this.genericTree.getRoot());
  }
}