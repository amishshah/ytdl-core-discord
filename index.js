const ytdl = require('ytdl-core');
const prism = require('prism-media');

function filter(format) {
	return format.audioEncoding === 'opus' &&
		format.container === 'webm' &&
		format.audio_sample_rate == 48000;
}

module.exports = function download(url, options = {}) {
	return new Promise((resolve, reject) => {
		ytdl.getInfo(url, (err, info) => {
			if (err) return reject(err);
			// Prefer opus
			const format = info.formats.find(filter);
			const canDemux = format && info.length_seconds != 0;
			if (canDemux) options = { ...options, filter };
			else if (info.length_seconds != 0) options = { ...options, filter: 'audioonly' };
			if (canDemux) {
				const demuxer = new prism.opus.WebmDemuxer();
				return resolve(ytdl.downloadFromInfo(info, options).pipe(demuxer).on('end', () => demuxer.destroy()));
			} else {
				const transcoder = new prism.FFmpeg({
					args: [
						'-reconnect', '1',
						'-reconnect_streamed', '1',
						'-reconnect_delay_max', '5',
						'-i', format.url,
						'-analyzeduration', '0',
						'-loglevel', '0',
						'-f', 's16le',
						'-ar', '48000',
						'-ac', '2',
					],
				});
				const opus = new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 });
				const stream = transcoder.pipe(opus);
				stream.on('close', () => {
					transcoder.destroy();
					opus.destroy();
				});
				return resolve(stream);
			}
		});
	});
};
