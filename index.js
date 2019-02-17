const ytdl = require('ytdl-core');
const fs = require('fs');
const prism = require('prism-media');

function filter(format) {
  return format.audioEncoding === 'opus' &&
    format.container === 'webm' &&
    format.audio_sample_rate == 48000 &&
    !format.live; // prism cannot yet play live webm files
}

module.exports = function download(url, options = {}) {
  return new Promise((resolve, reject) => {
    Object.assign(options, {
      filter: 'audioonly'
    });
    ytdl.getInfo(url, (err, info) => {
      if (err) return reject(err);
      // Prefer opus
      const hasOpus = info.formats.find(filter);
      if (hasOpus) Object.assign(options, { filter });
      const ytdlStream = ytdl.downloadFromInfo(info, options);
      if (hasOpus) {
        const demuxer = new prism.opus.WebmDemuxer();
        return resolve(ytdlStream.pipe(demuxer).on('end', () => {
          demuxer.destroy();
        }));
      } else {
        const transcoder = new prism.FFmpeg({
          args: [
            '-analyzeduration', '0',
            '-loglevel', '0',
            '-f', 's16le',
            '-ar', '48000',
            '-ac', '2',
          ],
        });
        const opus = new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 });
        const stream = ytdlStream.pipe(transcoder).pipe(opus);
        stream.on('close', () => {
          transcoder.destroy();
          opus.destroy();
        });
        return resolve(stream);
      }
    });
  });
}
