import { useState } from "react";
import { Cue } from "subtitle";
import { IUploadResponseData } from '@/lib/types';

interface ISubtitleProps {
  data: IUploadResponseData;
}

interface SubtitleCue extends Cue {
  targetText?: string;
}

function formatTimeRange(start: number, end: number) {
  const format = (num: number) => num.toString().padStart(2, '0'); // 格式化数字为两位数
  const formatMilliseconds = (num: number) => num.toString().padStart(3, '0'); // 格式化毫秒为三位数

  const startMinutes = Math.floor(start / 60000); // 获取开始时间的分钟数
  const startSeconds = Math.floor((start % 60000) / 1000); // 获取开始时间的秒数
  const startMilliseconds = start % 1000; // 获取开始时间的毫秒数

  const endMinutes = Math.floor(end / 60000); // 获取结束时间的分钟数
  const endSeconds = Math.floor((end % 60000) / 1000); // 获取结束时间的秒数
  const endMilliseconds = end % 1000; // 获取结束时间的毫秒数

  const startTime = `${format(startMinutes)}:${format(startSeconds)}.${formatMilliseconds(startMilliseconds)}`; // 格式化开始时间
  const endTime = `${format(endMinutes)}:${format(endSeconds)}.${formatMilliseconds(endMilliseconds)}`; // 格式化结束时间

  return `${startTime} --> ${endTime}`;
}

export default function Subtitle({
  data
}: ISubtitleProps) {
  const { nodes, length, filename } = data;
  const [cues, setCues] = useState<SubtitleCue[]>(nodes.map((i): SubtitleCue => i.data as SubtitleCue));
  const [loading, setLoading] = useState<boolean>(false);

  const handleTranslate = async (text: string, index: number) => {
    setLoading(true);
    const res = await fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text, index }),
    });
    const { index: curI, targetText, text: originText }: any = (await res.json());

    console.log(`-----------------`)
    console.log(`${curI + 1} / ${length}`)
    console.log(`${originText}\n${targetText}`)

    const newCues = [...cues];
    newCues[curI].targetText = targetText;
    setCues(newCues);
    setLoading(false);
  }

  const handleRunAll = async () => {
    setLoading(true);
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      if (!cue.targetText) {
        await handleTranslate(cue.text, i);
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {filename}
          </h2>
          <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
            {length} lines
          </p>
        </div>
        <div>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              <svg className="w-3 h-3 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1v14m8.336-.479-6.5-5.774a1 1 0 0 1 0-1.494l6.5-5.774A1 1 0 0 1 11 2.227v11.546a1 1 0 0 1-1.664.748Z" />
              </svg>
              Back
            </button>
            <button
              onClick={handleRunAll}
              type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              <svg className="w-3 h-3 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1.984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L2.506 1.139A1 1 0 0 0 1 1.984Z" />
              </svg>
              Run
            </button>
            <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
              <svg className="w-3 h-3 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
                <path fill-rule="evenodd" d="M0 .8C0 .358.32 0 .714 0h1.429c.394 0 .714.358.714.8v14.4c0 .442-.32.8-.714.8H.714a.678.678 0 0 1-.505-.234A.851.851 0 0 1 0 15.2V.8Zm7.143 0c0-.442.32-.8.714-.8h1.429c.19 0 .37.084.505.234.134.15.209.354.209.566v14.4c0 .442-.32.8-.714.8H7.857c-.394 0-.714-.358-.714-.8V.8Z" clip-rule="evenodd" />
              </svg>
              Stop
            </button>
          </div>
        </div>
      </div>
      <ol className="relative border-l border-gray-200 dark:border-gray-700">
        {cues.map((cue, index) => {
          const { start, end, text: originText, targetText } = cue;
          return (
            <li className="mb-4 ml-4" key={`node_${start}_${end}`}>
              <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700">
                {/* { index + 1 } */}
              </div>
              <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                {formatTimeRange(start, end)}
              </time>
              <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                <div className="items-center justify-between sm:flex">
                  <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                    {
                      !loading ? (
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          <svg className="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m2.707 14.293 5.586-5.586a1 1 0 0 0 0-1.414L2.707 1.707A1 1 0 0 0 1 2.414v11.172a1 1 0 0 0 1.707.707Z" />
                          </svg>
                        </button>
                      ) : (
                        <div role="status">
                          <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      )
                    }
                  </time>
                  <div className="text-sm pl-2 font-normal text-gray-500 lex dark:text-gray-300">
                    {originText}
                  </div>
                </div>
                {targetText && (
                  <div className="mt-2">
                    <input
                      onChange={() => { }}
                      value={targetText} type="text" id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

    </div>
  );
}
