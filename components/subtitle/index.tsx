import { useEffect, useState } from "react";
import { SubtitleMainInfo, SubtitleLine, TranslationStatus } from '@/lib/types';
import toast from 'react-hot-toast';
import Item from "./item";

interface ISubtitleProps {
  data: SubtitleMainInfo;
  handleBack: () => void;
}

export default function Subtitle({
  data: sourceData,
  handleBack
}: ISubtitleProps) {
  console.log('sourceData:', JSON.parse(JSON.stringify(sourceData)));
  const [lines, setLines] = useState<SubtitleLine[]>(sourceData.lines);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const handleTranslate = async (params: SubtitleLine) => {
    const res = await fetch('/api/translate', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    if (res.status === 200) {
      const newNode: SubtitleLine = (await res.json());

      console.log(`-----------------`)
      console.log(`${newNode.index + 1} / ${sourceData.length}`)
      console.log(`${newNode.originalText}\n${newNode.targetText}`)
  
      setLines((prevLines) =>
        prevLines.map((line, index) => {
          if (index !== currentIndex) return line;
          return {
            ...line,
            targetText: newNode.targetText,
            status: newNode.status
          };
        })
      );
        
      setCurrentIndex((prevIndex) => {
        if (prevIndex === null) return null;
        return prevIndex === lines.length - 1 ? null : prevIndex + 1;
      });

    } else {
      toast.error((await res.json()).message)
    }
  }

  useEffect(() => {
    if (currentIndex === null) return;
    handleTranslate(lines[currentIndex]);
  }, [currentIndex, lines])

  const handleRunAll = async () => {
    setLines(lines.map((i) => ({ ...i, status: TranslationStatus.Pending })));
    setCurrentIndex(0);
  }

  return (
    <div className="w-full h-full">
      <div className="h-16">
        <div className="flex justify-between px-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {sourceData.filename}
            </h2>
            <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
              { currentIndex === null ? `${sourceData.length} lines` : `${currentIndex}/${sourceData.length} translated`}
            </p>
          </div>
          <div>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={handleBack}
                type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-l-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                <svg className="w-3 h-3 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5H1m0 0 4 4M1 5l4-4"/>
                </svg>
                Back
              </button>
              <button
                onClick={handleRunAll}
                type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border-t border-b border-gray-900 hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                <svg className="w-3 h-3 mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 18">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1.984v14.032a1 1 0 0 0 1.506.845l12.006-7.016a.974.974 0 0 0 0-1.69L2.506 1.139A1 1 0 0 0 1 1.984Z" />
                </svg>
                Run
              </button>
              <button type="button" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-r-md hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                <svg className="w-3 h-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                  <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
                More
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-4">
        <ol className="relative border-l border-gray-200 dark:border-gray-700">
            { lines.map((item) => (<Item key={`key_${item.start}_${item.end}`} {...item} />))}
        </ol>
      </div>
    </div>
  );
}
