var int = require('./lib/int');

module.exports = (function() {
  // About.
  var about = document.querySelector('.about');

  // Drag.
  Draggable.create(about, {
    bounds: document.body,
    edgeResistance: 1,
    type: 'x, y',
    onDrag: function(e) {
      TweenLite.to(this.target, .1, {
        x: this.x,
        y: this.y
      });
    }
  });

  // Hover.
  about.addEventListener('mouseover', function() {
    TweenLite.to(about, .4, {
      background: 'rgba(255, 255, 255, 0)',
      color: 'rgb(255, 255, 255)'
    });
  });

  about.addEventListener('mouseout', function() {
    TweenLite.to(about, .4, {
      background: 'rgba(255, 255, 255, 1)',
      color: 'rgb(0, 0, 0)'
    });
  });

  // Position.
  about.style.left = int(0, window.innerWidth - about.offsetWidth) + 'px';
  about.style.top = int(0, window.innerHeight - about.offsetHeight) + 'px';
})();
