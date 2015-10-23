(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var int = require('./lib/int');

module.exports = (function() {
  // About.
  var about = document.querySelector('.about');

  // Drag.
  Draggable.create(about, {
    bounds: document.body,
    edgeResistance: 1,
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

  // Position.
  about.style.left = int(0, window.innerWidth - about.offsetWidth) + 'px';
  about.style.top = int(0, window.innerHeight - about.offsetHeight) + 'px';
})();

},{"./lib/int":3}],2:[function(require,module,exports){
module.exports = function(url, callback) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      callback(request);
    }
  };

  request.open('GET', url, true);

  request.send();
};

},{}],3:[function(require,module,exports){
module.exports = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

},{}],4:[function(require,module,exports){
module.exports = function(value, index, char) {
  return value.substr(0, index) + char + value.substr(index + 1);
};

},{}],5:[function(require,module,exports){
// Library.
var get = require('./lib/get');


// Classes.
var Music = require('./music');
var Scene = require('./scene');


// About.
var about = require('./about');


// Menu.
var menu = require('./menu');


// Music.
var music = new Music();

music.audio.addEventListener('ended', function() {
  music.start();
});


// Scene.
var scene = new Scene(music);

scene.createGeometry();
scene.createLight();
scene.createShaders();
scene.render();


// Icons.
get(
  'dist/img/sprites/sprites.svg',
  function (response) {
    var wrapper = document.createElement('div');

    wrapper.style.display = 'none';
    wrapper.innerHTML = response.responseText.replace(/\n/g, '');

    document.body.insertBefore(wrapper, document.body.childNodes[0]);
  }
);


// Audio.
var volume;


// Window.
window.addEventListener('resize', function() {
  scene.resize();
}, false);

window.addEventListener('click', function(e) {
  scene.click(e);
}, false);

window.addEventListener('mousemove', function(e) {
  scene.mousemove(e);
}, false);

window.addEventListener('mousewheel', function(e) {
  var volume = Math.round(music.audio.volume * 100) / 100;

  if (volume >= 0 && volume <= 1) {
    if (e.wheelDelta < 0) {
      volume = (volume == 0) ? 0 : volume - 0.05;
    } else {
      volume = (volume == 1) ? 1 : volume + 0.05;
    }

    music.audio.volume = volume;
  }
});

},{"./about":1,"./lib/get":2,"./menu":6,"./music":7,"./scene":12}],6:[function(require,module,exports){
var int = require('./lib/int');
var replace = require('./lib/replace');

module.exports = (function() {
  // Menu.
  var link = document.querySelectorAll('.menu-link'),
      linkOverInterval,
      linkOutInterval;


  for (var i = 0; i < link.length; i++) {
    var linkCurrent = link[i];


    // Drag.
    Draggable.create(linkCurrent, {
      bounds: document.body,
      edgeResistance: 1,
      type: 'x, y',
      onClick: function() {
        location.href = this.target.getAttribute('data-href');
      }
    });


    // Hover.
    linkCurrent.addEventListener('mouseover', function() {
      var link = this;

      linkOverInterval = setInterval(function() {
        var linkValue = link.innerHTML.trim();

        link.innerHTML = replace(
          linkValue,
          int(0, linkValue.length - 1),
          String.fromCharCode(int(65, 122))
        );
      }, 10);

      TweenLite.to(link, .4, {
        background: 'rgba(255, 255, 255, 1)',
        color: 'rgb(0, 0, 0)'
      });
    });

    linkCurrent.addEventListener('mouseout', function() {
      var link = this,
          linkText = link.getAttribute('data-text');

      clearInterval(linkOverInterval);

      var i = 0;

      var linkOutInterval = setInterval(function() {
        if (i < linkText.length) {
          var linKValue = link.innerHTML.trim();

          link.innerHTML = replace(
            linKValue,
            i,
            linkText[i]
          );
        } else {
          clearInterval(linkOutInterval);
        }

        i++;
      }, 10);

      TweenLite.to(link, .4, {
        background: 'rgba(255, 255, 255, 0)',
        color: 'rgb(255, 255, 255)'
      });
    });


    // Position.
    linkCurrent.style.left = int(0, window.innerWidth - linkCurrent.offsetWidth) + 'px';
    linkCurrent.style.top = int(0, window.innerHeight - linkCurrent.offsetHeight) + 'px';
  }
})();

},{"./lib/int":3,"./lib/replace":4}],7:[function(require,module,exports){
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
    'https://soundcloud.com/pnau/embrace-feat-ladyhawke',
    'https://soundcloud.com/joywave/now',
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

      audio.crossOrigin = 'anonymous';
      audio.src = data.stream_url + '?client_id=78c6552c14b382e23be3bce2fc411a82';

      title.setAttribute('href', data.permalink_url);
      title.textContent = data.title;

      user.setAttribute('href', data.user.permalink_url);
      user.textContent = data.user.username;
    }
  );

  this.audio.play();
};


Music.prototype.pause = function() {
  this.audio.pause();
};


Music.prototype.play = function() {
  this.audio.play();
};

},{"./lib/get":2}],8:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var pixelRatio = renderer.getPixelRatio();

		var width  = Math.floor( renderer.context.canvas.width  / pixelRatio ) || 1;
		var height = Math.floor( renderer.context.canvas.height / pixelRatio ) || 1;
		var parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };

		renderTarget = new THREE.WebGLRenderTarget( width, height, parameters );

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	if ( THREE.CopyShader === undefined )
	console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

THREE.EffectComposer.prototype = {

	swapBuffers: function() {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	render: function ( delta ) {

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( ! pass.enabled ) continue;

			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.context;

					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

					context.stencilFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( pass instanceof THREE.MaskPass ) {

				maskActive = true;

			} else if ( pass instanceof THREE.ClearMaskPass ) {

				maskActive = false;

			}

		}

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			renderTarget = this.renderTarget1.clone();

			var pixelRatio = this.renderer.getPixelRatio();

			renderTarget.width  = Math.floor( this.renderer.context.canvas.width  / pixelRatio );
			renderTarget.height = Math.floor( this.renderer.context.canvas.height / pixelRatio );

		}

		this.renderTarget1.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2.dispose();
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		this.renderTarget1.setSize( width, height );
		this.renderTarget2.setSize( width, height );

	}

};

},{}],9:[function(require,module,exports){
/**
* @author alteredq / http://alteredqualia.com/
*/

module.exports = THREE.MaskPass = function ( scene, camera ) {

  this.scene = scene;
  this.camera = camera;

  this.enabled = true;
  this.clear = true;
  this.needsSwap = false;

  this.inverse = false;

};

THREE.MaskPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    var context = renderer.context;

    // don't update color or depth

    context.colorMask( false, false, false, false );
    context.depthMask( false );

    // set up stencil

    var writeValue, clearValue;

    if ( this.inverse ) {

      writeValue = 0;
      clearValue = 1;

    } else {

      writeValue = 1;
      clearValue = 0;

    }

    context.enable( context.STENCIL_TEST );
    context.stencilOp( context.REPLACE, context.REPLACE, context.REPLACE );
    context.stencilFunc( context.ALWAYS, writeValue, 0xffffffff );
    context.clearStencil( clearValue );

    // draw into the stencil buffer

    renderer.render( this.scene, this.camera, readBuffer, this.clear );
    renderer.render( this.scene, this.camera, writeBuffer, this.clear );

    // re-enable update of color and depth

    context.colorMask( true, true, true, true );
    context.depthMask( true );

    // only render where stencil is set to 1

    context.stencilFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
    context.stencilOp( context.KEEP, context.KEEP, context.KEEP );

  }

};


THREE.ClearMaskPass = function () {

  this.enabled = true;

};

THREE.ClearMaskPass.prototype = {

  render: function ( renderer, writeBuffer, readBuffer, delta ) {

    var context = renderer.context;

    context.disable( context.STENCIL_TEST );

  }

};

},{}],10:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.enabled = true;
	this.clear = true;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		this.scene.overrideMaterial = this.overrideMaterial;

		if ( this.clearColor ) {

			this.oldClearColor.copy( renderer.getClearColor() );
			this.oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		renderer.render( this.scene, this.camera, readBuffer, this.clear );

		if ( this.clearColor ) {

			renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

		}

		this.scene.overrideMaterial = null;

	}

};

},{}],11:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 */

module.exports = THREE.ShaderPass = function ( shader, textureID ) {

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	this.material = new THREE.ShaderMaterial( {

		defines: shader.defines || {},
		uniforms: this.uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader

	} );

	this.renderToScreen = false;

	this.enabled = true;
	this.needsSwap = true;
	this.clear = false;


	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene  = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.ShaderPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

};

},{}],12:[function(require,module,exports){
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
      value: this.mouse.x / 2500
    });
  }


  // Movement.
  for (var i = 0; i < Scene.GEOMETRY_LENGTH; i++) {
    var value = ((this.music.getFrequency()[i] / 256) * 2.5) + 0.01;

    if (this.clicked) {
      this.geometry[i].scale.x = value;
      this.geometry[i].scale.y = value;
      this.geometry[i].scale.z = value;
      this.geometry[i].rotation.z += 0.1;
    } else {
      this.geometry[i].scale.z = value;
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
        x: "+= " + int(0, 1000),
        y: "+= " + int(0, 1000),
        z: "+= " + int(-500, 1000)
      });
    }

    this.clicked = true;
  }
};

},{"./lib/int":3,"./processing/effectcomposer":8,"./processing/maskpass":9,"./processing/renderpass":10,"./processing/shaderpass":11,"./shaders/copyshader":13,"./shaders/rgbshift":14}],13:[function(require,module,exports){
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

module.exports = THREE.CopyShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }
	},
	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),
	fragmentShader: [
		"uniform float opacity;",
		"uniform sampler2D tDiffuse;",
		"varying vec2 vUv;",
		"void main() {",
			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",
		"}"
	].join( "\n" )

};

},{}],14:[function(require,module,exports){
/**
* @author felixturner / http://airtight.cc/
*
* RGB Shift Shader
* Shifts red and blue channels from center in opposite directions
* Ported from http://kriss.cx/tom/2009/05/rgb-shift/
* by Tom Butterworth / http://kriss.cx/tom/
*
* amount: shift distance (1 is width of input)
* angle: shift angle in radians
*/

module.exports = THREE.RGBShiftShader = {
  uniforms: {
    "tDiffuse": { type: "t", value: null },
    "amount":   { type: "f", value: 0.005 },
    "angle":    { type: "f", value: 0.0 }
  },
  vertexShader: [
    "varying vec2 vUv;",
    "void main() {",
      "vUv = uv;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    "}"
  ].join("\n"),
  fragmentShader: [
    "uniform sampler2D tDiffuse;",
    "uniform float amount;",
    "uniform float angle;",
    "varying vec2 vUv;",
    "void main() {",
      "vec2 offset = amount * vec2( cos(angle), sin(angle));",
      "vec4 cr = texture2D(tDiffuse, vUv + offset);",
      "vec4 cga = texture2D(tDiffuse, vUv);",
      "vec4 cb = texture2D(tDiffuse, vUv - offset);",
      "gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",
    "}"
  ].join("\n")
};

},{}]},{},[5]);
