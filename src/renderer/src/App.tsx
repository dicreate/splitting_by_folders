import { useState } from 'react'
/* import { dialog, ipcRenderer } from 'electron'; */
function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('distribute-files', maxFolderSize)

  const [maxFolderSize, setMaxFolderSize] = useState(4.3) // Default value in GB
  /*   const [sourceDir, setSourceDir] = useState('') */

  /*   const selectSourceDir = async () => {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
      });

      if (!result.canceled && result.filePaths.length > 0) {
        setSourceDir(result.filePaths[0]);
      }
    };
   */

  return (
    <>
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <input
        type="number"
        value={maxFolderSize}
        onChange={(e) => setMaxFolderSize(parseFloat(e.target.value))}
      />
      <button /* onClick={selectSourceDir} */>Select Source Directory</button>
      <div className="actions">
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Run function
          </a>
        </div>
      </div>
    </>
  )
}

export default App
