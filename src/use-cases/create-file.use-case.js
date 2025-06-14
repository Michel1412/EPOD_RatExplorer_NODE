import { FileBase } from "../domain/bases/file.base.js";
import { GenericTree } from "../domain/generic-tree.js";
import { Result } from "../domain/result.js";

export class CreateFileUseCase {

  constructor() {
    this.genericTree = new GenericTree();
  }

  async execute(fileData) {
    if (!this.isValidParams(fileData)) {
      return Result.fail('Dados para criacao de arquivo inválidos');
    }

    if (!!fileData.path && !fileData.path.includes('/')) {
      fileData.extension = fileData.path;
      fileData.path = '/';
    }

    // Essa parte depende de um path sem o nome da pasta
    const root = await this.getRootToCreate(fileData.path);

    if (!root && !root.leafs && !root.leafs.size) {
      return Result.fail('[CreateFileUseCase] Pasta raiz não encontrada');
    }

    const newFile = new FileBase(fileData);

    const result = await this.genericTree.addNode(newFile);

    if (!result.success) {
      return Result.fail(result.error);
    }
    
    return Result.ok(result.data);
  }

  isValidParams(fileData) {
    return fileData && fileData.name && fileData.extension && fileData.path;
  }

  async getRootToCreate(path) {
    console.log(`[CreateFileUseCase - getRootToCreate] path: ${path}`);
    if (!path || path === '/' || !path.includes('/')) {
      return this.genericTree.getRoot();
    }

    const resultRoot = await this.genericTree.findRoot(path);
    
    if (!resultRoot.success) {
      console.error('[CreateFileUseCase - getRootToCreate] ', resultRoot.error);
      return null;
    }

    return resultRoot.data;
  }

  createLogical() {
    const fs = require('fs');
    const path = require('path');

    const fileName = `file_${Date.now()}.txt`;
    const filePath = path.join(this.currentPath, fileName);

    fs.writeFileSync(filePath, 'Conteúdo do arquivo', 'utf8');
    console.log(`Arquivo criado: ${filePath}`);
  }

  syncTree(tree) {
    this.genericTree = this.genericTree.setRoot(tree);
    return Result.ok(this.genericTree.getRoot());
  }
}