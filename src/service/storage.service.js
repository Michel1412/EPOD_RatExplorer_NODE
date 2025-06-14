import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export class StorageService {

    constructor(initialPath = '../storage') {
        this.fs = fs;
        this.path = path;
        // Corrigir __dirname para ES Modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.dirPath = this.path.join(__dirname, initialPath);
        this.filePath = this.path.join(this.dirPath, 'tree.json');
    }

    upsert(tree) {
        if (!this.fs.existsSync(this.dirPath)) {
            this.fs.mkdirSync(this.dirPath, { recursive: true });
        }

        this.fs.writeFileSync(this.filePath, JSON.stringify(tree), 'utf8');
        console.log(`File created: ${this.filePath}`);
    }

    get() {
        if (!this.fs.existsSync(this.dirPath)) {
            this.fs.mkdirSync(this.dirPath, { recursive: true });
        }
        if (!this.fs.existsSync(this.filePath)) {
            // Se o arquivo não existe, retorna null para evitar erro
            return null;
        }
        const data = this.fs.readFileSync(this.filePath, 'utf8');
        console.log(`File read: ${this.filePath} => result: ${data}`);
        return JSON.parse(data);
    }
}

export default StorageService;