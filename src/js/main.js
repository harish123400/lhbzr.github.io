(function() {
  var canvas = document.querySelector('.canvas');

  var colors = [0xfc63b3, 0xfff48d, 0x94fff5, 0xd68fff];

  var w = window.innerWidth;
  var h = window.innerHeight;

  var scene, camera, renderer;

  var spheres, sphere;


  function createMesh(geometry, index) {
    var material = new THREE.MeshBasicMaterial({
      color: colors[index],
      wireframe: true
    });

    var mesh = new THREE.Mesh(geometry, material);

    return mesh;
  }


  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000);
    camera.position.z = 100;

    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(w, h);
    renderer.setClearColor(0x232A35);

    spheres = new THREE.Group();

    for (var i = 0; i < 4; i++) {
      sphere = createMesh(new THREE.SphereGeometry(25 - (i * 5), 10, 10), i);
      sphere.rotation.x = Math.random() * 100;

      spheres.add(sphere);
    }

    scene.add(spheres);

    canvas.appendChild(renderer.domElement);

    renderer.render(scene, camera);
  }

  init();


  function render() {
    requestAnimationFrame(render);

    for (var i = 0; i < 4; i++) {
      spheres.children[i].rotation.x += 0.005 * (i + 1);
      spheres.children[i].rotation.y += 0.005 * (i + 1);
    }

    renderer.render(scene, camera);
  }

  render();
})();
