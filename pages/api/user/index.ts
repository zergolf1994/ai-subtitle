import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//     runtime: "edge",
// }

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return res.status(200).json({ name: 'John Doe' })
}