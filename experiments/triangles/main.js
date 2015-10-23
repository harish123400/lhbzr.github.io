(function() {
  // Window.
  var windowWidth = window.innerWidth,
      windowHeight = window.innerHeight;

  // Audio.
  var audio,
      audioContext,
      audioAnalyser,
      audioBuffer,
      audioSource,
      audioFrequency,
      request;

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

    request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
          var information = JSON.parse(request.responseText);

          audio.src = information.stream_url + '?client_id=78c6552c14b382e23be3bce2fc411a82';
          audio.play();

          var music = document.createElement('a');

          music.setAttribute('href', information.permalink_url);
          music.innerHTML = information.title + ' - ' + information.user.username;

          document.body.appendChild(music);
      }
    };

    request.open('GET', 'http://api.soundcloud.com/resolve.json?url=https://soundcloud.com/theblackkeys/gold-on-the-ceiling&client_id=78c6552c14b382e23be3bce2fc411a82', true);

    request.send();

    audioAnalyser.connect(audioContext.destination);

    audioFrequency = new Uint8Array(audioAnalyser.frequencyBinCount);

    audio.addEventListener('ended', function() {
      audio.play();
    });
  }

  //Scene.
  var scene,
      camera,
      renderer,
      light,
      composer,
      effect,
      circle,
      triangle,
      triangleSleeve,
      triangleLength = 100;

  function initScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
    camera.position.z = 250;

    scene.add(camera);

    renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(0xFFFFFF, 0)
    renderer.setSize(windowWidth, windowHeight);

    light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(1, 1, 1);

    scene.add(light);

    light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-1, -1, 1);

    scene.add(light);

    circle = new THREE.Object3D();

    triangle = [];
    triangleSleeve = [];

    for (var i = 0; i < triangleLength; i++) {
      triangle[i] = new THREE.Mesh(
        new THREE.TetrahedronGeometry(45, 0),
        new THREE.MeshPhongMaterial({
          color: 0xFFFFFF
        })
      );

      triangle[i].position.y = 100;

      triangleSleeve[i] = new THREE.Object3D();
      triangleSleeve[i].add(triangle[i]);
      triangleSleeve[i].rotation.z = i * (360 / triangleLength) * Math.PI / 180;

      circle.add(triangleSleeve[i]);
    }

    scene.add(circle);

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    effect = new THREE.ShaderPass(THREE.DotScreenShader);
    effect.uniforms['scale'].value = 5;
    composer.addPass(effect);

    effect = new THREE.ShaderPass(THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.005;
    effect.renderToScreen = true;
    composer.addPass(effect);

    renderer.render(scene, camera);

    document.body.appendChild(renderer.domElement);
  }

  //Render.
  function render() {
    for (var i = 0; i < triangleLength; i++) {
      triangle[i].scale.z = ((audioFrequency[i] / 256) * 2.5) + 0.01;
    }

    circle.rotation.z += 0.01;

    renderer.render(scene, camera);

    composer.render();

    audioAnalyser.getByteFrequencyData(audioFrequency);

    requestAnimationFrame(render);
  }

  //Resize.
  window.addEventListener('resize', function() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);
  });

  //Init.
  initAudio();
  initScene();
  render();
})();
