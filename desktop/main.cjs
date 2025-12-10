const path = require("path");
const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 960,
    height: 640,
    webPreferences: {
      contextIsolation: true
    },
    title: "NewUO Desktop"
  });

  win.setMenuBarVisibility(false);

  const entry = path.join(__dirname, "../dist/client/index.html");
  win.loadFile(entry);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
