import { useRef, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

type DirectoryInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  directory?: string
  webkitdirectory?: string
}

function App(): JSX.Element {
  const ipcHandleFs = (): void => {
    if (fileURL && maxFolderSize) {
      window.electron.ipcRenderer.send('distribute-files', maxFolderSize, fileURL)
    } else if (!fileURL && isNaN(maxFolderSize)) {
      toast.error('Выберите папку и введите размер папок')
    } else if (isNaN(maxFolderSize)) {
      toast.error('Введите размер папок')
    } else {
      toast.error('Выберите папку')
    }
  }

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

  const DirectoryInput = (props: DirectoryInputProps): JSX.Element => <input {...props} />

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="label p-2">
          <span className="text-base label-text text-gray-300">Размер папок (В ГБ)</span>
        </label>
        <input
          className="input input-bordered input-info w-full max-w-xs bg-slate-700 text-lg"
          type="number"
          value={maxFolderSize}
          onChange={(e) => setMaxFolderSize(parseFloat(e.target.value))}
        />
      </div>
      <DirectoryInput
        type="file"
        directory=""
        webkitdirectory=""
        className="file-input file-input-bordered file-input-info w-full max-w-xs bg-slate-700"
        ref={folderInput}
        onChange={handleFileChange}
      />
      <button className="btn btn-info uppercase" onClick={ipcHandleFs}>
        Start
      </button>
      <Toaster />
    </div>
  )
}

export default App
