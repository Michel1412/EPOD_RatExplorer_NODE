export class FileBase {
    constructor(name, size, type) {
        if (!name || !size || !type) {
            throw new Error('Name, size, and type are required for FileBase');
        }
        
        this.name = name;
        this.size = size; 
        this.type = type;
    }

    getName() {
        return this.name;
    }

    getSize() {
        return this.size;
    }

    getType() {
        return this.type;
    }
}