import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import colors from 'colors'
import { Configuration, OpenAIApi } from 'openai'
import { parseSync, stringifySync } from 'subtitle'

// first we need to disable the default body parser
export const config = {
    api: {
        bodyParser: false,
    }
};

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    basePath: process.env.OPENAI_API_BASE_PATH
});
const openai = new OpenAIApi(configuration);

export default async (req, res) => {
    if (req.method === 'POST') {

        // parse form with a Promise wrapper
        const data = await new Promise((resolve, reject) => {
            const form = new IncomingForm();
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);
                resolve({ fields, files });
            });
        });
        try {
            const fileObj = data.files.subtitleFile[0]; // .image because I named it in client side by that name: // pictureData.append('image', pictureFile);
            const filePath = fileObj.filepath;
            const pathToWriteFile = `public/${fileObj.originalFilename}`; // include name and .extention, you can get the name from data.files.image object

            const imageContent = await fs.readFile(filePath, 'utf-8');
            let subtitle = parseSync(imageContent)
            subtitle = subtitle.filter(line => line.type === 'cue')
            let previousSubtitles = []
            console.log('subtitle.length:', subtitle.length);

            for (let i = 0; i < subtitle.length; i++) {
                // for (let i = 0; i < 10; i++) {
                let text = subtitle[i].data.text
                let input = { Input: text }
                if (subtitle[i + 1]) {
                    input.Next = subtitle[i + 1].data.text
                }
                const completion = await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: `You are a program responsible for translating subtitles. Your task is to output the specified target language based on the input text. Please do not create the following subtitles on your own. Please do not output any text other than the translation. You will receive the subtitles as array that needs to be translated, as well as the previous translation results and next subtitle. If you need to merge the subtitles with the following line, simply repeat the translation. Please transliterate the person's name into the local language. Target language: Chinese`
                        },
                        ...previousSubtitles.slice(-4),
                        {
                            role: "user",
                            content: JSON.stringify(input)
                        }
                    ],
                });
                let result = completion.data.choices[0].message.content
                console.log('index: %s, result: %o', i, result);
                try {
                    result = JSON.parse(result).Input
                } catch (e) {
                    try {
                        result = result.match(/"Input":"(.*?)"/)[1]
                    } catch (e) {
                        console.log('###'.red)
                        console.log(e.toString().red)
                        console.log(result.red)
                        console.log('###'.red)
                    }
                }
                previousSubtitles.push({ role: "user", content: JSON.stringify(input) })
                previousSubtitles.push({ role: 'assistant', content: JSON.stringify({ ...input, Input: result }) })
                // console.log(`${subtitle[i].data.text}`.blue)
                subtitle[i].data.text = `${result}\n${text}`
                console.log(`-----------------`.gray)
                console.log(`${i + 1} / ${subtitle.length}`.gray)
                console.log(`${result}`.green)
                console.log(`${text}`.white)
            }

            await fs.writeFile(`${pathToWriteFile}`, stringifySync(subtitle, { format: 'srt' }));

            //store path in DB
            res.status(200).json({ message: 'image uploaded!', url: fileObj.originalFilename });
        } catch (error) {
            console.log('err:', error)
            res.status(500).json({ message: error.message });
            return;
        }
    };
};