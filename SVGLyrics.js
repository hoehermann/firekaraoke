var SVGLyrics = {
  SVGLyrics: function(song_txt, dom_screen) {
    let xmlns = "http://www.w3.org/2000/svg";
    let out = {
      note_height_px: 10,
      beat_width_px: 10,
      pitch_height_px: -10,
      max_beat: null,
      min_pitch: null,
      max_pitch: null,
      pitch_offset: null,
      song: null,
      convert_second_to_beat(second) {
        return (second-this.song.gap/1000)*this.song.bpm/60 * 4; // TODO: find out where this magic value comes from
      },
      get_lyric_by_second(second) {
        let beat = this.convert_second_to_beat(second);
        return this.song.lyrics.find(note => note.beat < beat && note.beat + note.duration > beat);
      }
    };
    out.song = Lyrics.parse(song_txt);
    //console.log(out.song);
    let pitches = out.song.lyrics.map(lyric => lyric.pitch).filter(pitch => !isNaN(pitch));
    out.min_pitch = Math.min(...pitches);
    out.max_pitch = Math.max(...pitches);
    out.pitch_offset = Math.floor(out.min_pitch/12)*12;
    out.min_pitch -= out.pitch_offset;
    out.max_pitch -= out.pitch_offset;
    //console.log(out.min_pitch, out.max_pitch);
    out.song.lyrics.forEach(lyric => {
      if (lyric.type == 'regular' || lyric.type == 'golden' || lyric.type == 'freestyle') {
        let pitch = out.min_pitch;
        if (lyric.type != 'freestyle') {
            lyric.pitch -= out.pitch_offset;
            pitch = lyric.pitch;
            let rect = document.createElementNS(xmlns, 'rect');
            rect.setAttributeNS(null, 'x', lyric.beat*out.beat_width_px);
            rect.setAttributeNS(null, 'y', pitch*out.pitch_height_px);
            rect.setAttributeNS(null, 'width', lyric.duration*out.beat_width_px);
            rect.setAttributeNS(null, 'height', out.note_height_px);
            dom_screen.appendChild(rect);
            lyric.dom_rect = rect;
        }
        let text = document.createElementNS(xmlns, 'text');
        text.setAttributeNS(null, 'x', lyric.beat*out.beat_width_px);
        text.setAttributeNS(null, 'y', pitch*out.pitch_height_px-2);
        text.innerHTML = lyric.text;
        dom_screen.appendChild(text);
        lyric.dom_text = text;
      } else if (lyric.type == 'break') {
        // nix
      } else if (lyric.type === undefined) {
        // seems to be used for song end marker and probably others
      } else {
        console.log("Unkown lyric type:", lyric);
      }
      if (lyric.beat) {
        out.max_beat = Math.max(out.max_beat, lyric.beat);
        if (lyric.duration) {
          out.max_beat += lyric.duration;
        }
      }
    });
    //dom_screen.width.baseVal.value = max_beat*beat_width_px;
    dom_screen.setAttributeNS(null, 'width', out.max_beat*out.beat_width_px);
    dom_screen.setAttributeNS(null, 'viewBox', `0 ${(out.max_pitch+2)*out.pitch_height_px} ${out.max_beat*out.beat_width_px} ${(out.min_pitch-out.max_pitch-4)*out.pitch_height_px}`);

    let dom_position_indicator = document.createElementNS(xmlns, 'path');
    dom_position_indicator.setAttributeNS(null, 'd', `M 0 ${out.min_pitch*out.pitch_height_px} V ${out.max_pitch*out.pitch_height_px}`);
    dom_position_indicator.setAttributeNS(null, 'id', 'position_indicator');
    dom_position_indicator.setAttributeNS(null, 'transform', 'translate(0 0)');
    dom_screen.appendChild(dom_position_indicator);
    
    return out;
  }
};