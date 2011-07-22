/**
 * Creates a new Note Tracker.
 *
 * @constructor
 * @this {Tracker}
 * @param {Number} sampleRate The samplerate to operate the Oscillator on.
 * @param {Number} noteLength The note length in milliseconds
*/
function Tracker(sampleRate, channelCount, noteLength, noteCallback){
	var	self	= this;
	self.notes	= [];
	self.sampleRate	= sampleRate;
	self.noteLength	= isNaN(noteLength) ? 250 : noteLength;
	self.len = sampleRate * 0.01 * self.noteLength;
	self.zero = new Float32Array(len);
}

Tracker.prototype = {
	
	_over: new Float32Array(len),
	_p: 0,
	
	generate: function(){
		var self = this;
		(self._p += 1) === self.len && (self.mixBuffer(notes.shift().splice(_p), self._over)) && (self._p = 0);
	},
	
	getMix: function(){
		var note = this.notes[0] || this.zero;
		return note[this._p];
	},
	
/**
 * Adds a Note to be played by the Tracker
*/
	addNotes: function(generateVoice /*, generateVoice2, 3, ... */){
		var args = Array.prototype.slice.call(arguments, 0);			
		this.asyncNote(args);
	},
	
	asyncNote: function(generatorArray){
		//Generate 1 note buffer, non-blocking loop
	},
	
	mix: function(sample1, sample2){
		//Mix together 2 or more samples
		var mixed, lesser, sum, extraArgs, argLength = arguments.length;
		
		if(sample1 > 0){
			if(sample2 > 0){
				console.log('1');
				mixed = sample1 + sample2 - sample1*sample2;
			} else {
				console.log('2');
				sum = sample1 + sample2;
				lesser = (sum < 0) ? sample1 : -sample2;
				mixed = (sample1 + sample2)*(1 + lesser);
			}
		} else {
			if (sample2 < 0){
				console.log('3');
				mixed = sample1 + sample2 + sample1*sample2;
			} else {
				console.log('4');
				sum = sample1 + sample2;
				lesser = (sum > 0) ? -sample1 : sample2;
				mixed = (sample1 + sample2)*(1 + lesser);
			}
		}
		
		
		if(argLength > 2){
			extraArgs = Array.prototype.slice.call(arguments, 2);
			extraArgs.unshift(mixed);
			mixed = this.mix.apply(this, extraArgs);
		}
		
		return mixed;
	},
	
	mixBuffer: function(sourceBuffer, destBuffer){
		//Mix sourceBuffer into destBuffer
		var l = sourceBuffer.length,
			i;
			
		for(i = 0; i < l; i++ ){
			destBuffer[i] = this.mix(sourceBuffer[i], destBuffer[i]);
		}
		
	}
}
