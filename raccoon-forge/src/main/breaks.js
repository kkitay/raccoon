import { ipcMain, globalShortcut } from 'electron';
import { createTrayWindow, showTray } from './tray';
import { createWhiteWindow } from './whiteWindow';

const BREAK_INTERVAL = 1000 * 60; // 20 minutes
const BREAK_TIME = 1000 * 30; // 30 seconds

let tray = null;
let trayWindow = null;
let whiteWindow = null;
let interval = null;

const showWhiteWindow = () => {
  whiteWindow.showInactive();
  whiteWindow.webContents.send('fadeio', BREAK_TIME);
};

const showTrayWindow = () => {
  showTray(tray, trayWindow);
  trayWindow.webContents.send('openTray', BREAK_TIME);
};

const skipBreak = () => {
  whiteWindow.webContents.send('skipbreak');
  trayWindow.webContents.send('skipbreak');
};

const takeBreak = () => {
  showWhiteWindow();
  showTrayWindow();

  // register shortcut then set a timeout to unregister it
  globalShortcut.register('Esc', () => {
    skipBreak();
  });
  setTimeout(() => {
    globalShortcut.unregisterAll();
  }, BREAK_TIME);

  // listen for skipping break
  ipcMain.on('skipbreak', () => {
    skipBreak();
  });
};

export const start = (baseUrl, trayRef) => {
  // we need this to position the tray
  tray = trayRef;

  // initialize hidden trayWindow
  trayWindow = createTrayWindow(baseUrl + '#/eyebreak');

  // initialize hidden whiteWindow
  whiteWindow = createWhiteWindow(baseUrl);

  // on an interval, make 'er show up
  interval = setInterval(() => takeBreak(), BREAK_INTERVAL);
};

export const stop = () => {
  clearInterval(interval);
};
