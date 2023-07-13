import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, File } from "formidable";
import { promises as fs } from "fs";
import { NodeCue, parseSync } from "subtitle";
import { IUploadResponseData } from "@/lib/types";
import { nanoid } from "@/lib/utils";

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * upload file handler
 * @param req {NextApiRequest}
 * @param res {NextApiResponse}
 * @returns {IUploadResponseData}
 */
const uploadHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // parse form with a Promise wrapper
    const formData: {
      fields: Fields;
      files: { [key: string]: File | File[] };
    } = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    try {
      // .subtitleFile because I named it in client side by that name: // pictureData.append('subtitleFile', pictureFile);
      const uploadFile = Array.isArray(formData.files.subtitleFile)
        ? formData.files.subtitleFile[0]
        : formData.files.subtitleFile;
      const { filepath, originalFilename } = uploadFile;
      const fileContent = await fs.readFile(filepath, "utf-8");
      // NOTE: for better performance, consider using streams
      let nodeList = parseSync(fileContent);
      console.log("[upload handler] subtitle length:", nodeList.length);

      // response data
      let data: IUploadResponseData = {
        nodes: [],
        length: 0,
        filename: originalFilename,
      };
      if (nodeList && nodeList.length > 0) {
        // filter out non-cue lines
        const subtitleNodes = nodeList.filter((line) => line.type === "cue") as NodeCue[];
        data.nodes = subtitleNodes.map((node, nodeIndex) => {
          return {
            ...node,
            data: {
              ...node.data,
              key: nanoid(),
              index: nodeIndex,
              originalText: node.data.text, 
              targetText: undefined
            }
          }
        });
        data.length = subtitleNodes.length;
      }
      console.log("[upload handler] data:", data);
      res.status(200).json({ data });
    } catch (error) {
      // @ts-ignore
      res.status(500).json({ message: error.message });
      return;
    }
  }
};

export default uploadHandler;
