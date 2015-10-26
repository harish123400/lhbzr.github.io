(function() {
  var height = window.innerHeight;
  var width = window.innerWidth;

  function color () {
    var colors = [
      '#000000', '#151515', '#2A2A2A', '#3F3F3F', '#545454', '#696969',
      '#7E7E7E', '#939393', '#A8A8A8', '#BDBDBD', '#D3D3D3'
    ];

    return colors[Math.floor(Math.random() * colors.length)];
  }

  var options = {
    width: 10,
    height: 10
  };

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  document.body.appendChild(canvas);

  canvas.height = height;
  canvas.width = width;

  var columns = Math.ceil(width / options.width),
      lines = Math.ceil(height / options.height);

  function draw() {
    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < lines; j++) {
        context.fillStyle = color();
        context.fillRect(options.width * i, options.height * j, options.width, options.height);
      }
    }
  }

  function render() {
    draw();

    requestAnimationFrame(render);
  }

  render();
})();
