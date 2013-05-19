ig.module(
	'game.entities.crate'
)
.requires(
	'plugins.box2d.entity'
)
.defines(function(){

EntityCrate = ig.Box2DEntity.extend({
	size: {x: 8, y: 8},
	
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,
	
	animSheet: new ig.AnimationSheet( 'media/crate.png', 8, 8 ),
	
	init: function( x, y, settings ) {
		this.addAnim( 'idle', 1, [0] );
		this.parent( x, y, settings );
	}
});


});