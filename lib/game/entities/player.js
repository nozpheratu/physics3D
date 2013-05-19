ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityPlayer = ig.Box2DEntity.extend({
	size: {x: 8, y:14},
	offset: {x: 4, y: 2},
	
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
	animSheet: new ig.AnimationSheet( 'media/player.png', 16, 24 ),	
	
	flip: false,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'jump', 0.07, [1,2] );
	},
	
	
	update: function() {
		
		// move left or right
		if( ig.input.state('left') ) {
			this.body.ApplyForce( new b2.Vec2(-20,0), this.body.GetPosition() );
			this.flip = true;
		}
		else if( ig.input.state('right') ) {
			this.body.ApplyForce( new b2.Vec2(20,0), this.body.GetPosition() );
			this.flip = false;
		}
		
		// jetpack
		if( ig.input.state('jump') ) {
			this.body.ApplyForce( new b2.Vec2(0,-30), this.body.GetPosition() );
			this.currentAnim = this.anims.jump;
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
		// shoot
		if( ig.input.pressed('shoot') ) {
			var x = this.pos.x + (this.flip ? -6 : 6 );
			var y = this.pos.y + 6;
			ig.game.spawnEntity( EntityProjectile, x, y, {flip:this.flip} );
		}
		
		this.currentAnim.flip.x = this.flip;
		
		
		// This sets the position and angle. We use the position the object
		// currently has, but always set the angle to 0 so it does not rotate
		this.body.SetXForm(this.body.GetPosition(), 0);
		
		// move!
		this.parent();
	}
});


EntityProjectile = ig.Box2DEntity.extend({
	size: {x: 8, y: 4},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, 
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
		
	animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 4 ),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = settings.flip;
		
		var velocity = (settings.flip ? -10 : 10);
		this.body.ApplyImpulse( new b2.Vec2(velocity,0), this.body.GetPosition() );
	}	
});

});