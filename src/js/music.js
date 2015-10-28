var get = require('./lib/get');

module.exports = Music;

function Music() {
  // Audio.
  this.audio = new Audio();
  this.audio.crossOrigin = 'anonymous';

  // Context.
  this.context = new (window.AudioContext || window.webkitAudioContext)();


  // Analyser.
  this.analyser = this.context.createAnalyser();
  this.analyser.smoothingTimeConstant = 0.1;
  this.analyser.fftSize = 2048;
  this.analyser.connect(this.context.destination);

  // Source.
  this.src = this.context.createMediaElementSource(this.audio);
  this.src.connect(this.context.destination);
  this.src.connect(this.analyser);


  // Frequency.
  this.frequency = new Uint8Array(this.analyser.frequencyBinCount);


  // Songs.
  this.songs = [
    'https://soundcloud.com/wolfganggartner/wolfgang-gartner-unholy-extended-mix',
    'https://soundcloud.com/mau5trap/deadmau5-some-chords-original',
    'https://soundcloud.com/aviciiofficial/avicii-levels-original-mix',
    'https://soundcloud.com/c2cdjs/down-the-road',
    'https://soundcloud.com/madeon/pay-no-mind',
    'https://soundcloud.com/futureclassic/hayden-james-something-about-you-2',
    'https://soundcloud.com/majorlazer/major-lazer-dj-snake-lean-on-feat-mo'
  ];

  this.start();
};


// Methods.
Music.prototype.isPaused = function() {
  return this.audio.paused;
};


Music.prototype.isPlaying = function() {
  return !this.audio.paused;
};


Music.prototype.getFrequency = function() {
  this.analyser.getByteFrequencyData(this.frequency);

  return this.frequency;
};


Music.prototype.start = function() {
  var audio = this.audio;
  var songs = this.songs;

  get(
    '//api.soundcloud.com/resolve.json?url=' + songs[Math.floor(Math.random() * songs.length)] + '&client_id=78c6552c14b382e23be3bce2fc411a82',
    function(request) {
      var data = JSON.parse(request.responseText);
      var title = document.querySelector('.music-title');
      var user = document.querySelector('.music-user');

      audio.src = data.stream_url + '?client_id=78c6552c14b382e23be3bce2fc411a82';
      audio.play();

      title.setAttribute('href', data.permalink_url);
      title.textContent = data.title;

      user.setAttribute('href', data.user.permalink_url);
      user.textContent = data.user.username;
    }
  );
};


Music.prototype.pause = function() {
  this.audio.pause();
};


Music.prototype.play = function() {
  this.audio.play();
};
