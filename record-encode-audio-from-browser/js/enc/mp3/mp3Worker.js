importScripts('libmp3lame.js');

var mp3codec;

self.onmessage = function(e) {
	switch (e.data.command) {
		case 'init':
			init(e.data.sampleRate);
			break;
		case 'encode':
			encode(e.data.pcm);
			break;
		case 'finish':
			finish();
			break;
	}
};

function init(sampleRate) {
	mp3codec = Lame.init();
	Lame.set_mode(mp3codec, Lame.MONO);
	Lame.set_num_channels(mp3codec, 1);
	Lame.set_out_samplerate(mp3codec, 22050);
	Lame.set_in_samplerate(mp3codec, sampleRate);
	Lame.set_bitrate(mp3codec, 96);
	Lame.init_params(mp3codec);
}

function encode(pcm) {
	var mp3data = Lame.encode_buffer_ieee_float(mp3codec, pcm, pcm);
	self.postMessage({
		mp3data: mp3data.data
	});
}

function finish() {
	var mp3data = Lame.encode_flush(mp3codec);
	self.postMessage({
		mp3data: mp3data.data
	});
}

