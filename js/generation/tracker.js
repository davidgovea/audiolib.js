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
	self.len = sampleRate * 0.001 * self.noteLength;
	self.zero = new Float32Array(len);
	self.over = new Float32Array(len);//Note overflow for audio longer than 1 beat
}

Tracker.prototype = {
	
	_p: 0,
	
	generate: function(){
		var self = this;
		if((self._p += 1) === self.len) {
			self.mixBuffer(notes.shift().splice(_p), self.over);
			self._p = 0;
			
			noteCallback();
		}
	},
	
	getMix: function(){
		var note = this.notes[0] || this.zero;
		return note[this._p];
	},
	
/**
 * Adds a Note to be played by the Tracker
*/
	addNote: function(generatorArray){
		var self = this,
			note = new Float32Array(self.len),
			argLength = generatorArray.length,
			noteLength = self.len,
			toMix = [];
			asyncCount = 0, 
			voiceIndex = 0,
			i = 0,
			
			ASYNC_SERVING_SIZE = 250;
			
	//	this.asyncNote(args);
		
		function async_generate(){
			asyncCount = 0;
			for(; i < noteLength; i++){
				toMix = [];
				for(voiceIndex = 0; voiceIndex < argLength; voiceIndex++){
					toMix.push( generatorArray[voiceIndex](i) );
					asyncCount++;
				}
				note[i] = mix(toMix);
				if(asyncCount >= ASYNC_SERVING_SIZE){
					break;
				}
			}
		
			if(i < noteLength){
				setTimeout(async_generate,0);
			} else {
				self.notes.push(note);
			}
		}
		
		async_generate();
		
		
	},
	
	asyncNote: function(generatorArray){
		//Generate 1 note buffer, non-blocking loop
		var note = new Float32Array(this.len);
		
		notes.push(note);
	},
	
	mix: function(sampleArray){
		//Simple addition mixing with clip handling
		var mixed = 0,
			count = sampleArray.length,
			i, n=0, abs;
			
			for(i=0; i<count; i++){
				var sample = sampleArray[i];
				if(sample !== 0){
					mixed += sample
					n++;
				}
			}
			
			//Handle Clipping
			abs = Math.abs(mixed);
			if(abs > 0.9){
				if(mixed > 0){
					mixed = 0.9 + (mixed-0.9)/n*.1;
				} else {
					mixed = -0.9 + (mixed+0.9)/n*.1;
				}
				
			}
		return mixed;
		
	},
	
	// mix: function(sample1, sample2){
		// //Mix together 2 or more samples
		// var mixed, lesser, sum, extraArgs, argLength = arguments.length;
// 		
		// if(sample1 > 0){
			// if(sample2 > 0){
				// console.log('1');
				// mixed = sample1 + sample2 - sample1*sample2;
			// } else {
				// console.log('2');
				// sum = sample1 + sample2;
				// lesser = (sum < 0) ? sample1 : -sample2;
				// mixed = (sample1 + sample2)*(1 + lesser);
			// }
		// } else {
			// if (sample2 < 0){
				// console.log('3');
				// mixed = sample1 + sample2 + sample1*sample2;
			// } else {
				// console.log('4');
				// sum = sample1 + sample2;
				// lesser = (sum > 0) ? -sample1 : sample2;
				// mixed = (sample1 + sample2)*(1 + lesser);
			// }
		// }
// 		
// 		
		// if(argLength > 2){
			// //Chaining mixes like this is inaccurate, alright alright!
			// extraArgs = Array.prototype.slice.call(arguments, 2);
			// extraArgs.unshift(mixed);
			// mixed = this.mix.apply(this, extraArgs);
		// }
// 		
		// return mixed;
	// },
	
	mixBuffer: function(sourceBuffer, destBuffer){
		//Mix sourceBuffer into destBuffer
		var l = sourceBuffer.length,
			i;
			
		for(i = 0; i < l; i++ ){
			destBuffer[i] = this.mix([sourceBuffer[i], destBuffer[i]]);
		}
		return true;
	},
	
}
