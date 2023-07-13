// @ts-nocheck
import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import { nanoid } from "@/lib/utils";
import { SubtitleNodeData } from "@/lib/types";

// export const runtime = "edge";
// first we need to disable the default body parser
// export const config = {
//   api: {
//     bodyParser: false,
//   }
// };

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  basePath: process.env.OPENAI_API_BASE_PATH,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const json: SubtitleNodeData = JSON.parse(req.body);
  console.log('json: %o', json);
  const { text } = json;

  const previousSubtitles = [];
  let input = { Input: text };
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a program responsible for translating subtitles. Your task is to output the specified target language based on the input text. Please do not create the following subtitles on your own. Please do not output any text other than the translation. You will receive the subtitles as array that needs to be translated, as well as the previous translation results and next subtitle. If you need to merge the subtitles with the following line, simply repeat the translation. Please transliterate the person's name into the local language. Target language: Chinese`,
      },
      {
        role: 'assistant',
        content: `for example: "hello world" -> { "Input": "hello world", "Translation": "你好世界" }`,
      },
      ...previousSubtitles.slice(-4),
      {
        role: "user",
        content: JSON.stringify(input),
      },
    ],
  });
  let result = completion.data.choices[0].message.content;
  console.log("completion.data.choices[0]", completion.data.choices[0]);
  try {
    result = JSON.parse(result);
    previousSubtitles.push({ role: "user", content: JSON.stringify(result.Input) })
    previousSubtitles.push({ role: 'assistant', content: JSON.stringify({ Input: result.Input }) })
    res.status(200).json({ targetText: result.Translation, ...json });
  } catch (e) {
    console.log("###");
    console.log(e.toString());
    console.log(result);
    console.log("###");
    res.status(500).json({ message: 'Server Error' });
  }
}
