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
  }

  isValidParams(fileData) {
    return fileData && fileData.name && fileData.extension && fileData.path;
  }


  syncTree(tree) {
    this.genericTree = this.genericTree.setRoot(tree);
    return Result.ok(this.genericTree.getRoot());
  }
}