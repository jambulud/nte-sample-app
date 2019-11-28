import Renderer from './renderer.service';

export class messageSenderService {

    renderer: Renderer;
    constructor() {
        this.renderer = new Renderer()
    }
    async sendLs() {
        const message = await this.renderer.send('terminal/ls')
    }
    async sendMkdir(dirname: string) {
        const message = await this.renderer.send('terminal/mkdir', dirname)
    }

    async sendPwd() {
        const message = await this.renderer.send('terminal/pwd');
    }

    async sendRmdir(dirname: string) {
        const message = await this.renderer.send('terminal/rmdir', dirname)
    }
    async sendOpenDialog() {
        const message = await this.renderer.send('terminal/open-dialog')
    }
    async sendMvnHelp(currentWorkingDir: string) {
        const message = await this.renderer.send('terminal/mvn-install', currentWorkingDir)
    }
}