/**********three stuff********************/

//document.body.appendChild( renderer.domElement );
var scene,camera,renderer;
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
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.position.z = 50;

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
		emissive: 0xdddddd,
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

	var ambientLight = new THREE.AmbientLight(0x222222);
		scene.add(ambientLight);
	/*********END lighting*********/

	var worldAxis = new THREE.AxisHelper(20);
	scene.add(worldAxis);
}//end init();


function animate() {

    requestAnimationFrame( animate );

    render();

}

function render() {
	rotation();
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
}


function ui(){

	//click toggles between 
	$('.container').click(function(){
		console.log('I am being clicked! Ouch!');
		autoMode=!autoMode;
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
	}, false			);

	$container.append(renderer.domElement);



	//!!!!!!! RESPONSIVE CODE NOT WORKING?!!!!//

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
}//END UI

/**********END three Stuff***************/