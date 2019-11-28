import { IpcRendererEvent } from 'electron';

class Renderer {

    private channels: string[] = [];

    on(channel: string, handler: Function) {
        global.ipcRenderer.on(channel, handler);
        this.channels.push(channel);
    }

    removeListener(channel: string, handler: Function) {
        global.ipcRenderer.removeListener(channel, handler);
        this.channels = this.channels.filter(sub => sub != channel);
    }

    removeAll() {
        for (const channel of this.channels) {
            global.ipcRenderer.removeAllListeners(channel);
        }

        this.channels = [];
    }

    send(channel: string, ...args: any[]): Promise<{ error?: string }> {
        const result = new Promise((resolve) => {
            global.ipcRenderer.once(
                channel,
                (_: IpcRendererEvent, message: any[]) => resolve(message));

            global.ipcRenderer.send(channel, ...args);
        });
        return result;
    }
}

export default Renderer;