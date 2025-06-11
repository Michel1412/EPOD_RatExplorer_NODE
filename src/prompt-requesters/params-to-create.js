const fileParams = ['name', 'size', 'type'];

export class ParamToCreate {

    static requestFileParams() {
        console.log('Criacao de Arquivo: \n');

        for (const param of fileParams) {
            console.log(`${param}`);
        }
    }
} 