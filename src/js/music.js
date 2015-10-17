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
    'https://soundcloud.com/penguin-prison/never-gets-old-1',
    'https://soundcloud.com/thewallaband/101a',
    'https://soundcloud.com/pop/iris-ill-wait-for-you',
    'https://soundcloud.com/upcastmusic/echosmith-cool-kids',
    'https://soundcloud.com/chvrches/chvrches-get-away',
    'https://soundcloud.com/rac/cheap-sunglasses-ft-matthew-koma',
    'https://soundcloud.com/greatgoodfineok/not-going-home',
    'https://soundcloud.com/recordrecords/of-monsters-and-men-little-2',
    'https://soundcloud.com/atlas-genius/trojans',
    'https://soundcloud.com/m83/midnight-city',
    'https://soundcloud.com/teganandsara/closer',
    'https://soundcloud.com/nettwerkmusicgroup/03-you-me-the-bourgeoisie',
    'https://soundcloud.com/wolfgang/lions-in-cages?in=wolfgang/sets/wolf-gang',
    'https://soundcloud.com/miami-horror/holidays',
    'https://soundcloud.com/panicatthedisco/vegas-lights',
    'https://soundcloud.com/panicatthedisco/panic-at-the-disco-hallelujah',
    'https://soundcloud.com/panicatthedisco/panic-at-the-disco-girlsgirlsboys',
    'https://soundcloud.com/whitetown/04-your-woman',
    'https://soundcloud.com/chromeo/night-by-night',
    'https://soundcloud.com/warnerbrosrecords/nonono-pumpin-blood',
    'https://soundcloud.com/wichita-recordings/peter-bjorn-and-john-young-folks',
    'https://soundcloud.com/the-ting-tings/do-it-again-1',
    'https://soundcloud.com/the-ting-tings/wrong-club',
    'https://soundcloud.com/fueled_by_ramen/migraine',
    'https://soundcloud.com/joywave/tongues',
    'https://soundcloud.com/blind-pilot-music/go-on-say-it',
    'https://soundcloud.com/yunizon-records/manganas-garden-slow-it-down',
    'https://soundcloud.com/templesofficial/shelter-song',
    'https://soundcloud.com/wearemausi/mausi-my-friend-has-a-swimming-pool',
    'https://soundcloud.com/givemepowers/beat-of-my-drum',
    'https://soundcloud.com/pnau/embrace-feat-ladyhawke',
    'https://soundcloud.com/joywave/now',
    'https://soundcloud.com/thecolourist/little-games',
    'https://soundcloud.com/penguin-prison/show-me-the-way',
    'https://soundcloud.com/scavengerhunt/wildfire',
    'https://soundcloud.com/atlas-genius/atlas-genius-back-seat',
    'https://soundcloud.com/wearelisbon/b-l-u-e-l-o-v-e',
    'https://soundcloud.com/ghostbeach/ghost-beach-on-my-side',
    'https://soundcloud.com/yuksek/kostrok-right-now-yuksek',
    'https://soundcloud.com/equalvision/northern-faces-wait-wait-wait',
    'https://soundcloud.com/helloclubfeet/clubfeet-heartbreak-feat-chela',
    'https://soundcloud.com/iamsoundrecords/kate-boy-northern-lights-mp3',
    'https://soundcloud.com/wearelisbon/khaleesi',
    'https://soundcloud.com/officialratatat/02-cream-on-chrome-1',
    'https://soundcloud.com/officialratatat/08-nightclub-amnesia-1',
    'https://soundcloud.com/theglitchmob/we-can-make-the-world-stop',
    'https://soundcloud.com/theglitchmob/the-glitch-mob-carry-the-sun',
    'https://soundcloud.com/wolfganggartner/wolfgang-gartner-unholy-extended-mix',
    'https://soundcloud.com/okgo/i-wont-let-you-down',
    'https://soundcloud.com/portugaltheman/atomic-man',
    'https://soundcloud.com/atlanticrecords/youre-gonna-love-this-1',
    'https://soundcloud.com/fueled_by_ramen/paramore-aint-it-fun',
    'https://soundcloud.com/royksopp/happy-up-here-1'
  ];
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


Music.prototype.load = function() {
  var audio = this.audio;
  var songs = this.songs;

  get(
    '//api.soundcloud.com/resolve.json?url=' + songs[Math.floor(Math.random() * songs.length)] + '&client_id=78c6552c14b382e23be3bce2fc411a82',
    function(request) {
      var data = JSON.parse(request.responseText);
      var title = document.querySelector('.music-title');
      var user = document.querySelector('.music-user');

      audio.src = data.stream_url + '?client_id=78c6552c14b382e23be3bce2fc411a82';

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
