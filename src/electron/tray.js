const { BrowserWindow, Tray } = require('electron');
const { toggleWindow } = require('./common');

const createTray = (trayWindow, icon) => {
  let tray = new Tray(icon);

  // toggle the tray window when clicking the tray icon.
  tray.on('click', function(event) {
    trayWindow.webContents.send('openedTray');

    toggleWindow(trayWindow, () => showTray(tray, trayWindow));

    if (trayWindow.isVisible() && process.defaultApp && event.metaKey) {
      trayWindow.openDevTools({ mode: 'detach' });
    }
  });

  // The window opened directly from the tray needs to go away on blur.
  trayWindow.on('blur', () => {
    if (!trayWindow.webContents.isDevToolsOpened()) {
      trayWindow.hide();
    }
  });

  return tray;
};

const createTrayWindow = (Url, optionsOverride = {}) => {
  let window = new BrowserWindow({
    width: 300,
    height: 400,
    useContentSize: true,
    show: false,
    frame: false,
    hasShadow: true,
    resizable: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    },
    ...optionsOverride
  });

  window.loadURL(Url);

  return window;
};

const showTray = (tray, trayWindow) => {
  const trayPos = tray.getBounds();
  const windowPos = trayWindow.getBounds();

  let x = 0;
  let y = 0;

  if (process.platform === 'darwin') {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height);
  } else {
    x = Math.round(trayPos.x + trayPos.width / 2 - windowPos.width / 2);
    y = Math.round(trayPos.y + trayPos.height * 10);
  }

  trayWindow.setPosition(x, y, false);
  trayWindow.show();
  trayWindow.focus();
};

module.exports = {
  createTray,
  createTrayWindow,
  showTray
};
