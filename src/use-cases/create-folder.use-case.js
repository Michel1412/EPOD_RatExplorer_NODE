export class CreateFolderUseCase {
  
  constructor() {
    this.genericTree = new GenericTree();
  }

  async execute(folderData) {
    if (!this.isValidParams(folderData)) {
      return Result.fail('Dados para criacao de pasta inválidos');
    }
    
    // Logic to create a folder using the genericTree
    const result = await this.genericTree.createFolder(folderData);
    
    if (result.isFailure) {
      return Result.fail(result.error);
    }
    
    return Result.ok(result.value);
  }

  isValidParams(folderData) {
    return folderData && folderData.name && folderData.path;
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

}