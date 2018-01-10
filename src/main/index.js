/* eslint-disable no-console */
// Module imports
import keytar from 'keytar-prebuild';
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import setupBarMenu from './menu/setupBarMenu';
import setupContextMenu from './menu/setupContextMenu';
import setupTray from './setupTray';

const localVersion = app.getVersion();

// Debug configs
const isDevelopment = process.env.NODE_ENV === 'development';

const rendererURL = isDevelopment
  ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
  : `file://${__dirname}/index.html`;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let rendererWindow;

let tray;

// If we receive a URI to open from an external app but there's no window to
// sendCredits it to, it's cached in this variable.
let openURI = null;

function processRequestedURI(URI) {
  // Windows normalizes URIs when they're passed in from other apps. On Windows,
  // this function tries to restore the original URI that was typed.
  //   - If the URI has no path, Windows adds a trailing slash. LBRY URIs
  //     can't have a slash with no path, so we just strip it off.
  //   - In a URI with a claim ID, like lbry://channel#claimid, Windows
  //     interprets the hash mark as an anchor and converts it to
  //     lbry://channel/#claimid. We remove the slash here as well.
  // On Linux and Mac, we just return the URI as given.

  if (process.platform === 'win32') {
    return URI.replace(/\/$/, '').replace('/#', '#');
  }
  return URI;
}

const createWindow = () => {
  // Disable renderer process's webSecurity on development to enable CORS.
  let windowConfiguration = {
    backgroundColor: '#155B4A',
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
  };

  windowConfiguration = isDevelopment
    ? {
        ...windowConfiguration,
        webPreferences: {
          webSecurity: false,
        },
      }
    : windowConfiguration;

  let window = new BrowserWindow(windowConfiguration);

  window.webContents.session.setUserAgent(`LBRY/${localVersion}`);

  window.maximize();

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  window.loadURL(rendererURL);

  setupBarMenu();
  setupContextMenu(window);

  if (openURI) {
    // We stored and received a URI that an external app requested before we had a window object
    window.webContents.on('did-finish-load', () => {
      window.webContents.send('open-uri-requested', openURI, true);
    });
  }

  window.webContents.on('crashed', () => {
    window = null;
  });

  window.on('closed', () => {
    window = null;
  });

  window.on('focus', () => {
    window.webContents.send('window-is-focused', null);
  });

  window.on('unresponsive', () => {
    dialog.showMessageBox(
      window,
      {
        type: 'warning',
        buttons: ['Wait', 'Quit'],
        title: 'LBRY Unresponsive',
        defaultId: 1,
        message: 'LBRY is not responding. Would you like to quit?',
        cancelId: 0,
      },
      buttonIndex => {
        if (buttonIndex === 1) app.quit();
      }
    );
  });

  return window;
};

function handleOpenURIRequested(URI) {
  if (!rendererWindow) {
    // Window not created yet, so store up requested URI for when it is
    openURI = processRequestedURI(URI);
  } else {
    if (rendererWindow.isMinimized()) {
      rendererWindow.restore();
    } else if (!rendererWindow.isVisible()) {
      rendererWindow.show();
    }

    rendererWindow.focus();
    rendererWindow.webContents.send('open-uri-requested', processRequestedURI(URI));
  }
}

const isSecondaryInstance = app.makeSingleInstance(argv => {
  if (argv.length >= 2) {
    handleOpenURIRequested(argv[1]); // This will handle restoring and focusing the window
  } else if (rendererWindow) {
    if (rendererWindow.isMinimized()) {
      rendererWindow.restore();
    } else if (!rendererWindow.isVisible()) {
      rendererWindow.show();
    }
    rendererWindow.focus();
  }
});

if (isSecondaryInstance) {
  // We're not in the original process, so quit
  app.quit();
}

if (isDevelopment) {
  import('devtron')
    .then(({ install }) => {
      install();
      console.log('Added Extension: Devtron');
    })
    .catch(error => {
      console.error(error);
    });
  import('electron-devtools-installer')
    .then(({ default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS }) => {
      app.on('ready', () => {
        [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS].forEach(extension => {
          installExtension(extension)
            .then(name => console.log(`Added Extension: ${name}`))
            .catch(err => console.log('An error occurred: ', err));
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
}

app.setAsDefaultProtocolClient('lbry');

app.on('ready', () => {
  rendererWindow = createWindow();
  tray = setupTray(rendererWindow, createWindow);
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (rendererWindow === null) {
    createWindow();
  }
});

if (process.platform === 'darwin') {
  app.on('open-url', (event, URI) => {
    handleOpenURIRequested(URI);
  });
} else if (process.argv.length >= 2) {
  handleOpenURIRequested(process.argv[1]);
}

ipcMain.on('get-auth-token', event => {
  keytar.getPassword('LBRY', 'auth_token').then(token => {
    event.sender.send('auth-token-response', token ? token.toString().trim() : null);
  });
});

ipcMain.on('set-auth-token', (event, token) => {
  keytar.setPassword('LBRY', 'auth_token', token ? token.toString().trim() : null);
});

process.on('uncaughtException', error => {
  console.error(error);
  app.quit();
});

app.on('window-all-closed', () => {
  // Subscribe to event so the app doesn't quit when closing the window.
});
