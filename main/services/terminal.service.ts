import { WebContents } from 'electron';
import { spawn } from 'child_process';

interface Command {
    command: string,
    arguments: string[],
}

export const CMD_LS: Command = { command: 'ls', arguments: ['-lh'] };

export const CMD_MKDIR: Command = { command: 'mkdir', arguments: [] };

export const CMD_RMDIR: Command = { command: 'rmdir', arguments: [] };

export const CMD_PWD: Command = { command: 'pwd', arguments: [] };

export class TerminalService {

    ls(channel: string, sender: WebContents) {
        const ls = spawn(CMD_LS.command, CMD_LS.arguments)

        ls.stdout.on('data', (data) => {
            const message = `stdout: \n${data}`;
            sender.send(channel, message)
        });

        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    mkdir(channel: string, sender: WebContents, dirname: string) {
        const mkdir = spawn(CMD_MKDIR.command, [dirname]);

        mkdir.stdout.on('data', (data) => {
            const message = `stdout: \n${data}`;
            sender.send(channel, message)
        });

        mkdir.stderr.on('data', (data) => {
            const message = `stderr: \n${data}`;
            sender.send(channel, message)
        });

        mkdir.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    rmdir(channel: string, sender: WebContents, dirname: string) {
        const rmdir = spawn(CMD_RMDIR.command, [dirname]);

        rmdir.stdout.on('data', (data) => {
            const message = `stdout: \n${data}`;
            sender.send(channel, message)
        });

        rmdir.stderr.on('data', (data) => {
            const message = `stderr: \n${data}`;
            sender.send(channel, message)
        });

        rmdir.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }

    pwd(channel: string, sender: WebContents) {
        const pwd = spawn(CMD_PWD.command, CMD_PWD.arguments);

        pwd.stdout.on('data', (data) => {
            const message = `stdout: \n${data}`;
            sender.send(channel, message)
        });

        pwd.stderr.on('data', (data) => {
            const message = `stderr: \n${data}`;
            sender.send(channel, message)
        });

        pwd.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    }
}