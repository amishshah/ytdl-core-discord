/// <reference types="node" />
import { Readable } from 'stream';
import { downloadOptions, videoFormat } from 'ytdl-core';
export interface PrismVideoFormat extends videoFormat {
    audio_sample_rate?: number;
}
export declare function download(url: string, options?: downloadOptions): Promise<Readable>;
export default download;
