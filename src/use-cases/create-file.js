import { Result } from '../core/logic/Result';

export class CreateFile {

  constructor() {
    this.genericTree = new GenericTree();
  }

  async execute(fileData) {
    if (!this.isValidParams(fileData)) {
      return Result.fail('Dados para criacao de arquivo inválidos');
    }
  }

  isValidParams(fileData) {
    return fileData && fileData.name && fileData.extencion && fileData.path;
  }
}