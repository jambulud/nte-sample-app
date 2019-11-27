import { spawn, exec, ChildProcessWithoutNullStreams, SpawnOptionsWithoutStdio } from 'child_process';
import Process from '../decorators/process';
import { dialog } from 'electron';

interface Command {
    command: string,
    arguments: string[],
}

export const CMD_LS: Command = { command: 'ls', arguments: ['-lh'] };

export const CMD_MKDIR: Command = { command: 'mkdir', arguments: [] };

export const CMD_RMDIR: Command = { command: 'rmdir', arguments: [] };

export const CMD_PWD: Command = { command: 'pwd', arguments: [] };

export const POWERSHELL: Command = { command: 'cmd.exe', arguments: ['mvn', '--help'] };

const MAX_BUFFER = 1024 * 500; /* 500 KB */

export class TerminalService {

    private standardHandler(spawn: ChildProcessWithoutNullStreams): Promise<{}> {
        return new Promise((resolve, reject) => {
            let result = '';
            spawn.stdout.on('data', data => { result += data });
            spawn.stderr.on('data', data => reject(`${data}`));
            spawn.on('close', () => resolve(result));
            spawn.stdin.end()
        });
    }

    @Process('terminal/ls')
    async ls() {
        const ls = spawn(CMD_LS.command, CMD_LS.arguments)
        const result = await this.standardHandler(ls);

        return result;
    }

    @Process('terminal/mkdir')
    async mkdir(dirname: string) {
        const mkdir = spawn(CMD_MKDIR.command, [dirname]);
        try {
            const result = await this.standardHandler(mkdir);

            return result;
        } catch (error) {
            return error;
        }
    }

    @Process('terminal/rmdir')
    async rmdir(dirname: string) {
        const rmdir = spawn(CMD_RMDIR.command, [dirname]);
        try {
            const result = await this.standardHandler(rmdir);
            return result;

        } catch (error) {
            return error;
        }
    }

    @Process('terminal/pwd')
    async pwd() {
        const pwd = spawn(CMD_PWD.command, CMD_PWD.arguments);

        try {
            const result = await this.standardHandler(pwd);
            return result;

        } catch (error) {
            return error;
        }
    }

    @Process('terminal/open-dialog')
    async openDialog() {
        const res = await dialog.showOpenDialog({ properties: ['openDirectory'] });
        return res;
    }


    @Process('terminal/mvn-install')
    async mvnInstall(cwd?: string) {
        const options = cwd ? { cwd, maxBuffer: MAX_BUFFER } : undefined
        let mvn = exec('mvn --help', options);

        try {
            const result = await this.standardHandler(mvn);
            return result;

        } catch (error) {
            return error;
        }
    }

    @Process('terminal/all-commands')
    async allCommands(command: string, cwd?: string) {
        if (!command) return '';

        const options = cwd ? { cwd, maxBuffer: MAX_BUFFER } : undefined
        let mvn = exec(command, options);

        try {
            const result = await this.standardHandler(mvn);
            return result;

        } catch (error) {
            return error;
        }
    }
}