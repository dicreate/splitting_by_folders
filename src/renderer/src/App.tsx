import { useRef, useState } from 'react'
function App(): JSX.Element {
  const ipcHandleFs = (): void =>
    window.electron.ipcRenderer.send('distribute-files', maxFolderSize, fileURL)

  const [maxFolderSize, setMaxFolderSize] = useState<number>(4.3) // Default value in GB
  const [fileURL, setFileURL] = useState<string | null>(null)
  const folderInput = useRef(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files
    if (files && files.length > 0) {
      const filePath = files[0].path
      setFileURL(filePath)
    }
  }

  return (
    <>
      {/*    <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p> */}
      <input
        className="text-black"
        type="number"
        value={maxFolderSize}
        onChange={(e) => setMaxFolderSize(parseFloat(e.target.value))}
      />
      <input
        type="file"
        directory=""
        webkitdirectory=""
        className="form-control"
        ref={folderInput}
        onChange={handleFileChange}
      />
      <div className="actions">
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandleFs}>
            Run function
          </a>
        </div>
      </div>
    </>
  )
}

export default App
