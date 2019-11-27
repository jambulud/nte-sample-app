import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
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

export const MVN_INSTALL: Command = { command: 'mvn', arguments: ['install'] };

export class TerminalService {

    private standardHandler(spawn: ChildProcessWithoutNullStreams): Promise<{}> {
        return new Promise((resolve, reject) => {
            spawn.stdout.on('data', data => resolve(`stdout: ${data}`));
            spawn.stderr.on('data', data => reject(`stderr: ${data}`));
            spawn.on('close', code => resolve(`child process exited with code ${code}`));
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
        const result = await this.standardHandler(mkdir);

        return result;
    }

    @Process('terminal/rmdir')
    async rmdir(dirname: string) {
        const rmdir = spawn(CMD_RMDIR.command, [dirname]);
        const result = await this.standardHandler(rmdir);

        return result;
    }

    @Process('terminal/pwd')
    async pwd() {
        const pwd = spawn(CMD_PWD.command, CMD_PWD.arguments);
        const result = await this.standardHandler(pwd);

        return result;
    }

    @Process('terminal/open-dialog')
    async openDialog() {
        const res = await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
        return res;
    }
}