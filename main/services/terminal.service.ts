import { WebContents } from 'electron';
import { spawn } from 'child_process';


export default (sender: WebContents, message: string) => {
    const ls = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', (data) => {
        const resMessage = `stdout: ${data}`;
        console.log(resMessage);
        sender.send('terminal:spawn-ls', resMessage)
    });

    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}


