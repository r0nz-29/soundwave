"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const sqlite3 = require("sqlite3");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      webSecurity: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.ipcMain.on("hi", () => {
  console.log("got hi");
  electron.ipcMain.emit("hi-reply", { msg: "hey" });
});
const database = new sqlite3.Database(
  "/home/raunits/.local/share/soundwave/music_metadata.db",
  (err) => {
    if (err)
      console.error("Database opening error: ", err);
    console.log("DB Connected");
  }
);
electron.ipcMain.on("get-tracks", (event) => {
  const sql = "SELECT * FROM music_metadata LIMIT 100";
  database.all(sql, (err, rows) => {
    event.reply("tracks", err && err.message || rows);
  });
});
electron.ipcMain.on("get-search-results", (event, args) => {
  let { term } = args;
  term = term.toLowerCase();
  const sql = "SELECT * FROM music_metadata WHERE LOWER(title) LIKE '%" + term + "%'";
  database.all(sql, (err, rows) => {
    event.reply("search-results", err && err.message || rows);
  });
});
electron.ipcMain.on("get-albums", (event) => {
  const sql = "SELECT DISTINCT album AS name, artist, img, genre FROM music_metadata";
  database.all(sql, (err, rows) => {
    event.reply("albums", err && err.message || rows);
  });
});
electron.ipcMain.on("get-tracks-from-album", (event, args) => {
  const { album } = args;
  const sql = "SELECT * FROM music_metadata WHERE album LIKE '%" + album + "%'";
  database.all(sql, (err, rows) => {
    event.reply("tracks-from-album", err && err.message || rows);
  });
});
