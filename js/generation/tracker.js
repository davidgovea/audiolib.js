/**
 * Creates a new Note Tracker.
 *
 * @constructor
 * @this {Tracker}
 * @param {Number} sampleRate The samplerate to operate the Oscillator on.
 * @param {Number} noteTime The note length in milliseconds
*/
function Tracker(sampleRate, noteTime, noteCallback){
    var self            = this;
    self.notes          = [];
    self.sampleRate     = sampleRate;
    self.noteTime       = isNaN(noteTime) ? 250 : noteTime;
    self.noteLength     = sampleRate * 0.001 * self.noteTime;
    self.zero           = new Float32Array(self.noteLength);
    self.cb             = noteCallback; 
}

Tracker.prototype = {
    
    pos: 0,
    
    looping: false,
    
    generate: function(){
        var self = this,
            notes,
            loopNote;
            
        if((self.pos+=1) === self.noteLength) {
            notes   = self.notes,
            loopNote = notes.shift();
            
            if(self.looping) {
                notes.push(loopNote);
            }
            
            self.pos = 0;
            self.cb(); //TODO: pass info into callback
        }
    },
    
    getMix: function(){
        var self = this,
            note = self.notes[0] || self.zero;
            
        return note[self.pos];
    },
    
/**
 * Adds a Note to be played by the Tracker
*/
    addNote: function(generatorFn){
        var self        = this,
            noteLength  = self.noteLength,
            note        = new Float32Array(noteLength),
            i           = 0;
                   
        for(i=0; i < noteLength; i++){
            note[i] = generatorFn(i);           
        }
        
        self.notes.push(note);
    },
    
    getNoteLength: function(){
        //Returns queued note count
        return this.noteLength;
    },
    
    getNoteCount: function(){
        //Returns queued note count
        return this.notes.length - 1;
    },
    
    setLooping: function(bool){
        this.looping = (typeof bool === 'undefined') ? true : bool;
    },
    
    reset: function(){
        this.notes  = [];
        this.pos    = 0;
    }

};
