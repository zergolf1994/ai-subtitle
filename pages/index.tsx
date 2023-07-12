import { useState } from 'react';
import Uploader from '@/components/uploader';
import { IUploadResponseData } from '@/lib/types';
import Subtitle from '@/components/Subtitle';

const Steps = {
  UPLOAD: 1,
  TRANSLATE: 2,
  DOWNLOAD: 3
}

export default function Home() {
  const [step, setStep] = useState<number>(Steps.UPLOAD);
  const [data, setData] = useState<IUploadResponseData | null>(null);

  const renderStepContent = () => {
    switch (step) {
      case Steps.UPLOAD:
        return (
          <div className='p-12'>
            <Uploader
              onFinished={(data) => {
                setStep(Steps.TRANSLATE);
                setData(data);
              }}
            />
          </div>  
        )
      case Steps.TRANSLATE:
        return (
          <div className='p-12'>
            {data && <Subtitle data={data}/>}
          </div>
        )
      case Steps.DOWNLOAD:
        return <div>Download</div>
      default:
        return <div>Unknown step</div>
    }
  }

  const isStepActive = (value: number) => {
    if (step === value) {
      return 'text-blue-600 dark:text-blue-500';
    }

    return '';
  }

  return (
    <div>
      <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
        <li className={`${isStepActive(Steps.UPLOAD)} flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            <span className="mr-2">1.</span>
            Upload <span className="hidden sm:inline-flex sm:ml-2">File</span>
          </span>
        </li>
        <li className={`${isStepActive(Steps.TRANSLATE)} flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}>
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
            <span className="mr-2">2.</span>
            Translate <span className="hidden sm:inline-flex sm:ml-2">Subtitles</span>
          </span>
        </li>
        <li className={`${isStepActive(Steps.DOWNLOAD)} flex items-center`}>
          <span className="mr-2">3.</span>
          Download
        </li>
      </ol>
      <div>
          {renderStepContent()}
      </div>
    </div>
  )
}
