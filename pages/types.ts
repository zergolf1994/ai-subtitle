import { NodeList } from 'subtitle';

export interface IUploadResponseData {
    nodes: NodeList;
    length: number;
    filename: string | null;
}