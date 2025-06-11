class FileExplorer {
    constructor(initialPath) {
        this.currentPath = initialPath || process.cwd();
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
}

module.exports = FileExplorer;