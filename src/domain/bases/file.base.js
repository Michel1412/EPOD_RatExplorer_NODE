export class FileBase {

    constructor(data) {
        this.name = data.name;
        this.path = data.path || '/';
        this.extension = data.extension || 'txt'; 
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }
}