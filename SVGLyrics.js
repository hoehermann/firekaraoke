var SVGLyrics = {
note_height_px:10,
beat_width_px:10,
pitch_height_px:-10,
min_pitch:null,
max_pitch:null,
pitch_offset:null,
song:null,
load:function(song_url, dom_screen) {
  let xmlns = "http://www.w3.org/2000/svg";
  fetch(song_url).then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.text();
  }).then((data) => {
    this.song = Lyrics.parse(data);
    //console.log(this.song);
    let pitches = this.song.lyrics.map(note => note.pitch).filter(pitch => !isNaN(pitch));
    this.min_pitch = Math.min(...pitches);
    this.max_pitch = Math.max(...pitches);
    this.pitch_offset = Math.floor(this.min_pitch/12)*12;
    this.min_pitch -= this.pitch_offset;
    this.max_pitch -= this.pitch_offset;
    //console.log(this.min_pitch, this.max_pitch);
    let max_beat = 0;
    this.song.lyrics.forEach(note => {
      if (note.type == 'regular' || note.type == 'golden') {
        note.pitch -= this.pitch_offset;
        let rect = document.createElementNS(xmlns, 'rect');
        rect.setAttributeNS(null, 'x', note.beat*this.beat_width_px);
        rect.setAttributeNS(null, 'y', note.pitch*this.pitch_height_px);
        rect.setAttributeNS(null, 'width', note.duration*this.beat_width_px);
        rect.setAttributeNS(null, 'height', this.note_height_px);
        dom_screen.appendChild(rect);
        let text = document.createElementNS(xmlns, 'text');
        text.setAttributeNS(null, 'x', note.beat*this.beat_width_px);
        text.setAttributeNS(null, 'y', note.pitch*this.pitch_height_px-2);
        text.innerHTML = note.text;
        dom_screen.appendChild(text);
      } else if (note.type == 'break') {
        // nix
      } else if (note.type === undefined) {
        // seems to be used for song end marker and probably others
      } else {
        console.log("Unkown note type:", note);
      }
      if (note.beat) {
        max_beat = Math.max(max_beat, note.beat);
        if (note.duration) {
          max_beat += note.duration;
        }
      }
    });
    //dom_screen.width.baseVal.value = max_beat*beat_width_px;
    dom_screen.setAttributeNS(null, 'width', max_beat*this.beat_width_px);
    dom_screen.setAttributeNS(null, 'viewBox', `0 ${(this.max_pitch+2)*this.pitch_height_px} ${max_beat*this.beat_width_px} ${(this.min_pitch-this.max_pitch-4)*this.pitch_height_px}`);
    
    let dom_position_indicator = document.createElementNS(xmlns, 'path');
    dom_position_indicator.setAttributeNS(null, 'd', `M 0 ${SVGLyrics.min_pitch*SVGLyrics.pitch_height_px} V ${SVGLyrics.max_pitch*SVGLyrics.pitch_height_px}`);
    dom_position_indicator.setAttributeNS(null, 'id', 'position_indicator');
    dom_position_indicator.setAttributeNS(null, 'transform', 'translate(0 0)');
    dom_screen.appendChild(dom_position_indicator);
  });
}
};