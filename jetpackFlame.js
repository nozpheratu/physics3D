var JetpackFlame = function()
{
	this.speed = 50;
	this.targetRotation = 0;
	this.delta = 1;
	this.clock = new THREE.Clock();
	this.particleCloud = {};
	this.sparksEmitter = {};
	this.emitterpos = {};
	this.timeOnShapePath = 0;
	this.rotation = 0;


	this.particlesLength = 50000;
	var particles = new THREE.Geometry();

	this.newpos = function newpos( x, y, z ) {
		return new THREE.Vector3( x, y, z );
	}


	var Pool = {
					__pools: [],

					// Get a new Vector

					get: function() {

						if ( this.__pools.length > 0 ) {

							return this.__pools.pop();

						}

						console.log( "pool ran out!" )
						return null;

					},

					// Release a vector back into the pool

					add: function( v ) {

						this.__pools.push( v );

					}

				};


	for ( i = 0; i < this.particlesLength; i ++ ) {

					particles.vertices.push( this.newpos( Math.random() * 200 - 100, Math.random() * 100 + 150, Math.random() * 50 ) );
					Pool.add( i );

	}


		this.generateSprite = function(){

					var canvas = document.createElement( 'canvas' );
					canvas.width = 32;
					canvas.height = 32;

					var context = canvas.getContext( '2d' );

					context.beginPath();
					context.arc( 16, 16, 10, 0, Math.PI * 2, false) ;
					context.closePath();

					context.lineWidth = 0.5; //0.05
					context.stroke();
					context.restore();

					var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );

					gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
					gradient.addColorStop( 0.1, 'rgba(200,200,200,1)' );
					gradient.addColorStop( 0.3, 'rgba(200,200,200,1)' );
					gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

					context.fillStyle = gradient;

					context.fill();

					return canvas;

				}




	this.attributes = {
		size:  { type: 'f', value: [] },
		pcolor: { type: 'c', value: [] }
	};

	this.sprite = this.generateSprite() ;

	this.texture = new THREE.Texture( this.sprite );
	this.texture.needsUpdate = true;

	this.uniforms = {
		texture:   { type: "t", value: 0, texture: this.texture }
	};



	this.shaderMaterial = new THREE.ShaderMaterial( {

		uniforms: 		this.uniforms,
		attributes:     this.attributes,

		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		blending: 		THREE.AdditiveBlending,

		depthWrite:		false,
		transparent:	true

	});


	particleCloud = new THREE.ParticleSystem( particles, this.shaderMaterial );
	this.particleCloud.dynamic = true;
	this.system =  particleCloud;
	//particleCloud.sortParticles = true;

	var vertices = particleCloud.geometry.vertices;
	var values_size = this.attributes.size.value;
	var values_color = this.attributes.pcolor.value;

	for( var v = 0; v < vertices.length; v ++ ) {

					values_size[ v ] = 10;

					values_color[ v ] = new THREE.Color( 0xffffff );
					values_color[ v ].setHSL( 0, 0, 0 );

					particles.vertices[ v ].set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

		}


	var hue = 0;

	var setTargetParticle = function() {

		var target = Pool.get();
		values_size[ target ] = Math.random() * 5 + 5;

		return target;
	};

	var hue = 0;
	var onParticleCreated = function( p ) {

		var position = p.position;
		p.target.position = position;

		var target = p.target;

		if ( target ) {
		//console.log(target,particles.vertices[target]);
		//values_size[target]
			//values_color[target]

			//hue += 0.003 ;
			//if ( hue > 1 ) hue -= 1;

			particles.vertices[ target ] = p.position;
			values_color[ target ].setHSL( 0, .7, .7 );

		};

	};

	var onParticleDead = function( particle ) {

		var target = particle.target;

		if ( target ) {

			// Hide the particle

			values_color[ target ].setHSL( 0, 0, 0 );
			particles.vertices[ target ].set( Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY );

			// Mark particle system as available by returning to pool

			Pool.add( particle.target );

		}

	};

	var engineLoopUpdate = function() {

	};

	this.counter =  new SPARKS.SteadyCounter( 1 );
	this.sparksEmitter = new SPARKS.Emitter( this.counter );

	this.emitterpos = new THREE.Vector3( 100, 0, 0 );

	this.sparksEmitter.addInitializer( new SPARKS.Position( new SPARKS.PointZone( this.emitterpos ) ) );
	this.sparksEmitter.addInitializer( new SPARKS.Lifetime( 1, 1.5 ));
	this.sparksEmitter.addInitializer( new SPARKS.Target( null, setTargetParticle ) );


	this.sparksEmitter.addInitializer( new SPARKS.Velocity( new SPARKS.PointZone( new THREE.Vector3( 0, -3, 0 ) ) ) );
	// TOTRY Set velocity to move away from centroid

	this.sparksEmitter.addAction( new SPARKS.Age() );
	this.sparksEmitter.addAction( new SPARKS.Accelerate( 0, 1, 0 ) );
	this.sparksEmitter.addAction( new SPARKS.Move() );
	this.sparksEmitter.addAction( new SPARKS.RandomDrift( 50, -200, 50) );


	this.sparksEmitter.addCallback( "created", onParticleCreated );
	this.sparksEmitter.addCallback( "dead", onParticleDead );
	this.sparksEmitter.start();

 
	console.log("*** JetpackFlame CREATED *** ")

}

