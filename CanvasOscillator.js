var CanvasOscillator = {
  CanvasOscillator: function(dom_canvas) {
    return {
      ctx: dom_canvas.getContext('2d'),
      enabled: true,
      update: function(samples) {
        if (this.enabled) {
          this.enabled = false;
          let oscillator_data = this.ctx.createImageData(dom_canvas.width, dom_canvas.height);
          let oscillator_height_half = oscillator_data.height/2;
          for (var i = 0; i < samples.length; i++) {
            let value = samples[i];
            let y = ~~(value*oscillator_height_half + oscillator_height_half);
            let x = i>>4;
            let channel = 3;
            let addr = ((y * (oscillator_data.width * 4)) + (x * 4)) + channel;
            oscillator_data.data[addr] = 255;
          }
          this.ctx.putImageData(oscillator_data, 0, 0);
        }
      }
    };
  }
}