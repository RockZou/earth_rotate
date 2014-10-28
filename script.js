/**********three stuff********************/


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

var $container= $('.container');

var geometry = new THREE.SphereGeometry( 1.5, 32, 32 );


var autoMode=false;//determines if earth should rotate on its own or depend on orientation
//constant showcase-like rotation
var cRotX=0;
var cRotY=0;
var cRotZ=0;

//rotation from orientation
var rotZ=0;
var rotY=0;
var rotX=0;

//the x y z rotate values after being off-setted
var newX=0;
var newY=0;
var newZ=0;



//detect if this is the first time to receive the orientation data
var firstRecieved=false;
var offsetX=0.0;
var offsetY=0.0;
var offsetZ=0.0;





camera.position.z = 5;


//*********Material**********//
var material = new THREE.MeshPhongMaterial(
{
	map: THREE.ImageUtils.loadTexture('earthmap1k.jpg'),
	bumpMap: THREE.ImageUtils.loadTexture('earthbump1k.jpg'),
	bumpScale:0.1,
	specularMap:THREE.ImageUtils.loadTexture('earthspec1k.jpg'),
	//specular: new THREE.Color('white')
}
	);


var sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );



//*********END Material*******//


/******Lighting**********/


// create a directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(10,0,3);
    scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x222222);
	scene.add(ambientLight);


/*!!!!!!!HOW TO DO WORLD MATRIX TRANSFORMATION?!!!!!!*/

// var worldRotationMatrix = new THREE.Matrix4();
// 	worldRotationMatrix.set(Math.cos(-0.4),-Math.sin(-0.4),0,0,
// 							Math.sin(-0.4),Math.cos(-0.4),0,0,
// 							0,0,1,0,
// 							0,0,0,1);
// console.log(worldRotationMatrix);

/*********END lighting*********/


function render() {
	requestAnimationFrame( render );
	rotation();
	renderer.render( scene, camera );
}

render();



function rotation()
{
	if (autoMode)// the earth should rotate by itself, not being affected by the 
	{
		sphere.rotation.y += cRotY;
		sphere.rotation.x += cRotX;
		sphere.rotation.z += cRotZ;
	}

	//sphere.setFromMatrixPosition(worldRotationMatrix);
//	sphere.rotation.z = rotZ;
	else
	{
		sphere.rotation.x = rotX;
		sphere.rotation.y = rotY;
	}
}

//click toggles between 
$('.container').click(function(){
	console.log('I am being clicked! Ouch!');
	autoMode=!autoMode;
	offsetX+=newX;
	offsetY+=newY;
	offsetZ+=newZ;

});


window.addEventListener('deviceorientation', function(event) {


  $('.someText').html('a='+event.alpha+' b='+event.beta+' c='+event.gamma);


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

}, false);

$container.append(renderer.domElement);



//!!!!!!! RESPONSIVE CODE NOT WORKING?!!!!//

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


/**********END three Stuff***************/