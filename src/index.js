// This file is the entry point of the application. It initializes the file explorer and handles user input from the terminal.

import {RatExplorer} from './service/rat-explorer.js';

const explorer = new RatExplorer();

const runExplorer = async () => {
    console.clear();
    console.log('Welcome to the File Explorer CLI!');
    console.log('Type "help" for a list of commands.');

    process.stdin.on('data', async (data) => {
        const commandParts = data.toString().trim().split(' ');
        await handleCommand(commandParts);
    });
};

const handleCommand = async (commandParts) => {
    switch (commandParts[0]) {
        case 'help':
            console.log('Available commands:');
            console.log('list - List files in the current directory');
            // FELIPE VALIDA ISSO AQUI           |
            // FELIPE VALIDA ISSO AQUI           |
            // FELIPE VALIDA ISSO AQUI           v
            console.log('create <type> <name> <path> <ext> - Create a new folder Types: "folder", "file"');
            console.log('clean - Clear the console');
            console.log('navigate <path> - Navigate to a different directory');
            console.log('details <file> - Get details of a specific file');
            console.log('exit - Exit the application');
            break; 
        case 'create':
            const params = commandParts.slice(1);

            if (!params) {
                console.log('Por favor forneca um nome de uma pasta.');
                return;
            }

            const data = {
                type: params[0],
                name: params[1],
                path: params[2] ? params[2] : '/',
                extension: params[3] ? params[3] : null
            }

            console.log(`Creating folder: ${JSON.stringify(data)}`);
            await explorer.handleCreateCommand(data);
            break;
        case 'list':
            await explorer.listFiles();
            break;
        case commandParts[0].startsWith('navigate '):
            const path = commandParts[1];
            await explorer.navigateTo(path);
            break;
        case commandParts[0].startsWith('details '):
            const fileName = commandParts[1];
            await explorer.getFileDetails(fileName);
            break;
        case 'exit':
            console.log('Exiting the File Explorer CLI. Goodbye!');
            process.exit();
            break;
        case 'clean': // Limpa a tela do console
            console.clear();
            break;
        default:
            console.log('Unknown command. Type "help" for a list of commands.');
    }
};

runExplorer();