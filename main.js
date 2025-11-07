import { app, BrowserWindow, screen, Menu} from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Required to construct __dirname in ES module style
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.arch === 'x64') {
  const userDataPath = path.join(app.getPath('appData'), 'Scripta');
  app.setPath('userData', userDataPath);
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  const template = [
    {
      label: 'View',
        submenu: [
          { role: 'toggledevtools' },
        ],
    },
    {
      label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteAndMatchStyle' },
          { role: 'selectAll' },
        ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Accounting for machines with different DPI scaling
  win.webContents.on('did-finish-load', () => {
    const display = screen.getPrimaryDisplay();
    const scaleFactor = display.scaleFactor;
    const baseZoom = 1.5;
    const normalizedZoom = baseZoom / scaleFactor;
    win.webContents.setZoomFactor(normalizedZoom);
  });

  win.on('focus', () => {
    const display = screen.getPrimaryDisplay();
    const scaleFactor = display.scaleFactor;
    const baseZoom = 1.5;
    const normalizedZoom = baseZoom / scaleFactor;
    win.webContents.setZoomFactor(normalizedZoom);
  });

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
