import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { join } from 'path';
import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import icon from '../../resources/icon.png?asset';
import sqlite3 from 'sqlite3';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron');

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('hi', () => {
  console.log('got hi');
  ipcMain.emit('hi-reply', { msg: 'hey' });
});

const database = new sqlite3.Database(
  '/home/raunits/.local/share/soundwave/music_metadata.db',
  (err) => {
    if (err) console.error('Database opening error: ', err);
    console.log('DB Connected');
  }
);

ipcMain.on('get-tracks', (event) => {
  const sql = 'SELECT * FROM music_metadata ORDER BY RANDOM() LIMIT 100 ';
  database.all(sql, (err, rows) => {
    event.reply('tracks', (err && err.message) || rows);
  });
});

ipcMain.on('get-search-results', (event, args) => {
  let { term } = args;
  term = term.toLowerCase();
  const sql = "SELECT * FROM music_metadata WHERE LOWER(title) LIKE '%" + term + "%'";
  database.all(sql, (err, rows) => {
    event.reply('search-results', (err && err.message) || rows);
  });
});

ipcMain.on('get-album-search-results', (event, args) => {
  let { term } = args;
  console.log(term);
  term = term.toLowerCase();
  const sql = "SELECT DISTINCT album AS name, artist, img, genre FROM music_metadata WHERE LOWER(album) LIKE '%" + term + "%'";
  database.all(sql, (err, rows) => {
    event.reply('album-search-results', (err && err.message) || rows);
  });
});

ipcMain.on('get-albums', (event) => {
  const sql = 'SELECT DISTINCT album AS name, artist, img, genre FROM music_metadata ORDER BY RANDOM() LIMIT 50';
  database.all(sql, (err, rows) => {
    event.reply('albums', (err && err.message) || rows);
  });
});

ipcMain.on('get-popular-albums', (event) => {
  const sql = 'SELECT DISTINCT album AS name, artist, img, genre FROM music_metadata ORDER BY RANDOM() LIMIT 6';
  database.all(sql, (err, rows) => {
    event.reply('popular-albums', (err && err.message) || rows);
  });
});

ipcMain.on('get-tracks-from-album', (event, args) => {
  const { album } = args;
  const sql = "SELECT * FROM music_metadata WHERE album LIKE '%" + album + "%'";
  database.all(sql, (err, rows) => {
    event.reply('tracks-from-album', (err && err.message) || rows);
  });
});
