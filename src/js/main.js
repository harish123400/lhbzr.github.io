// Library.
var get = require('./lib/get');


// Classes.
var Music = require('./music');
var Scene = require('./scene');


// About.
var about = require('./about');


// Menu.
var menu = require('./menu');


// Music.
var music = new Music();

music.audio.addEventListener('ended', function() {
  music.start();
});


// Scene.
var scene = new Scene(music);

scene.createGeometry();
scene.createLight();
scene.createShaders();
scene.render();


// Icons.
get(
  'dist/img/sprites/sprites.svg',
  function (response) {
    var wrapper = document.createElement('div');

    wrapper.style.display = 'none';
    wrapper.innerHTML = response.responseText.replace(/\n/g, '');

    document.body.insertBefore(wrapper, document.body.childNodes[0]);
  }
);


// Audio.
var volume;


// Window.
window.addEventListener('resize', function() {
  scene.resize();
}, false);

window.addEventListener('click', function(e) {
  scene.click(e);
}, false);

window.addEventListener('mousemove', function(e) {
  scene.mousemove(e);
}, false);

window.addEventListener('mousewheel', function(e) {
  var volume = Math.round(music.audio.volume * 100) / 100;

    if (e.wheelDelta < 0 && volume - 0.05 >= 0) {
        volume = Math.abs(volume - 0.05);
    } else if (e.wheelDelta > 0 && volume + 0.05 <= 1) {
        volume = Math.abs(volume + 0.05);
    }

    music.audio.volume = volume;
});
