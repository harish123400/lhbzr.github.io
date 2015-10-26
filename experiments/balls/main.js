(function() {
  var COLORS = ['#D0F66A', '#36C186', '#158A8C', '#1E5287'];
  
  var sketch = Sketch.create();
  var particles = [];

  var Particle = function(x, y) {
    this.alive = true;
    this.angle = random(0, 360);
    this.color = random(COLORS);
    this.radius = random(10, 30);
    this.vy = cos(this.angle);
    this.vx = sin(this.angle);
    this.x = x;
    this.y = y;
  }

  Particle.prototype.update = function() {
    this.alive = this.radius > 0.25;
    this.radius *= 0.90;
    this.x += this.vx * 10;
    this.y += this.vy * 10;
  };

  Particle.prototype.render = function() {
    sketch.globalAlpha = 1;
    sketch.beginPath();
    sketch.arc(this.x, this.y, this.radius, 0, TWO_PI);
    sketch.fillStyle = this.color;
    sketch.fill();
  };

  sketch.draw = function() {
    for (var i = 0; i < particles.length; i++) {
      particles[i].render();
    }
  };

  sketch.mousemove = function() {
    for (var i = 0; i < 2; i++) {
      particles.push(new Particle(sketch.mouse.x, sketch.mouse.y));
    }

    for (var i = 0; i < particles.length; i++) {
      particles[i].render();
    }
  };

  sketch.update = function() {
    for (var i = 0; i < particles.length; i++) {
      if (particles[i]) {
        var particle = particles[i];

        if (particle.alive) {
          particle.update()
        }
        else {
          particles.splice(i, 1);
        }
      }
    }
  };

  sketch.clear = function() {
    sketch.globalAlpha = 0.5;
    sketch.fillStyle = '#000';
    sketch.fillRect(0, 0, sketch.width, sketch.height);
  };
})();
