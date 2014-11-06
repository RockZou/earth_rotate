/*********three stuff********************/

//document.body.appendChild( renderer.domElement );
var scene,camera,renderer,controls;
var $container= $('.container');

var autoMode=true;//determines if earth should rotate on its own or depend on orientation
//constant showcase-like rotation
var cRotX=0,cRotY=0.01,cRotZ=0;

//rotation from orientation
var rotZ=0;
var rotY=0;
var rotX=0;

//the x y z rotate values after being off-setted
var newX=0;
var newY=0;
var newZ=0;


var earth,moon, theSun;
var theEarthSystem;
var theMoonSystem;
var theSunSystem;
var geometry;

//camera related
var lookatBody=0;// the body the camera is looking at
var campos;
var camrot;
var pos;


var tiltAngle=-23.5/180.0*Math.PI;
var moonOrbitR=5;
var moonOrbitA=0;

var theEarthSystemOrbitR=25;
var theEarthSystemOrbitA=0;

//detect if this is the first time to receive the orientation data
var firstRecieved=false;
var offsetX=0.0;
var offsetY=0.0;
var offsetZ=0.0;


init();
animate();
ui();

function init(){


	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camrot=new THREE.Vector3(0,0,0);
	campos=camera.position.clone();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.position.z = 50;

	controls = new THREE.OrbitControls( camera );
//  	controls.addEventListener( 'change', render );

//************Create the Earth System*****//

	theEarthSystem = new THREE.Object3D();// earth and moon system

	geometry = new THREE.SphereGeometry( 2, 32, 32 );
	
	//*********Material**********//
	var material = new THREE.MeshPhongMaterial(
	{
		map: THREE.ImageUtils.loadTexture('src/earthmap1k.jpg'),
		bumpMap: THREE.ImageUtils.loadTexture('src/earthbump1k.jpg'),
		bumpScale:0.1,
		specularMap:THREE.ImageUtils.loadTexture('src/earthspec1k.jpg'),
		specular: new THREE.Color('0x000000')
	}
	);//endPhongMaterial

	earth = new THREE.Mesh( geometry, material );

	theEarthSystem.add(earth);
	theEarthSystem.rotation.z=tiltAngle;

	var earthAxis = new THREE.AxisHelper(8);
		
		theEarthSystem.add(earthAxis);

	scene.add( theEarthSystem );
	//*********END Material*******//

//******END Earth System****//
//*******Moon System********//


	theMoonSystem = new THREE.Object3D();// earth and moon system

	geometry = new THREE.SphereGeometry( 0.5, 32, 32 );

	//*********Material**********//
	material = new THREE.MeshPhongMaterial(
	{
		map: THREE.ImageUtils.loadTexture('src/moonmap4k.jpg'),
		bumpMap: THREE.ImageUtils.loadTexture('src/moonbump4k.jpg'),
		bumpScale:0.005,
		//specularMap:THREE.ImageUtils.loadTexture('src/earthspec1k.jpg'),
		specular: new THREE.Color('0x000000')
	}
	);//endPhongMaterial

	moon = new THREE.Mesh( geometry, material );

	theMoonSystem.rotation.z=5.0/180.0*Math.PI;//rotates the moon orbit plane
	var moonAxis=new THREE.AxisHelper(5);
	theMoonSystem.add(moon);
	theMoonSystem.add(moonAxis);
	scene.add(theMoonSystem);

//********END Moon System******//
//********Sun ***************//

	theSunSystem = new THREE.Object3D();

	geometry = new THREE.SphereGeometry( 10, 32, 32 );
	//*********Material**********//
	material = new THREE.MeshLambertMaterial(
	{
		emissive: 0xbbbbbb,
		map: THREE.ImageUtils.loadTexture('src/sunmap.jpg')
	}
	);//endPhongMaterial

	theSun = new THREE.Mesh( geometry, material );

	theSunSystem.add(theSun);
	scene.add(theSunSystem);

//*********END SUN************//



	/******Lighting**********/
	// create a directional light
	var pointLight = new THREE.PointLight(0xffffff, 1);

	    pointLight.position.set(0,0,0);
	    scene.add(pointLight);

	var ambientLight = new THREE.AmbientLight(0x444444);
		scene.add(ambientLight);
	/*********END lighting*********/

	var worldAxis = new THREE.AxisHelper(20);
	scene.add(worldAxis);
}//end init();


function animate() {

    requestAnimationFrame( animate );
    controls.update();

	rotation();

	camTransform();


	renderer.render( scene, camera );

}


function rotation()
{
	rotateEarthMoonSystem();
	rotateEarth();
	rotateMoon();

}

function rotateEarthMoonSystem()
{
	theEarthSystemOrbitA+=0.001;

	theEarthSystem.position.x= Math.cos(theEarthSystemOrbitA) * theEarthSystemOrbitR;
	theEarthSystem.position.z= Math.sin(theEarthSystemOrbitA) * theEarthSystemOrbitR;
	theMoonSystem.position.x= theEarthSystem.position.x;
	theMoonSystem.position.z= theEarthSystem.position.z;
}

function rotateEarth()
{
	if (autoMode)// if set to auto rotate
	{
		earth.rotation.y += cRotY;
	}
	else// if rotating by orientation data
	{
		earth.rotation.x = rotX;
		earth.rotation.y = rotY;
	}
}
function rotateMoon()
{
	moonOrbitA+=0.012;
    moon.position.x = Math.cos(moonOrbitA) * moonOrbitR;
    moon.position.z = Math.sin(moonOrbitA) * moonOrbitR;
    moon.rotation.y+=0.01;
}


 function camTransform(){
// 	camera.position.x=campos.x;
// 	camera.position.y=campos.y;
// 	camera.position.z=campos.z;
	
	console.log(campos.clone());

	//camera.rotation.y = camrot.y;

	camera.up = new THREE.Vector3(0,1,0);
	//var cameraTarget = new THREE.Vector3(0,0,0);
	//cameraTarget.add(theMoonSystem.position);
	//cameraTarget.add(moon.position);
	//var addOffSet= new THREE.Vector3(0,0,30);

	switch (lookatBody)
	{
		case 0:// looking at the sun
			//camera.position.set(theSunSystem.position.x, theSunSystem.position.y,theSunSystem.position.z+50);
			camera.lookAt(theSunSystem.position);
		break;

		case 1://looking at the earth
			//camera.position.set(theEarthSystem.position.x, theEarthSystem.position.y, theEarthSystem.position.z+10);
			camera.lookAt(theEarthSystem.position);	
		break;

		case 2:
		var theMoonPos= new THREE.Vector3();
		theMoonPos.setFromMatrixPosition(moon.matrixWorld );
		//camera.position.set(theMoonPos.x,theMoonPos.y,theMoonPos.z+3);
		camera.lookAt(theMoonPos);
			//camera.position.set(theMoonSystem.position.x+moon.position.x,theMoonSystem.position.y+moon.position.y,theMoonSystem.position.z+moon.position.z+3);
			//camera.lookAt(theMoonSystem.position.clone().add(moon.position));
		break;
	}

}

function onKeyUp(event){
	console.log("event keyCode is", event.keyCode);
	switch (event.keyCode)
	{
		case 81: campos.z-=5; console.log('q is pressed'); break;//q
		case 90: campos.z+=5; break;//z
		case 65: campos.x-=5; break;//a
		case 68: campos.x+=5; break;//d
		case 87: campos.y+=5; break;//w
		case 83: campos.y-=5; break;//s
		case 37: camrot.y+=0.01;break;
		case 13: lookatBody=(lookatBody+1)%3;break;
	}
}

function ui(){

	//click toggles between 
	$('.container').click(function(){
		console.log('I am being clicked! Ouch!');
		//lookatBody=(lookatBody+1)%3;
		//autoMode=!autoMode;
		offsetX+=newX;
		offsetY+=newY;
		offsetZ+=newZ;
	});


	window.addEventListener('deviceorientation', function(event) 
	{
	//  $('.someText').html('a='+event.alpha+' b='+event.beta+' c='+event.gamma);
	// if this is the first time receiving data, set this data to offset data
		 if (!firstRecieved)
		{
			offsetX=event.beta;
			offsetY=event.gamma;
			offsetZ=event.alpha;
			firstRecieved=true;
		}
	 	newX=event.beta-offsetX;
	 	newY=event.gamma-offsetY;
	 	newZ=event.alpha-offsetZ;

		rotX = newX/180.0*3.14;
		rotY = newY/180.0*3.14;
	}, false			);// end event listener


	window.addEventListener('keydown', onKeyUp,false); 
	window.addEventListener( 'resize', onWindowResize, false );


}//END UI

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}





$container.append(renderer.domElement);
/**********END three Stuff**************/