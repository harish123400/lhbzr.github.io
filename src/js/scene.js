var int = require('./lib/int');

var EffectComposer = require('./processing/effectcomposer');
var MaskPass = require('./processing/maskpass');
var RenderPass = require('./processing/renderpass');
var ShaderPass = require('./processing/shaderpass');
var CopyShader = require('./shaders/copyshader');
var RGBShiftShader = require('./shaders/rgbshift');

module.exports = Scene;

function Scene(music) {
  // Canvas.
  this.canvas = document.querySelector('.canvas');
  this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  this.camera.position.z = 275;
  this.camera.lookAt = new THREE.Vector3();


  // Scene.
  this.scene = new THREE.Scene();


  // Renderer.
  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: this.canvas
  });
  this.renderer.setSize(window.innerWidth, window.innerHeight);


  // Geometries.
  this.circle = [];
  this.geometry = [];
  this.geometrySleeve = [];
  this.geometryList = [
    new THREE.TetrahedronGeometry(50, 0),
    new THREE.IcosahedronGeometry(40, 0),
    new THREE.OctahedronGeometry(40, 0)
  ];


  // Composer.
  this.composer = new EffectComposer(this.renderer);


  // Mouse.
  this.mouse = {
    x: 0,
    y: 0
  };


  // Music.
  this.music = music;


  // Click.
  this.clicked = false;
}


// Values.
Scene.GEOMETRY_LENGTH = 100;


// Methods.
Scene.prototype.createGeometry = function() {
  var number = int(0, this.geometryList.length - 1);

  this.circle = new THREE.Object3D();

  for (var i = 0; i < Scene.GEOMETRY_LENGTH; i++) {
    this.geometry[i] = new THREE.Mesh(
      this.geometryList[number],
      new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        wireframe: true
      })
    );

    this.geometry[i].position.y = 100;

    // Surrogate Rings. [http://inmosystems.com/demos/surrogateRings/source/]
    this.geometrySleeve[i] = new THREE.Object3D();
    this.geometrySleeve[i].add(this.geometry[i]);
    this.geometrySleeve[i].rotation.z = i * (360 / Scene.GEOMETRY_LENGTH) * Math.PI / 180;

    this.circle.add(this.geometrySleeve[i]);
  }

  this.scene.add(this.circle);
};


Scene.prototype.createLight = function() {
  var light;

  light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(1, 1, 1);

  this.scene.add(light);

  light = new THREE.DirectionalLight(0xFFFFFF, 1);
  light.position.set(-1, -1, 1);

  this.scene.add(light);
};


Scene.prototype.createShaders = function() {
  var effect;

  this.composer.addPass(new RenderPass(this.scene, this.camera));

  effect = new ShaderPass(RGBShiftShader);
  effect.uniforms['amount'].value = 0.05;
  effect.renderToScreen = true;

  this.composer.addPass(effect);

  this.renderer.render(this.scene, this.camera);

  this.effect = effect;
};


Scene.prototype.render = function() {
  requestAnimationFrame(this.render.bind(this));

  // Shaders.
  if (this.clicked) {
    TweenLite.to(this.effect.uniforms['amount'], 1, {
      value: 0.005
    });
  } else {
    TweenLite.to(this.effect.uniforms['amount'], 1, {
      value: this.mouse.x / window.innerWidth
    });
  }


  // Movement.
  for (var i = 0; i < Scene.GEOMETRY_LENGTH; i++) {
    var value = 1;

    if (window.AudioContext || window.webkitAudioContext) {
      value = ((this.music.getFrequency()[i] / 256) * 2.5) + 0.01;
    }

    if (this.clicked) {
      TweenLite.to(this.geometry[i].scale, .1, {
        x: value,
        y: value,
        z: value
      });

      if (i % 2 == 0) {
        TweenLite.to(this.geometry[i].rotation, .1, {
          z: "+= 0.1"
        });
      } else {
        TweenLite.to(this.geometry[i].rotation, .1, {
          z: "-= 0.1"
        });
      }
    } else {
      TweenLite.to(this.geometry[i].scale, .1, {
        z: value
      });
    }
  }

  this.circle.rotation.z += 0.01;


  // Render.
  this.renderer.render(this.scene, this.camera);

  this.composer.render();
};


Scene.prototype.resize = function() {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(window.innerWidth, window.innerHeight);
};


Scene.prototype.mousemove = function(e) {
  this.mouse.x = e.clientX - window.innerWidth / 2;
  this.mouse.y = e.clientY - window.innerHeight / 2;
};


Scene.prototype.click = function() {
  if (this.clicked) {
    for (var i = 0; i < Scene.GEOMETRY_LENGTH; i++) {
      TweenLite.to(this.geometry[i].scale, 1, {
        x: 1,
        y: 1,
        z: 1
      });

      TweenLite.to(this.geometry[i].rotation, 1, {
        x: 0,
        y: 0,
        z: 0
      });

      TweenLite.to(this.geometry[i].position, 1, {
        x: 0,
        y: 100,
        z: 0
      });
    }

    this.clicked = false;
  } else {
    for (var i = 0; i < Scene.GEOMETRY_LENGTH; i++) {
      TweenLite.to(this.geometry[i].rotation, 1, {
        x: int(0, Math.PI),
        y: int(0, Math.PI),
        z: int(0, Math.PI)
      });

      TweenLite.to(this.geometry[i].position, 1, {
        x: "+= " + int(-1000, 1000),
        y: "+= " + int(-1000, 1000),
        z: "+= " + int(-500, -250)
      });
    }

    this.clicked = true;
  }
};
