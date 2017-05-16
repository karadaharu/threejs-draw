var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0xDCE35B,1);
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


var particleCount = 350;
var color_base = new THREE.Color(0x30E8BF);

var height = 6.0;
var width = 1.4;
var x_0 = -3.8;
var y_0 = -3.0;

    
for (var p = 0; p < particleCount; p++) {
    var geometry = new THREE.Geometry();
    var u = Math.random();
    var material = new THREE.LineBasicMaterial();
    material.color = new THREE.Color(
        (1-color_base.r)*u+color_base.r,
        (0.508-color_base.g)*u+color_base.g,
        (0.246-color_base.b)*u+color_base.b
        );
    var x = - Math.log(-u+1);				

    geometry.vertices.push(
        new THREE.Vector3( x_0, y_0+u*height, 0 ),
        new THREE.Vector3( x_0+width*x, y_0+u*height, 0 ),
        new THREE.Vector3( x_0+width*x, y_0, 0 )
    );
    var line = new THREE.Line( geometry, material );
    scene.add( line );
}

camera.position.z = 5;

var render = function () {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
};
render();