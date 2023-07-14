import { Cue } from 'subtitle';

export const enum TranslationStatus {
  Pending = 'pending',
  Translating = 'translating',
  Translated = 'translated',
  Failed = 'failed',
  Skipped = 'skipped'
}

export interface SubtitleLine extends Cue {
  key?: string;
  index: number;
  originalText: string;
  targetText?: string;
  status?: TranslationStatus;
}

export interface SubtitleMainInfo {
    lines: SubtitleLine[];
    length: number;
    filename: string | null;
}
