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
	
	_p: 0,
	
	generate: function(){
		(this._p += 1) === this.len && this.notes.shift() && (this._p = 0);
	},
	
	getMix: function(){
		var note = this.notes[0] || this.zero;
		return note[this._p];
	},
	
/**
 * Adds a Note to be played by the Tracker
*/
	addNote: function(generateNote){
		var self = this,
			l = self.len,
			note = new Float32Array(l),
			i;
			
		for (i=0; i<l; i++){
			note[i] = generateNote(self.sampleRate);
		}
		self.notes.push(note);
	},
}
