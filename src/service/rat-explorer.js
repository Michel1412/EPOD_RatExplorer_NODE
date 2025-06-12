import path from 'path';
import { GenericTree } from '../domain/generic-tree.js';
import { CreateFileUseCase } from '../use-cases/create-file.use-case.js';
import { CreateFolderUseCase } from '../use-cases/create-folder.use-case.js';

export class RatExplorer {

    constructor(initialPath) {
        this.currentPath = `${initialPath || process.cwd()}/test`;
        this.createFileUseCase = new CreateFileUseCase();
        this.createFolderUseCase = new CreateFolderUseCase();
        this.tree = new GenericTree();
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
                this.createFile();
                break;
            default:
                console.error('Unknown type for create command:', data.type);
        }
    }

    async createFolder(data) {
        if (!data || typeof data.name !== 'string') {
            console.error('Invalid folder data');
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

    createFile() {
        this.tree = this.createFileUseCase.execute();
        this.syncTree();

        const fs = require('fs');
        const path = require('path');

        const fileName = `file_${Date.now()}.txt`;
        const filePath = path.join(this.currentPath, fileName);

        try {
            fs.writeFileSync(filePath, 'This is a test file.');
            console.log(`File created: ${filePath}`);
            return filePath;
        } catch (error) {
            console.error('Error creating file:', error);
            return null;
        }
    }

    listFiles() {
        const fs = require('fs');
        const path = require('path');

        try {
            const files = fs.readdirSync(this.currentPath);
            return files.map(file => {
                const filePath = path.join(this.currentPath, file);
                const stats = fs.statSync(filePath);
                return {
                    name: file,
                    isDirectory: stats.isDirectory(),
                    size: stats.size,
                    modified: stats.mtime
                };
            });
        } catch (error) {
            console.error('Error reading directory:', error);
            return [];
        }
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
    }
}