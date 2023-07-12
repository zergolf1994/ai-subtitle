'use client'
import { useState, useCallback, useMemo, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import { IUploadResponseData } from '@/lib/types';

const FILE_ACCEPT = '.srt,.vtt';
interface IUploaderProps {
  onFinished: (subtitle: IUploadResponseData | null) => void;
}

export default function Uploader({
  onFinished
}: IUploaderProps) {
  const [data, setData] = useState<{
    filename: string | null,
    size: number | null
  }>({
    filename: null,
    size: null
  })
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  /**
   * Handle file change
   */
  const onChangeFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        const fileMb = file.size / 1024 / 1024; // in MB
        if (fileMb > 10) {
          toast.error('File size too big (max 10MB)')
        } else {
          setFile(file)
          setData({ filename: file.name, size: fileMb })
        }
      }
    },
    [setData]
  )

  const saveDisabled = useMemo(() => {
    return !data.filename || saving
  }, [data.filename, saving])

  const uploadFileHandler = async (file: any) => {
    const pictureData = new FormData();
    pictureData.append('subtitleFile', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: pictureData,
      });

      if (res.status === 200) {
        const { data }: { data: IUploadResponseData } = (await res.json());
        console.log('[uploader] "/api/upload" response: ', data);
        onFinished(data);
      } else {
        const error = await res.text()
        toast.error(error)
      }
      setSaving(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="grid gap-6"
      onSubmit={async (e) => {
        e.preventDefault()
        setSaving(true)
        uploadFileHandler(file);
      }}
    >
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          onDragOver={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(true)
          }}
          onDragEnter={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(true)
          }}
          onDragLeave={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)
          }}
          onDrop={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            const file = e.dataTransfer.files && e.dataTransfer.files[0]
            if (file) {
              const fileMb = file.size / 1024 / 1024; // in MB
              if (fileMb > 10) {
                toast.error('File size too big (max 10MB)')
              } else {
                setFile(file)
                setData({ filename: file.name, size: fileMb })
              }
            }
          }}
        >
          {
            data.filename ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 text-gray-500 dark:text-gray-400 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 1v4a1 1 0 0 1-1 1H1m4 6 2 2 4-4m4-8v16a.97.97 0 0 1-.933 1H1.933A.97.97 0 0 1 1 18V5.828a2 2 0 0 1 .586-1.414l2.828-2.828A2 2 0 0 1 5.828 1h8.239A.97.97 0 0 1 15 2Z"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{ data.filename }</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                 Size { data.size }MB
                </p>
              </div>  
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">.srt or .vtt (MAX. 10MB)</p>
              </div>  
            )
          }
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            name="subtitleFile"
            accept={FILE_ACCEPT}
            onChange={onChangeFile}
          />
        </label>
      </div>
      <button
        disabled={saveDisabled}
        type="submit"
        className={`w-full text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 inline-flex items-center justify-center ${saveDisabled ? 'cursor-not-allowed bg-blue-400 dark:bg-blue-400' : 'bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 '}`}>
          {saving ? (
            <span>
              <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
              Loading...
            </span>
          ) : (
          <span>Confirm upload</span>
        )}
      </button>
    </form>
  )
}
