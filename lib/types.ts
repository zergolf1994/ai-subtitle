import { NodeCue, Cue } from 'subtitle';
export interface SubtitleNodeData extends Cue {
  key: string;
  index: number;
  originalText: string;
  targetText?: string;
}
export interface SubtitleNode extends NodeCue {
  data: SubtitleNodeData
}
export interface IUploadResponseData {
    nodes: SubtitleNode[];
    length: number;
    filename: string | null;
}
