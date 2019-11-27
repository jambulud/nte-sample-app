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
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  if(isDev) {
    mainWindow.webContents.openDevTools();
  }

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

terminalService.ls();
terminalService.mkdir(null);
terminalService.rmdir(null);
terminalService.pwd();
terminalService.openDialog();
terminalService.mvnInstall();
terminalService.allCommands(null, null);