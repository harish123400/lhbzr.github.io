(function() {
  // Variables.
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;
  var windowHalfHeight = windowHeight / 2;
  var windowHalfWidth = windowWidth / 2;



  //Mouse.
  var mouseX = windowHalfWidth;
  var mouseY = windowHalfHeight;



  // Introduction.
  var intro = document.querySelector('.intro');
  var introCanvas = document.querySelector('.intro-canvas');
  var introCanvasOverlay = document.querySelector('.intro-canvas-overlay');
  var introLink = document.querySelectorAll('.intro-link');



  // Functions.
  function get(url, callback) {
    request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        callback(request.responseText);
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



  // Link.
  var linkOverInterval, linkOutInterval;

  for (var i = 0; i < introLink.length; i++) {
    introLink[i].addEventListener('mouseover', function() {
      var link = this;

      linkOverInterval = setInterval(function() {
        var linkValue = link.innerHTML.trim();

        link.innerHTML = replaceAt(linkValue, randomInt(0, linkValue.length - 1), String.fromCharCode(randomInt(65, 122)));
      }, 10);
    });

    introLink[i].addEventListener('mouseout', function() {
      clearInterval(linkOverInterval);

      var link = this,
      linkText = link.getAttribute('data-text');

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
    });
  }



  // Audio.
  var audio, audioContext, audioAnalyser, audioBuffer, audioSource, audioFrequency;

  var soundcloudClient = 'client_id=78c6552c14b382e23be3bce2fc411a82';

  var soundcloudMusics = [
    'https://soundcloud.com/theblackkeys/gold-on-the-ceiling',
    'https://soundcloud.com/theheavyyy/like-me',
    'https://soundcloud.com/fueled_by_ramen/paramore-aint-it-fun'
  ];

  function soundcloudLoadMusic() {
    var soundcloudPermalink = soundcloudMusics[Math.floor(Math.random() * soundcloudMusics.length)];

    get(
      '//api.soundcloud.com/resolve.json?url=' + soundcloudPermalink + '&' + soundcloudClient,
      function (response) {
        var information = JSON.parse(response);

        audio.src = information.stream_url + '?' + soundcloudClient;
        audio.play();

        var musicTitle = document.querySelector('.intro-music-title');
        musicTitle.setAttribute('href', information.permalink_url);
        musicTitle.innerHTML = information.title;

        var musicUser = document.querySelector('.intro-music-user');
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



  // Scene.
  var scene, camera, renderer, light, composer, effect;
  var particles, circle, geometry, geometrySleeve, geometryListInt;

  var geometryList = [
    new THREE.TetrahedronGeometry(50, 0),
    new THREE.IcosahedronGeometry(40, 0),
    new THREE.OctahedronGeometry(40, 0),
    new THREE.DodecahedronGeometry(40, 0)
  ];

  var geometryLength = 100;

  function initScene() {
    // Setup.
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: introCanvas
    });

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



  // Render.
  function render() {
    // Circle.
    for (var i = 0; i < geometryLength; i++) {
      var value = ((audioFrequency[i] / 256) * 2.5) + 0.01;

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
    audioAnalyser.getByteFrequencyData(audioFrequency);

    // Rendering.
    renderer.render(scene, camera);
    composer.render();

    requestAnimationFrame(render);
  }



  // Resize.
  window.addEventListener('resize', function() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);
  });



  // Move.
  window.addEventListener('mousemove', function(e) {
    mouseX = e.clientX - windowHalfWidth;
    mouseY = e.clientY - windowHalfHeight;
  });


  // Down.
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

        geometry[i].scale.z = ((audioFrequency[i] / 256) * 2.5) + 0.01;
      }

      clicked = false;
    }
  });



  // Init.
  initAudio();
  initScene();
  render();
})();
