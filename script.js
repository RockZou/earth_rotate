/***********three stuff********************/


var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
//document.body.appendChild( renderer.domElement );

var $container= $('.container');

var geometry = new THREE.SphereGeometry( 1.5, 32, 32 );

// var material = new THREE.MeshLambertMaterial(
// {
//	color: 0xffff00
// //	wireframe: true
// });



camera.position.z = 3;


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
// create a point light
// var pointLight =
//   new THREE.PointLight(0xFFFFFF);

// // set its position
// pointLight.position.x = 10;
// pointLight.position.y = 50;
// pointLight.position.z = 130;

// // add to the scene
// scene.add(pointLight);


// create a directional light
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);

    directionalLight.position.set(10,0,3);
    scene.add(directionalLight);

var ambientLight = new THREE.AmbientLight(0x222222);
	scene.add(ambientLight);



/*********END lighting*********/


function render() {
	requestAnimationFrame( render );
	rotation();
	renderer.render( scene, camera );
}

render();



function rotation()
{
	//sphere.rotation.x += 0.01;
	sphere.rotation.y += 0.005;
	sphere.rotation.z = 0.5;
}

$container.append(renderer.domElement);

/**********END three Stuff****************/