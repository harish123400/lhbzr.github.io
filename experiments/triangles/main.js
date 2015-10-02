document.addEventListener('DOMContentLoaded', function() {
  //Variables.
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;

  var canvas = document.querySelector('.canvas');

  //Audio.
  var context, audio, source, request, buffer, analyser, frequency;

  function initAudio() {
    context = new (window.AudioContext || window.webkitAudioContext)();

    audio = document.createElement('audio');

    request = new XMLHttpRequest();

    request.open('GET', 'http://lhbzr.github.io/dist/music/black-cat.mp3', true);
    request.responseType = 'blob';

    request.onload = function(e) {
      source = document.createElement('source');
      source.src = (window.URL || window.webkitURL || {}).createObjectURL(this.response);
      source.type = 'audio/mp3';

      audio.appendChild(source);
    };

    request.send();

    buffer = context.createMediaElementSource(audio);

    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.25;
    analyser.fftSize = 2048;

    buffer.connect(analyser);
    analyser.connect(context.destination);

    frequency = new Uint8Array(analyser.frequencyBinCount);

    audio.play();

    audio.addEventListener('ended', function () {
      audio.play();
    });
  }



  //Scene.
  var scene, camera, renderer, light, composer, effect;
  var circle, triangle, triangleSleeve;
  var triangleLength = 100;

  function initScene() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, windowWidth / windowHeight, 0.1, 1000);
    camera.position.z = 250;

    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      canvas: canvas
    });

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
        new THREE.TetrahedronGeometry(50, 0),
        new THREE.MeshPhongMaterial({
          color: 0xFFFFFF
        })
      );

      triangle[i].position.y = 100;

      //Surrogate Rings. [http://inmosystems.com/demos/surrogateRings/source/]
      triangleSleeve[i] = new THREE.Object3D();
      triangleSleeve[i].add(triangle[i]);
      triangleSleeve[i].rotation.z = i * (360 / triangleLength) * Math.PI / 180;

      circle.add(triangleSleeve[i]);
    }

    scene.add(circle);

    //Shaders. [http://threejs.org/examples/#webgl_postprocessing]
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
  }



  //Render.
  function render() {
    for (var i = 0; i < triangleLength; i++) {
      triangle[i].scale.z = ((frequency[i] / 256) * 2) + 0.01;
    }

    circle.rotation.z += 0.01;

    renderer.render(scene, camera);

    composer.render();

    analyser.getByteFrequencyData(frequency);

    requestAnimationFrame(render);
  }



  //Resize.
  window.addEventListener('resize', function () {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);
  });



  //Init.
  (function() {
    initAudio();
    initScene();
    render();
  })();
});
