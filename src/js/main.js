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
      }, 50);
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
      }, 50);
    });
  }



  // Audio.
  var audio, audioContext, audioAnalyser, audioBuffer, audioSource, audioFrequency;

  var soundcloudClient = 'client_id=78c6552c14b382e23be3bce2fc411a82';

  var soundcloudMusics = [
    'https://soundcloud.com/officialratatat/08-nightclub-amnesia-1',
    'https://soundcloud.com/officialratatat/04-abrasive-1',
    'https://soundcloud.com/officialratatat/02-cream-on-chrome-1',
    'https://soundcloud.com/officialratatat/track-01',
    'https://soundcloud.com/officialratatat/track-02'
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
  var particles, circle, triangle, triangleSleeve;
  var triangleLength = 100;

  function initScene() {
    // Setup.
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: introCanvas
    });

    renderer.setClearColor(0xFFFFFF, 0);
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

    triangle = [];
    triangleSleeve = [];

    for (var i = 0; i < triangleLength; i++) {
      triangle[i] = new THREE.Mesh(
        new THREE.TetrahedronGeometry(50, 0),
        new THREE.MeshPhongMaterial({
          color: 0xFFFFFF
        })
      );

      triangle[i].position.y = 100;

      // Surrogate Rings. [http://inmosystems.com/demos/surrogateRings/source/]
      triangleSleeve[i] = new THREE.Object3D();
      triangleSleeve[i].add(triangle[i]);
      triangleSleeve[i].rotation.z = i * (360 / triangleLength) * Math.PI / 180;

      circle.add(triangleSleeve[i]);
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

    effect = new THREE.ShaderPass(THREE.DotScreenShader);
    effect.uniforms['scale'].value = 5;
    composer.addPass(effect);

    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.5;
    effect.renderToScreen = true;
    composer.addPass(effect);

    renderer.render(scene, camera);
  }



  // Render.
  function render() {
    for (var i = 0; i < triangleLength; i++) {
      TweenLite.to(triangle[i].scale, 0.1, {
        z: ((audioFrequency[i] / 256) * 2.5) + 0.01
      });
    }

    circle.rotation.z += 0.01;

    TweenLite.to(camera.rotation, 1, {
      x: mouseY / 20000,
      y: mouseX / 20000
    });

    renderer.render(scene, camera);

    composer.render();

    audioAnalyser.getByteFrequencyData(audioFrequency);

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
    console.log('mouseX: ' + mouseX + ', mouseY: ' + mouseY);
  });



  // Init.
  initAudio();
  initScene();
  render();
})();
