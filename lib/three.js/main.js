window.requestAnimFrame = (function()
		{
			return  window.requestAnimationFrame     	|| 
		      		window.webkitRequestAnimationFrame 	|| 
		     		window.mozRequestAnimationFrame    	|| 
		      		window.oRequestAnimationFrame      	|| 
		     		window.msRequestAnimationFrame     	|| 
		      		function(/* function */ callback, /* DOMElement */ element)
		      		{
		        		window.setTimeout(callback, 1000 / 60);
		      		};
		})();

		var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
		var FLOOR = -160;
		// set the scene size
		var WIDTH = 1000,
		    HEIGHT = 480;

		// set some camera attributes
		var VIEW_ANGLE = 45,
		    ASPECT = WIDTH / HEIGHT,
		    NEAR = 1,
		    FAR = 3000;

		var camera, controls, scene, renderer;
		var container, stats;

		loadGeometry();
		setTimeout(preInit,1000);
			
		function preInit()
		{
			if(ig.game)
			{
				init();
			} else
			{
				setTimeout(preInit,500);
			}
		}
		var flameLight;
		var composer, rtParameters;
		function init() 
		{
			container = document.getElementById('container');

			scene = new THREE.Scene();

			camera = new THREE.PerspectiveCamera(VIEW_ANGLE,ASPECT,NEAR,FAR);			
			camera.position.set( 0, -90, 140 );
			scene.add( camera );

			var ambient = new THREE.AmbientLight( 0x242424 );
			scene.add( ambient );

			light = new THREE.SpotLight( 0xd6e2ff, 1, 0, Math.PI, 1 );
			light.position.set( 600, 400, 1000 );
			light.target.position.set( 0, 0, 0 );

			light.castShadow = true;
			light.shadowCameraNear = 200;
			light.shadowCameraFar = 1800;
			light.shadowCameraFov = 45;
			light.shadowBias = 0.0005;
			light.shadowDarkness = .55;
			light.shadowMapWidth = SHADOW_MAP_WIDTH;
			light.shadowMapHeight = SHADOW_MAP_HEIGHT;
			light.shadowMapSoft = true;
			scene.add(light);

			var specLight = new THREE.PointLight( 0x058ee4, .2, 0, Math.PI, 1 );
			scene.add(specLight);

			flameLight = new THREE.PointLight( 0xff7301, 1, 0, Math.PI, 1 );
			flameLight.distance = 200;
			scene.add(flameLight);
			flameLight.intensity = 0;

			createScene();

			renderer = new THREE.WebGLRenderer({antialias:true});						
			renderer.setSize(WIDTH, HEIGHT);		
			container.appendChild(renderer.domElement);

			renderer.autoClear = false;
			renderer.shadowMapEnabled = true;
			renderer.shadowMapSoft = true;

			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			stats.domElement.style.left = '0px';
			stats.domElement.style.zIndex = 100;
			container.appendChild( stats.domElement );

			impactWrapper.init(scene);			
			addGUI();
			animate();
		}

		var SettingsObj = function() 
		{
		  this.zoom =  140;
		  this.gravity = 100;
		};

		var settings;
		function addGUI()
		{
			settings = new SettingsObj()
			var gui = new dat.GUI();
			gui.add(settings,'zoom',30,300)
		}

		function createScene() 
		{
			var geometry = new THREE.PlaneGeometry( 100, 100 );
			var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );

			var ground = new THREE.Mesh( geometry, planeMaterial );
			ground.position.set( 0, FLOOR - 68, 0 );
			ground.scale.set( 100, 100, 100 );
			ground.castShadow = false;
			ground.receiveShadow = true;			

			var loader = new THREE.JSONLoader();
			loader.load("models/testLevel.js", function( geometry, material )
			{
			 	var zmesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(material));
			   	zmesh.scale.set( 1, 1, 1 );
			   	zmesh.position.set( 0,-240, 0 );
				zmesh.receiveShadow = true;
				zmesh.castShadow = true;
			    scene.add(zmesh);			    
			});

			flame = new JetpackFlame();
			scene.add(flame.system)

		}

		var c = 0;
		var camOffset = {x:0,y:0};
		var flameIntensity = 0;
		var lastGravity = 100;	
		// draw!
		function animate() 
		{
			requestAnimationFrame(animate);
			c++;
			impactWrapper.update();

			camera.lookAt(impactWrapper.player.position);
			camera.position.x += ((impactWrapper.player.position.x - camera.position.x) + camOffset.x )* .02;
			camera.position.y += (((impactWrapper.player.position.y+30 ) - camera.position.y) + camOffset.y ) * .08; 
			camera.position.y = Math.min(camera.position.y, -40)
			camera.position.z += ((settings.zoom) - camera.position.z) * .08;
			camOffset.x = Math.sin(c/20) * 8 - 4 + Math.random() * 6;
			camOffset.y = Math.cos(c/30) * 6 - 3 + Math.random() * 2;

			if(flame)
			{
				if(impactWrapper.player.rotation.y < 0)
				flame.emitterpos.x = impactWrapper.player.position.x + 3;
				else 	flame.emitterpos.x = impactWrapper.player.position.x - 3;
				flame.emitterpos.y = impactWrapper.player.position.y - 5;
				if( ig.input.state('jump') ) {
					flame.counter.rate = 200;
					flameIntensity = 1 + (Math.sin(c) + 2);
					flameLight.position = impactWrapper.player.position;
				} else
				{
					flameIntensity = 0;
					flame.counter.rate = 0;
				}
				flameLight.intensity += ((flameIntensity) - flameLight.intensity) * .09;
			}

			render();
			stats.update();
		}

		function render()
		{
			flame.system.geometry.verticesNeedUpdate = true;
			flame.attributes.size.needsUpdate = true;
			flame.attributes.pcolor.needsUpdate = true;

			renderer.render(scene, camera);
		}
		function loadGeometry()
		{
			var loader = new THREE.JSONLoader();
			loader.load("models/crate.js",
						function(geometry, materials){
							impactWrapper.addModel(geometry,materials,"2")}
						);
			loader.load("models/char.js",
						function(geometry, materials){
							impactWrapper.addModel(geometry,materials,"1")}
						);	
			loader.load("models/bullet.js",
						function(geometry, materials){
							impactWrapper.addModel(geometry,materials,"0")}
						);
		}		