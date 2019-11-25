class Renderer {

    channels: string[] = [];

    on(channel: string, handler: Function) {
        global.ipcRenderer.on(channel, handler);
        this.channels.push(channel);
    }

    removeListener(channel: string, handler: Function) {
        global.ipcRenderer.removeListener(channel, handler);
        this.channels.filter(sub => sub != channel)
    }

    removeAll() {
        for (const channel of this.channels) {
            global.ipcRenderer.removeAllListeners(channel);
        }

        this.channels = [];
    }

    send(...args: any[]) {
        global.ipcRenderer.send(...args);
    }
}

export default Renderer;