(function() {
  'use strict';

  //
  // Variables.
  //
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var windowHalfHeight = windowHeight / 2;
  var windowHalfWidth = windowWidth / 2;
  var mouseX = windowHalfWidth;
  var mouseY = windowHalfHeight;



  //
  // Functions.
  //
  function get(url, callback) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        callback(request);
      }
    };

    request.open('GET', url, true);
    request.send();
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function replaceAt(value, index, char) {
    return value.substr(0, index) + char + value.substr(index + 1);
  }



  //
  // About.
  //
  var about = document.querySelector('.about');

  // Positions.
  about.style.top = randomInt(0, windowHeight - about.offsetHeight) + "px";
  about.style.left = randomInt(0, windowWidth - about.offsetWidth) + "px";

  // Draggable.
  Draggable.create(about, {
    bounds: document.querySelector('body'),
    type: 'x, y'
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



  //
  // Link.
  //
  var link = document.querySelectorAll('.menu-link');
  var linkOverInterval;
  var linkOutInterval;

  // Draggable.
  Draggable.create(link, {
    bounds: document.querySelector('body'),
    edgeResistance: 1,
    type: 'x, y',
    onClick: function() {
      location.href = this.target.getAttribute('data-href');
    }
  });

  // Hover.
  for (var i = 0; i < link.length; i++) {
    var linkCurrent = link[i];

    linkCurrent.style.top = randomInt(0, windowHeight - linkCurrent.offsetHeight) + "px";
    linkCurrent.style.left = randomInt(0, windowWidth - linkCurrent.offsetWidth) + "px";

    linkCurrent.addEventListener('mouseover', function() {
      var link = this;

      linkOverInterval = setInterval(function() {
        var linkValue = link.innerHTML.trim();

        link.innerHTML = replaceAt(linkValue, randomInt(0, linkValue.length - 1), String.fromCharCode(randomInt(65, 122)));
      }, 10);

      TweenLite.to(link, .4, {
        background: 'rgba(255, 255, 255, 1)',
        color: 'rgb(0, 0, 0)'
      });
    });

    linkCurrent.addEventListener('mouseout', function() {
      clearInterval(linkOverInterval);

      var link = this;
      var linkText = link.getAttribute('data-text');
      var i = 0;

      var linkOutInterval = setInterval(function() {
        if (i < linkText.length) {
          var linkValue = link.innerHTML.trim();

          link.innerHTML = replaceAt(linkValue, i, linkText[i]);
        } else {
          clearInterval(linkOutInterval);
        }

        i++;
      }, 10);


      // Hover.
      TweenLite.to(link, .4, {
        background: 'rgba(255, 255, 255, 0)',
        color: 'rgb(255, 255, 255)'
      });
    });
  }



  //
  // Audio.
  //
  var audio, audioContext, audioAnalyser, audioBuffer, audioSource, audioFrequency;
  var soundcloudClient = 'client_id=78c6552c14b382e23be3bce2fc411a82';
  var soundcloudMusics = [
    'https://soundcloud.com/penguin-prison/never-gets-old-1',
    'https://soundcloud.com/thewallaband/101a',
    'https://soundcloud.com/pop/iris-ill-wait-for-you',
    'https://soundcloud.com/upcastmusic/echosmith-cool-kids',
    'https://soundcloud.com/chvrches/chvrches-get-away',
    'https://soundcloud.com/rac/cheap-sunglasses-ft-matthew-koma',
    'https://soundcloud.com/greatgoodfineok/not-going-home',
    'https://soundcloud.com/polyvinyl-records/starfucker-while-im-alive',
    'https://soundcloud.com/fitzandthetantrums/the-walker',
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
    'https://soundcloud.com/fueled_by_ramen/paramore-aint-it-fun'
  ];

  function soundcloudLoadMusic() {
    var soundcloudPermalink = soundcloudMusics[Math.floor(Math.random() * soundcloudMusics.length)];

    get(
      '//api.soundcloud.com/resolve.json?url=' + soundcloudPermalink + '&' + soundcloudClient,
      function (response) {
        var information = JSON.parse(response.responseText);

        audio.src = information.stream_url + '?' + soundcloudClient;
        audio.play();

        var musicTitle = document.querySelector('.music-title');
        musicTitle.setAttribute('href', information.permalink_url);
        musicTitle.innerHTML = information.title;

        var musicUser = document.querySelector('.music-user');
        musicUser.setAttribute('href', information.user.permalink_url);
        musicUser.innerHTML = information.user.username;
      }
    );
  };

  function initAudio() {
    audio = new Audio();
    audio.crossOrigin = 'anonymous';

    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    audioSource = audioContext.createMediaElementSource(audio);
    audioSource.connect(audioContext.destination);

    audioAnalyser = audioContext.createAnalyser();
    audioAnalyser.smoothingTimeConstant = 0.1;
    audioAnalyser.fftSize = 512 * 4;
    audioSource.connect(audioAnalyser);

    soundcloudLoadMusic();

    audioAnalyser.connect(audioContext.destination);

    audioFrequency = new Uint8Array(audioAnalyser.frequencyBinCount);

    audio.addEventListener('ended', function() {
      soundcloudLoadMusic();
    });
  }



  //
  // Scene.
  //
  var canvas = document.querySelector('.canvas');
  var scene, camera, renderer, light, composer, effect;
  var particles, circle, geometry, geometrySleeve, geometryListInt;
  var geometryList = [
    new THREE.TetrahedronGeometry(50, 0),
    new THREE.IcosahedronGeometry(40, 0),
    new THREE.OctahedronGeometry(40, 0)
  ];
  var geometryLength = 100;

  function initScene() {
    // Setup.
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true, canvas: canvas }) || new THREE.CanvasRenderer({ alpha: true, canvas: canvas });

    renderer.setSize(windowWidth, windowHeight);

    // Lights.
    light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(1, 1, 1);

    scene.add(light);

    light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, -1, 1);

    scene.add(light);

    // Circle.
    circle = new THREE.Object3D();

    geometry = [];
    geometrySleeve = [];
    geometryListInt = randomInt(0, geometryList.length - 1);

    for (var i = 0; i < geometryLength; i++) {
      geometry[i] = new THREE.Mesh(
        geometryList[geometryListInt],
        new THREE.MeshPhongMaterial({
          color: 0xFFFFFF,
          wireframe: true
        })
      );

      geometry[i].position.y = 100;

      // Surrogate Rings. [http://inmosystems.com/demos/surrogateRings/source/]
      geometrySleeve[i] = new THREE.Object3D();
      geometrySleeve[i].add(geometry[i]);
      geometrySleeve[i].rotation.z = i * (360 / geometryLength) * Math.PI / 180;

      circle.add(geometrySleeve[i]);
    }

    scene.add(circle);

    // Camera.
    camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
    camera.position.z = 275;
    camera.lookAt = circle;

    scene.add(camera);

    // Shaders. [http://threejs.org/examples/#webgl_postprocessing]
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.05;
    effect.renderToScreen = true;
    composer.addPass(effect);

    renderer.render(scene, camera);
  }



  //
  // Render.
  //
  function render() {
    // Circle.
    for (var i = 0; i < geometryLength; i++) {
      var value = (audioFrequency) ? ((audioFrequency[i] / 256) * 2.5) + 0.01 : 1;

      geometry[i].scale.z = value;

      if (clicked) {
        geometry[i].scale.x = value;
        geometry[i].scale.y = value;
      }
    }

    circle.rotation.z += 0.01;

    // Effect.
    if (!clicked) {
      TweenLite.to(effect.uniforms['amount'], 1, {
        value: mouseX / 2500
      });
    } else {
      TweenLite.to(effect.uniforms['amount'], 1, {
        value: 0.005
      });
    }

    // Audio.
    if (audioAnalyser) {
      audioAnalyser.getByteFrequencyData(audioFrequency);
    }

    // Rendering.
    renderer.render(scene, camera);
    composer.render();

    requestAnimationFrame(render);
  }



  //
  // Resize.
  //
  window.addEventListener('resize', function() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);
  });



  //
  // Move.
  //
  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX - windowHalfWidth;
    mouseY = e.clientY - windowHalfHeight;
  });



  //
  // Down.
  //
  var clicked = false;

  window.addEventListener('click', function() {
    if (!clicked) {
      for (var i = 0; i < geometryLength; i++) {
        TweenLite.to(geometry[i].rotation, 1, {
           x: randomInt(0, Math.PI),
           y: randomInt(0, Math.PI),
           z: randomInt(0, Math.PI)
        });

        TweenLite.to(geometry[i].position, 1, {
           x: "+= " + randomInt(0, 1000),
           y: "+= " + randomInt(0, 1000),
           z: "+= " + randomInt(-500, -250)
        });
      }

      clicked = true;
    } else {
      for (var i = 0; i < geometryLength; i++) {
        TweenLite.to(geometry[i].scale, 1, {
          x: 1,
          y: 1,
          z: 1
        });

        TweenLite.to(geometry[i].rotation, 1, {
          x: 0,
          y: 0,
          z: 0
        });

        TweenLite.to(geometry[i].position, 1, {
          x: 0,
          y: 100,
          z: 0
        });
      }

      clicked = false;
    }
  });



  //
  // Icons.
  //
  function initIcons() {
    get(
      'dist/img/sprites/sprites.svg',
      function (response) {
        var wrapper = document.createElement('div');
        var responseText = response.responseText;

        wrapper.style.display = 'none';
        wrapper.innerHTML = responseText.replace(/\n/g, " ");

        document.body.insertBefore(wrapper, document.body.childNodes[0]);
      }
    );
  }



  //
  // Init.
  //
  if (window.AudioContext || window.webkitAudioContext) {
    initAudio();
  } else {
    document.querySelector('.music').innerHTML = 'Your browser doesn\'t support Web Audio API.';
  }

  initScene();
  initIcons();
  render();
})();
