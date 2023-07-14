import { customAlphabet } from 'nanoid'

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7
) // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}


export function formatTimeRange(start: number, end: number) {
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
