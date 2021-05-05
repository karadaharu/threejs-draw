var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0xF0F3BD,1);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// create the particle variables
var particleCount = 3000;

var geometry = new THREE.CircleGeometry( 0.05, 12 );
var material = new THREE.MeshBasicMaterial( { color: 0x00A896 } );
for (var p = 0; p < particleCount; p++) {
    var circle = new THREE.Mesh( geometry, material );
    scene.add(circle);
    circle.position.set(Math.random()*6-3, Math.random()*6-3, 0);
}

camera.position.z = 5;

var render = function () {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
};
render();