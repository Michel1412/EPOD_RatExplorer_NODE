// This file is the entry point of the application. It initializes the file explorer and handles user input from the terminal.

import RatExplorer from './service/rat-explorer.js';

const explorer = new RatExplorer();

const runExplorer = async () => {
    console.log('Welcome to the File Explorer CLI!');
    console.log('Type "help" for a list of commands.');

    process.stdin.on('data', async (data) => {
        const command = data.toString().trim();
        await handleCommand(command);
    });
};

const handleCommand = async (command) => {
    switch (command) {
        case 'help':
            console.log('Available commands:');
            console.log('list - List files in the current directory');
            console.log('navigate <path> - Navigate to a different directory');
            console.log('details <file> - Get details of a specific file');
            console.log('exit - Exit the application');
            break;
        case 'list':
            await explorer.listFiles();
            break;
        case command.startsWith('navigate '):
            const path = command.split(' ')[1];
            await explorer.navigateTo(path);
            break;
        case command.startsWith('details '):
            const fileName = command.split(' ')[1];
            await explorer.getFileDetails(fileName);
            break;
        case 'exit':
            console.log('Exiting the File Explorer CLI. Goodbye!');
            process.exit();
            break;
        default:
            console.log('Unknown command. Type "help" for a list of commands.');
    }
};

runExplorer();