var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer({alpha:true, antialias: true });
renderer.setClearColor(0x114357,1); // background color
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
document.body.appendChild( renderer.domElement );

var points = [];
var addPoint = function (point, color = { color: 0x00A896 }) {
    var geometry = new THREE.CircleGeometry( 0.05, 12 );
    var material = new THREE.MeshBasicMaterial( color );

    var circle = new THREE.Mesh( geometry, material );
    scene.add(circle);
    circle.position.set(point[0], point[1], 0);
    points.push(point);
}


var lines = [];
var addLine = function (points, color = { color : 0xC5796D }) {
    var material = new THREE.LineBasicMaterial( color );
    var geometry = new THREE.Geometry();
    geometry.vertices.push(
    new THREE.Vector3( points[0][0], points[0][1], 0 ),
    new THREE.Vector3( points[1][0], points[1][1], 0 )
    );

    var line = new THREE.Line( geometry, material );
    lines.push(points);
    scene.add(line);
}

var get2dGaussianVars = function () {
    var x1 = Math.random();
    var x2 = Math.random();
    var z1 = Math.sqrt(-2*Math.log(x1)) * Math.cos(2*Math.PI*x2);
    var z2 = Math.sqrt(-2*Math.log(x1)) * Math.sin(2*Math.PI*x2);
    return [z1, z2];
}

var judgeSampling = function (pointBefore, pointAfter) {
    var limit = Math.random();
    var probBefore = probFunGauss(pointBefore);
    var probAfter = probFunGauss(pointAfter);
    var rate = probAfter / probBefore;
    return limit < rate ? true : false;
}

var probFunGauss = function(point) {
    return Math.exp( -(Math.pow(point[0],2)+ Math.pow(point[1],2))/2.0 ) / (2*Math.PI);
}

var color_1 = new THREE.Color(0x114357);
var color_2 = new THREE.Color(0xF29492);
var getColorGrad = function (ratio, inverse=false) {
    var color = new THREE.Color();
    if (inverse) {
        color.r = color_1.r + (color_2.r - color_1.r) * ratio;
        color.g = color_1.g + (color_2.g - color_1.g) * ratio;
        color.b = color_1.b + (color_2.b - color_1.b) * ratio;
    } else {
        color.r = color_2.r + (color_1.r - color_2.r) * ratio;
        color.g = color_2.g + (color_1.g - color_2.g) * ratio;
        color.b = color_2.b + (color_1.b - color_2.b) * ratio;
    }
    return color;
}

camera.position.z = 5;
addPoint([0,0], {color: color_2});

var render = function () {
    requestAnimationFrame( render );

    // new point by random walk
    var point = [];
    point.push(points[points.length - 1][0]);
    point.push(points[points.length - 1][1]);
    var dx = get2dGaussianVars();
    for (var i = 0; i < 2; i++) {
        point[i] = point[i] + dx[i];
    }

    // judge
    if (judgeSampling(points[points.length - 1], point)) {
        var c_val = probFunGauss(point)*2*Math.PI;
        var col_1 = getColorGrad(c_val,true);
        var color_1 = {color: col_1.getHex()};

        addPoint(point, color_1);
        addLine([points[points.length - 2], point], color_1);
    }
    
    renderer.render(scene, camera);
};

render();