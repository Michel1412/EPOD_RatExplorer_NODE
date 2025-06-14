import { GenericTree } from '../domain/generic-tree.js';
import { CreateFileUseCase } from '../use-cases/create-file.use-case.js';
import { CreateFolderUseCase } from '../use-cases/create-folder.use-case.js';
import StorageService from './storage.service.js';

export class RatExplorer {

    constructor(initialPath = '../storage') {
        this.createFileUseCase = new CreateFileUseCase();
        this.createFolderUseCase = new CreateFolderUseCase();
        this.storageService = new StorageService(initialPath);
        this.tree = this.readStorageOrCreate();
    }

    async readStorageOrCreate() {
        const tree = this.storageService.get();

        if (!tree) {
            this.storageService.upsert(new GenericTree());
            return new GenericTree();
        }

        return tree;
    }

    async handleCreateCommand(data) {
        if (!data || !data.type) {
            console.error('Favor passar o campo \x1b[1m<type>\x1b[0m => create <type> <name>');
            return;
        }

        switch (data.type) {
            case 'folder':
            case 'fol':
                await this.createFolder(data);
                break;
            case 'file':
            case 'fi':
                await this.createFile(data);
                break;
            default:
                console.error('Unknown type for create command:', data.type);
        }
    }

    async createFolder(data) {
        if (!data || typeof data.name !== 'string') {
            console.error('Nomo da Pasta invalido.');
            return;
        }

        const folderData = {
            name: data.name,
            path: data.path || '/'
        }

        const result = await this.createFolderUseCase.execute(folderData);
        
        if (!result.success) {
            console.error('Error creating folder:', result.error);
            return;
        }

        this.syncTree(result.data);
    }

    async createFile(data) {
        if (!data || typeof data.name !== 'string') {
            console.error('Nomo da Pasta invalido.');
            return;
        }

        const fileData = {
            name: data.name,
            path: data.path || '/',
            extension: data.extension || 'txt' 
        }

        const result = await this.createFileUseCase.execute(fileData);
        
        if (!result.success) {
            console.error('Error creating file:', result.error);
            return;
        }

        this.syncTree(result.data);
    }

    async listFiles() {
        return !!this.tree && !!this.tree.leafs ? this.tree : [];
    }

    navigateTo(newPath) {
        const fs = require('fs');
        const path = require('path');

        const targetPath = path.join(this.currentPath, newPath);
        if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            this.currentPath = targetPath;
            return true;
        } else {
            console.error('Invalid directory:', newPath);
            return false;
        }
    }

    getFileDetails(fileName) {
        const fs = require('fs');
        const path = require('path');

        const filePath = path.join(this.currentPath, fileName);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return {
                name: fileName,
                size: stats.size,
                modified: stats.mtime,
                isDirectory: stats.isDirectory()
            };
        } else {
            console.error('File not found:', fileName);
            return null;
        }
    }

    syncTree(tree) {
        this.tree = tree || this.tree;

        console.log('[RatExplorer] Syncing Tree...');
        this.createFileUseCase.syncTree(this.tree);
        this.createFolderUseCase.syncTree(this.tree);
        console.log('[RatExplorer] Tree: ', JSON.stringify(this.tree, null, 2));

        this.storageService.upsert(this.tree);
    }
}