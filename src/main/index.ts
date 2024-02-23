import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'

const sourceDir = 'E:/test'
const maxFolderSize = 4.3 * 1024 * 1024 * 1024

function readFiles(directory): { name: string; size: number; path: string }[] {
  return fs
    .readdirSync(directory)
    .map((fileName) => {
      const filePath = path.join(directory, fileName)
      return {
        name: fileName,
        size: fs.statSync(filePath).size,
        path: filePath
      }
    })
    .filter((file) => file.size < maxFolderSize) // исключаем файлы больше 4.3 ГБ
}

function createFolder(folderName): void {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }
}

function distributeFiles(files): void {
  let folderIndex = 0
  let currentFolderSize = 0

  files.forEach((file) => {
    if (currentFolderSize + file.size > maxFolderSize) {
      folderIndex++
      currentFolderSize = 0
    }
    const folderName = `E:/test/disk${folderIndex}`

    createFolder(folderName)

    const targetPath = path.join(folderName, file.name)
    fs.renameSync(file.path, targetPath) // Перемещение файла

    currentFolderSize += file.size
  })
}

const files = readFiles(sourceDir).sort((a, b) => b.size - a.size)

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
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('123'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
