/**
 * Creates a new Note Tracker.
 *
 * @constructor
 * @this {Tracker}
 * @param {Number} sampleRate The samplerate to operate the Oscillator on.
 * @param {Number} noteLength The note length in milliseconds
*/
function Tracker(sampleRate, noteLength, noteCallback){
	var	self	= this;
	self.notes	= [];
	self.sampleRate	= sampleRate;
	self.noteLength	= isNaN(noteLength) ? 250 : noteLength;
}

Tracker.prototype = {
	generate: function(){

	},
	
	getMix: function(){
		
	},
	
/**
 * Adds a Note to be played by the Tracker
*/
	addNote: function(generateNote){
		
	},
}
