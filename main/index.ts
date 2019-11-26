// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { BrowserWindow, app, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';

// Other dependencies
import { TerminalService } from './services/terminal.service';

const terminalService = new TerminalService();

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  const url = isDev
    ? 'http://localhost:8000/start'
    : format({
      pathname: join(__dirname, '../../renderer/start.html'),
      protocol: 'file:',
      slashes: true,
    })

  mainWindow.loadURL(url)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event, message) => {
  event.sender.send('message', message)
})

function endpoint(path: string) { // this is the decorator factory
  return function (target) { // this is the decorator
      // do something with 'target' and 'value'...
  }
}

ipcMain.on('terminal/ls', (event, _) => {
  terminalService.ls('terminal/ls', event.sender);
  console.log('spawned!!')
});

ipcMain.on('terminal/mkdir', (event, dirname) => {
  terminalService.mkdir('terminal/mkdir', event.sender, dirname);
  console.log('spawned!!')
});


ipcMain.on('terminal/pwd', (event, dirname) => {
  terminalService.pwd('terminal/pwd', event.sender);
  console.log('spawned!!')
});