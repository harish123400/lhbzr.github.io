(function() {
  var canvas = document.querySelector('.canvas');

  var w = window.innerWidth;
  var h = window.innerHeight;

  var scene, camera, renderer;

  var light;

  var clock;

  var cubes, cube;

  var composer, effect;


  function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  function createMesh(geometry) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());

    return mesh;
  }


  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 10;

    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);

    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, -1, 1);

    scene.add(light);

    clock = new THREE.Clock();

    cubes = new THREE.Group();

    for (var i = 0; i < 100; i++) {
      cube = createMesh(new THREE.BoxGeometry(0.5, 0.5, 0.5));

      cube.position.y = randomIntFromInterval(0, 1000);

      cubes.add(cube);
    }

    scene.add(cubes);

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    effect = new THREE.ShaderPass(THREE.DotScreenShader);
    effect.uniforms['scale'].value = 4;
    composer.addPass(effect);

    effect = new THREE.ShaderPass( THREE.RGBShiftShader);
    effect.uniforms['amount'].value = 0.0015;
    effect.renderToScreen = true;
    composer.addPass(effect);

    canvas.appendChild(renderer.domElement);

    renderer.render(scene, camera);
  }

  init();


  function render() {
    requestAnimationFrame(render);

    for (var i = 0; i < 100; i++) {
      var delta = clock.getDelta();
      cubes.children[i].rotation.x += 1 * delta;
      cubes.children[i].rotation.y += 1 * delta;

      var time = clock.getElapsedTime() * 0.5;
      cubes.children[i].position.x = Math.cos(time) * 2;
      cubes.children[i].position.y = Math.sin(time) * 2 - 0.4;
    }

    renderer.render(scene, camera);

    composer.render();
  }

  render();
})();
