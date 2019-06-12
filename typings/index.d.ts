/// <reference types="node" />
import { Readable } from 'stream';
import { downloadOptions, videoFormat, videoInfo, relatedVideo } from 'ytdl-core';
export interface PrismVideoFormat extends videoFormat {
	audio_sample_rate?: number;
}
export declare function ytdlDiscord(url: string, options?: downloadOptions): Promise<Readable>
export declare function getBasicInfo(url: string, callback?: (err: Error, info: videoInfo) => void): Promise<videoInfo>;
export declare function getBasicInfo(url: string, options?: downloadOptions, callback?: (err: Error, info: videoInfo) => void): Promise<videoInfo>;
export declare function getInfo(url: string, callback?: (err: Error, info: videoInfo) => void): Promise<videoInfo>;
export declare function getInfo(url: string, options?: downloadOptions, callback?: (err: Error, info: videoInfo) => void): Promise<videoInfo>;
export declare function downloadFromInfo(info: videoInfo, options?: downloadOptions): Readable;
export declare function chooseFormat(format: videoFormat | videoFormat[], options?: downloadOptions): videoFormat | Error;
export declare function filterFormats(formats: videoFormat | videoFormat[], filter?: 'video' | 'videoonly' | 'audio' | 'audioonly' | ((format: videoFormat) => boolean)): videoFormat[];
export declare function validateID(string: string): boolean;
export declare function validateURL(string: string): boolean;
export declare function getURLVideoID(string: string): string | Error;
export declare function getVideoID(string: string): string | Error;
