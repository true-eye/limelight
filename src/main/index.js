import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

import udp from './limelight/udpServer';
import limelight from './limelight/limelight';

let mainWindow = BrowserWindow | null;
let udpServer = null;
let limelightServer = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 500,
    width: 700,
    minHeight: 500,
    // maxHeight:600,
    minWidth: 700,
    //maxWidth: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:8000/#/');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  setTimeout(() => {
    limelightServer = limelight(mainWindow);

    const { foundLimelight, appendLog /*, addNewLimelight*/ } = limelightServer;
    udpServer = udp(foundLimelight, appendLog /*, addNewLimelight*/);
  }, 10);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('findLimelights', () => {
  mainWindow.webContents.send('clearLog','');
  udpServer.Ping_Limelights();
});

ipcMain.on('restartLimelight', (event, ipAddr) => {
  limelightServer.restartLimelight(ipAddr);
});
