var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0xDBE6F6,1);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

var particleCount = 150;
var color_base = new THREE.Color(0x30E8BF);

var count = 0;
var points = [];
var addPoint = function (point) {
    var geometry = new THREE.CircleGeometry( 0.05, 12 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00A896 } );         

    var circle = new THREE.Mesh( geometry, material );
    scene.add(circle);
    circle.position.set(point[0], point[1], 0);
}
var lines = [];
var drawArc = function () {
    for (var i = 0, len = points.length; i < len; i++) {
        var point = points[i];
        var radius = Math.sqrt(Math.pow(point[0],2)+Math.pow(point[1],2));
        console.log(radius);
        var angle = Math.atan(point[1]/point[0]);
        var curve = new THREE.EllipseCurve(
            0, 0,             // ax, aY
            radius, radius,            // xRadius, yRadius
            angle-Math.PI, angle+Math.PI-radius*1.5, // aStartAngle, aEndAngle

            true           // aClockwise
        );

        var points_arc = curve.getSpacedPoints( 30*radius );

        var path = new THREE.Path();
        var geometry = path.createGeometry( points_arc );
        var buffer_geometry = new THREE.BufferGeometry().fromGeometry(geometry);

        var material = new THREE.LineBasicMaterial( { color : 0xC5796D } );
        lines.push(new THREE.Line( geometry, material ));

        scene.add( lines[i] );
    }
}

for (var p = 0; p < particleCount; p++) {
    var x1 = Math.random();
    var x2_fix = 0.3;

    var z1_fix = Math.sqrt(-2*Math.log(x1)) * Math.cos(2*Math.PI*x2_fix);
    var z2_fix = Math.sqrt(-2*Math.log(x1)) * Math.sin(2*Math.PI*x2_fix);
    points.push([z1_fix,z2_fix]);
    addPoint(points[p]);
    for (var j = 0; j < 3; j++) {
        var x2_random = Math.random();                    
        var z1_random = Math.sqrt(-2*Math.log(x1)) * Math.cos(2*Math.PI*x2_random);
        var z2_random = Math.sqrt(-2*Math.log(x1)) * Math.sin(2*Math.PI*x2_random);                
        addPoint([z1_random,z2_random]);
    }
}
drawArc();


camera.position.z = 5;
var render = function () {
    requestAnimationFrame( render );
    renderer.render(scene, camera);
};

render();