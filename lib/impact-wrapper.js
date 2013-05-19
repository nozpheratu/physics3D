impactWrapper = {};
impactWrapper.models = impactWrapper.models || {};
impactWrapper.entities = impactWrapper.entities || {};
impactWrapper.player = impactWrapper.player || {};
impactWrapper.scene = null;
impactWrapper.updateCount = 0;

impactWrapper.init = function(scene)
{
	console.log(" ***impactWrapper Init *** ");

	this.scene = scene;

	var newObject;
	for(var i = 0; i < ig.game.entities.length; i++)
	{
		var entity = ig.game.entities[i];
		
		if(this.models[entity.type])
		{
			newObject = new THREE.Mesh( this.models[entity.type].geometry,
										new THREE.MeshFaceMaterial(this.models[entity.type].materials));
			newObject.castShadow = true;
			//cube.receiveShadow = true;
		}
		else
		{
			newObject = new THREE.Mesh( new THREE.CubeGeometry( 8, 8, 8 ),
										new THREE.MeshPhongMaterial({color:0xff00ff}) );
			newObject.castShadow = true;
			//cube.receiveShadow = true;
		}
					
		if(entity.type == 1) 
		{
			this.player = newObject;
		}
		
		this.entities[entity.id] = newObject;
		this.scene.add(newObject);
	}
}

impactWrapper.update = function()
{

	this.updateCount++;
	var obj;			
	for(var i = 0; i < ig.game.entities.length; i++)
	{
		var entity = ig.game.entities[i];
		

		// If object doesn't exist create it			
		if(!this.entities[entity.id])
		{
			//console.log(entity.type)

			if(this.models[entity.type])
			{
				obj = new THREE.Mesh( this.models[entity.type].geometry,
										new THREE.MeshFaceMaterial(this.models[entity.type].materials));
			}
			else
			{
				obj = new THREE.Mesh( new THREE.CubeGeometry( 8, 4, 2 ), new THREE.MeshNormalMaterial() );
			}
							
				obj.castShadow = true;
				//cube.receiveShadow = true;
				this.entities[entity.id] = obj;
				this.scene.add(obj);

		}
					
		this.entities[entity.id].position.x = entity.pos.x + 4; // half entity width instead of 4
		this.entities[entity.id].position.y = (entity.pos.y - entity.offset.y ) * -1 - entity.size.y/2 ;
		this.entities[entity.id].rotation.z = entity.angle*-1;
		this.entities[entity.id].updated = this.updateCount;

		if(ig.game.entities[i].flip)
		{
			this.entities[entity.id].rotation.y = -Math.PI;
		}
		else
		{
			this.entities[entity.id].rotation.y = 0; 
		}
					
	}
				
				
	for(var prop in this.entities) 
	{			   	
		if(this.entities[prop] && this.entities[prop].updated != c)
		{	
			this.scene.remove(this.entities[prop]);
			this.entities[prop] = null;
		}	
			prop = null;
	}
			
}

impactWrapper.addModel = function(geometry,materials,type)
{
	this.models[type] = {geometry: geometry, materials: materials};
}